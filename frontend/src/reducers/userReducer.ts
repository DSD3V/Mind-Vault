import { createReducer } from '@reduxjs/toolkit';

import {
  CLEAR_FORM,
  LOG_IN_FAILED,
  LOG_IN_STARTED,
  LOG_IN_SUCCEEDED,
  LOG_OUT_FAILED,
  LOG_OUT_STARTED,
  LOG_OUT_SUCCEEDED,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_STARTED,
  RESET_PASSWORD_SUCCEEDED,
  SIGN_UP_FAILED,
  SIGN_UP_STARTED,
  SIGN_UP_SUCCEEDED,
} from '../actions/userActions';
import { UserStateI } from '../interfaces';

const initialState = {
  errorMessage: '',
  isLoading: false,
  successMessage: '',
  userData: {
    email: '',
    token: localStorage.getItem('token'),
    userId: '',
  },
} as UserStateI;

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(CLEAR_FORM, (state) => {
      state.errorMessage = '';
      state.isLoading = false;
      state.successMessage = '';
    })

    .addCase(LOG_IN_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.errorMessage = errorMessage;
      state.isLoading = false;
    })

    .addCase(LOG_IN_STARTED, (state) => {
      state.errorMessage = '';
      state.isLoading = true;
    })

    .addCase(LOG_IN_SUCCEEDED, (state, action) => {
      const { userData } = action.payload;
      localStorage.setItem('token', userData.token);
      state.errorMessage = '';
      state.isLoading = false;
      state.userData = {
        ...userData,
        token: userData.token,
      };
    })

    .addCase(LOG_OUT_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.errorMessage = errorMessage;
      state.isLoading = false;
    })

    .addCase(LOG_OUT_STARTED, (state) => {
      state.errorMessage = '';
      state.isLoading = true;
    })

    .addCase(LOG_OUT_SUCCEEDED, (state) => {
      localStorage.removeItem('token');
      state.errorMessage = '';
      state.isLoading = false;
      state.userData.token = '';
    })

    .addCase(RESET_PASSWORD_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.errorMessage = errorMessage;
      state.isLoading = false;
    })

    .addCase(RESET_PASSWORD_STARTED, (state) => {
      state.errorMessage = '';
      state.isLoading = true;
    })

    .addCase(RESET_PASSWORD_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.errorMessage = '';
      state.isLoading = false;
      state.successMessage = successMessage;
    })

    .addCase(SIGN_UP_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.errorMessage = errorMessage;
      state.isSignUpLoading = false;
    })

    .addCase(SIGN_UP_STARTED, (state) => {
      state.errorMessage = '';
      state.isSignUpLoading = true;
    })

    .addCase(SIGN_UP_SUCCEEDED, (state, action) => {
      const { userData } = action.payload;
      localStorage.setItem('token', userData.token);
      state.errorMessage = '';
      state.isSignUpLoading = false;
      state.userData = {
        ...userData,
        token: userData.token,
      };
    });
});
