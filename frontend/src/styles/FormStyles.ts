import styled from 'styled-components';

import { colors } from '../constants';

export const CaptchaDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 7% 0 5% 0;
`;

export const ErrorMessage = styled.p`
  color: ${colors.RED};
  font-size: 0.9rem;
  margin: 2px 0 0 1px;
  text-align: left;
`;

export const ErrorMessage2 = styled(ErrorMessage)`
  margin: 3px 0 0 0;
  text-align: center;
`;

export const SubmitButtonDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const GoogleButtonDiv = styled(SubmitButtonDiv)`
  margin: 3% 0 5% 0;
`;

export const InputField = styled.input`
  width: 50%;
`;

export const ResetPasswordErrorMessage = styled(ErrorMessage)`
  margin-top: 2%;
  text-align: center;
`;

export const SuccessMessage = styled.p`
  color: ${colors.GREEN};
  font-size: 1.1rem;
  margin-top: 2%;
  text-align: center;
`;

export const SuccessMessage2 = styled.p`
  color: ${colors.GREEN};
  font-size: 0.9rem;
  margin: 3px 0 0 0;
  text-align: center;
`;
