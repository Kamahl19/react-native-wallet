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
export const SELECT_ACTIVE_WALLET = 'wallet/SELECT_ACTIVE_WALLET';
export const CREATE_WALLET = 'wallet/CREATE_WALLET';
export const GENERATE_ADDRESS = 'wallet/GENERATE_ADDRESS';
export const SEND_TRANSACTION = 'wallet/SEND_TRANSACTION';
export const GET_BALANCE = 'wallet/GET_BALANCE';
export const GET_ADDRESSES = 'wallet/GET_ADDRESSES';
export const GET_TX_HISTORY = 'wallet/GET_TX_HISTORY';
export const EXPORT_WALLET = 'wallet/EXPORT_WALLET';
export const IMPORT_WALLET = 'wallet/IMPORT_WALLET';

/**
 * ACTIONS
 */
export const selectActiveWalletAction = createActionCreator(SELECT_ACTIVE_WALLET);
export const createWalletActions = createApiActionCreators(CREATE_WALLET);
export const generateAddressActions = createApiActionCreators(GENERATE_ADDRESS);
export const sendTransactionAction = createActionCreator(SEND_TRANSACTION);
export const getBalanceActions = createApiActionCreators(GET_BALANCE);
export const getAddressesActions = createApiActionCreators(GET_ADDRESSES);
export const getTxHistoryActions = createApiActionCreators(GET_TX_HISTORY);
export const exportWalletActions = createApiActionCreators(EXPORT_WALLET);
export const importWalletActions = createApiActionCreators(IMPORT_WALLET);

/**
 * REDUCERS
 */
const initialState = {
  activeWalletId: null,
  wallets: [],
};

const activeWalletId = createReducer(initialState.activeWalletId, {
  [SELECT_ACTIVE_WALLET]: (state, walletId) => walletId,
});

const wallets = createReducer(initialState.wallets, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
  [GENERATE_ADDRESS]: {
    [SUCCESS]: (state, { address, walletId }) => {
      const wallet = findActiveWallet(state, walletId);

      return updateActiveWallet(state, walletId, {
        ...wallet,
        address,
      });
    },
  },
  [GET_BALANCE]: {
    [SUCCESS]: (state, { balance, walletId }) => {
      const wallet = findActiveWallet(state, walletId);

      return updateActiveWallet(state, walletId, {
        ...wallet,
        balance,
      });
    },
  },
  [GET_ADDRESSES]: {
    [SUCCESS]: (state, { addresses, walletId }) => {
      const wallet = findActiveWallet(state, walletId);

      return updateActiveWallet(state, walletId, {
        ...wallet,
        addresses,
      });
    },
  },
  [GET_TX_HISTORY]: {
    [SUCCESS]: (state, { txs, walletId }) => {
      const wallet = findActiveWallet(state, walletId);

      return updateActiveWallet(state, walletId, {
        ...wallet,
        txs,
      });
    },
  },
  [EXPORT_WALLET]: {
    [SUCCESS]: (state, { exported, walletId }) => {
      const wallet = findActiveWallet(state, walletId);

      return updateActiveWallet(state, walletId, {
        ...wallet,
        exported,
      });
    },
  },
  [IMPORT_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
});

function findActiveWallet(state, walletId) {
  return state.find(wallet => wallet.walletId === walletId);
}

function updateActiveWallet(state, walletId, value) {
  return replaceInArray(state, wallet => wallet.walletId === walletId, value);
}

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
  yield put(startApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));

  try {
    const wallet = yield call(
      bitcoreUtils.createWallet,
      payload.walletName,
      payload.coin,
      payload.network
    );

    yield put(createWalletActions.success(wallet));

    yield finishBitcoreCall(apiCallIds.CREATE_WALLET);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.CREATE_WALLET, error);
  }
}

function* generateAddress() {
  yield put(startApiCall({ apiCallId: apiCallIds.GENERATE_ADDRESS }));

  try {
    const activeWallet = yield select(selectActiveWallet);

    const address = yield call(bitcoreUtils.generateAddress, activeWallet);

    yield put(
      generateAddressActions.success({
        walletId: activeWallet.walletId,
        address,
      })
    );

    yield finishBitcoreCall(apiCallIds.GENERATE_ADDRESS);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GENERATE_ADDRESS, error);
  }
}

