import { combineReducers } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  createActionCreator,
  createApiActionCreators,
  createReducer,
  createActionType,
  REQUEST,
  SUCCESS,
} from '../../common/utils/reduxHelpers';
import api from './api';

/**
 * ACTION TYPES
 */
export const CREATE_WALLET = 'wallet/CREATE_WALLET';
export const LOAD_WALLET = 'wallet/LOAD_WALLET';

/**
 * ACTIONS
 */
export const createWalletActions = createApiActionCreators(CREATE_WALLET);
export const loadWalletAction = createActionCreator(LOAD_WALLET);

/**
 * REDUCERS
 */
const initialState = {
  encryptedWallets: [],
  activeWallet: null,
};

const encryptedWallets = createReducer(initialState.encryptedWallets, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, payload) => [...state, payload],
  },
});

const activeWallet = createReducer(initialState.activeWallet, {
  [LOAD_WALLET]: (state, payload) => payload,
});

export default combineReducers({
  encryptedWallets,
  activeWallet,
});

/**
 * SELECTORS
 */
export const selectWallet = state => state.wallet;

export const selectEncryptedWallets = state => selectWallet(state).encryptedWallets;
export const selectActiveWallet = state => selectWallet(state).activeWallet;

/**
 * SAGAS
 */
function* createWallet({ payload }) {
  const resp = yield call(api.createWallet, payload);

  if (resp.ok) {
    yield put(
      createWalletActions.success({
        walletName: payload.walletName,
        coin: payload.coin,
        network: payload.network,
        encryptedWallet: resp.data.walletEncrypted,
      })
    );
  }
}

export function* walletSaga() {
  yield takeLatest(createActionType(CREATE_WALLET, REQUEST), createWallet);
}
