import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { deleteWeb3Wrapper } from '../../services/web3_wrapper';
import { resetWallet, setWeb3State } from '../../store/actions';
import { getWeb3State } from '../../store/selectors';
import { errorsWallet } from '../../util/error_messages';
import { Web3State } from '../../util/types';

import { ErrorCard, ErrorIcons, FontSize } from './error_card';

export const separatorTopbar = css`
    &:after {
        background-color: ${props => props.theme.componentsTheme.topbarSeparatorColor};
        content: '';
        height: 26px;
        margin-left: 17px;
        margin-right: 17px;
        width: 1px;
    }
    &:last-child:after {
        display: none;
    }
`;

const ErrorPointer = styled(ErrorCard)`
    cursor: pointer;
`;

const Web3StateButton = () => {
    const web3State = useSelector(getWeb3State);
    const dispatch = useDispatch();
    const onConnectWallet = () => {
        dispatch(setWeb3State(Web3State.Connecting));
    };

    const onErrorConnectWallet = () => {
        dispatch(resetWallet());
        deleteWeb3Wrapper();
        dispatch(setWeb3State(Web3State.Connect));
    };

    const getContentFromWeb3State = (): React.ReactNode => {
        switch (web3State) {
            case Web3State.Locked:
                return (
                    <ErrorCard
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmLocked}
                        onClick={onConnectWallet}
                        icon={ErrorIcons.Lock}
                    />
                );
            case Web3State.NotInstalled:
                return (
                    <ErrorCard
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmNotInstalled}
                        icon={ErrorIcons.Metamask}
                    />
                );
            case Web3State.Connect:
                return (
                    <ErrorPointer
                        className={'connect-wallet'}
                        onClick={onConnectWallet}
                        fontSize={FontSize.Large}
                        text={'Connect Wallet'}
                        icon={ErrorIcons.Lock}
                    />
                );
            case Web3State.Connecting:
                return <ErrorCard fontSize={FontSize.Large} text={'Connecting Wallet'} icon={ErrorIcons.Lock} />;
            case Web3State.Loading:
                return (
                    <ErrorPointer
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmLoading}
                        icon={ErrorIcons.Wallet}
                        onClick={onErrorConnectWallet}
                    />
                );
            case Web3State.Error:
                return (
                    <ErrorCard
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmWrongNetwork}
                        onClick={onConnectWallet}
                        icon={ErrorIcons.Warning}
                    />
                );
            case Web3State.Done:
                return null;
            default:
                const _exhaustiveCheck: never = web3State;
                return _exhaustiveCheck;
        }
    };

    return <>{getContentFromWeb3State()}</>;
};

export { Web3StateButton };
