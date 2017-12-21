import { combineReducers } from 'redux';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import AlertService from '../../common/services/alert';
import {
  createActionCreator,
  createApiActionCreators,
  createReducer,
  createActionType,
  replaceInArray,
  REQUEST,
  SUCCESS,
} from '../../common/utils/reduxHelpers';
import { finishApiCall, startApiCall } from '../spinner/ducks';
import * as bitcoreUtils from './bitcoreUtils';
import { apiCallIds } from './constants';

/**
 * ACTION TYPES
 */
export const LOAD_WALLET = 'wallet/LOAD_WALLET';
export const CREATE_WALLET = 'wallet/CREATE_WALLET';
export const GENERATE_ADDRESS = 'wallet/GENERATE_ADDRESS';
export const SEND_TRANSACTION = 'wallet/SEND_TRANSACTION';

/**
 * ACTIONS
 */
export const loadWalletAction = createActionCreator(LOAD_WALLET);
export const createWalletActions = createApiActionCreators(CREATE_WALLET);
export const generateAddressActions = createApiActionCreators(GENERATE_ADDRESS);
export const sendTransactionAction = createActionCreator(SEND_TRANSACTION);

/**
 * REDUCERS
 */
const initialState = {
  activeWalletId: null,
  wallets: [],
};

const activeWalletId = createReducer(initialState.activeWalletId, {
  [LOAD_WALLET]: (state, walletId) => walletId,
});

const wallets = createReducer(initialState.wallets, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
  [GENERATE_ADDRESS]: {
    [SUCCESS]: (state, { address, walletId }) => {
      const wallet = state.find(wallet => wallet.walletId === walletId);

      return replaceInArray(state, wallet => wallet.walletId === walletId, {
        ...wallet,
        address,
      });
    },
  },
});

export default combineReducers({
  activeWalletId,
  wallets,
});

/**
 * SELECTORS
 */
export const selectWallet = state => state.wallet;

export const selectActiveWalletId = state => selectWallet(state).activeWalletId;
export const selectWallets = state => selectWallet(state).wallets;

export const selectActiveWallet = createSelector(
  selectActiveWalletId,
  selectWallets,
  (activeWalletId, wallets) =>
    activeWalletId ? wallets.find(wallet => wallet.walletId === activeWalletId) : null
);

/**
 * SAGAS
 */
function* createWallet({ payload }) {
  yield put(
    startApiCall({
      apiCallId: apiCallIds.CREATE_WALLET,
    })
  );

  try {
    const wallet = yield call(
      bitcoreUtils.createWallet,
      payload.walletName,
      payload.coin,
      payload.network
    );

    yield put(createWalletActions.success(wallet));

    yield put(
      finishApiCall({
        apiCallId: apiCallIds.CREATE_WALLET,
      })
    );
  } catch (error) {
    yield put(
      finishApiCall({
        apiCallId: apiCallIds.CREATE_WALLET,
        error: error.message,
      })
    );

    AlertService.error(error.message);
  }
}

function* generateAddress() {
  yield put(
    startApiCall({
      apiCallId: apiCallIds.GENERATE_ADDRESS,
    })
  );

  try {
    const activeWallet = yield select(selectActiveWallet);

    const address = yield call(bitcoreUtils.generateAddress, activeWallet);

    yield put(
      generateAddressActions.success({
        walletId: activeWallet.walletId,
        address,
      })
    );

    yield put(
      finishApiCall({
        apiCallId: apiCallIds.GENERATE_ADDRESS,
      })
    );
  } catch (error) {
    yield put(
      finishApiCall({
        apiCallId: apiCallIds.GENERATE_ADDRESS,
        error: error.message,
      })
    );

    AlertService.error(error.message);
  }
}

function* sendTransaction({ payload }) {
  yield put(
    startApiCall({
      apiCallId: apiCallIds.SEND_TRANSACTION,
    })
  );

  try {
    const activeWallet = yield select(selectActiveWallet);

    yield call(
      bitcoreUtils.sendTransaction,
      activeWallet,
      payload.address,
      payload.amount,
      payload.feePerKb,
      payload.note
    );

    yield put(
      finishApiCall({
        apiCallId: apiCallIds.SEND_TRANSACTION,
      })
    );
  } catch (error) {
    yield put(
      finishApiCall({
        apiCallId: apiCallIds.SEND_TRANSACTION,
        error: error.message,
      })
    );

    AlertService.error(error.message);
  }
}

export function* walletSaga() {
  yield takeLatest(createActionType(CREATE_WALLET, REQUEST), createWallet);
  yield takeLatest(createActionType(GENERATE_ADDRESS, REQUEST), generateAddress);
  yield takeLatest(SEND_TRANSACTION, sendTransaction);
}
