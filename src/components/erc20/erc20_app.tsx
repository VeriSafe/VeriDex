import React, { lazy, Suspense } from 'react';
import { IntlProvider } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { ERC20_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../../components/common/adblock_detector';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { getERC20Theme } from '../../store/selectors';
import { PageLoading } from '../common/page_loading';

import ToolbarContentContainer from './common/toolbar_content';
import messages_en from './translations/en.json';
import messages_pt from './translations/pt.json';
import messages_es from './translations/es.json';
const toolbar = <ToolbarContentContainer />;

const TokensListPage = lazy(() => import('./pages/tokens_list'));
const MyWallet = lazy(() => import('./pages/my_wallet'));
const AccountTradingsPage = lazy(() => import('./pages/account_trading'));
const Marketplace = lazy(() => import('./pages/marketplace'));
const WizardPage = lazy(() => import('./pages/wizard'));

const messages: any = {
    pt: messages_pt,
    en: messages_en,
    es: messages_es,
};

const Erc20App = (props: any) => {
    const themeColor = useSelector(getERC20Theme);

    return (
        <ThemeProvider theme={themeColor}>
            <IntlProvider locale={props.language} messages={messages[props.language]}>
                <GeneralLayoutContainer toolbar={toolbar}>
                    <AdBlockDetector />
                    <Switch>
                        <Suspense fallback={<PageLoading />}>
                            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/`} component={Marketplace} />
                            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/my-wallet`} component={MyWallet} />
                            <Route
                                exact={true}
                                path={`${ERC20_APP_BASE_PATH}/listed-tokens`}
                                component={TokensListPage}
                            />
                            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/dex-wizard`} component={WizardPage} />
                            <Route
                                exact={true}
                                path={`${ERC20_APP_BASE_PATH}/trading-competition`}
                                component={AccountTradingsPage}
                            />
                        </Suspense>
                    </Switch>
                </GeneralLayoutContainer>
            </IntlProvider>
        </ThemeProvider>
    );
};

const mapStateToProps = (state: any) => {
    return {
        language: state.ui.language.language,
    };
};

export default connect(mapStateToProps, null)(Erc20App);
