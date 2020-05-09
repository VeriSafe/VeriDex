import React from 'react';
import { connect, useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { deleteWeb3Wrapper } from '../../services/web3_wrapper';
import { resetWallet, setWeb3State } from '../../store/actions';
import { getWeb3State } from '../../store/selectors';
import { themeBreakPoints, themeDimensions } from '../../themes/commons';
import { errorsWallet } from '../../util/error_messages';
import { StoreState, Web3State } from '../../util/types';

import { ErrorCard, ErrorIcons, FontSize } from './error_card';

interface OwnProps {
    centerContent?: React.ReactNode;
    endContent: React.ReactNode;
    endOptContent?: React.ReactNode;
    startContent: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onConnectWallet: () => any;
}

type Props = OwnProps & StateProps & DispatchProps;

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

const ToolbarWrapper = styled.div`
    align-items: center;
    background: ${props => props.theme.componentsTheme.topbarBackgroundColor};
    border-bottom: 1px solid ${props => props.theme.componentsTheme.topbarBorderColor};
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: ${themeDimensions.toolbarHeight};
    justify-content: space-between;
    padding: 0 ${themeDimensions.horizontalPadding};
    position: sticky;
    top: 0;
    z-index: 123;
`;

const ToolbarStart = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;

    @media (min-width: ${themeBreakPoints.xxl}) {
        min-width: 33.33%;
    }
`;

const ToolbarCenter = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    justify-content: center;

    @media (min-width: ${themeBreakPoints.xxl}) {
        min-width: 33.33%;
    }
`;

const ToolbarEnd = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;

    @media (min-width: ${themeBreakPoints.xxl}) {
        min-width: 33.33%;
    }
`;

const ToolbarEndBigWidth = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;

    @media (min-width: ${themeBreakPoints.xxl}) {
        width: 50%;
    }
`;

const ErrorPointer = styled(ErrorCard)`
    cursor: pointer;
`;

const Toolbar = (props: Props) => {
    const { startContent, endContent, centerContent, onConnectWallet, endOptContent } = props;
    const dispatch = useDispatch();
    const onErrorConnectWallet = () => {
        dispatch(resetWallet());
        deleteWeb3Wrapper();
        dispatch(setWeb3State(Web3State.Connect));
    };


    
    const getContentFromWeb3State = (web3State: Web3State): React.ReactNode => {
        switch (web3State) {
            case Web3State.Locked:
                return (
                    <>
                        {endOptContent && <ToolbarEndBigWidth>{endOptContent}</ToolbarEndBigWidth>}
                        <ErrorCard
                            fontSize={FontSize.Large}
                            text={errorsWallet.mmLocked}
                            icon={ErrorIcons.Lock}
                            onClick={onConnectWallet}
                        />
                    </>
                );
            case Web3State.NotInstalled:
                return (
                    <>
                        {endOptContent && <ToolbarEndBigWidth>{endOptContent}</ToolbarEndBigWidth>}
                        <ErrorCard
                            onClick={onConnectWallet}
                            fontSize={FontSize.Large}
                            text={errorsWallet.mmNotInstalled}
                            icon={ErrorIcons.Metamask}
                        />
                    </>
                );
            case Web3State.Connect:
                return (
                    <>
                        {endOptContent && <ToolbarEndBigWidth>{endOptContent}</ToolbarEndBigWidth>}
                        <ErrorPointer
                            className={'connect-wallet'}
                            onClick={onConnectWallet}
                            fontSize={FontSize.Large}
                            text={'Connect Wallet'}
                            icon={ErrorIcons.Lock}
                        />
                    </>
                );
            case Web3State.Connecting:
                return (
                    <>
                        {endOptContent && <ToolbarEndBigWidth>{endOptContent}</ToolbarEndBigWidth>}
                        <ErrorPointer fontSize={FontSize.Large} text={'Connecting Wallet'} icon={ErrorIcons.Lock} onClick={onErrorConnectWallet} />
                    </>
                );
            case Web3State.Loading:
                return (
                    <>
                        {endOptContent && <ToolbarEndBigWidth>{endOptContent}</ToolbarEndBigWidth>}
                        <ErrorPointer
                            fontSize={FontSize.Large}
                            text={errorsWallet.mmLoading}
                            icon={ErrorIcons.Wallet}
                            onClick={onConnectWallet}
                        />
                    </>
                );
            case Web3State.Error:
                return (
                    <>
                        {endOptContent && <ToolbarEndBigWidth>{endOptContent}</ToolbarEndBigWidth>}
                        <ErrorPointer
                            fontSize={FontSize.Large}
                            text={errorsWallet.mmWrongNetwork}
                            onClick={onConnectWallet}
                            icon={ErrorIcons.Warning}
                        />
                    </>
                );
            case Web3State.Done:
                return (
                    <>
                        <ToolbarCenter>{centerContent}</ToolbarCenter>
                        <ToolbarEnd>
                            {endOptContent}
                            {endContent}
                        </ToolbarEnd>
                    </>
                );
            default:
                const _exhaustiveCheck: never = web3State;
                return _exhaustiveCheck;
        }
    };

    return (
        <ToolbarWrapper>
            <ToolbarStart>{startContent}</ToolbarStart>
            {getContentFromWeb3State(props.web3State)}
        </ToolbarWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        onConnectWallet: () => dispatch(setWeb3State(Web3State.Connecting)),
    };
};

const ToolbarContainer = connect(mapStateToProps, mapDispatchToProps)(Toolbar);

export { Toolbar, ToolbarContainer };
