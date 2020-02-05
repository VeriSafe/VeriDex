import React, { HTMLAttributes } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Config } from '../../common/config';
import { GIT_COMMIT } from '../../common/constants';
import { goToListedTokens, openFiatOnRampChooseModal, setERC20Theme, setThemeName } from '../../store/actions';
import { getThemeName } from '../../store/selectors';
import { themeBreakPoints, themeDimensions } from '../../themes/commons';
import { getThemeFromConfigDex } from '../../themes/theme_meta_data_utils';

import { Button } from './button';
import { SocialIcon } from './icons/social_icon';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    background-color: ${props => props.theme.componentsTheme.background};
`;

const LinksContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 0 ${themeDimensions.horizontalPadding} ${themeDimensions.verticalPadding};

    @media (max-width: ${themeBreakPoints.md}) {
        flex-direction: column;
        height: 100%;
    }

    .break {
        flex-basis: 100%;
        width: 0px;
        height: 0px;
        overflow: hidden;
    }
`;

const SocialsContainer = styled.div`
    align-items: center;
    display: flex;
    height: ${themeDimensions.footerHeight};
    justify-content: center;
    padding: 0 ${themeDimensions.horizontalPadding} ${themeDimensions.verticalPadding};
`;

const HrefStyled = styled.a`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    text-decoration: none;
    padding-left: 5px;
    @media (max-width: ${themeBreakPoints.md}) {
        padding-left: 2px;
    }
`;

const StyledButton = styled(Button)`
    background-color: ${props => props.theme.componentsTheme.background};
    color: ${props => props.theme.componentsTheme.textColorCommon};
    padding: 0px;
    padding-left: 2px;
    &:hover {
        text-decoration: underline;
    }
`;

