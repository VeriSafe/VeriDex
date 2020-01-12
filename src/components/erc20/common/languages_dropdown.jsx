import React from 'react';

import styled from 'styled-components';
import { DropdownTextItem } from '../../common/dropdown_text_item';
import { CardBase } from '../../common/card_base';
import { Dropdown, DropdownPositions } from '../../common/dropdown';

const DropdownItems = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
`;

const DropdownSelectionWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

const DropdownSelectionText = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

const LanguagesDropdown = props => {
    const { onClick, language } = props;

    const getLanguage = language => {
        switch (language) {
            case 'pt':
                return 'Português';
            case 'es':
                return 'Espanol';
            case 'en':
            default:
                return 'English';
        }
    };

    const body = (
        <DropdownItems>
            <DropdownTextItem onClick={onClick} text="English" value="en" />
            <DropdownTextItem onClick={onClick} text="Espanol" value="es" />
            <DropdownTextItem onClick={onClick} text="Português" value="pt" />
        </DropdownItems>
    );

    const header = (
        <DropdownSelectionWrapper>
            <DropdownSelectionText>{getLanguage(language)}</DropdownSelectionText>
        </DropdownSelectionWrapper>
    );

    return <Dropdown header={header} body={body} horizontalPosition={DropdownPositions.Right} />;
};

export default LanguagesDropdown;
