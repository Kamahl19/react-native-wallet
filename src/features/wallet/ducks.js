import { combineReducers } from 'redux';
import { call, put, fork, takeLatest, select, delay } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import AlertService from '../../common/services/alert';
import {
  createActionCreator,
  createApiActionCreators,
  createReducer,
  createActionType,
  replaceInArray,
  removeFromArray,
  REQUEST,
  SUCCESS,
} from '../../common/utils/reduxHelpers';
import { startApiCall, finishApiCall } from '../spinner/ducks';
import * as btcService from '../../btcService';
import { FETCH_BALANCE_INTERVAL_MS, apiCallIds } from './constants';

/**
 * ACTION TYPES
 */
export const SELECT_ACTIVE_WALLET = 'wallet/SELECT_ACTIVE_WALLET';
export const DELETE_WALLET = 'wallet/DELETE_WALLET';
export const CREATE_WALLET = 'wallet/CREATE_WALLET';
export const GENERATE_ADDRESS = 'wallet/GENERATE_ADDRESS';
export const SEND_TRANSACTION = 'wallet/SEND_TRANSACTION';
export const GET_ADDRESSES = 'wallet/GET_ADDRESSES';
export const GET_TX_HISTORY = 'wallet/GET_TX_HISTORY';
export const EXPORT_WALLET = 'wallet/EXPORT_WALLET';
export const IMPORT_WALLET = 'wallet/IMPORT_WALLET';
export const GET_BALANCE_SUCCESS = 'wallet/GET_BALANCE_SUCCESS';

/**
 * ACTIONS
 */
export const selectActiveWalletAction = createActionCreator(SELECT_ACTIVE_WALLET);
export const deleteWalletAction = createActionCreator(DELETE_WALLET);
export const createWalletActions = createApiActionCreators(CREATE_WALLET);
export const generateAddressActions = createApiActionCreators(GENERATE_ADDRESS);
export const sendTransactionActions = createApiActionCreators(SEND_TRANSACTION);
export const getAddressesActions = createApiActionCreators(GET_ADDRESSES);
export const getTxHistoryActions = createApiActionCreators(GET_TX_HISTORY);
export const exportWalletActions = createApiActionCreators(EXPORT_WALLET);
export const importWalletActions = createApiActionCreators(IMPORT_WALLET);
export const getBalanceSuccessAction = createActionCreator(GET_BALANCE_SUCCESS);

/**
 * REDUCERS
 */
const initialState = {
  activeWalletId: null,
  wallets: [],
  walletsExtraData: [],
};

const activeWalletId = createReducer(initialState.activeWalletId, {
  [SELECT_ACTIVE_WALLET]: (state, walletId) => walletId,
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => {
      if (!state) {
        return wallet.walletId;
      }

      return state;
    },
  },
  [DELETE_WALLET]: (state, walletId) => {
    if (state === walletId) {
      return null;
    }

    return state;
  },
});

const wallets = createReducer(initialState.wallets, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
  [IMPORT_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
  [DELETE_WALLET]: (state, walletId) => removeFromArray(state, w => w.walletId === walletId),
});

