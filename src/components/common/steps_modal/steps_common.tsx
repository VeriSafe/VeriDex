import React from 'react';
import styled, { keyframes } from 'styled-components';

import { themeColors } from '../../../util/theme';
import { MetamaskLarge } from '../icons/icon_metamask_large';
import { NotificationCancelIcon } from '../icons/notification_cancel_icon';
import { NotificationCheckmarkIcon } from '../icons/notification_checkmark_icon';
import { NotificationProcessingIcon } from '../icons/notification_processing_icon';
import { StepsProgress } from '../steps_modal/steps_progress';

const DONE_STATUS_VISIBILITY_TIME: number = 4000;

enum StepStatus {
    ConfirmOnMetamask,
    Loading,
    Done,
    Error,
}

interface WithChildren {
    children: React.ReactNode;
}

const StepStatusConfirmOnMetamask = (props: React.Props<WithChildren>) => (
    <>
        <MetamaskIcon />
        {props.children}
    </>
);

const StepStatusLoading = (props: React.Props<WithChildren>) => (
    <>
        <IconContainer>
            <IconSpin>
                <NotificationProcessingIcon />
            </IconSpin>
        </IconContainer>
        {props.children}
    </>
);

const StepStatusDone = (props: React.Props<WithChildren>) => (
    <>
        <IconContainer>
            <NotificationCheckmarkIcon />
        </IconContainer>
        {props.children}
    </>
);

const StepStatusError = (props: React.Props<WithChildren>) => (
    <>
        <IconContainer>
            <NotificationCancelIcon />
        </IconContainer>
        {props.children}
    </>
);

const sleep = (timeout: number) => new Promise<void>(resolve => setTimeout(resolve, timeout));

const iconMarginBottom = '30px';

const MetamaskIcon = styled(MetamaskLarge)`
    margin-bottom: ${iconMarginBottom};
`;

const StepsTimeline = styled(StepsProgress)`
    margin-top: auto;
`;

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    min-height: 300px;
    width: 310px;
`;

const ModalText = styled.p`
    color: #000;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0;
    padding: 0 20px;
    text-align: center;
`;

const ModalTextClickable = styled.span`
    color: ${themeColors.textLight};
    cursor: pointer;
    text-decoration: underline;
`;

const ModalStatusText = styled.p`
    color: #666;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 20px 20px 0;
    text-align: center;
`;

const ModalStatusTextLight = styled.span`
    color: ${themeColors.textLight};
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 62px;
    justify-content: center;
    margin-bottom: ${iconMarginBottom};

    svg {
        height: 52px;
        width: 52px;
    }
`;

const IconSpin = styled.div`
    animation: ${rotate} 1.5s linear infinite;
`;

export {
    DONE_STATUS_VISIBILITY_TIME,
    ModalContent,
    ModalStatusText,
    ModalStatusTextLight,
    ModalText,
    ModalTextClickable,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    StepsTimeline,
    Title,
    sleep,
};
