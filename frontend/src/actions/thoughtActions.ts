import { createAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { SetStateAction } from 'react';

import { ThoughtI } from '../interfaces';

export const ADD_THOUGHT_FAILED = createAction(
  'ADD_THOUGHT_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const ADD_THOUGHT_STARTED = createAction('ADD_THOUGHT_STARTED');
export const ADD_THOUGHT_SUCCEEDED = createAction(
  'ADD_THOUGHT_SUCCEEDED',
  ({
    newThought,
    successMessage,
  }: {
    newThought: ThoughtI;
    successMessage: string;
  }) => ({
    payload: { newThought, successMessage },
  })
);

export const CLEAR_ADD_THOUGHT_MESSAGES = createAction(
  'CLEAR_ADD_THOUGHT_MESSAGES'
);
export const CLEAR_DELETE_THOUGHT_MESSAGES = createAction(
  'CLEAR_DELETE_THOUGHT_MESSAGES'
);
export const CLEAR_EDIT_THOUGHTS_MESSAGES = createAction(
  'CLEAR_EDIT_THOUGHTS_MESSAGES'
);

export const DELETE_THOUGHT_FAILED = createAction(
  'DELETE_THOUGHT_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const DELETE_THOUGHT_STARTED = createAction('DELETE_THOUGHT_STARTED');
export const DELETE_THOUGHT_SUCCEEDED = createAction(
  'DELETE_THOUGHT_SUCCEEDED',
  ({
    deletedThoughtId,
    successMessage,
  }: {
    deletedThoughtId: string;
    successMessage: string;
  }) => ({
    payload: { deletedThoughtId, successMessage },
  })
);

export const EDIT_THOUGHTS_FAILED = createAction(
  'EDIT_THOUGHTS_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const EDIT_THOUGHTS_STARTED = createAction('EDIT_THOUGHTS_STARTED');
export const EDIT_THOUGHTS_SUCCEEDED = createAction(
  'EDIT_THOUGHTS_SUCCEEDED',
  ({
    successMessage,
    thoughts,
  }: {
    successMessage: string;
    thoughts: ThoughtI[];
  }) => ({
    payload: { successMessage, thoughts },
  })
);

const addThoughtFailedMessage = 'Failed to add new thought.';
const addThoughtSucceededMessage = 'Thought added.';

const deleteThoughtFailedMessage =
  'Failed to delete thought: an error occurred.';
const deleteThoughtSucceededMessage = 'Thought deleted.';

const editThoughtsFailedMessage =
  'Failed to save thought changes: an error occurred.';
const editThoughtsSucceededMessage = 'Thought changes saved.';

export const addThought =
  ({
    newThoughtHTML,
    orderIndex,
    setThoughtIdToNewHTML,
    setThoughts,
    thoughtIdToNewHTML,
    userId,
    vaultId,
  }: {
    newThoughtHTML: string;
    orderIndex: number;
    setThoughtIdToNewHTML: React.Dispatch<
      SetStateAction<{ [key: string]: string }>
    >;
    setThoughts: React.Dispatch<SetStateAction<ThoughtI[]>>;
    thoughtIdToNewHTML: { [key: string]: string };
    userId: string;
    vaultId: string;
  }) =>
  async (dispatch: Dispatch) => {
    dispatch(ADD_THOUGHT_STARTED());
    try {
      const {
        data: { newThought },
      } = await axios.post('/thought/addThought', null, {
        params: {
          newThoughtHTML,
          orderIndex,
          userId,
          vaultId,
        },
      });
      setThoughts(prevThoughts => {
        let thoughts = prevThoughts.map(thought => ({
          ...thought,
          html: thoughtIdToNewHTML[thought.thoughtId],
        }));
        thoughts.unshift(newThought);
        return thoughts;
      });
      setThoughtIdToNewHTML(
        (prevThoughtIdToNewHTML: { [key: string]: string }) => ({
          ...prevThoughtIdToNewHTML,
          [newThought.thoughtId]: newThoughtHTML,
        })
      );
      dispatch(
        ADD_THOUGHT_SUCCEEDED({
          newThought,
          successMessage: addThoughtSucceededMessage,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        ADD_THOUGHT_FAILED({
          errorMessage: addThoughtFailedMessage,
        })
      );
    }
  };

export const deleteThought =
  ({
    setThoughts,
    thoughtIdToNewHTML,
    thoughtToDeleteId,
  }: {
    setThoughts: React.Dispatch<SetStateAction<ThoughtI[]>>;
    thoughtIdToNewHTML: { [key: string]: string };
    thoughtToDeleteId: string;
  }) =>
  async (dispatch: Dispatch) => {
    dispatch(DELETE_THOUGHT_STARTED());
    try {
      await axios.delete('/thought/deleteThought', {
        data: { thoughtId: thoughtToDeleteId },
      });
      setThoughts(prevThoughts =>
        prevThoughts
          .filter(thought => thought.thoughtId !== thoughtToDeleteId)
          .map(thought => ({
            ...thought,
            html: thoughtIdToNewHTML[thought.thoughtId],
          }))
      );
      dispatch(
        DELETE_THOUGHT_SUCCEEDED({
          deletedThoughtId: thoughtToDeleteId,
          successMessage: deleteThoughtSucceededMessage,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        DELETE_THOUGHT_FAILED({ errorMessage: deleteThoughtFailedMessage })
      );
    }
  };

export const editThoughts =
  ({ thoughts }: { thoughts: ThoughtI[] }) =>
  async (dispatch: Dispatch) => {
    dispatch(EDIT_THOUGHTS_STARTED());
    try {
      await axios.patch('/thought/editThoughts', {
        thoughts,
      });
      dispatch(
        EDIT_THOUGHTS_SUCCEEDED({
          successMessage: editThoughtsSucceededMessage,
          thoughts,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        EDIT_THOUGHTS_FAILED({
          errorMessage: editThoughtsFailedMessage,
        })
      );
    }
  };
