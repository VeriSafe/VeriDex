import { Mesh } from '@0x/mesh-browser';
import { RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { providerUtils } from '@0x/utils';


const provider = new Web3ProviderEngine();
const rpcProvider = new RPCSubprovider('');
provider.addProvider(rpcProvider);
providerUtils.startProviderEngine(provider);

const mesh = new Mesh({
    verbosity: 4,
    ethereumChainID: 1,
    web3Provider: provider,
});

// This handler will be called whenever there is a critical error.
/*mesh.onError((err: Error) => {
    console.error(err);
});*/

// This handler will be called whenever an order is added, expired,
// cancelled, or filled.
/*mesh.onOrderEvents((events: OrderEvent[]) => {
    for (const event of events) {
        console.log(event);
    }
});*/

export const getMesh =  (): Mesh => {
   /* while (!meshReady) {
        // if mesh is not ready yet
       await sleep(100);
    }*/
    return mesh;
};