const poweredBySVG = () => {
    return (
        <svg width="108" height="18" viewBox="0 0 108 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.17959 10.0032V13.5455H0V4.49716H3.29917C4.27807 4.49716 5.04398 4.74988 5.59692 5.25533C6.15395 5.76077 6.43246 6.42986 6.43246 7.26261C6.43246 8.14092 6.16009 8.8183 5.61535 9.29474C5.0747 9.76705 4.29855 10.0032 3.28688 10.0032H1.17959ZM1.17959 9.02752H3.29917C3.92992 9.02752 4.41323 8.87837 4.74909 8.58008C5.08494 8.27764 5.25287 7.84263 5.25287 7.27504C5.25287 6.73645 5.08494 6.30558 4.74909 5.98242C4.41323 5.65927 3.95245 5.49148 3.36675 5.47905H1.17959V9.02752Z"
                fill="#777777"
            />
            <path
                d="M7.37245 10.1213C7.37245 9.46254 7.49942 8.87009 7.75336 8.34393C8.01139 7.81777 8.36773 7.41175 8.82236 7.12589C9.28109 6.84002 9.80331 6.69709 10.389 6.69709C11.2942 6.69709 12.0253 7.01403 12.5823 7.6479C13.1434 8.28178 13.424 9.12488 13.424 10.1772V10.258C13.424 10.9126 13.2991 11.5009 13.0492 12.0229C12.8035 12.5408 12.4492 12.9447 11.9864 13.2347C11.5276 13.5247 10.9993 13.6697 10.4013 13.6697C9.50022 13.6697 8.76912 13.3528 8.20799 12.7189C7.65096 12.085 7.37245 11.2461 7.37245 10.2021V10.1213ZM8.51518 10.258C8.51518 11.0037 8.68515 11.6024 9.02511 12.054C9.36915 12.5056 9.82788 12.7314 10.4013 12.7314C10.9788 12.7314 11.4375 12.5035 11.7775 12.0478C12.1174 11.5879 12.2874 10.9457 12.2874 10.1213C12.2874 9.38382 12.1133 8.78723 11.7652 8.3315C11.4212 7.87163 10.9624 7.64169 10.389 7.64169C9.82788 7.64169 9.3753 7.86748 9.03125 8.31907C8.6872 8.77066 8.51518 9.41696 8.51518 10.258Z"
                fill="#777777"
            />
            <path
                d="M20.735 11.9608L22.0129 6.82138H23.1495L21.2142 13.5455H20.2927L18.6769 8.44957L17.1041 13.5455H16.1825L14.2534 6.82138H15.3838L16.6925 11.8551L18.2407 6.82138H19.1561L20.735 11.9608Z"
                fill="#777777"
            />
            <path
                d="M27.0692 13.6697C26.1681 13.6697 25.4349 13.3714 24.8697 12.7749C24.3045 12.1741 24.0219 11.3725 24.0219 10.3699V10.1586C24.0219 9.49154 24.1468 8.89702 24.3967 8.375C24.6506 7.84884 25.0028 7.43868 25.4534 7.14453C25.908 6.84624 26.3995 6.69709 26.9279 6.69709C27.7921 6.69709 28.4638 6.98503 28.943 7.5609C29.4222 8.13678 29.6618 8.96123 29.6618 10.0343V10.5128H25.1585C25.1749 11.1757 25.3653 11.7122 25.7298 12.1223C26.0985 12.5283 26.5654 12.7314 27.1306 12.7314C27.532 12.7314 27.872 12.6485 28.1505 12.4828C28.429 12.3171 28.6727 12.0975 28.8816 11.824L29.5758 12.3709C29.0188 13.2368 28.1832 13.6697 27.0692 13.6697ZM26.9279 7.64169C26.4691 7.64169 26.0841 7.81155 25.7729 8.15128C25.4616 8.48686 25.2691 8.95916 25.1953 9.56818H28.5252V9.48118C28.4925 8.89702 28.3368 8.44543 28.0583 8.12642C27.7798 7.80327 27.403 7.64169 26.9279 7.64169Z"
                fill="#777777"
            />
            <path
                d="M34.1959 7.85298C34.0238 7.82398 33.8375 7.80948 33.6368 7.80948C32.8914 7.80948 32.3855 8.13056 32.1193 8.77273V13.5455H30.9827V6.82138H32.0886L32.107 7.59819C32.4797 6.99746 33.0081 6.69709 33.6921 6.69709C33.9133 6.69709 34.0812 6.72609 34.1959 6.78409V7.85298Z"
                fill="#777777"
            />
            <path
                d="M37.8821 13.6697C36.981 13.6697 36.2479 13.3714 35.6826 12.7749C35.1174 12.1741 34.8348 11.3725 34.8348 10.3699V10.1586C34.8348 9.49154 34.9597 8.89702 35.2096 8.375C35.4635 7.84884 35.8158 7.43868 36.2663 7.14453C36.7209 6.84624 37.2124 6.69709 37.7408 6.69709C38.605 6.69709 39.2767 6.98503 39.7559 7.5609C40.2351 8.13678 40.4747 8.96123 40.4747 10.0343V10.5128H35.9714C35.9878 11.1757 36.1782 11.7122 36.5428 12.1223C36.9114 12.5283 37.3783 12.7314 37.9435 12.7314C38.3449 12.7314 38.6849 12.6485 38.9634 12.4828C39.2419 12.3171 39.4856 12.0975 39.6945 11.824L40.3887 12.3709C39.8317 13.2368 38.9962 13.6697 37.8821 13.6697ZM37.7408 7.64169C37.2821 7.64169 36.8971 7.81155 36.5858 8.15128C36.2745 8.48686 36.082 8.95916 36.0083 9.56818H39.3382V9.48118C39.3054 8.89702 39.1497 8.44543 38.8712 8.12642C38.5927 7.80327 38.2159 7.64169 37.7408 7.64169Z"
                fill="#777777"
            />
            <path
                d="M41.5192 10.1275C41.5192 9.09588 41.7608 8.26728 42.2441 7.64169C42.7274 7.01196 43.3602 6.69709 44.1425 6.69709C44.9207 6.69709 45.5372 6.96638 45.9918 7.50497V4H47.1284V13.5455H46.0839L46.0287 12.8246C45.574 13.388 44.9412 13.6697 44.1302 13.6697C43.3602 13.6697 42.7315 13.3507 42.2441 12.7127C41.7608 12.0747 41.5192 11.242 41.5192 10.2145V10.1275ZM42.6558 10.258C42.6558 11.0203 42.8114 11.6169 43.1227 12.0478C43.434 12.4786 43.864 12.6941 44.4129 12.6941C45.1337 12.6941 45.66 12.3668 45.9918 11.7122V8.62358C45.6518 7.9897 45.1296 7.67276 44.4251 7.67276C43.8681 7.67276 43.434 7.89027 43.1227 8.32528C42.8114 8.7603 42.6558 9.40453 42.6558 10.258Z"
                fill="#777777"
            />
            <path
                d="M57.6464 10.258C57.6464 11.2855 57.4129 12.112 56.946 12.7376C56.4791 13.359 55.8524 13.6697 55.066 13.6697C54.2264 13.6697 53.5772 13.3694 53.1185 12.7686L53.0632 13.5455H52.0188V4H53.1553V7.5609C53.6141 6.98503 54.2469 6.69709 55.0538 6.69709C55.8606 6.69709 56.4934 7.00574 56.9522 7.62305C57.415 8.24035 57.6464 9.08552 57.6464 10.1586V10.258ZM56.5098 10.1275C56.5098 9.34446 56.3603 8.73958 56.0613 8.31285C55.7623 7.88613 55.3323 7.67276 54.7711 7.67276C54.0216 7.67276 53.483 8.02492 53.1553 8.72923V11.6376C53.5035 12.3419 54.0462 12.6941 54.7834 12.6941C55.3282 12.6941 55.7521 12.4807 56.0552 12.054C56.3583 11.6272 56.5098 10.9851 56.5098 10.1275Z"
                fill="#777777"
            />
            <path
                d="M61.1852 11.8613L62.7334 6.82138H63.9498L61.2773 14.5833C60.8637 15.7019 60.2063 16.2612 59.3052 16.2612L59.0902 16.2425L58.6663 16.1618V15.2296L58.9734 15.2544C59.3584 15.2544 59.6574 15.1757 59.8704 15.0183C60.0875 14.8609 60.2657 14.5729 60.4049 14.1545L60.6568 13.4709L58.2853 6.82138H59.5264L61.1852 11.8613Z"
                fill="#777777"
            />
            <path
                d="M72.7808 11.3763L74.178 9.93067L72.441 7.58664L70.2293 4.45722C69.448 5.79067 69 7.34287 69 9C69 11.7452 70.2293 14.203 72.1682 15.8537L74.9755 13.8697C74.0206 13.2748 73.2514 12.4087 72.7808 11.3763Z"
                fill="#777777"
            />
            <path
                d="M75.6237 3.78081L77.0693 5.17803L79.4134 3.44099L82.5428 1.22933C81.2093 0.447982 79.6571 0 78 0C75.2548 0 72.797 1.22933 71.1463 3.16816L73.1303 5.97552C73.7252 5.02063 74.5913 4.25139 75.6237 3.78081Z"
                fill="#777777"
            />
            <path
                d="M81.822 8.06933L83.559 10.4134L85.7707 13.5428C86.552 12.2093 87 10.6571 87 9C87 6.2548 85.7707 3.79695 83.8318 2.14628L81.0245 4.13031C81.9794 4.7252 82.7486 5.5913 83.2192 6.62368L81.822 8.06933Z"
                fill="#777777"
            />
            <path
                d="M84.8537 14.8318L82.8697 12.0245C82.2748 12.9794 81.4087 13.7486 80.3763 14.2192L78.9307 12.822L76.5866 14.559L73.4572 16.7707C74.7907 17.552 76.3429 18 78 18C80.7452 18 83.203 16.7707 84.8537 14.8318Z"
                fill="#777777"
            />
            <path
                d="M95.7489 3.89648C93.6144 3.89648 92.2422 5.54671 92.2422 8.8651C92.2422 12.1566 93.6234 13.8247 95.7489 13.8247C97.8745 13.8247 99.2736 12.1566 99.2736 8.8651C99.2736 5.57361 97.8745 3.89648 95.7489 3.89648ZM93.435 8.87406C93.435 6.41666 94.1973 4.97272 95.7399 4.97272C96.2063 4.97272 96.6099 5.10725 96.9597 5.38527L93.9283 11.5826C93.6054 10.9279 93.435 10.031 93.435 8.87406ZM95.7489 12.7664C95.2825 12.7664 94.8879 12.6319 94.5471 12.3718L97.5785 6.18348C97.9103 6.85613 98.0718 7.74402 98.0718 8.87406C98.0718 11.3135 97.2915 12.7664 95.7489 12.7664Z"
                fill="#777777"
            />
            <path
                d="M104.96 10.086L106.915 6.76758H105.704L104.09 9.503H103.596L102.018 6.76758H100.78L102.708 10.1308L100.565 13.6555H101.838L103.587 10.7676H104.072L105.785 13.6555H107.094L104.96 10.086Z"
                fill="#777777"
            />
        </svg>
    );
};

