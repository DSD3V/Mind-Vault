import styled from 'styled-components';

import { colors, NAV_HEIGHT } from '../constants';

export const Nav = styled.nav`
  align-items: center;
  background-color: ${colors.NAVY};
  display: flex;
  height: ${NAV_HEIGHT}px;
  justify-content: space-between;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
`;

export const NavButtonsDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-right: max(2.5%, 15px);
`;

export const NavLoginOrSignupButton = styled.a`
  border: 2px solid black;
  color: ${colors.GREY};
  cursor: pointer;
  font-size: 1rem;
  margin-right: max(2.5%, 15px);
  padding: 10px 12px;
  text-decoration: none;
  transition: 0.4s;

  :hover {
    color: ${colors.LIGHT_GREY};
  }
`;

export const NavSignoutButton = styled.a`
  border: 2px solid black;
  color: ${colors.GREY};
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 4px;
  margin-top: 4px;
  text-decoration: none;
  transition: 0.4s;
  width: 80px;

  :hover {
    color: ${colors.LIGHT_GREY};
  }
`;

export const NavTitle = styled.a`
  color: ${colors.GREY};
  cursor: pointer;
  font-size: 1.35rem;
  margin-left: max(2.5%, 15px);
  text-decoration: none;
  transition: 0.4s;

  :hover {
    color: ${colors.LIGHT_GREY};
  }
`;

export const UserEmailSpan = styled.span`
  color: ${colors.DARK_GREY};
  font-size: 0.82rem;
  padding-top: 3px;
`;