function* sendTransaction({ payload }) {
  yield put(startApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));

  try {
    const activeWallet = yield select(selectActiveWallet);

    yield call(
      bitcoreUtils.sendTransaction,
      activeWallet,
      payload.address,
      payload.amount,
      payload.feeLevel,
      payload.note
    );

    yield finishBitcoreCall(apiCallIds.SEND_TRANSACTION);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.SEND_TRANSACTION, error);
  }
}

function* getBalance() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_BALANCE }));

  try {
    const activeWallet = yield select(selectActiveWallet);

    const balance = yield call(bitcoreUtils.getBalance, activeWallet);

    yield put(
      getBalanceActions.success({
        walletId: activeWallet.walletId,
        balance,
      })
    );

    yield finishBitcoreCall(apiCallIds.GET_BALANCE);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GET_BALANCE, error);
  }
}

function* getAddresses() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_ADDRESSES }));

  try {
    const activeWallet = yield select(selectActiveWallet);

    const addresses = yield call(bitcoreUtils.getAddresses, activeWallet);

    yield put(
      getAddressesActions.success({
        walletId: activeWallet.walletId,
        addresses,
      })
    );

    yield finishBitcoreCall(apiCallIds.GET_ADDRESSES);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GET_ADDRESSES, error);
  }
}

function* getTxHistory() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));

  try {
    const activeWallet = yield select(selectActiveWallet);

    const txs = yield call(bitcoreUtils.getTxHistory, activeWallet);

    yield put(
      getTxHistoryActions.success({
        walletId: activeWallet.walletId,
        txs,
      })
    );

    yield finishBitcoreCall(apiCallIds.GET_TX_HISTORY);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GET_TX_HISTORY, error);
  }
}

function* exportWallet() {
  yield put(startApiCall({ apiCallId: apiCallIds.EXPORT_WALLET }));

  try {
    const activeWallet = yield select(selectActiveWallet);

    const exported = yield call(bitcoreUtils.exportWallet, activeWallet);

    yield put(
      exportWalletActions.success({
        walletId: activeWallet.walletId,
        exported,
      })
    );

    yield finishBitcoreCall(apiCallIds.EXPORT_WALLET);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.EXPORT_WALLET, error);
  }
}

function* importWallet({ payload }) {
  yield put(startApiCall({ apiCallId: apiCallIds.IMPORT_WALLET }));

  try {
    let wallet;

    if (payload.mnemonic) {
      wallet = yield call(
        bitcoreUtils.importWalletFromMnemonic,
        payload.mnemonic,
        payload.coin,
        payload.network
      );
    } else {
      wallet = yield call(bitcoreUtils.importWallet, payload.importData);
    }

    const existingWallets = yield select(selectWallets);
    const alreadyExists = !!existingWallets.filter(w => w.walletId === wallet.walletId).length;

    if (alreadyExists) {
      yield finishBitcoreCall(apiCallIds.IMPORT_WALLET, {
        message: 'This wallet already exists in the device',
      });
    } else {
      yield put(importWalletActions.success(wallet));

      yield finishBitcoreCall(apiCallIds.IMPORT_WALLET);
    }
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.IMPORT_WALLET, error);
  }
}

function* finishBitcoreCall(apiCallId, error) {
  yield put(
    finishApiCall({
      apiCallId,
      error: error ? error.message : undefined,
    })
  );

  if (error) {
    AlertService.error(error.message);
  }
}

export function* walletSaga() {
  yield takeLatest(createActionType(CREATE_WALLET, REQUEST), createWallet);
  yield takeLatest(createActionType(GENERATE_ADDRESS, REQUEST), generateAddress);
  yield takeLatest(SEND_TRANSACTION, sendTransaction);
  yield takeLatest(createActionType(GET_BALANCE, REQUEST), getBalance);
  yield takeLatest(createActionType(GET_ADDRESSES, REQUEST), getAddresses);
  yield takeLatest(createActionType(GET_TX_HISTORY, REQUEST), getTxHistory);
  yield takeLatest(createActionType(EXPORT_WALLET, REQUEST), exportWallet);
  yield takeLatest(createActionType(IMPORT_WALLET, REQUEST), importWallet);
}
