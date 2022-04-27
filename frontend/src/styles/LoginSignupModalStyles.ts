import styled from 'styled-components';

import { colors, NAV_HEIGHT } from '../constants';
import { StyledLink } from './GlobalStyles';

export const Container = styled.div`
  align-items: center;
  color: ${colors.GREY};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${NAV_HEIGHT + 20}px;
  padding: 3% 5%;
`;

export const ModalNav = styled.div`
  display: flex;
  justify-content: center;
  margin: -53px auto 10px auto;
  width: 50%;
`;

export const ModalNavText = styled(StyledLink)<{
  $isSelected: boolean;
}>`
  border-bottom: ${({ $isSelected }) => ($isSelected ? '1px solid' : 'none')};
`;