export const Footer: React.FC<Props> = props => {
    const config = Config.getConfig();
    const dispatch = useDispatch();
    let socialButtons;
    if (config.general && config.general.social) {
        const social_urls_keys = Object.keys(config.general.social);
        const social_urls = config.general.social;
        socialButtons = () => {
            return social_urls_keys.map(s => (
                // @ts-ignore
                <SocialIcon key={s} icon={s.split('_')[0]} url={social_urls[s]} />
            ));
        };
    }

    const themeName = useSelector(getThemeName);
    const handleThemeClick = () => {
        const themeN = themeName === 'DARK_THEME' ? 'LIGHT_THEME' : 'DARK_THEME';
        dispatch(setThemeName(themeN));
        const theme = getThemeFromConfigDex(themeN);
        dispatch(setERC20Theme(theme));
    };
    const handleFiatChooseModal = () => {
        dispatch(openFiatOnRampChooseModal(true));
    };

    /*const handleDexWizardClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        dispatch(goToDexWizard());
    };*/

    const handleListTokensClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        dispatch(goToListedTokens());
    };

    return (
        <FooterWrapper title={GIT_COMMIT} {...props}>
            <LinksContainer>
                <HrefStyled href={`/listed-tokens`} onClick={handleListTokensClick}>
                    Tokens
                </HrefStyled>
                <HrefStyled
                    href="https://www.verisafe.io/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                >
                    Terms and Conditions
                </HrefStyled>
                <HrefStyled href="https://0x.org/" target="_blank" rel="noopener noreferrer">
                    {poweredBySVG()}
                </HrefStyled>
                <br className="break" />

                <HrefStyled href="https://www.verisafe.io/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                </HrefStyled>
                <HrefStyled
                    href="https://steemit.com/veridex/@joaocampos/tutorial-to-use-veridex-at-dex-verisafe-io-https-dex-verisafe-io"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Tutorial
                </HrefStyled>
                <HrefStyled href="https://my.verisafe.io/help-support/" target="_blank" rel="noopener noreferrer">
                    Listings
                </HrefStyled>
                <StyledButton onClick={handleThemeClick} className={'theme-switcher-footer'}>
                    {themeName === 'DARK_THEME' ? '☼' : '🌑'}
                </StyledButton>
                <StyledButton onClick={handleFiatChooseModal} className={'buy-eth-footer'}>
                    Buy ETH
                </StyledButton>
            </LinksContainer>
            {/*<LinksContainer>
                <HrefStyled href={`/dex-wizard`} onClick={handleDexWizardClick}>
                    Dex Wizard
                 </HrefStyled>
                <StyledButton onClick={handleThemeClick} className={'theme-switcher-footer'}>
                    {themeName === 'DARK_THEME' ? '☼' : '🌑'}
                </StyledButton>
                <StyledButton onClick={handleFiatChooseModal} className={'buy-eth-footer'}>
                    Buy ETH
                </StyledButton>
                </LinksContainer> */}
            {socialButtons && <SocialsContainer>{socialButtons()}</SocialsContainer>}
        </FooterWrapper>
    );
};
