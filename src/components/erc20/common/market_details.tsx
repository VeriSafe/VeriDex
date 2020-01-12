import { BigNumber } from '@0x/utils';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { USE_RELAYER_MARKET_UPDATES } from '../../../common/constants';
import { changeMarket, goToHome } from '../../../store/actions';
import {
    getBaseToken,
    getCurrencyPair,
    getCurrentMarketLastPrice,
    getCurrentMarketTodayClosedOrders,
    getCurrentMarketTodayHighPrice,
    getCurrentMarketTodayLowerPrice,
    getCurrentMarketTodayVolume,
    getQuoteToken,
    getWeb3State,
} from '../../../store/selectors';
import { formatMarketToString, marketToString } from '../../../util/markets';
import { isMobile } from '../../../util/screen';
import { formatTokenName, formatTokenSymbol, tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, StoreState, Token, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { withWindowWidth } from '../../common/hoc/withWindowWidth';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

const TVChartContainer = React.lazy(() => import('../marketplace/tv_chart'));

const MarketDetailCard = styled(Card)`
    height: 100%;
    overflow: auto;
    margin-top: 5px;
`;

const StyledHr = styled.hr`
    border-color: ${props => props.theme.componentsTheme.dropdownBorderColor};
`;

interface StateProps {
    baseToken: Token | null;
    quoteToken: Token | null;
    web3State?: Web3State;
    currencyPair: CurrencyPair;
    highPrice: BigNumber | number | null;
    lowerPrice: BigNumber | number | null;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

interface OwnProps {
    windowWidth: number;
    isTradingGraphic: boolean;
}

type Props = StateProps & DispatchProps & OwnProps;

interface MarketStats {
    highPrice: BigNumber | null | number;
    lowerPrice: BigNumber | null | number;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}

const statsToRow = (marketStats: MarketStats, baseToken: Token, currencyPair: CurrencyPair) => {
    const lastPrice = marketStats.lastPrice
        ? new BigNumber(marketStats.lastPrice).toFixed(currencyPair.config.pricePrecision)
        : '-';
    let volume;
    if (USE_RELAYER_MARKET_UPDATES) {
        volume =
            (marketStats.volume &&
                `${marketStats.volume.toFixed(baseToken.displayDecimals)} ${formatTokenSymbol(baseToken.symbol)}`) ||
            '- ';
    } else {
        volume =
            (marketStats.volume &&
                `${tokenAmountInUnits(
                    marketStats.volume,
                    baseToken.decimals,
                    baseToken.displayDecimals,
                ).toString()} ${formatTokenSymbol(baseToken.symbol)}`) ||
            '- ';
    }

    return (
        <TR>
            <CustomTD>{formatTokenName(baseToken.name)}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{lastPrice}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.highPrice && marketStats.highPrice.toFixed(currencyPair.config.pricePrecision)) || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.lowerPrice && marketStats.lowerPrice.toFixed(currencyPair.config.pricePrecision)) || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{volume}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{marketStats.closedOrders || '-'}</CustomTD>
        </TR>
    );
};

const DesktopTable = (marketStats: MarketStats, baseToken: Token, currencyPair: CurrencyPair) => {
    return (
        <Table isResponsive={true}>
            <THead>
                <TR>
                    <TH>
                        <FormattedMessage
                            id="market-details.project"
                            defaultMessage="Project"
                            description="Project Name"
                        />
                    </TH>
                    <TH styles={{ textAlign: 'right' }}>
                        <FormattedMessage
                            id="market-details.last-price"
                            defaultMessage="Last Price"
                            description="Last Price"
                        />
                    </TH>
                    <TH styles={{ textAlign: 'right' }}>
                        <FormattedMessage
                            id="market-details.max-price-24h"
                            defaultMessage="Max Price 24H"
                            description="Max Price 24H"
                        />
                    </TH>
                    <TH styles={{ textAlign: 'right' }}>
                        <FormattedMessage
                            id="market-details.min-price-24h"
                            defaultMessage="Min Price 24H"
                            description="Min Price 24H"
                        />
                    </TH>
                    <TH styles={{ textAlign: 'right' }}>
                        <FormattedMessage
                            id="market-details.volume-24h"
                            defaultMessage="Volume 24H"
                            description="Volume 24H"
                        />
                    </TH>
                    <TH styles={{ textAlign: 'right' }}>
                        <FormattedMessage
                            id="market-details.orders-closed"
                            defaultMessage="Orders Closed"
                            description="Orders Closed"
                        />
                    </TH>
                </TR>
            </THead>
            <tbody>{statsToRow(marketStats, baseToken, currencyPair)}</tbody>
        </Table>
    );
};

