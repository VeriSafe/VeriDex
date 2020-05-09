import { APIOrder } from '@0x/connect';
import { Mesh, OrderEvent } from '@0x/mesh-browser';
import {
    AcceptedOrderInfo,
    OrderEventEndState,
    OrderInfo,
    RejectedOrderInfo,
} from '@0x/mesh-rpc-client';
import { AcceptedRejectedOrders, AddedRemovedOrders, BaseOrderProvider, OrderStore } from '@0x/orderbook';
import { DEFAULT_TOKEN_PRECISION } from '@0x/orderbook/lib/src/order_provider/base_order_provider';
import { Asset, AssetPairsItem, SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';

export class MeshBrowserOrderProvider extends BaseOrderProvider {
    private readonly _mesh: Mesh;
    private _isStarted?: boolean;

    /**
     * Converts the OrderEvent or OrderInfo from Mesh  into an APIOrder.
     * If the OrderInfo is a RejectedOrderInfo the remainingFillableTakerAssetAmount is
     * assumed to be 0.
     * @param orderEvent The `OrderEvent` from a Mesh subscription update
     */
    private static _orderInfoToAPIOrder(
        orderEvent: OrderEvent | AcceptedOrderInfo | RejectedOrderInfo | OrderInfo,
    ): APIOrder {
        const remainingFillableTakerAssetAmount = (orderEvent as OrderEvent).fillableTakerAssetAmount
            ? (orderEvent as OrderEvent).fillableTakerAssetAmount
            : new BigNumber(0);
        // TODO(dekz): Remove the any hack when mesh is published v3
        return {
            // tslint:disable:no-unnecessary-type-assertion
            order: orderEvent.signedOrder as any,
            metaData: {
                orderHash: orderEvent.orderHash,
                remainingFillableTakerAssetAmount,
            },
        };
    }

    /**
     * Instantiates a [Mesh](https://github.com/0xProject/0x-mesh) Order Provider. This provider writes
     * all orders stored in Mesh to the OrderStore and subscribes all Mesh updates.
     * @param opts `MeshOrderProviderOpts` containing the websocketEndpoint and additional Mesh options
     * @param orderStore The `OrderStore` where orders are added and removed from
     */
    constructor(mesh: Mesh, orderStore: OrderStore) {
        super(orderStore);
        this._mesh = mesh;
    }

    /**
     * Returns the available asset pairs. If no subscription to Mesh exists (and therefore no orders) it is
     * created and awaited on. Once the connection has been initialized the orders in the store are returned
     * as asset pairs.
     */
    public async getAvailableAssetDatasAsync(): Promise<AssetPairsItem[]> {
        await this._initializeIfRequiredAsync();
        const assetPairsItems: AssetPairsItem[] = [];
        const minAmount = new BigNumber(0);
        const maxAmount = new BigNumber(2).pow(256).minus(1);
        const precision = DEFAULT_TOKEN_PRECISION;
        //@ts-ignore
        for (const assetPairKey of await this._orderStore.keysAsync()) {
            const [assetA, assetB] = OrderStore.assetPairKeyToAssets(assetPairKey);
            const assetDataA: Asset = { assetData: assetA, minAmount, maxAmount, precision };
            const assetDataB: Asset = { assetData: assetB, minAmount, maxAmount, precision };
            assetPairsItems.push({ assetDataA, assetDataB });
            assetPairsItems.push({ assetDataA: assetDataB, assetDataB: assetDataA });
        }
        return assetPairsItems;
    }

    /**
     * Creates a subscription for all asset pairs in Mesh.
     * @param makerAssetData the Maker Asset Data
     * @param takerAssetData the Taker Asset Data
     */
    public async createSubscriptionForAssetPairAsync(_makerAssetData: string, _takerAssetData: string): Promise<void> {
        // Create the subscription first to get any updates while waiting for the request
        await this._initializeIfRequiredAsync();
    }

    /**
     * Submits the SignedOrder to the Mesh node
     * @param orders the set of signed orders to add
     */
    public async addOrdersAsync(orders: SignedOrder[]): Promise<AcceptedRejectedOrders> {
        const { accepted, rejected } = await utils.attemptAsync(() => this._mesh.addOrdersAsync(orders));
        // TODO(dekz): Remove the any hack when mesh is published v3
        return {
            accepted: accepted.map((o: any) => o.signedOrder) as any,
            rejected: rejected.map((o: any) => ({ order: o.signedOrder, message: o.status.message })) as any,
        };
    }

    /**
     * Destroys the order provider, removing any subscriptions
     */
    public async destroyAsync(): Promise<void> {
     //   this._wsClient.destroy();
    }

    /**
     * Creates the order subscription unless one already exists. If one does not exist
     * it also handles the reconnection logic.
     */
    private async _initializeIfRequiredAsync(): Promise<void> {
        if (this._isStarted) {
            return;
        }
        this._mesh.onOrderEvents(this._handleOrderUpdatesAsync.bind(this));
        this._mesh.onError((err: Error) => {
            console.error(err);
        });
        await this._mesh.startAsync();
        this._isStarted = true;

     // this._wsSubscriptionId = await this._wsClient.subscribeToOrdersAsync(this._handleOrderUpdatesAsync.bind(this));
        await this._fetchOrdersAndStoreAsync();
        // On Reconnnect sync all of the orders currently stored
        /*this._wsClient.onReconnected(() => {
            void this._syncOrdersInOrderStoreAsync();
        });*/
    }

    /**
     * Syncs the orders currently stored in the OrderStore. This is used when the connection to mesh
     * has reconnected. During this outage there are missed OrderEvents so all orders are re-validated
     * for every known asset pair.
     */
    private async _syncOrdersInOrderStoreAsync(): Promise<void> {
        // @ts-ignore
        for (const assetPairKey of await this._orderStore.keysAsync()) {
            const currentOrders = await this._orderStore.getOrderSetForAssetPairAsync(assetPairKey);
            const { rejected } = await utils.attemptAsync(() =>
                this._mesh.addOrdersAsync(Array.from(currentOrders.values()).map(o => o.order)),
            );
            // Remove any rejected orders
            await this._updateStoreAsync({
                assetPairKey,
                added: [],
                // @ts-ignore
                removed: rejected.map(o => MeshBrowserOrderProvider._orderInfoToAPIOrder(o)),
            });
        }
        await this._fetchOrdersAndStoreAsync();
    }

    /**
     * Fetches all of the Orders available in Mesh. All orders are then stored in the
     * OrderStore.
     */
    private async _fetchOrdersAndStoreAsync(): Promise<void> {
        const ordersByAssetPairKey: { [assetPairKey: string]: APIOrder[] } = {};
        // Fetch all orders in Mesh
        const orderResponse = await utils.attemptAsync(() => this._mesh.getOrdersAsync());
        for (const order of orderResponse.ordersInfos) {
            const { makerAssetData, takerAssetData } = order.signedOrder;
            const assetPairKey = OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            if (!ordersByAssetPairKey[assetPairKey]) {
                ordersByAssetPairKey[assetPairKey] = [];
            }
            ordersByAssetPairKey[assetPairKey].push( MeshBrowserOrderProvider._orderInfoToAPIOrder(order));
        }
        for (const assetPairKey of Object.keys(ordersByAssetPairKey)) {
            await this._updateStoreAsync({
                added: ordersByAssetPairKey[assetPairKey],
                removed: [],
                assetPairKey,
            });
        }
    }

    /**
     * Handles the order events converting to APIOrders and either adding or removing based on its kind.
     * @param orderEvents The set of `OrderEvents` returned from a mesh subscription update
     */
    private async _handleOrderUpdatesAsync(orderEvents: OrderEvent[]): Promise<void> {
        const addedRemovedByAssetPairKey: { [assetPairKey: string]: AddedRemovedOrders } = {};
        for (const event of orderEvents) {
            const { makerAssetData, takerAssetData } = event.signedOrder;
            const assetPairKey = OrderStore.getKeyForAssetPair(makerAssetData, takerAssetData);
            if (!addedRemovedByAssetPairKey[assetPairKey]) {
                addedRemovedByAssetPairKey[assetPairKey] = { added: [], removed: [], assetPairKey };
            }
            const apiOrder = MeshBrowserOrderProvider._orderInfoToAPIOrder(event);
            switch (event.endState) {
                case OrderEventEndState.Added:
                case OrderEventEndState.Unexpired: {
                    addedRemovedByAssetPairKey[assetPairKey].added.push(apiOrder);
                    break;
                }
                case OrderEventEndState.Cancelled:
                case OrderEventEndState.Expired:
                case OrderEventEndState.FullyFilled:
                case OrderEventEndState.Unfunded:
                case OrderEventEndState.StoppedWatching: {
                    addedRemovedByAssetPairKey[assetPairKey].removed.push(apiOrder);
                    break;
                }
                case OrderEventEndState.FillabilityIncreased:
                case OrderEventEndState.Filled: {
                    addedRemovedByAssetPairKey[assetPairKey].added.push(apiOrder);
                    break;
                }
                default:
                    break;
            }
        }
        for (const assetPairKey of Object.keys(addedRemovedByAssetPairKey)) {
            await this._updateStoreAsync(addedRemovedByAssetPairKey[assetPairKey]);
        }
    }
}


const utils = {
    async delayAsync(ms: number): Promise<void> {
        // tslint:disable:no-inferred-empty-object-type
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    },
    async attemptAsync<T>(
        fn: () => Promise<T>,
        opts: { interval: number; maxRetries: number } = { interval: 1000, maxRetries: 10 },
    ): Promise<T> {
        let result: T | undefined;
        let attempt = 0;
        let error;
        let isSuccess = false;
        while (!result && attempt < opts.maxRetries) {
            attempt++;
            try {
                result = await fn();
                isSuccess = true;
                error = undefined;
            } catch (err) {
                error = err;
                await utils.delayAsync(opts.interval);
            }
        }
        if (!isSuccess) {
            throw error;
        }
        return result as T;
    },
};
