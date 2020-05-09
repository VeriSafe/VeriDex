// tslint:disable-next-line: no-implicit-dependencies
import { providerUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
// import Torus from '@toruslabs/torus-embed';

import { CHAIN_ID, FORTMATIC_APP_ID, INFURA_ID, NETWORK_ID, NETWORK_NAME, PORTIS_APP_ID } from '../common/constants';
import { providerFactory } from '../util/provider_factory';
import { sleep } from '../util/sleep';
import { Wallet } from '../util/types';

import { LocalStorage } from './local_storage';
let web3Wrapper: Web3Wrapper | null = null;

const localStorage = new LocalStorage(window.localStorage);

export const isMetamaskInstalled = (): boolean => {
    const { ethereum, web3 } = window;
    return ethereum || web3;
};

export const initializeWeb3Wrapper = async (wallet: Wallet): Promise<Web3Wrapper | null> => {
    switch (wallet) {
        case Wallet.Portis:
            web3Wrapper = await initPortis();
            break;
        case Wallet.Metamask:
            web3Wrapper = await initMetamask();
            break;
        case Wallet.Torus:
            web3Wrapper = await initTorus();
            break;
        case Wallet.Fortmatic:
            web3Wrapper = await initFortmatic();
            break;
        case Wallet.Coinbase:
            web3Wrapper = await initWalletConnect();
            break;
        case Wallet.Enjin:
            web3Wrapper = await initEnjin();
            break;
        case Wallet.WalletConnect:
            web3Wrapper = await initWalletConnect();
            break;
        case Wallet.Coinbase:
            web3Wrapper = await initCoinbase();
            break;
        case Wallet.Trust:
            web3Wrapper = await initTrustWallet(wallet);
            break;
        case Wallet.Cipher:
            web3Wrapper = await initProviderWallet(wallet);
            break;
        // case Wallet.WalletConnect:
        //     web3Wrapper = await initWalletConnect(wallet);
        //     break;
        default:
            break;
    }

    if (web3Wrapper) {
        return web3Wrapper;
    } else {
        return null;
    }
};
export const initMetamask = async (): Promise<Web3Wrapper | null> => {
    const { ethereum, web3, location } = window;
    if (ethereum) {
        try {
            web3Wrapper = new Web3Wrapper(ethereum);
            // Request account access if needed
            await ethereum.enable();
            // Subscriptions register
            ethereum.on('accountsChanged', async (accounts: []) => {
                // Reload to avoid MetaMask bug: "MetaMask - RPC Error: Internal JSON-RPC"
                location.reload();
            });
            ethereum.on('networkChanged', async (network: number) => {
                location.reload();
            });
            localStorage.saveWalletConnected(Wallet.Metamask);

            return web3Wrapper;
        } catch (error) {
            // The user denied account access
            return null;
        }
    } else if (web3) {
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
        return web3Wrapper;
    } else {
        localStorage.resetWalletConnected();
        //  The user does not have metamask installed
        return null;
    }
};
// TODO: Refactor this to initProviderWallet
export const initEnjin = async (): Promise<Web3Wrapper | null> => {
    // @ts-ignore
    const { enjin } = window;
    if (enjin) {
        try {
            web3Wrapper = new Web3Wrapper(enjin);
            const isPrivacyModeEnabled = (enjin as any).enable !== undefined;

            if (isPrivacyModeEnabled) {
                await enjin.enable();
            }
            localStorage.saveWalletConnected(Wallet.Enjin);

            return web3Wrapper;
        } catch (error) {
            // The user denied account access
            return null;
        }
    } else {
        localStorage.resetWalletConnected();
        //  The user does not have metamask installed
        return null;
    }
};
// TODO: Refactor this to initProviderWallet
export const initCoinbase = async (): Promise<Web3Wrapper | null> => {
    const { web3 } = window;
    if (web3) {
        const provider = providerUtils.standardizeOrThrow(web3.currentProvider);
        if (provider) {
            try {
                web3Wrapper = new Web3Wrapper(provider);
                const isPrivacyModeEnabled = (web3 as any).enable !== undefined;
                if (isPrivacyModeEnabled) {
                    await web3.enable();
                }

                localStorage.saveWalletConnected(Wallet.Coinbase);

                return web3Wrapper;
            } catch (error) {
                // The user denied account access
                return null;
            }
        } else {
            localStorage.resetWalletConnected();
            return null;
        }
    } else {
        localStorage.resetWalletConnected();
        //  The user does not have metamask installed
        return null;
    }
};

const initProviderWallet = async (wallet: Wallet): Promise<Web3Wrapper | null> => {
    const provider = providerFactory.getInjectedProviderIfExists();

    if (provider) {
        try {
            web3Wrapper = new Web3Wrapper(provider);
            if (provider.enable !== undefined) {
                await provider.enable();
            }
            localStorage.saveWalletConnected(wallet);
            return web3Wrapper;
        } catch (error) {
            // The user denied account access
            return null;
        }
    } else {
        localStorage.resetWalletConnected();
        return null;
    }
};

const initTrustWallet = async (wallet: Wallet): Promise<Web3Wrapper | null> => {
    const provider = window.ethereum;

    if (provider) {
        try {
            web3Wrapper = new Web3Wrapper(provider);
            if (provider.enable !== undefined) {
                await provider.enable();
            }
            localStorage.saveWalletConnected(wallet);
            return web3Wrapper;
        } catch (error) {
            // The user denied account access
            return null;
        }
    } else {
        localStorage.resetWalletConnected();
        return null;
    }
};

export const initPortis = async (): Promise<Web3Wrapper | null> => {
    const { location } = window;
    if (!PORTIS_APP_ID) {
        return null;
    }
    try {
        const Portis = await import('@portis/web3');
        const portis = new Portis.default(PORTIS_APP_ID, NETWORK_NAME.toLowerCase());
        web3Wrapper = new Web3Wrapper(portis.provider);
        const [account] = await web3Wrapper.getAvailableAddressesAsync();
        portis.onLogout(() => {
            localStorage.resetWalletConnected();
            location.reload();
        });
        portis.onLogin(() => {
            localStorage.saveWalletConnected(Wallet.Portis);
            location.reload();
        });
        if (account) {
            return web3Wrapper;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const initWalletConnect = async (): Promise<Web3Wrapper | null> => {
    const { location } = window;
    const WalletConnectProvider = (await import('@walletconnect/web3-provider')).default;
    const provider = new WalletConnectProvider({ infuraId: INFURA_ID, chainId: CHAIN_ID });
    try {
        await provider.enable();
        localStorage.saveWalletConnected(Wallet.WalletConnect);
    } catch {
        localStorage.resetWalletConnected();
        location.reload();
        return null;
    }

    web3Wrapper = new Web3Wrapper(provider);

    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts: string[]) => {
        location.reload();
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
        location.reload();
    });

    // Subscribe to networkId change
    provider.on('networkChanged', (networkId: number) => {
        location.reload();
    });

    // Subscribe to session connection/open
    provider.on('open', () => {
        localStorage.saveWalletConnected(Wallet.WalletConnect);
    });

    // Subscribe to session disconnection/close
    provider.on('close', (code: number, reason: string) => {
        deleteWeb3Wrapper();
        localStorage.resetWalletConnected();
        location.reload();
    });

    return web3Wrapper;
};

export const initTorus = async (): Promise<Web3Wrapper | null> => {
    /*const importTorus = (): Promise<Web3Wrapper | null> => {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            import('@toruslabs/torus-embed')
                .then(async () => {
                    try {
                        resolve(await enableTorus());
                    } catch {
                        reject(null);
                    }
                })
                .catch(() => reject(null));
        });
    };*/

    const enableTorus = async () => {
        /* const torus = new Torus({});
        await torus.init({ buildEnv: 'production', network: { host: 'mainnet' } });
        await torus.login({});
        const isTorus = sessionStorage.getItem('pageUsingTorus');
        if (isTorus) {
            // @ts-ignore
            return (web3Wrapper = new Web3Wrapper(torus.provider));
        }
        // @ts-ignore
        web3Wrapper = new Web3Wrapper(torus.provider);
        localStorage.saveWalletConnected(Wallet.Torus);
        sessionStorage.setItem('pageUsingTorus', 'true');
        return web3Wrapper;*/
    };

    try {
        return null;
        // return await importTorus();
    } catch {
        return null;
    }
};

export const initFortmatic = async (): Promise<Web3Wrapper | null> => {
    if (!FORTMATIC_APP_ID) {
        return null;
    }
    // @ts-ignore - no typings
    const Fortmatic = await import('fortmatic');
    const fm =
        NETWORK_ID === 1
            ? new Fortmatic.default(FORTMATIC_APP_ID)
            : new Fortmatic.default(FORTMATIC_APP_ID, NETWORK_NAME.toLowerCase());

    web3Wrapper = new Web3Wrapper(fm.getProvider());
    let isUserLoggedIn = await fm.user.isLoggedIn();
    // user is already logged
    if (isUserLoggedIn) {
        return web3Wrapper;
    } else {
        await fm.user.login();
        isUserLoggedIn = await fm.user.isLoggedIn();
        if (isUserLoggedIn) {
            return web3Wrapper;
        } else {
            return null;
        }
    }
};

export const getWeb3Wrapper = async (): Promise<Web3Wrapper> => {
    while (!web3Wrapper) {
        // if web3Wrapper is not set yet, wait and retry
        await sleep(100);
    }

    return web3Wrapper;
};

export const deleteWeb3Wrapper = (): void => {
    web3Wrapper = null;
};

export const isWeb3Wrapper = (): Web3Wrapper | null => {
    return web3Wrapper;
};
