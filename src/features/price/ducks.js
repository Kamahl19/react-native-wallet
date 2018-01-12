import { combineReducers } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import AlertService from '../../common/services/alert';
import {
  createApiActionCreators,
  createReducer,
  createActionType,
  REQUEST,
  SUCCESS,
} from '../../common/utils/reduxHelpers';
import { finishApiCall, startApiCall } from '../spinner/ducks';
import { selectActiveWallet } from '../wallet/ducks';
import * as btcService from '../../btcService';
import { PRICES_FROM, PRICES_TO, apiCallIds } from './constants';

/**
 * ACTION TYPES
 */
export const GET_PRICES = 'price/GET_PRICES';

/**
 * ACTIONS
 */
export const getPricesActions = createApiActionCreators(GET_PRICES);

/**
 * REDUCERS
 */
const initialState = {
  prices: {},
};

const prices = createReducer(initialState.prices, {
  [GET_PRICES]: {
    [SUCCESS]: (state, payload) => payload,
  },
});

export default combineReducers({
  prices,
});

/**
 * SELECTORS
 */
export const selectPrice = state => state.price;

export const selectPrices = state => selectPrice(state).prices;

export const selectPriceForActiveWallet = createSelector(
  selectPrices,
  selectActiveWallet,
  (prices, activeWalllet, fiat) => (activeWalllet ? prices[activeWalllet.coin.toUpperCase()] : null)
);

/**
 * SAGAS
 */
function* getPrices() {
  yield put(startApiCall({ apiCallId: apiCallIds.GET_PRICES }));

  try {
    const prices = yield call(btcService.getPrices, PRICES_FROM, PRICES_TO);

    yield put(getPricesActions.success(prices));

    yield finishPricesCall(apiCallIds.GET_PRICES);
  } catch (error) {
    yield finishPricesCall(apiCallIds.GET_PRICES, error);
  }
}

function* finishPricesCall(apiCallId, error) {
  yield put(
    finishApiCall({
      apiCallId,
      error,
    })
  );

  if (error) {
    AlertService.error(error.message || error);
  }
}

export function* priceSaga() {
  yield takeLatest(createActionType(GET_PRICES, REQUEST), getPrices);
}
