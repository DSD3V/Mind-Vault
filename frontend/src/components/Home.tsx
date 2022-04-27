import { TailSpin } from 'react-loader-spinner';

import defaultVaultImgUrl from '../images/vaultPic.jpg';
import { LoginSignupModal } from './LoginSignupModal';
import {
  selectMindCurrentVault,
  selectMindIsLoading,
} from '../selectors/mindSelectors';
import { selectUserIsAuthenticated } from '../selectors/userSelectors';
import { useAppSelector } from '../store';
import { Container, Div } from '../styles/GlobalStyles';
import { LoginSignupCell, VaultImage, VaultTitle } from '../styles/VaultStyles';
import { Vault } from './Vault';

export const Home = ({
  closeLoginSignupModal = () => {},
  isLoginSignupModalOpen = false,
  openLoginSignupModal = () => {},
}: {
  closeLoginSignupModal?: () => void;
  isLoginSignupModalOpen?: boolean;
  openLoginSignupModal?: () => void;
}) => {
  const currentVault = useAppSelector(selectMindCurrentVault);
  const isAuthenticated = useAppSelector(selectUserIsAuthenticated);
  const isLoadingVaults = useAppSelector(selectMindIsLoading);

  return isAuthenticated ? (
    isLoadingVaults ? (
      <Container>
        <Div $d='column' $f='1.2rem' $m='40px 0 0 0'>
          <span style={{ paddingBottom: '38px' }}>Fetching vaults...</span>
          <TailSpin color='#00BFFF' height={70} width={70} />
        </Div>
      </Container>
    ) : (
      !!currentVault && <Vault vault={currentVault} />
    )
  ) : (
    <Container>
      {isLoginSignupModalOpen && (
        <LoginSignupModal
          closeLoginSignupModal={closeLoginSignupModal}
          isLoginSignupModalOpen={isLoginSignupModalOpen}
        />
      )}
      <LoginSignupCell onClick={() => openLoginSignupModal()}>
        <VaultTitle>
          Log In or Sign Up to view or create Mind Vaults.
        </VaultTitle>
        <VaultImage src={defaultVaultImgUrl} />
      </LoginSignupCell>
    </Container>
  );
};
