import { all, fork } from 'redux-saga/effects';

import { walletSaga } from '../../features/wallet/ducks';
import { pricesSaga } from '../../features/prices/ducks';

export default function* rootSaga() {
  yield all([fork(walletSaga), fork(pricesSaga)]);
}
