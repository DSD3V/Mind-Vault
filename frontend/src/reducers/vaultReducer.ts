import { createReducer } from '@reduxjs/toolkit';

import {
  ADD_VAULT_FAILED,
  ADD_VAULT_STARTED,
  ADD_VAULT_SUCCEEDED,
  CLEAR_ADD_VAULT_MESSAGES,
  CLEAR_DELETE_VAULT_MESSAGES,
  CLEAR_EDIT_VAULTS_MESSAGES,
  CLEAR_REORDER_VAULTS_MESSAGES,
  DELETE_VAULT_FAILED,
  DELETE_VAULT_STARTED,
  DELETE_VAULT_SUCCEEDED,
  EDIT_VAULTS_FAILED,
  EDIT_VAULTS_STARTED,
  EDIT_VAULTS_SUCCEEDED,
  REORDER_VAULTS_FAILED,
} from '../actions/vaultActions';
import { VaultStateI } from '../interfaces';

const initialState = {
  addingVaultErrorMessage: '',
  addingVaultSuccessMessage: '',
  deletingVaultErrorMessage: '',
  deletingVaultSuccessMessage: '',
  editingVaultsErrorMessage: '',
  editingVaultsSuccessMessage: '',
  isAddingVault: false,
  isDeletingVault: false,
  isEditingVaults: false,
  reorderingVaultsErrorMessage: '',
} as VaultStateI;

export const vaultReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_VAULT_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.addingVaultErrorMessage = errorMessage;
      state.isAddingVault = false;
    })

    .addCase(ADD_VAULT_STARTED, (state) => {
      state.addingVaultErrorMessage = '';
      state.isAddingVault = true;
    })

    .addCase(ADD_VAULT_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.addingVaultErrorMessage = '';
      state.addingVaultSuccessMessage = successMessage;
      state.isAddingVault = false;
    })

    .addCase(CLEAR_ADD_VAULT_MESSAGES, (state) => {
      state.addingVaultErrorMessage = '';
      state.addingVaultSuccessMessage = '';
    })

    .addCase(CLEAR_DELETE_VAULT_MESSAGES, (state) => {
      state.deletingVaultErrorMessage = '';
      state.deletingVaultSuccessMessage = '';
    })

    .addCase(CLEAR_EDIT_VAULTS_MESSAGES, (state) => {
      state.editingVaultsErrorMessage = '';
      state.editingVaultsSuccessMessage = '';
    })

    .addCase(CLEAR_REORDER_VAULTS_MESSAGES, (state) => {
      state.editingVaultsErrorMessage = '';
    })

    .addCase(DELETE_VAULT_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.deletingVaultErrorMessage = errorMessage;
      state.isDeletingVault = false;
    })

    .addCase(DELETE_VAULT_STARTED, (state) => {
      state.deletingVaultErrorMessage = '';
      state.deletingVaultSuccessMessage = '';
      state.isDeletingVault = true;
    })

    .addCase(DELETE_VAULT_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.deletingVaultErrorMessage = '';
      state.deletingVaultSuccessMessage = successMessage;
      state.isDeletingVault = false;
    })

    .addCase(EDIT_VAULTS_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.editingVaultsErrorMessage = errorMessage;
      state.isEditingVaults = false;
    })

    .addCase(EDIT_VAULTS_STARTED, (state) => {
      state.editingVaultsErrorMessage = '';
      state.editingVaultsSuccessMessage = '';
      state.isEditingVaults = true;
    })

    .addCase(EDIT_VAULTS_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.editingVaultsErrorMessage = '';
      state.editingVaultsSuccessMessage = successMessage;
      state.isEditingVaults = false;
    })

    .addCase(REORDER_VAULTS_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.reorderingVaultsErrorMessage = errorMessage;
    });
});
