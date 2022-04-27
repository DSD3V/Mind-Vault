import { createAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';

export const GET_MIND_STARTED = createAction('GET_MIND_STARTED');
export const GET_MIND_SUCCEEDED = createAction(
  'GET_MIND_SUCCEEDED',
  ({ mind }) => ({
    payload: { mind },
  })
);
export const GET_MIND_FAILED = createAction(
  'GET_MIND_FAILED',
  ({ errorMessage }) => ({
    payload: { errorMessage },
  })
);

export const getMind =
  ({ userId }: { userId: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(GET_MIND_STARTED());
    try {
      const {
        data: { mind },
      } = await axios.get('/mind/getMind', { params: { userId } });
      dispatch(GET_MIND_SUCCEEDED({ mind }));
    } catch (error) {
      console.error(error);
      dispatch(
        GET_MIND_FAILED({ errorMessage: 'Failed to get vaults from database.' })
      );
    }
  };
