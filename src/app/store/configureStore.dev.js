import { applyMiddleware, compose } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import Reactotron from 'reactotron-react-native';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware({
    sagaMonitor: Reactotron.createSagaMonitor(),
  });

  const persistedReducer = persistReducer(
    {
      key: 'root',
      storage: AsyncStorage,
      whitelist: ['wallet'],
      debug: true,
    },
    rootReducer
  );

  const store = Reactotron.createStore(
    persistedReducer,
    compose(applyMiddleware(sagaMiddleware, logger))
  );

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}
