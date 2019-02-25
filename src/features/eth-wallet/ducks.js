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
import * as ethService from '../../ethService';

import { apiCallIds } from './constants';

/**
 * ACTION TYPES
 */
export const SELECT_ACTIVE_WALLET = 'ethWallet/SELECT_ACTIVE_WALLET';
export const CREATE_WALLET = 'ethWallet/CREATE_WALLET';
export const DELETE_WALLET = 'ethWallet/DELETE_WALLET';
export const SEND_TRANSACTION = 'ethWallet/SEND_TRANSACTION';
export const GET_TX_HISTORY = 'ethWallet/GET_TX_HISTORY';
export const GET_BALANCE_SUCCESS = 'ethWallet/GET_BALANCE_SUCCESS';

/**
 * ACTIONS
 */
export const selectActiveWalletAction = createActionCreator(SELECT_ACTIVE_WALLET);
export const createWalletActions = createApiActionCreators(CREATE_WALLET);
export const deleteWalletAction = createActionCreator(DELETE_WALLET);
export const sendTransactionActions = createApiActionCreators(SEND_TRANSACTION);
export const getTxHistoryActions = createApiActionCreators(GET_TX_HISTORY);
export const getBalanceSuccessAction = createActionCreator(GET_BALANCE_SUCCESS);

/**
 * REDUCERS
 */
const initialState = {
  activeWalletPk: null,
  wallets: [],
  walletsExtraData: {},
};

const activeWalletPk = createReducer(initialState.activeWalletPk, {
  [SELECT_ACTIVE_WALLET]: (_, privateKey) => privateKey,
  [CREATE_WALLET]: {
    [SUCCESS]: (activeWalletPk, { wallet }) =>
      !activeWalletPk ? wallet.privateKey : activeWalletPk,
  },
  [DELETE_WALLET]: (activeWalletPk, privateKey) =>
    activeWalletPk === privateKey ? initialState.activeWalletPk : privateKey,
});

const wallets = createReducer(initialState.wallets, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, { wallet: { privateKey, mnemonic, address, provider }, walletName }) => [
      ...state,
      {
        walletName,
        privateKey,
        mnemonic,
        address,
        network: provider.network.name,
      },
    ],
  },
  [DELETE_WALLET]: (state, privateKey) => removeFromArray(state, w => w.privateKey === privateKey),
});

const walletsExtraData = createReducer(initialState.walletsExtraData, {
  [CREATE_WALLET]: {
    [SUCCESS]: (state, { wallet }) => ({
      ...state,
      [wallet.privateKey]: {
        txs: [],
        balance: null,
      },
    }),
  },
  [DELETE_WALLET]: (state, privateKey) => ({
    ...state,
    [privateKey]: undefined,
  }),
  [GET_TX_HISTORY]: {
    [SUCCESS]: (state, { txs, privateKey }) => ({
      ...state,
      [privateKey]: {
        ...state[privateKey],
        txs,
      },
    }),
  },
  [GET_BALANCE_SUCCESS]: (state, { balance, privateKey }) => ({
    ...state,
    [privateKey]: {
      ...state[privateKey],
      balance,
    },
  }),
});

export default combineReducers({
  activeWalletPk,
  wallets,
  walletsExtraData,
});

/**
 * SELECTORS
 */
export const selectEthWallet = state => state.ethWallet;

export const selectActiveWalletPk = state => selectEthWallet(state).activeWalletPk;
export const selectWallets = state => selectEthWallet(state).wallets;
export const selectWalletsExtraData = state => selectEthWallet(state).walletsExtraData;

export const selectActiveWallet = createSelector(
  selectActiveWalletPk,
  selectWallets,
  (activeWalletPk, wallets) => activeWalletPk && wallets.find(w => w.privateKey === activeWalletPk)
);

export const selectActiveWalletInstance = createSelector(
  selectActiveWallet,
  activeWallet =>
    activeWallet &&
    ethService.createWallet(activeWallet.network, { privateKey: activeWallet.privateKey })
);

export const selectActiveWalletExtraData = createSelector(
  selectActiveWalletPk,
  selectWalletsExtraData,
  (activeWalletPk, walletsExtraData) => activeWalletPk && walletsExtraData[activeWalletPk]
);

/**
 * SAGAS
 */
function* createWallet({ payload: { network, walletName, mnemonic } }) {
  yield put(startApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));

  try {
    const wallet = yield call(ethService.createWallet, network, { mnemonic });

    if (mnemonic) {
      const existingWallets = yield select(selectWallets);
      const alreadyExists = !!existingWallets.find(w => w.privateKey === wallet.privateKey);

      if (alreadyExists) {
        throw new Error('This wallet already exists in the device');
      }
    }

    yield put(createWalletActions.success({ wallet, walletName }));

    AlertService.success(
      `Wallet was ${mnemonic ? 'imported' : 'created'} successfully. You can select it now.`
    );
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.CREATE_WALLET }));
}

function* sendTransaction({ payload: { address, amount } }) {
  yield put(startApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));

  const activeWalletInstance = yield select(selectActiveWalletInstance);

  try {
    yield call(ethService.sendTransaction, activeWalletInstance, address, amount);

    yield put(sendTransactionActions.success());

    AlertService.success('Transaction was sent successfully.');
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.SEND_TRANSACTION }));
}

function* getTxHistory() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));

  const activeWalletInstance = yield select(selectActiveWalletInstance);

  try {
    const txs = yield call(ethService.getHistory, activeWalletInstance);

    yield put(
      getTxHistoryActions.success({
        privateKey: activeWalletInstance.privateKey,
        txs,
      })
    );
  } catch (error) {
    AlertService.error(error.message);
  }

  yield put(finishApiCall({ apiCallId: apiCallIds.GET_TX_HISTORY }));
}

function* getBalance() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_BALANCE }));

  const activeWalletInstance = yield select(selectActiveWalletInstance);

  if (!activeWalletInstance) {
    return;
  }

  try {
    const balance = yield call(ethService.getBalance, activeWalletInstance);

    yield put(
      getBalanceSuccessAction({
        privateKey: activeWalletInstance.privateKey,
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

export function* ethWalletSaga() {
  yield takeLatest(createActionType(CREATE_WALLET, REQUEST), createWallet);
  yield takeLatest(createActionType(SEND_TRANSACTION, REQUEST), sendTransaction);
  yield takeLatest(createActionType(GET_TX_HISTORY, REQUEST), getTxHistory);

  yield takeLatest(SELECT_ACTIVE_WALLET, getBalance);
  yield takeLatest(createActionType(CREATE_WALLET, SUCCESS), getBalance);
  yield takeLatest(createActionType(SEND_TRANSACTION, SUCCESS), getBalance);

  yield fork(updateBalanceContinuously);
}
