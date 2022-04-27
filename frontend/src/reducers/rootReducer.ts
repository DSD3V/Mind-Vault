import { combineReducers } from 'redux';

import { mindReducer } from './mindReducer';
import { thoughtReducer } from './thoughtReducer';
import { userReducer } from './userReducer';
import { vaultReducer } from './vaultReducer';

export const rootReducer = combineReducers({
  mind: mindReducer,
  thought: thoughtReducer,
  user: userReducer,
  vault: vaultReducer,
});
