import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import { LoginForm } from './LoginForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SignupForm } from './SignupForm';
import { Divider } from '../styles/GlobalStyles';
import { ModalNav, ModalNavText } from '../styles/LoginSignupModalStyles';

export const LoginSignupModal = ({
  closeLoginSignupModal,
  isLoginSignupModalOpen,
}: {
  closeLoginSignupModal: () => void;
  isLoginSignupModalOpen: boolean;
}) => {
  const [selectedForm, setSelectedForm] = useState('login');

  return (
    <Modal backdrop="static" centered onHide={closeLoginSignupModal} show={isLoginSignupModalOpen}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <ModalNav>
          <ModalNavText $isSelected={selectedForm === 'login'} onClick={() => setSelectedForm('login')}>
            Login
          </ModalNavText>
          <Divider>|</Divider>
          <ModalNavText $isSelected={selectedForm === 'signup'} onClick={() => setSelectedForm('signup')}>
            Signup
          </ModalNavText>
        </ModalNav>
        {selectedForm === 'login' ? (
          <LoginForm setSelectedForm={setSelectedForm} />
        ) : selectedForm === 'signup' ? (
          <SignupForm setSelectedForm={setSelectedForm} />
        ) : (
          <ResetPasswordForm setSelectedForm={setSelectedForm} />
        )}
      </Modal.Body>
    </Modal>
  );
};
