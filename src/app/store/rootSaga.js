import { all } from 'redux-saga/effects';

import { walletSaga } from '../../features/wallet/ducks';

export default function* rootSaga() {
  yield all([walletSaga()]);
}
