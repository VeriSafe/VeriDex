import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { goToHomeLaunchpad, goToHomeMarginLend, logoutWallet } from '../../../store/actions';
import { getEthAccount } from '../../../store/selectors';
import { connectToExplorer, viewOnFabrx } from '../../../util/external_services';
import { truncateAddress } from '../../../util/number_utils';
import { viewAddressOnEtherscan } from '../../../util/transaction_link';
import { StoreState } from '../../../util/types';
import { WalletConnectionStatusContainer } from '../../account/wallet_connection_status';
import { CardBase } from '../../common/card_base';
import { DropdownTextItem } from '../../common/dropdown_text_item';

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}
interface DispatchProps {
    onLogoutWallet: () => any;
    onGoToHomeLaunchpad: () => any;
    onGoToHomeMarginLend: () => any;
}

type Props = StateProps & OwnProps & DispatchProps;

const DropdownItems = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    min-width: 240px;
`;

class WalletConnectionContent extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, onLogoutWallet, onGoToHomeLaunchpad, onGoToHomeMarginLend, ...restProps } = this.props;
        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';

        const openFabrx = () => {
            viewOnFabrx(ethAccount);
        };

        const viewAccountExplorer = () => {
            viewAddressOnEtherscan(ethAccount);
        };

        const content = (
            <DropdownItems>
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItem
                        text={
                            <FormattedMessage
                                id="toolbar.wallet-dropdown.copy"
                                defaultMessage="Copy Address to Clipboard"
                                description="Copy Address to Clipboard"
                            />
                        }
                    />
                </CopyToClipboard>
                <DropdownTextItem
                    onClick={viewAccountExplorer}
                    text={
                        <FormattedMessage
                            id="toolbar.wallet-dropdown.view-address"
                            defaultMessage="View Address on Etherscan"
                            description="View Address on Etherscan"
                        />
                    }
                />
                <DropdownTextItem
                    onClick={connectToExplorer}
                    text={
                        <FormattedMessage
                            id="toolbar.wallet-dropdown.track-dex"
                            defaultMessage="Track DEX volume"
                            description="Track DEX volume"
                        />
                    }
                />
                <DropdownTextItem
                    onClick={openFabrx}
                    text={
                        <FormattedMessage
                            id="toolbar.wallet-dropdown.set-alerts"
                            defaultMessage="Set Alerts"
                            description="Set Alerts"
                        />
                    }
                />
                <DropdownTextItem
                    onClick={onGoToHomeLaunchpad}
                    text={
                        <FormattedMessage
                            id="toolbar.wallet-dropdown.launchpad"
                            defaultMessage="Launchpad"
                            description="Launchpad"
                        />
                    }
                />
                <DropdownTextItem
                    onClick={onGoToHomeMarginLend}
                    text={
                        <FormattedMessage id="toolbar.wallet-dropdown.lend" defaultMessage="Lend" description="Lend" />
                    }
                />
                <DropdownTextItem
                    onClick={onLogoutWallet}
                    text={
                        <FormattedMessage
                            id="toolbar.wallet-dropdown.logout"
                            defaultMessage="Logout Wallet"
                            description="Logout"
                        />
                    }
                />
            </DropdownItems>
        );

        return (
            <WalletConnectionStatusContainer
                walletConnectionContent={content}
                headerText={ethAccountText}
                ethAccount={ethAccount}
                {...restProps}
            />
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onLogoutWallet: () => dispatch(logoutWallet()),
        onGoToHomeLaunchpad: () => dispatch(goToHomeLaunchpad()),
        onGoToHomeMarginLend: () => dispatch(goToHomeMarginLend()),
    };
};

const WalletConnectionContentContainer = connect(mapStateToProps, mapDispatchToProps)(WalletConnectionContent);

export { WalletConnectionContent, WalletConnectionContentContainer };
