import { createReducer } from '@reduxjs/toolkit';

import {
  ADD_THOUGHT_FAILED,
  ADD_THOUGHT_STARTED,
  ADD_THOUGHT_SUCCEEDED,
  CLEAR_ADD_THOUGHT_MESSAGES,
  CLEAR_DELETE_THOUGHT_MESSAGES,
  CLEAR_EDIT_THOUGHTS_MESSAGES,
  DELETE_THOUGHT_FAILED,
  DELETE_THOUGHT_STARTED,
  DELETE_THOUGHT_SUCCEEDED,
  EDIT_THOUGHTS_FAILED,
  EDIT_THOUGHTS_STARTED,
  EDIT_THOUGHTS_SUCCEEDED,
} from '../actions/thoughtActions';

const initialState = {
  addingThoughtErrorMessage: '',
  addingThoughtSuccessMessage: '',
  deletingThoughtErrorMessage: '',
  deletingThoughtSuccessMessage: '',
  editingThoughtsErrorMessage: '',
  editingThoughtsSuccessMessage: '',
  isAddingThought: false,
  isDeletingThought: false,
  isEditingThoughts: false,
} as {
  addingThoughtErrorMessage: string;
  addingThoughtSuccessMessage: string;
  deletingThoughtErrorMessage: string;
  deletingThoughtSuccessMessage: string;
  editingThoughtsErrorMessage: string;
  editingThoughtsSuccessMessage: string;
  isAddingThought: boolean;
  isDeletingThought: boolean;
  isEditingThoughts: boolean;
};

export const thoughtReducer = createReducer(initialState, builder => {
  builder
    .addCase(ADD_THOUGHT_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.addingThoughtErrorMessage = errorMessage;
      state.isAddingThought = false;
    })

    .addCase(ADD_THOUGHT_STARTED, state => {
      state.addingThoughtErrorMessage = '';
      state.addingThoughtSuccessMessage = '';
      state.isAddingThought = true;
    })

    .addCase(ADD_THOUGHT_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.addingThoughtErrorMessage = '';
      state.addingThoughtSuccessMessage = successMessage;
      state.isAddingThought = false;
    })

    .addCase(CLEAR_ADD_THOUGHT_MESSAGES, state => {
      state.addingThoughtErrorMessage = '';
      state.addingThoughtSuccessMessage = '';
    })

    .addCase(CLEAR_DELETE_THOUGHT_MESSAGES, state => {
      state.deletingThoughtErrorMessage = '';
      state.deletingThoughtSuccessMessage = '';
    })

    .addCase(CLEAR_EDIT_THOUGHTS_MESSAGES, state => {
      state.editingThoughtsErrorMessage = '';
      state.editingThoughtsSuccessMessage = '';
    })

    .addCase(DELETE_THOUGHT_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.deletingThoughtErrorMessage = errorMessage;
      state.isDeletingThought = false;
    })

    .addCase(DELETE_THOUGHT_STARTED, state => {
      state.deletingThoughtErrorMessage = '';
      state.deletingThoughtSuccessMessage = '';
      state.isDeletingThought = true;
    })

    .addCase(DELETE_THOUGHT_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.deletingThoughtErrorMessage = '';
      state.deletingThoughtSuccessMessage = successMessage;
      state.isDeletingThought = false;
    })

    .addCase(EDIT_THOUGHTS_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.editingThoughtsErrorMessage = errorMessage;
      state.isEditingThoughts = false;
    })

    .addCase(EDIT_THOUGHTS_STARTED, state => {
      state.editingThoughtsErrorMessage = '';
      state.isEditingThoughts = true;
    })

    .addCase(EDIT_THOUGHTS_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.editingThoughtsErrorMessage = '';
      state.editingThoughtsSuccessMessage = successMessage;
      state.isEditingThoughts = false;
    });
});
