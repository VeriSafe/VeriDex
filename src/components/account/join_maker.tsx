import React from 'react';
import { useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { getEthAccount } from '../../store/selectors';
import { joinAsMakerToPool } from '../../util/staking';
import { ButtonVariant } from '../../util/types';
import { Button } from '../common/button';
import { Card } from '../common/card';

const LabelWrapper = styled.span`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    margin-right: 15px;
`;

const ButtonStyled = styled(Button)`
    width: 100%;
`;

const JoinAsMaker = () => {
    const ethAccount = useSelector(getEthAccount);
    const handleJoinAsMaker = () => {
        // tslint:disable-next-line:no-floating-promises
        joinAsMakerToPool(ethAccount);
    };

    let content: React.ReactNode;

    content = (
        <LabelWrapper>
            <ButtonStyled onClick={handleJoinAsMaker} variant={ButtonVariant.Buy}>
                Join As Market Maker
            </ButtonStyled>
        </LabelWrapper>
    );

    return <Card title="Join as Market Maker: Veridex Pool">{content}</Card>;
};
// @ts-ignore
const JoinAsMakerWithTheme = withTheme(JoinAsMaker);

export { JoinAsMaker, JoinAsMakerWithTheme };
