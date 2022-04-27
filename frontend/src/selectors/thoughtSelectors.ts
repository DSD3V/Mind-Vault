import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

const selectThoughtState = (state: RootState) => state.thought;

export const selectAddingThoughtErrorMessage = createSelector(
  [selectThoughtState],
  state => state.addingThoughtErrorMessage
);

export const selectAddingThoughtSuccessMessage = createSelector(
  [selectThoughtState],
  state => state.addingThoughtSuccessMessage
);

export const selectDeletingThoughtErrorMessage = createSelector(
  [selectThoughtState],
  state => state.deletingThoughtErrorMessage
);

export const selectDeletingThoughtSuccessMessage = createSelector(
  [selectThoughtState],
  state => state.deletingThoughtSuccessMessage
);

export const selectIsAddingThought = createSelector(
  [selectThoughtState],
  state => state.isAddingThought
);

export const selectIsDeletingThought = createSelector(
  [selectThoughtState],
  state => state.isDeletingThought
);

export const selectEditingThoughtsErrorMessage = createSelector(
  [selectThoughtState],
  state => state.editingThoughtsErrorMessage
);

export const selectEditingThoughtsSuccessMessage = createSelector(
  [selectThoughtState],
  state => state.editingThoughtsSuccessMessage
);

export const selectIsEditingThoughts = createSelector(
  [selectThoughtState],
  state => state.isEditingThoughts
);
