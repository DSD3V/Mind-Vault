import { enterVault } from '../actions/vaultActions';
import { logOut } from '../actions/userActions';
import {
  selectUserEmail,
  selectUserIsAuthenticated,
} from '../selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import {
  Nav,
  NavButtonsDiv,
  NavLoginOrSignupButton,
  NavSignoutButton,
  NavTitle,
  UserEmailSpan,
} from '../styles/NavbarStyles';

export const Navbar = ({
  openLoginSignupModal,
}: {
  openLoginSignupModal: () => void;
}) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectUserIsAuthenticated);
  const userEmail = useAppSelector(selectUserEmail);

  return (
    <Nav>
      <NavTitle onClick={() => dispatch(enterVault({ isEnteringRoot: true }))}>
        Mind Vault
      </NavTitle>
      {isLoggedIn ? (
        <NavButtonsDiv>
          <NavSignoutButton onClick={() => dispatch(logOut())}>
            Sign Out
          </NavSignoutButton>
          <UserEmailSpan>{userEmail}</UserEmailSpan>
        </NavButtonsDiv>
      ) : (
        <NavLoginOrSignupButton onClick={openLoginSignupModal}>
          Log In / Sign Up
        </NavLoginOrSignupButton>
      )}
    </Nav>
  );
};
