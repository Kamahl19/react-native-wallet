import { all } from 'redux-saga/effects';

import { authSaga } from '../../features/auth/ducks';

export default function* rootSaga() {
  yield all([authSaga()]);
}
