import { createAction, Dispatch } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from '../auth/firebase';

export const CLEAR_FORM = createAction('CLEAR_FORM');

export const LOG_IN_FAILED = createAction(
  'LOG_IN_FAILED',
  ({ errorMessage }) => ({
    payload: { errorMessage },
  })
);
export const LOG_IN_STARTED = createAction('LOG_IN_STARTED');
export const LOG_IN_SUCCEEDED = createAction(
  'LOG_IN_SUCCEEDED',
  ({ userData }) => ({
    payload: { userData },
  })
);

export const LOG_OUT_FAILED = createAction(
  'LOG_OUT_FAILED',
  ({ errorMessage }) => ({
    payload: { errorMessage },
  })
);
export const LOG_OUT_STARTED = createAction('LOG_OUT_STARTED');
export const LOG_OUT_SUCCEEDED = createAction('LOG_OUT_SUCCEEDED');

export const RESET_PASSWORD_FAILED = createAction(
  'RESET_PASSWORD_FAILED',
  ({ errorMessage }) => ({
    payload: { errorMessage },
  })
);
export const RESET_PASSWORD_STARTED = createAction('RESET_PASSWORD_STARTED');
export const RESET_PASSWORD_SUCCEEDED = createAction(
  'RESET_PASSWORD_SUCCEEDED',
  ({ successMessage }) => ({
    payload: { successMessage },
  })
);

export const SIGN_UP_FAILED = createAction(
  'SIGN_UP_FAILED',
  ({ errorMessage }) => ({
    payload: { errorMessage },
  })
);
export const SIGN_UP_STARTED = createAction('SIGN_UP_STARTED');
export const SIGN_UP_SUCCEEDED = createAction(
  'SIGN_UP_SUCCEEDED',
  ({ userData }) => ({
    payload: { userData },
  })
);

export const logIn =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(LOG_IN_STARTED());
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      dispatch(LOG_IN_FAILED({ errorMessage: 'Log In Failed.' }));
    }
  };

export const logInWithGoogle = () => async (dispatch: Dispatch) => {
  dispatch(LOG_IN_STARTED());
  try {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, googleAuthProvider);
  } catch (error) {
    console.error(error);
    dispatch(LOG_IN_FAILED({ errorMessage: 'Google Log In Failed.' }));
  }
};

export const logOut = () => async (dispatch: Dispatch) => {
  dispatch(LOG_OUT_STARTED());
  try {
    await signOut(auth);
    dispatch(LOG_OUT_SUCCEEDED());
  } catch (error) {
    console.error(error);
    dispatch(LOG_OUT_FAILED({ errorMessage: 'Error: Failed to log out.' }));
  }
};

export const resetPassword =
  ({ email }: { email: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(RESET_PASSWORD_STARTED());
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch(
        RESET_PASSWORD_SUCCEEDED({
          successMessage: 'Reset password email sent.',
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        RESET_PASSWORD_FAILED({
          errorMessage: (error as Error).toString().includes('not-found')
            ? 'A user with this email does not exist.'
            : 'Error: Failed to send reset password email.',
        })
      );
    }
  };

export const signUp =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(SIGN_UP_STARTED());
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      const errorString = (error as Error).toString();
      dispatch(
        SIGN_UP_FAILED({
          errorMessage: errorString.includes('invalid-email')
            ? 'Error: Sign Up Failed - Invalid email entered.'
            : errorString.includes('email-already-in-use')
            ? 'Sign Up Failed - A user with this email already exists.'
            : 'Error: Sign Up Failed.',
        })
      );
    }
  };
