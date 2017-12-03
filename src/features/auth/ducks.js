import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { call, put, takeLatest } from 'redux-saga/effects';

import AlertService from '../../common/services/alert';
import {
  createActionCreator,
  createApiActionCreators,
  createReducer,
  createActionType,
  REQUEST,
  SUCCESS,
  FAILURE,
} from '../../common/utils/reduxHelpers';
import api from './api';

/**
 * ACTION TYPES
 */
export const SIGN_UP_REQUEST = 'auth/SIGN_UP_REQUEST';
export const LOGIN = 'auth/LOGIN';
export const RELOGIN_REQUEST = 'auth/RELOGIN_REQUEST';
export const LOGOUT = 'auth/LOGOUT';
export const FORGOTTEN_PASSWORD = 'auth/FORGOTTEN_PASSWORD';

/**
 * ACTIONS
 */
export const signUpRequest = createActionCreator(SIGN_UP_REQUEST);
export const loginActions = createApiActionCreators(LOGIN);
export const reloginRequest = createActionCreator(RELOGIN_REQUEST);
export const logout = createActionCreator(LOGOUT);
export const forgottenPasswordRequest = createActionCreator(FORGOTTEN_PASSWORD);

/**
 * REDUCERS
 */
const initialState = {
  user: null,
  token: null,
};

const user = createReducer(initialState.user, {
  [LOGIN]: {
    [SUCCESS]: (state, payload) => payload.user,
    [FAILURE]: state => initialState.user,
  },
  [LOGOUT]: state => initialState.user,
});

const token = createReducer(initialState.token, {
  [LOGIN]: {
    [SUCCESS]: (state, payload) => payload.token,
    [FAILURE]: state => initialState.token,
  },
  [LOGOUT]: state => initialState.token,
});

export default combineReducers({
  user,
  token,
});

/**
 * SELECTORS
 */
export const selectAuth = state => state.auth;

export const selectUser = state => selectAuth(state).user;
export const selectToken = state => selectAuth(state).token;

export const selectUserEmail = createSelector(selectUser, user => user && user.email);
export const selectIsLoggedIn = createSelector(selectUser, user => user !== null);

/**
 * SAGAS
 */
function* signUp({ payload }) {
  const resp = yield call(api.signUp, payload);

  yield call(receiveLogin, resp);
}

function* login({ payload }) {
  const resp = yield call(api.login, payload);

  yield call(receiveLogin, resp);
}

function* relogin() {
  const resp = yield call(api.relogin);

  yield call(receiveLogin, resp);
}

function* receiveLogin(resp) {
  if (resp.ok) {
    yield put(loginActions.success(resp.data));
  } else {
    yield put(loginActions.failure(resp.error));
  }
}

function* forgottenPassword({ payload }) {
  const resp = yield call(api.forgottenPassword, payload.email);

  if (resp.ok) {
    AlertService.success('Link to reset your password has been sent to your e-mail.');
  }
}

export function* authSaga() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
  yield takeLatest(createActionType(LOGIN, REQUEST), login);
  yield takeLatest(RELOGIN_REQUEST, relogin);
  yield takeLatest(FORGOTTEN_PASSWORD, forgottenPassword);
}
