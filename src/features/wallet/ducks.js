import { combineReducers } from 'redux';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  createActionCreator,
  createApiActionCreators,
  createReducer,
  createActionType,
  replaceInArray,
  REQUEST,
  SUCCESS,
} from '../../common/utils/reduxHelpers';
import api from './api';

/**
 * ACTION TYPES
 */
export const FETCH_WALLETS = 'wallet/FETCH_WALLETS';
export const CREATE_WALLET = 'wallet/CREATE_WALLET';
export const SEND_TRANSACTION = 'wallet/SEND_TRANSACTION';
export const GENERATE_ADDRESS = 'wallet/GENERATE_ADDRESS';
export const LOAD_WALLET = 'wallet/LOAD_WALLET';

/**
 * ACTIONS
 */
export const fetchWalletsActions = createApiActionCreators(FETCH_WALLETS);
export const createWalletActions = createApiActionCreators(CREATE_WALLET);
export const sendTransactionActions = createApiActionCreators(SEND_TRANSACTION);
export const generateAddressActions = createApiActionCreators(GENERATE_ADDRESS);
export const loadWalletAction = createActionCreator(LOAD_WALLET);

/**
 * REDUCERS
 */
const initialState = {
  wallets: [],
  activeWalletId: null,
};

const wallets = createReducer(initialState.wallets, {
  [FETCH_WALLETS]: {
    [SUCCESS]: (state, payload) => payload.wallets,
  },
  [CREATE_WALLET]: {
    [SUCCESS]: (state, payload) => [...state, payload.wallet],
  },
  [GENERATE_ADDRESS]: {
    [SUCCESS]: (state, payload) => {
      const wallet = state.find(wallet => wallet.id === payload.id);

      return replaceInArray(state, wallet => wallet.id === payload.id, {
        ...wallet,
        address: payload.address,
      });
    },
  },
});

const activeWalletId = createReducer(initialState.activeWalletId, {
  [LOAD_WALLET]: (state, payload) => payload,
});

export default combineReducers({
  wallets,
  activeWalletId,
});

/**
 * SELECTORS
 */
export const selectWallet = state => state.wallet;

export const selectWallets = state => selectWallet(state).wallets;
export const selectActiveWalletId = state => selectWallet(state).activeWalletId;

export const selectActiveWallet = createSelector(
  selectActiveWalletId,
  selectWallets,
  (activeWalletId, wallets) =>
    activeWalletId ? wallets.find(wallet => wallet.id === activeWalletId) : null
);

/**
 * SAGAS
 */
function* fetchWallets({ payload }) {
  const resp = yield call(api.fetchWallets);

  if (resp.ok) {
    yield put(fetchWalletsActions.success(resp.data));
  }
}

function* createWallet({ payload }) {
  const resp = yield call(api.createWallet, payload);

  if (resp.ok) {
    yield put(createWalletActions.success(resp.data));
  }
}

function* sendTransaction({ payload }) {
  const resp = yield call(api.sendTransaction, payload.id, payload.transactionData);

  if (resp.ok) {
    yield put(sendTransactionActions.success(resp.data));
  }
}

function* generateAddress({ payload }) {
  const resp = yield call(api.generateAddress, payload.id, payload.password);

  const activeWalletId = yield select(selectActiveWalletId);

  if (resp.ok) {
    yield put(
      generateAddressActions.success({
        id: activeWalletId,
        address: resp.data.address,
      })
    );
  }
}

export function* walletSaga() {
  yield takeLatest(createActionType(FETCH_WALLETS, REQUEST), fetchWallets);
  yield takeLatest(createActionType(CREATE_WALLET, REQUEST), createWallet);
  yield takeLatest(createActionType(SEND_TRANSACTION, REQUEST), sendTransaction);
  yield takeLatest(createActionType(GENERATE_ADDRESS, REQUEST), generateAddress);
}
