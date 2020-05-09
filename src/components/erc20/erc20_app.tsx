import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { ERC20_APP_BASE_PATH, MARKET_MAKER_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../../components/common/adblock_detector';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { getERC20Theme } from '../../store/selectors';
import { PageLoading } from '../common/page_loading';

import ToolbarContentContainer from './common/toolbar_content';
import AccountTradingsPage from './pages/account_trading';
import JoinAsMakerPage from './pages/join_as_maker';
import TokenListingPage from './pages/listing';
import MarketMakerPage from './pages/market_maker';
import Marketplace from './pages/marketplace';
import MyWallet from './pages/my_wallet';
import TokensListPage from './pages/tokens_list';
import UserWizardPage from './pages/user_wizard';
import WizardPage from './pages/wizard';

const toolbar = <ToolbarContentContainer />;

/*const TokensListPage = lazy(() => import('./pages/tokens_list'));
const MyWallet = lazy(() => import('./pages/my_wallet'));
const AccountTradingsPage = lazy(() => import('./pages/account_trading'));
const Marketplace = lazy(() => import('./pages/marketplace'));
const WizardPage = lazy(() => import('./pages/wizard'));
const JoinAsMakerPage = lazy(() => import('./pages/join_as_maker'));
const TokenListingPage = lazy(() => import('./pages/listing'));
const UserWizardPage = lazy(() => import('./pages/user_wizard'));
const MarketMakerPage = lazy(() => import('./pages/market_maker'));*/


const Erc20App = () => {
    const themeColor = useSelector(getERC20Theme);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutContainer toolbar={toolbar}>
                <AdBlockDetector />
                <Switch>
                    <Suspense fallback={<PageLoading />}>
                        <Route exact={true} path={`${ERC20_APP_BASE_PATH}/`} component={Marketplace} />
                        <Route exact={true} path={`${ERC20_APP_BASE_PATH}/my-wallet`} component={MyWallet} />
                        <Route exact={true} path={`${ERC20_APP_BASE_PATH}/join-as-maker`} component={JoinAsMakerPage} />
                        <Route exact={true} path={`${ERC20_APP_BASE_PATH}/listed-tokens`} component={TokensListPage} />
                        <Route exact={true} path={`${ERC20_APP_BASE_PATH}/dex-wizard`} component={WizardPage} />
                        <Route exact={true} path={MARKET_MAKER_APP_BASE_PATH} component={MarketMakerPage} />
                        <Route
                            exact={true}
                            path={`${ERC20_APP_BASE_PATH}/user-dex-wizard`}
                            component={UserWizardPage}
                        />
                        <Route exact={true} path={`${ERC20_APP_BASE_PATH}/listings`} component={TokenListingPage} />
                        <Route
                            exact={true}
                            path={`${ERC20_APP_BASE_PATH}/trading-competition`}
                            component={AccountTradingsPage}
                        />
                    </Suspense>
                </Switch>
            </GeneralLayoutContainer>
        </ThemeProvider>
    );
};

export { Erc20App as default };
