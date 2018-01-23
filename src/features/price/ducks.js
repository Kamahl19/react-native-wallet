import { combineReducers } from 'redux';
import { delay } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { createActionCreator, createReducer } from '../../common/utils/reduxHelpers';
import { finishApiCall, startApiCall } from '../spinner/ducks';
import { selectActiveWallet } from '../wallet/ducks';
import * as btcService from '../../btcService';
import { PRICES_FROM, PRICES_TO, FETCH_PRICES_INTERVAL_MS, apiCallIds } from './constants';

/**
 * ACTION TYPES
 */
export const GET_PRICES_SUCCESS = 'price/GET_PRICES_SUCCESS';

/**
 * ACTIONS
 */
export const getPricesSuccessAction = createActionCreator(GET_PRICES_SUCCESS);

/**
 * REDUCERS
 */
const initialState = {
  prices: {},
};

const prices = createReducer(initialState.prices, {
  [GET_PRICES_SUCCESS]: (state, payload) => payload,
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

    yield put(getPricesSuccessAction(prices));

    yield put(
      finishApiCall({
        apiCallId: apiCallIds.GET_PRICES,
      })
    );
  } catch (error) {
    yield put(
      finishApiCall({
        apiCallId: apiCallIds.GET_PRICES,
        error,
      })
    );
  }
}

function* updatePricesContinuously() {
  while (true) {
    yield call(getPrices);

    yield call(delay, FETCH_PRICES_INTERVAL_MS);
  }
}

export function* priceSaga() {
  yield fork(updatePricesContinuously);
}