const walletsExtraData = createReducer(initialState.walletsExtraData, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => [
      ...state,
      {
        walletId: wallet.walletId,
        addresses: [],
        txs: [],
      },
    ],
  },
  [IMPORT_WALLET]: {
    [SUCCESS]: (state, wallet) => [
      ...state,
      {
        walletId: wallet.walletId,
        addresses: [],
        txs: [],
      },
    ],
  },
  [DELETE_WALLET]: (state, walletId) => removeFromArray(state, w => w.walletId === walletId),
  [GENERATE_ADDRESS]: {
    [SUCCESS]: (state, { address, walletId }) => {
      const walletExtraData = state.find(w => w.walletId === walletId);

      return replaceInArray(state, w => w.walletId === walletId, {
        ...walletExtraData,
        address,
      });
    },
  },
  [GET_ADDRESSES]: {
    [SUCCESS]: (state, { addresses, walletId }) => {
      const walletExtraData = state.find(w => w.walletId === walletId);

      return replaceInArray(state, w => w.walletId === walletId, {
        ...walletExtraData,
        addresses,
      });
    },
  },
  [GET_TX_HISTORY]: {
    [SUCCESS]: (state, { txs, walletId }) => {
      const walletExtraData = state.find(w => w.walletId === walletId);

      return replaceInArray(state, w => w.walletId === walletId, {
        ...walletExtraData,
        txs,
      });
    },
  },
  [EXPORT_WALLET]: {
    [SUCCESS]: (state, { exported, walletId }) => {
      const walletExtraData = state.find(w => w.walletId === walletId);

      return replaceInArray(state, w => w.walletId === walletId, {
        ...walletExtraData,
        exported,
      });
    },
  },
  [GET_BALANCE_SUCCESS]: (state, { balance, walletId }) => {
    const walletExtraData = state.find(w => w.walletId === walletId);

    return replaceInArray(state, w => w.walletId === walletId, {
      ...walletExtraData,
      balance,
    });
  },
});

export default combineReducers({
  activeWalletId,
  wallets,
  walletsExtraData,
});

/**
 * SELECTORS
 */
export const selectWallet = state => state.wallet;

export const selectActiveWalletId = state => selectWallet(state).activeWalletId;
export const selectWallets = state => selectWallet(state).wallets;
export const selectWalletsExtraData = state => selectWallet(state).walletsExtraData;

export const selectActiveWallet = createSelector(
  selectActiveWalletId,
  selectWallets,
  (activeWalletId, wallets) =>
    activeWalletId ? wallets.find(w => w.walletId === activeWalletId) : null
);

export const selectActiveWalletExtraData = createSelector(
  selectActiveWalletId,
  selectWalletsExtraData,
  (activeWalletId, walletsExtraData) =>
    activeWalletId ? walletsExtraData.find(w => w.walletId === activeWalletId) : null
);

/**
 * SAGAS
 */
function* createWallet({ payload }) {
  yield put(startApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));

  try {
    const wallet = yield call(btcService.createWallet, payload.walletName, payload.network);

    yield put(createWalletActions.success(wallet));

    yield finishBitcoreCall(apiCallIds.CREATE_WALLET, {
      msg: 'Wallet was created successfully. You can select it now.',
    });
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.CREATE_WALLET, { error });
  }
}

function* generateAddress() {
  yield put(startApiCall({ apiCallId: apiCallIds.GENERATE_ADDRESS }));

  const activeWallet = yield select(selectActiveWallet);

  try {
    const address = yield call(btcService.generateAddress, activeWallet);

    yield put(
      generateAddressActions.success({
        walletId: activeWallet.walletId,
        address,
      })
    );

    yield finishBitcoreCall(apiCallIds.GENERATE_ADDRESS);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GENERATE_ADDRESS, { error });
  }
}

function* sendTransaction({ payload }) {
  yield put(startApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));

  const activeWallet = yield select(selectActiveWallet);

  try {
    yield call(
      btcService.sendTransaction,
      activeWallet,
      payload.address,
      payload.amount,
      payload.feeLevel
    );

    yield put(sendTransactionActions.success());

    yield finishBitcoreCall(apiCallIds.SEND_TRANSACTION, {
      msg: 'Transaction was sent successfully. You can see it in Transactions screen.',
    });
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.SEND_TRANSACTION, { error });
  }
}

function* getAddresses() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_ADDRESSES }));

  const activeWallet = yield select(selectActiveWallet);

  try {
    const addresses = yield call(btcService.getAddresses, activeWallet);

    yield put(
      getAddressesActions.success({
        walletId: activeWallet.walletId,
        addresses,
      })
    );

    yield finishBitcoreCall(apiCallIds.GET_ADDRESSES);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GET_ADDRESSES, { error });
  }
}

