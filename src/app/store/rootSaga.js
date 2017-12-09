import { all } from 'redux-saga/effects';

import { authSaga } from '../../features/auth/ducks';
import { walletSaga } from '../../features/wallet/ducks';

export default function* rootSaga() {
  yield all([authSaga(), walletSaga()]);
}
