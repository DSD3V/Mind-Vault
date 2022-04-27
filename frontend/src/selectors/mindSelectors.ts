import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

const selectMindState = (state: RootState) => state.mind;

export const selectDidEditThoughts = createSelector(
  [selectMindState],
  state => state.didEditThoughts
);

export const selectDidEnterOrExitVault = createSelector(
  [selectMindState],
  state => state.didEnterOrExitVault
);

export const selectMindCurrentVault = createSelector(
  [selectMindState],
  state => state.vaultStack[state.vaultStack.length - 1]
);

export const selectMindErrorMessage = createSelector(
  [selectMindState],
  state => state.errorMessage
);

export const selectMindIsLoading = createSelector(
  [selectMindState],
  state => state.isLoading
);

export const selectParentVaultNames = createSelector(
  [selectMindState],
  state => {
    const vaultNames = state.vaultStack.map(vault => vault.name);
    return vaultNames.slice(0, vaultNames.length - 1);
  }
);
