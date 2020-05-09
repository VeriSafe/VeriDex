import { ConnectedRouter } from 'connected-react-router';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import 'sanitize.css';

import {
    DEFAULT_BASE_PATH,
    ERC20_APP_BASE_PATH,
    ERC721_APP_BASE_PATH,
    FIAT_RAMP_APP_BASE_PATH,
    INSTANT_APP_BASE_PATH,
    LAUNCHPAD_APP_BASE_PATH,
    LOGGER_ID,
    MARGIN_APP_BASE_PATH,
    MARKET_APP_BASE_PATH,
} from './common/constants';
import { AppContainer } from './components/app';
import { PageLoading } from './components/common/page_loading';
import Erc20App from './components/erc20/erc20_app';
import FiatApp from './components/erc20/fiat_ramp_app';
import InstantApp from './components/erc20/instant_app';
import LaunchpadApp from './components/erc20/launchpad_app';
import MarginApp from './components/erc20/margin_app';
import MarketTradeApp from './components/erc20/market_trade_app';
import Erc721App from './components/erc721/erc721_app';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { history, store } from './store';
import { envUtil } from './util/env';
/*import Erc20App from './components/erc20/erc20_app';
import LaunchpadApp from './components/erc20/launchpad_app';
import MarginApp from './components/erc20/margin_app';*/

// Adding analytics
ReactGA.initialize(process.env.REACT_APP_ANALYTICS || '');

history.listen(his => {
    ReactGA.pageview(his.pathname + his.search);
});

ReactModal.setAppElement('#root');

if (['development', 'production'].includes(process.env.NODE_ENV) && !window.localStorage.debug) {
    // Log only the app constant id to the console
    window.localStorage.debug = `${LOGGER_ID}*`;
}
const RedirectToHome = () => <Redirect to={DEFAULT_BASE_PATH} />;

/*const Erc20App = lazy(() => import('./components/erc20/erc20_app'));
const LaunchpadApp = lazy(() => import('./components/erc20/launchpad_app'));
const MarginApp = lazy(() => import('./components/erc20/margin_app'));
const InstantApp = lazy(() => import('./components/erc20/instant_app'));
const Erc721App = lazy(() => import('./components/erc721/erc721_app'));
const FiatApp = lazy(() => import('./components/erc20/fiat_ramp_app'));
const MarketTradeApp = lazy(() => import('./components/erc20/market_trade_app'));*/

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer>
                <Suspense fallback={<PageLoading />}>
                    <Switch>
                        <Route path={ERC20_APP_BASE_PATH} component={Erc20App} />
                        <Route path={LAUNCHPAD_APP_BASE_PATH} component={LaunchpadApp} />
                        <Route path={MARGIN_APP_BASE_PATH} component={MarginApp} />
                        <Route path={INSTANT_APP_BASE_PATH} component={InstantApp} />
                        <Route path={ERC721_APP_BASE_PATH} component={Erc721App} />
                        <Route path={FIAT_RAMP_APP_BASE_PATH} component={FiatApp} />
                        <Route path={MARKET_APP_BASE_PATH} component={MarketTradeApp} />
                        <Route component={RedirectToHome} />
                    </Switch>
                </Suspense>
            </AppContainer>
        </ConnectedRouter>
    </Provider>
);

ReactDOM.render(Web3WrappedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
if (!envUtil.isMobileOperatingSystem()) {
    serviceWorker.register();
}
