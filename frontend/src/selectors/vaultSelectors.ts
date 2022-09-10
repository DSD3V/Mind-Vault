import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

const selectVaultState = (state: RootState) => state.vault;

export const selectAddingVaultErrorMessage = createSelector(
  [selectVaultState],
  (state) => state.addingVaultErrorMessage
);

export const selectAddingVaultSuccessMessage = createSelector(
  [selectVaultState],
  (state) => state.addingVaultSuccessMessage
);

export const selectDeletingVaultErrorMessage = createSelector(
  [selectVaultState],
  (state) => state.deletingVaultErrorMessage
);

export const selectDeletingVaultSuccessMessage = createSelector(
  [selectVaultState],
  (state) => state.deletingVaultSuccessMessage
);

export const selectIsAddingVault = createSelector([selectVaultState], (state) => state.isAddingVault);

export const selectIsDeletingVault = createSelector([selectVaultState], (state) => state.isDeletingVault);

export const selectEditingVaultsErrorMessage = createSelector(
  [selectVaultState],
  (state) => state.editingVaultsErrorMessage
);

export const selectEditingVaultsSuccessMessage = createSelector(
  [selectVaultState],
  (state) => state.editingVaultsSuccessMessage
);

export const selectIsEditingVaults = createSelector([selectVaultState], (state) => state.isEditingVaults);
