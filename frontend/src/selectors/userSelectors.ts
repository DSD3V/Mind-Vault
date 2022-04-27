import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

const selectUserState = (state: RootState) => state.user;

export const selectUserData = createSelector(
  [selectUserState],
  state => state.userData
);

export const selectUserEmail = createSelector(
  [selectUserData],
  state => state.email
);

export const selectUserErrorMessage = createSelector(
  [selectUserState],
  state => state.errorMessage
);

export const selectUserId = createSelector(
  [selectUserData],
  state => state.userId
);

export const selectUserIsAuthenticated = createSelector(
  [selectUserData],
  state => !!state.token
);

export const selectUserIsLoading = createSelector(
  [selectUserState],
  state => state.isLoading
);

export const selectUserIsSignUpLoading = createSelector(
  [selectUserState],
  state => state.isSignUpLoading
);

export const selectUserSuccessMessage = createSelector(
  [selectUserState],
  state => state.successMessage
);
