import React from 'react';
import { Step } from 'react-joyride';
import { FormattedMessage } from 'react-intl';
const commonSteps: Step[] = [
    {
        target: '.markets-list',
        content: (
            <FormattedMessage
                id="joyride-steps.step-1"
                defaultMessage="Markets Lists: Lists all markets listed in this dex"
                description="Markets Lists: Lists all markets listed in this dex"
            />
        ),
    },
    {
        target: '.market-details',
        content: (
            <FormattedMessage
                id="joyride-steps.step-2"
                defaultMessage="Market Stats: Show all market details related to the selected pair and respective graphic"
                description="Market Stats: Show all market details related to the selected pair and respective graphic"
            />
        ),
    },
    {
        target: '.wallet-balance',
        content: (
            <FormattedMessage
                id="joyride-steps.step-3"
                defaultMessage="Wallet Balances: Shows your balances of current active pair"
                description="Wallet Balances: Shows your balances of current active pair"
            />
        ),
        placementBeacon: 'bottom',
        placement: 'bottom',
    },
    {
        target: '.buy-sell',
        content: (
            <FormattedMessage
                id="joyride-steps.step-4"
                defaultMessage="Buy or sell the current active pair with limit and market options. Market buy/sell will buy directly from orders on orderbook, market limit buy/sell will buy or sell at the fixed price, if no order with that value it will place a order."
                description="Buy or sell the current active pair with limit and market options. Market buy/sell will buy directly from orders on orderbook, market limit buy/sell will buy or sell at the fixed price, if no order with that value it will place a order."
            />
        ),
        placement: 'bottom',
        placementBeacon: 'bottom',
    },
    {
        target: '.orderbook',
        content: (
            <FormattedMessage
                id="joyride-steps.step-5"
                defaultMessage="OrderBook: Shows bid and asks for active current pair"
                description="OrderBook: Shows bid and asks for active current pair"
            />
        ),
    },
    {
        target: '.orderhistory',
        content: (
            <FormattedMessage
                id="joyride-steps.step-6"
                defaultMessage="My Current Orders: Shows your open orders for active current pair. You can check filled balance and cancel orders here."
                description="My Current Orders: Shows your open orders for active current pair. You can check filled balance and cancel orders here."
            />
        ),
    },
    {
        target: '.market-fills',
        content: (
            <FormattedMessage
                id="joyride-steps.step-7"
                defaultMessage="Market History: Shows most recent market fills for the current active pair."
                description="Market History: Shows most recent market fills for the current active pair."
            />
        ),
    },
    {
        target: '.order-fills',
        content: (
            <FormattedMessage
                id="joyride-steps.step-8"
                defaultMessage="0x Mesh Trades: Shows all recent trades on 0x network for the listed pairs on this dex."
                description="0x Mesh Trades: Shows all recent trades on 0x network for the listed pairs on this dex."
            />
        ),
    },
];

export const marketPlaceSteps: Step[] = [
    {
        target: '.theme-switcher',
        content: (
            <FormattedMessage
                id="market-place-steps.step-1"
                defaultMessage="Choose a theme between Light or Dark"
                description="Choose a theme between Light or Dark"
            />
        ),
        disableBeacon: true,
        floaterProps: { disableAnimation: true },
    },
    {
        target: '.buy-eth',
        content: (
            <FormattedMessage
                id="market-place-steps.step-2"
                defaultMessage="Buy ETH with Apple Pay, Credit or Debit Cards using our integrated fiat on ramps from our parterns: Wyre and Coindirect"
                description="Buy ETH with Apple Pay, Credit or Debit Cards using our integrated fiat on ramps from our parterns: Wyre and Coindirect"
            />
        ),
    },
    {
        target: '.my-wallet',
        content: (
            <FormattedMessage
                id="market-place-steps.step-3"
                defaultMessage="Navigate to your Wallet. Here you can check all token balances, transfer tokens and buy tokens instantly"
                description="Navigate to your Wallet. Here you can check all token balances, transfer tokens and buy tokens instantly"
            />
        ),
    },
    {
        target: '.wallet-dropdown',
        content: (
            <FormattedMessage
                id="market-place-steps.step-4"
                defaultMessage="Check the navigation menu. Here you can copy to clipboard, set alerts, check your etherscan wallet, go to launchpad or lend tokens at lending page"
                description="Check the navigation menu. Here you can copy to clipboard, set alerts, check your etherscan wallet, go to launchpad or lend tokens at lending page"
            />
        ),
    },
    {
        target: '.markets-dropdown',
        content: (
            <FormattedMessage
                id="market-place-steps.step-5"
                defaultMessage="Check all markets clicking on this dropdown"
                description="Check all markets clicking on this dropdown"
            />
        ),
    },
    {
        target: '.notifications',
        content: (
            <FormattedMessage
                id="market-place-steps.step-6"
                defaultMessage="Check all related blockchain notifications here from market buy, market sell and token transfers."
                description="Check all related blockchain notifications here from market buy, market sell and token transfers."
            />
        ),
    },
];

const noLoginWallet: Step[] = [
    {
        target: '.connect-wallet',
        content: (
            <FormattedMessage
                id="no-login-wallet.step-1"
                defaultMessage="Connect Wallet to start use the platform clicking here"
                description="Connect Wallet to start use the platform clicking here"
            />
        ),
        disableBeacon: true,
        floaterProps: { disableAnimation: true },
    },
];

export const allSteps = marketPlaceSteps.concat(commonSteps);

export const noWalletSteps = noLoginWallet.concat(commonSteps);
// export const noWalletSteps = commonSteps;