const MobileTable = (marketStats: MarketStats, baseToken: Token, currencyPair: CurrencyPair) => {
    const lastPrice = marketStats.lastPrice
        ? new BigNumber(marketStats.lastPrice).toFixed(currencyPair.config.pricePrecision)
        : '-';

    return (
        <Table isResponsive={true}>
            <tbody>
                <TR>
                    <TH>
                        <FormattedMessage id="market-details.project" defaultMessage="Project" description="Project" />
                    </TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {formatTokenName(baseToken.name)}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>
                        <FormattedMessage
                            id="market-details.last-price"
                            defaultMessage="Last Price"
                            description="Last Price"
                        />
                    </TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>{lastPrice || '-'}</CustomTD>
                </TR>
                <TR>
                    <TH>
                        <FormattedMessage
                            id="market-details.max-price-24h"
                            defaultMessage="Max Price 24H"
                            description="Max Price 24H"
                        />
                    </TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {(marketStats.highPrice && marketStats.highPrice.toFixed(currencyPair.config.pricePrecision)) ||
                            '-'}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>
                        <FormattedMessage
                            id="market-details.min-price-24h"
                            defaultMessage="Min Price 24H"
                            description="Min Price 24H"
                        />
                    </TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {(marketStats.lowerPrice &&
                            marketStats.lowerPrice.toFixed(currencyPair.config.pricePrecision)) ||
                            '-'}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>
                        <FormattedMessage
                            id="market-details.volume-24h"
                            defaultMessage="Volume 24H"
                            description="Volume 24H"
                        />
                    </TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {(marketStats.volume &&
                            `${tokenAmountInUnits(
                                marketStats.volume,
                                baseToken.decimals,
                                baseToken.displayDecimals,
                            ).toString()} ${formatTokenSymbol(baseToken.symbol)}`) ||
                            '-'}{' '}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>
                        <FormattedMessage
                            id="market-details.orders-closed"
                            defaultMessage="Orders Closed"
                            description="Orders Closed"
                        />
                    </TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {marketStats.closedOrders || '-'}
                    </CustomTD>
                </TR>
            </tbody>
        </Table>
    );
};

class MarketDetails extends React.Component<Props> {
    public render = () => {
        const { baseToken, quoteToken, web3State, currencyPair, isTradingGraphic = true } = this.props;
        let content: React.ReactNode;
        const defaultBehaviour = () => {
            if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                content = <LoadingWrapper minHeight="120px" />;
            } else if (!baseToken || !quoteToken) {
                content = (
                    <EmptyContent
                        alignAbsoluteCenter={true}
                        text={
                            <FormattedMessage
                                id="market-list.empty"
                                defaultMessage="There are no market details to show"
                                description="Empty Message"
                            />
                        }
                    />
                );
            } else {
                const { highPrice, lowerPrice, volume, closedOrders, lastPrice, windowWidth } = this.props;

                const marketStats = {
                    highPrice,
                    lowerPrice,
                    volume,
                    closedOrders,
                    lastPrice,
                };
                let tableMarketDetails;

                isMobile(windowWidth)
                    ? (tableMarketDetails = MobileTable(marketStats, baseToken, currencyPair))
                    : (tableMarketDetails = DesktopTable(marketStats, baseToken, currencyPair));

                content = (
                    <>
                        {tableMarketDetails}
                        <StyledHr />
                        {isTradingGraphic && <TVChartContainer symbol={marketToString(currencyPair)} />}
                    </>
                );
            }
        };
        if (USE_RELAYER_MARKET_UPDATES) {
            defaultBehaviour();
        } else {
            switch (web3State) {
                case Web3State.Locked:
                case Web3State.NotInstalled: {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                    break;
                }
                case Web3State.Loading: {
                    content = <LoadingWrapper minHeight="120px" />;
                    break;
                }
                default: {
                    defaultBehaviour();
                    break;
                }
            }
        }
        const title = `Market Stats: ${formatMarketToString(currencyPair)}`;

        return (
            <MarketDetailCard title={title} minHeightBody={'90px'}>
                {content}
            </MarketDetailCard>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
        highPrice: getCurrentMarketTodayHighPrice(state),
        lowerPrice: getCurrentMarketTodayLowerPrice(state),
        volume: getCurrentMarketTodayVolume(state),
        closedOrders: getCurrentMarketTodayClosedOrders(state),
        lastPrice: getCurrentMarketLastPrice(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const MarketDetailsContainer = withWindowWidth(connect(mapStateToProps, mapDispatchToProps)(MarketDetails));

export { MarketDetails, MarketDetailsContainer };
