import { all, fork } from 'redux-saga/effects';

import { btcWalletSaga } from '../../features/btc-wallet/ducks';
import { ethWalletSaga } from '../../features/eth-wallet/ducks';
import { pricesSaga } from '../../features/prices/ducks';

export default function* rootSaga() {
  yield all([fork(btcWalletSaga), fork(ethWalletSaga), fork(pricesSaga)]);
}
