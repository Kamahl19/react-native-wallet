import { combineReducers } from 'redux';

import { createActionCreator, createReducer } from '../utils/reduxHelpers';

/**
 * ACTION TYPES
 */
export const START_API_CALL = 'spinner/START_API_CALL';
export const FINISH_API_CALL = 'spinner/FINISH_API_CALL';

/**
 * ACTIONS
 */
export const startApiCall = createActionCreator(START_API_CALL);
export const finishApiCall = createActionCreator(FINISH_API_CALL);

/**
 * REDUCERS
 */
const initialState = {
  apiCalls: {},
};

const apiCalls = createReducer(initialState.apiCalls, {
  [START_API_CALL]: (state, payload) => {
    if (payload.apiCallId) {
      return {
        ...state,
        [payload.apiCallId]: state[payload.apiCallId] ? state[payload.apiCallId] + 1 : 1,
      };
    }

    return state;
  },
  [FINISH_API_CALL]: (state, payload) => {
    if (payload.apiCallId) {
      return {
        ...state,
        [payload.apiCallId]: Math.max(state[payload.apiCallId] - 1, 0),
      };
    }

    return state;
  },
});

export default combineReducers({
  apiCalls,
});

/**
 * SELECTORS
 */
export const selectSpinner = state => state.spinner;
export const selectApiCalls = state => selectSpinner(state).apiCalls;
export const selectApiCallById = (state, apiCallId) => selectApiCalls(state)[apiCallId];
export const selectIsInProgress = (state, apiCallId) => !!selectApiCallById(state, apiCallId);