function* getTxHistory() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));

  const activeWallet = yield select(selectActiveWallet);

  try {
    const txs = yield call(btcService.getTxHistory, activeWallet);

    yield put(
      getTxHistoryActions.success({
        walletId: activeWallet.walletId,
        txs,
      })
    );

    yield finishBitcoreCall(apiCallIds.GET_TX_HISTORY);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GET_TX_HISTORY, { error });
  }
}

function* exportWallet() {
  yield put(startApiCall({ apiCallId: apiCallIds.EXPORT_WALLET }));

  const activeWallet = yield select(selectActiveWallet);

  try {
    const exported = yield call(btcService.exportWallet, activeWallet);

    yield put(
      exportWalletActions.success({
        walletId: activeWallet.walletId,
        exported,
      })
    );

    yield finishBitcoreCall(apiCallIds.EXPORT_WALLET);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.EXPORT_WALLET, { error });
  }
}

function* importWallet({ payload }) {
  yield put(startApiCall({ apiCallId: apiCallIds.IMPORT_WALLET }));

  try {
    let wallet;

    if (payload.mnemonic) {
      wallet = yield call(
        btcService.importWalletFromMnemonic,
        payload.mnemonic,
        payload.network,
        payload.from3rdParty
      );
    } else {
      wallet = yield call(btcService.importWalletFromData, payload.walletData);
    }

    const existingWallets = yield select(selectWallets);
    const alreadyExists = !!existingWallets.filter(w => w.walletId === wallet.walletId).length;

    if (alreadyExists) {
      throw new Error('This wallet already exists in the device');
    } else {
      yield put(importWalletActions.success(wallet));

      yield finishBitcoreCall(apiCallIds.IMPORT_WALLET, {
        msg: 'Wallet was imported successfully. You can select it now.',
      });
    }
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.IMPORT_WALLET, { error });
  }
}

function* getBalance() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_BALANCE }));

  const activeWallet = yield select(selectActiveWallet);

  if (!activeWallet) {
    return;
  }

  try {
    const balance = yield call(btcService.getBalance, activeWallet);

    yield put(
      getBalanceSuccessAction({
        walletId: activeWallet.walletId,
        balance,
      })
    );

    yield finishBitcoreCall(apiCallIds.GET_BALANCE);
  } catch (error) {
    yield finishBitcoreCall(apiCallIds.GET_BALANCE, { error });
  }
}

function* updateBalanceContinuously() {
  while (true) {
    yield call(getBalance);

    yield delay(FETCH_BALANCE_INTERVAL_MS);
  }
}

function* finishBitcoreCall(apiCallId, { error, msg } = {}) {
  yield put(
    finishApiCall({
      apiCallId,
      error: error ? error.message : undefined,
    })
  );

  if (error) {
    AlertService.error(error.message);
  } else if (msg) {
    AlertService.success(msg);
  }
}

export function* walletSaga() {
  yield takeLatest(createActionType(CREATE_WALLET, REQUEST), createWallet);
  yield takeLatest(createActionType(GENERATE_ADDRESS, REQUEST), generateAddress);
  yield takeLatest(createActionType(SEND_TRANSACTION, REQUEST), sendTransaction);
  yield takeLatest(createActionType(GET_ADDRESSES, REQUEST), getAddresses);
  yield takeLatest(createActionType(GET_TX_HISTORY, REQUEST), getTxHistory);
  yield takeLatest(createActionType(EXPORT_WALLET, REQUEST), exportWallet);
  yield takeLatest(createActionType(IMPORT_WALLET, REQUEST), importWallet);

  yield takeLatest(SELECT_ACTIVE_WALLET, getBalance);
  yield takeLatest(createActionType(CREATE_WALLET, SUCCESS), getBalance);
  yield takeLatest(createActionType(IMPORT_WALLET, SUCCESS), getBalance);
  yield takeLatest(createActionType(SEND_TRANSACTION, SUCCESS), getBalance);

  yield fork(updateBalanceContinuously);
}
