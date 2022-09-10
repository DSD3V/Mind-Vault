import { arrayMove } from '@dnd-kit/sortable';
import { createReducer } from '@reduxjs/toolkit';

import { GET_MIND_FAILED, GET_MIND_STARTED, GET_MIND_SUCCEEDED } from '../actions/mindActions';
import { ADD_THOUGHT_SUCCEEDED, DELETE_THOUGHT_SUCCEEDED, EDIT_THOUGHTS_SUCCEEDED } from '../actions/thoughtActions';
import { SIGN_UP_SUCCEEDED } from '../actions/userActions';
import {
  ADD_VAULT_SUCCEEDED,
  DELETE_VAULT_SUCCEEDED,
  EDIT_VAULTS_SUCCEEDED,
  ENTER_ROOT_VAULT,
  ENTER_VAULT,
  EXIT_VAULT,
  REORDER_VAULTS_IN_STATE,
} from '../actions/vaultActions';
import { MindStateI, ThoughtI, VaultEditRequestI, VaultI } from '../interfaces';

const initialState = {
  didEditThoughts: false,
  didEnterOrExitVault: false,
  errorMessage: '',
  isLoading: false,
  vaultStack: [],
} as MindStateI;

const MIND_UPDATE_TYPES = {
  AddThought: 'Add Thought',
  AddVault: 'Add Vault',
  DeleteThought: 'Delete Thought',
  DeleteVault: 'Delete Vault',
  EditThoughts: 'Edit Thoughts',
  EditVaults: 'Edit Vaults',
  ReorderVaults: 'Reorder Vaults',
};

export const mindReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_THOUGHT_SUCCEEDED, (state, action) => {
      const { newThought } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        newThought,
        state,
        updateType: MIND_UPDATE_TYPES.AddThought,
      });
    })

    .addCase(ADD_VAULT_SUCCEEDED, (state, action) => {
      const { newVault } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        newVault,
        state,
        updateType: MIND_UPDATE_TYPES.AddVault,
      });
    })

    .addCase(DELETE_THOUGHT_SUCCEEDED, (state, action) => {
      const { deletedThoughtId } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        deletedThoughtId,
        state,
        updateType: MIND_UPDATE_TYPES.DeleteThought,
      });
    })

    .addCase(DELETE_VAULT_SUCCEEDED, (state, action) => {
      const { deletedVaultId } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        deletedVaultId,
        state,
        updateType: MIND_UPDATE_TYPES.DeleteVault,
      });
    })

    .addCase(EDIT_THOUGHTS_SUCCEEDED, (state, action) => {
      const { thoughts } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        state,
        thoughts,
        updateType: MIND_UPDATE_TYPES.EditThoughts,
      });
    })

    .addCase(EDIT_VAULTS_SUCCEEDED, (state, action) => {
      const { vaultEditRequests } = action.payload;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        state,
        updateType: MIND_UPDATE_TYPES.EditVaults,
        vaultEditRequests,
      });
    })

    .addCase(ENTER_ROOT_VAULT, (state) => {
      state.didEditThoughts = false;
      state.didEnterOrExitVault = true;
      state.vaultStack = state.vaultStack.slice(0, 1);
    })

    .addCase(ENTER_VAULT, (state, action) => {
      const { vaultToEnter } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = true;
      state.vaultStack = [...state.vaultStack, vaultToEnter];
    })

    .addCase(EXIT_VAULT, (state) => {
      state.didEditThoughts = false;
      state.didEnterOrExitVault = true;
      state.vaultStack = state.vaultStack.slice(0, state.vaultStack.length - 1);
    })

    .addCase(GET_MIND_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.errorMessage = errorMessage;
      state.isLoading = false;
    })

    .addCase(GET_MIND_STARTED, (state) => {
      state.errorMessage = '';
      state.isLoading = true;
    })

    .addCase(GET_MIND_SUCCEEDED, (state, action) => {
      const { mind } = action.payload;
      state.errorMessage = '';
      state.isLoading = false;
      state.vaultStack = [
        {
          childVaults: mind,
          imageUrl: '',
          name: '',
          thoughts: [],
          vaultId: '',
        },
      ];
    })

    .addCase(REORDER_VAULTS_IN_STATE, (state, action) => {
      const { newIndex, oldIndex } = action.payload;
      state.didEditThoughts = false;
      state.didEnterOrExitVault = false;
      updateMindHelper({
        newIndex,
        oldIndex,
        state,
        updateType: MIND_UPDATE_TYPES.ReorderVaults,
      });
    })

    .addCase(SIGN_UP_SUCCEEDED, (state) => {
      state.errorMessage = '';
      state.isLoading = false;
      state.vaultStack = [
        {
          childVaults: [],
          imageUrl: '',
          name: '',
          thoughts: [],
          vaultId: '',
        },
      ];
    });
});

const updateMindHelper = ({
  deletedThoughtId,
  deletedVaultId,
  newIndex,
  newThought,
  newVault,
  oldIndex,
  state,
  thoughts,
  updateType,
  vaultEditRequests,
}: {
  deletedThoughtId?: string;
  deletedVaultId?: string;
  newIndex?: number;
  newThought?: ThoughtI;
  newVault?: VaultI;
  oldIndex?: number;
  state: MindStateI;
  thoughts?: ThoughtI[];
  updateType: string;
  vaultEditRequests?: VaultEditRequestI[];
}): void => {
  const vaultIdx = state.vaultStack.length - 1;

  switch (updateType) {
    case MIND_UPDATE_TYPES.AddThought:
      state.vaultStack[vaultIdx].thoughts.unshift(newThought!);
      break;

    case MIND_UPDATE_TYPES.DeleteThought:
      state.vaultStack[vaultIdx].thoughts = state.vaultStack[vaultIdx].thoughts.filter(
        (thought) => thought.thoughtId !== deletedThoughtId
      );
      break;

    case MIND_UPDATE_TYPES.EditThoughts:
      state.vaultStack[vaultIdx].thoughts = thoughts!;
      state.didEditThoughts = true;
      break;

    case MIND_UPDATE_TYPES.AddVault:
      state.vaultStack[vaultIdx].childVaults.unshift(newVault!);
      break;

    case MIND_UPDATE_TYPES.DeleteVault:
      state.vaultStack[vaultIdx].childVaults = state.vaultStack[vaultIdx].childVaults.filter(
        (vault) => vault.vaultId !== deletedVaultId
      );
      break;

    case MIND_UPDATE_TYPES.EditVaults:
      vaultEditRequests!.forEach((editRequest) => {
        const idx = state.vaultStack[vaultIdx].childVaults.findIndex((vault) => vault.vaultId === editRequest.vaultId);
        state.vaultStack[vaultIdx].childVaults[idx].imageUrl = editRequest.newImage as string;
        state.vaultStack[vaultIdx].childVaults[idx].name = editRequest.newName;
      });
      break;

    case MIND_UPDATE_TYPES.ReorderVaults:
      state.vaultStack[vaultIdx].childVaults = arrayMove(state.vaultStack[vaultIdx].childVaults, oldIndex!, newIndex!);
      break;
  }

  for (let i = vaultIdx - 1; i >= 0; i--) {
    const vaultId = state.vaultStack[i + 1].vaultId;
    const childVaultIdx = state.vaultStack[i].childVaults.findIndex((vault) => vault.vaultId === vaultId);
    state.vaultStack[i].childVaults[childVaultIdx] = state.vaultStack[i + 1];
  }
};
