import { combineReducers } from 'redux';
import { call, put, fork, takeLatest, select, delay } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { FETCH_BALANCE_INTERVAL_MS } from '../../common/constants';
import AlertService from '../../common/services/alert';
import { startApiCall, finishApiCall } from '../../common/services/spinner';
import {
  createActionCreator,
  createApiActionCreators,
  createReducer,
  createActionType,
  removeFromArray,
  REQUEST,
  SUCCESS,
} from '../../common/utils/reduxHelpers';
import * as btcService from '../../btcService';

import { apiCallIds } from './constants';

/**
 * ACTION TYPES
 */
export const SELECT_ACTIVE_WALLET = 'btcWallet/SELECT_ACTIVE_WALLET';
export const DELETE_WALLET = 'btcWallet/DELETE_WALLET';
export const CREATE_WALLET = 'btcWallet/CREATE_WALLET';
export const GENERATE_ADDRESS = 'btcWallet/GENERATE_ADDRESS';
export const SEND_TRANSACTION = 'btcWallet/SEND_TRANSACTION';
export const GET_ADDRESSES = 'btcWallet/GET_ADDRESSES';
export const GET_TX_HISTORY = 'btcWallet/GET_TX_HISTORY';
export const EXPORT_WALLET = 'btcWallet/EXPORT_WALLET';
export const IMPORT_WALLET = 'btcWallet/IMPORT_WALLET';
export const GET_BALANCE_SUCCESS = 'btcWallet/GET_BALANCE_SUCCESS';

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
  walletsExtraData: {},
};

const activeWalletId = createReducer(initialState.activeWalletId, {
  [SELECT_ACTIVE_WALLET]: (_, walletId) => walletId,
  [CREATE_WALLET]: {
    [SUCCESS]: (activeWalletId, wallet) => (!activeWalletId ? wallet.walletId : activeWalletId),
  },
  [DELETE_WALLET]: (activeWalletId, walletId) =>
    activeWalletId === walletId ? initialState.activeWalletId : walletId,
});

const wallets = createReducer(initialState.wallets, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
  [IMPORT_WALLET]: {
    [SUCCESS]: (state, wallet) => [...state, wallet],
  },
  [DELETE_WALLET]: (state, walletId) => removeFromArray(state, (w) => w.walletId === walletId),
});

const walletsExtraData = createReducer(initialState.walletsExtraData, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, wallet) => ({
      ...state,
      [wallet.walletId]: {
        txs: [],
        addresses: [],
        balance: {},
      },
    }),
  },
  [IMPORT_WALLET]: {
    [SUCCESS]: (state, wallet) => ({
      ...state,
      [wallet.walletId]: {
        txs: [],
        addresses: [],
        balance: {},
      },
    }),
  },
  [DELETE_WALLET]: (state, walletId) => ({
    ...state,
    [walletId]: undefined,
  }),
  [GENERATE_ADDRESS]: {
    [SUCCESS]: (state, { address, walletId }) => ({
      ...state,
      [walletId]: {
        ...state[walletId],
        address,
      },
    }),
  },
  [GET_ADDRESSES]: {
    [SUCCESS]: (state, { addresses, walletId }) => ({
      ...state,
      [walletId]: {
        ...state[walletId],
        addresses,
      },
    }),
  },
  [GET_TX_HISTORY]: {
    [SUCCESS]: (state, { txs, walletId }) => ({
      ...state,
      [walletId]: {
        ...state[walletId],
        txs,
      },
    }),
  },
  [EXPORT_WALLET]: {
    [SUCCESS]: (state, { exported, walletId }) => ({
      ...state,
      [walletId]: {
        ...state[walletId],
        exported,
      },
    }),
  },
  [GET_BALANCE_SUCCESS]: (state, { balance, walletId }) => ({
    ...state,
    [walletId]: {
      ...state[walletId],
      balance,
    },
  }),
});

export default combineReducers({
  activeWalletId,
  wallets,
  walletsExtraData,
});

/**
 * SELECTORS
 */
export const selectBtcWallet = (state) => state.btcWallet;

export const selectActiveWalletId = (state) => selectBtcWallet(state).activeWalletId;
export const selectWallets = (state) => selectBtcWallet(state).wallets;
export const selectWalletsExtraData = (state) => selectBtcWallet(state).walletsExtraData;

export const selectActiveWallet = createSelector(
  selectActiveWalletId,
  selectWallets,
  (activeWalletId, wallets) => activeWalletId && wallets.find((w) => w.walletId === activeWalletId)
);

export const selectActiveWalletExtraData = createSelector(
  selectActiveWalletId,
  selectWalletsExtraData,
  (activeWalletId, walletsExtraData) => activeWalletId && walletsExtraData[activeWalletId]
);

/**
 * SAGAS
 */
function* createWallet({ payload: { walletName, network } }) {
  yield put(startApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));

  try {
    const wallet = yield call(btcService.createWallet, walletName, network);

    yield put(createWalletActions.success(wallet));

    AlertService.success('Wallet was created successfully. You can select it now.');
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));
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
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.GENERATE_ADDRESS }));
}

function* sendTransaction({ payload: { address, amount, feeLevel } }) {
  yield put(startApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));

  const activeWallet = yield select(selectActiveWallet);

  try {
    yield call(btcService.sendTransaction, activeWallet, address, amount, feeLevel);

    yield put(sendTransactionActions.success());

    AlertService.success('Transaction was sent successfully.');
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));
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
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.GET_ADDRESSES }));
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
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));
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
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.EXPORT_WALLET }));
}

function* importWallet({ payload: { mnemonic, network, from3rdParty, walletData } }) {
  yield put(startApiCall({ apiCallId: apiCallIds.IMPORT_WALLET }));

  try {
    let wallet;

    if (mnemonic) {
      wallet = yield call(btcService.importWalletFromMnemonic, mnemonic, network, from3rdParty);
    } else {
      wallet = yield call(btcService.importWalletFromData, walletData);
    }

    const existingWallets = yield select(selectWallets);
    const alreadyExists = !!existingWallets.filter((w) => w.walletId === wallet.walletId).length;

    if (alreadyExists) {
      throw new Error('This wallet already exists in the device');
    } else {
      yield put(importWalletActions.success(wallet));

      AlertService.success('Wallet was imported successfully. You can select it now.');
    }
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.IMPORT_WALLET }));
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
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.GET_BALANCE }));
}

function* updateBalanceContinuously() {
  while (true) {
    yield call(getBalance);

    yield delay(FETCH_BALANCE_INTERVAL_MS);
  }
}

export function* btcWalletSaga() {
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
