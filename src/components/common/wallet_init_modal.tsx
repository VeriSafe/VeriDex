import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled, { withTheme } from 'styled-components';

import { Theme } from '../../themes/commons';
import { ButtonVariant, Wallet } from '../../util/types';

import { Button } from './button';
import { CloseModalButton } from './icons/close_modal_button';

interface OwnProps {
    theme: Theme;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {
    isOpen: boolean;
    closeModal: any;
    chooseWallet: (wallet: Wallet) => any;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
    width: 310px;
`;

const ModalTitle = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ModalTextLink = styled.a`
    color: ${props => props.theme.componentsTheme.textLight};
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
`;

const ButtonStyled = styled(Button)`
    width: 100%;
    margin: 10px;
`;

const ButtonCoinbase = styled(Button)`
    width: 100%;
    margin: 10px;
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
`;

const LinkButton = styled.a`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
`;

const MobileText = styled.p`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
    text-align: left;
`;

const WalletChooseModalContainer: React.FC<Props> = props => {
    const { isOpen, closeModal, chooseWallet, theme } = props;

    const choosePortis = () => {
        chooseWallet(Wallet.Portis);
    };

    /*const chooseWalletTorus = () => {
        chooseWallet(Wallet.Torus);
    };*/
    const chooseFortmatic = () => {
        chooseWallet(Wallet.Fortmatic);
    };

    const chooseWalletConnect = () => {
        chooseWallet(Wallet.WalletConnect);
    };


    const content = (
        <>
            <ModalTitle>Wallet:</ModalTitle>
            Import
                <ButtonStyled onClick={choosePortis} variant={ButtonVariant.Portis}>
                    <LinkButton>{'Private Key'}</LinkButton>
                </ButtonStyled>
                <ButtonStyled onClick={chooseFortmatic} variant={ButtonVariant.Fortmatic}>
                    <LinkButton>{'Menmonic'}</LinkButton>
                </ButtonStyled>
                <ButtonStyled onClick={chooseFortmatic} variant={ButtonVariant.Fortmatic}>
                    <LinkButton>{'Keystore'}</LinkButton>
                </ButtonStyled>
            o  
            <ButtonStyled onClick={chooseFortmatic} variant={ButtonVariant.Fortmatic}>
                    <LinkButton>{'Create'}</LinkButton>
                </ButtonStyled>
           {/* <ButtonStyled  onClick={chooseWalletConnect} variant={ButtonVariant.Torus}>
                <LinkButton>{'Wallet Connect'}</LinkButton>
         </ButtonStyled>*/}
            {/*<ButtonStyled  onClick={chooseWalletTorus} variant={ButtonVariant.Torus}>
                <LinkButton>{'Torus'}</LinkButton>
               </ButtonStyled>*/}
            {/*isMMInstalled() ? <ModalTextLink>Torus not work with Metamask installed! </ModalTextLink> : ''*/}
        </>
    );

    return (
        <Modal isOpen={isOpen} style={theme.modalTheme}>
            <CloseModalButton onClick={closeModal} />
            <ModalContent>{content}</ModalContent>
        </Modal>
    );
};

const WalletChooseModal = withTheme(WalletChooseModalContainer);

export { WalletChooseModal };
