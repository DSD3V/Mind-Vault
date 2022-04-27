import styled from 'styled-components';

import { colors, NAV_HEIGHT } from '../constants';

export const AlertDiv = styled.div`
  position: fixed;
  top: 34%;
  z-index: 2;
`;

export const Button = styled.a<{
  $isDisabled?: boolean;
  $isHidden?: boolean;
  $w?: string;
}>`
  align-self: flex-end;
  border: 2px solid ${colors.NAVY};
  color: ${({ $isDisabled }) => ($isDisabled ? colors.DARK_GREY : colors.GREY)};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  font-size: 0.9rem;
  margin: 0 14px 2px 14px;
  padding: 6px 10px;
  text-decoration: none;
  transition: ${({ $isHidden }) => ($isHidden ? '0s' : '0.4s')};
  visibility: ${({ $isHidden }) => ($isHidden ? 'hidden' : 'visible')};
  width: ${({ $w }) => ($w ? $w : 'auto')};

  :hover {
    border: ${({ $isDisabled }) =>
      $isDisabled
        ? `2px solid ${colors.NAVY}`
        : `2px solid ${colors.LIGHT_NAVY}`};
    color: ${({ $isDisabled }) =>
      $isDisabled ? colors.DARK_GREY : colors.LIGHT_GREY};
  }
`;

export const Container = styled.div`
  align-items: center;
  color: ${colors.GREY};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${NAV_HEIGHT + 15}px;
  padding: 3% 2% 5% 2%;
`;

export const Div = styled.div<{
  $a?: string;
  $as?: string;
  $c?: string;
  $d?: string;
  $f?: string;
  $h?: string;
  $j?: string;
  $m?: string;
  $mh?: string;
  $p?: string;
  $w?: string;
}>`
  align-items: ${({ $a }) => ($a ? $a : 'center')};
  align-self: ${({ $as }) => ($as ? $as : 'auto')};
  color: ${({ $c }) => ($c ? $c : 'auto')};
  display: flex;
  flex-direction: ${({ $d }) => ($d ? $d : 'row')};
  font-size: ${({ $f }) => ($f ? $f : 'auto')};
  height: ${({ $h }) => ($h ? $h : 'auto')};
  justify-content: ${({ $j }) => ($j ? $j : 'center')};
  margin: ${({ $m }) => ($m ? $m : 0)};
  max-height: ${({ $mh }) => ($mh ? $mh : 'auto')};
  padding: ${({ $p }) => ($p ? $p : 0)};
  width: ${({ $w }) => ($w ? $w : '100%')};
`;

export const Divider = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin: 1px;
  padding: 0 8px;
  transform: scaleY(1.2);
`;

export const EmptySpan = styled.span`
  cursor: default;
`;

export const FileInput = styled.input`
  color: transparent;
  font-size: 0.75rem;
  margin: 7px auto 4px auto;

  ::before {
    border: 2px solid ${colors.NAVY};
    color: ${colors.GREY};
    cursor: pointer;
    display: inline-block;
    outline: none;
    padding: 4px 10px;
    -webkit-user-select: none;
  }

  :hover::before {
    border: 2px solid ${colors.LIGHT_NAVY};
    color: ${colors.LIGHT_GREY};
    transition: 0.4s;
  }

  ::-webkit-file-upload-button {
    visibility: hidden;
  }
`;

export const NameInputField = styled.input`
  background-color: black;
  border: 2px solid ${colors.NAVY};
  color: ${colors.GREY};
  font-size: 1.15rem;
  padding: 7px 9px;
  text-align: center;
  width: 95%;
  word-wrap: break-word;

  :focus {
    border: 2px solid ${colors.LIGHT_NAVY};
    box-shadow: none;
    outline: none;
  }

  ::placeholder {
    color: ${colors.DARK_GREY};
    opacity: 0.8;
    text-align: center;
  }

  @media (max-width: 351px) {
    font-size: 0.9rem;
  }
`;

export const StyledLink = styled.a`
  cursor: pointer;
  padding: 0 3px;
  text-decoration: none;
`;

export const X = styled.a`
  align-self: flex-end;
  color: ${colors.DARK_RED};
  cursor: pointer;
  font-size: 1.9rem;
  font-weight: 600;
  text-decoration: none;
  transform: scale(1.2, 1.12);
  transition: 0.35s;

  :hover {
    color: ${colors.SLIGHTLY_LESS_DARK_RED};
  }
`;
