import { all } from 'redux-saga/effects';

import { walletSaga } from '../../features/wallet/ducks';
import { priceSaga } from '../../features/price/ducks';

export default function* rootSaga() {
  yield all([walletSaga(), priceSaga()]);
}
