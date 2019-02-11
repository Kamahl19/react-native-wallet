import { applyMiddleware, createStore, compose } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const persistedReducer = persistReducer(
    {
      key: 'root',
      version: 0,
      storage: AsyncStorage,
      whitelist: ['wallet'],
      debug: __DEV__,
    },
    rootReducer
  );

  const middlewares = [sagaMiddleware];

  if (__DEV__) {
    const { createLogger } = require('redux-logger');
    middlewares.push(createLogger());
  }

  const store = createStore(persistedReducer, compose(applyMiddleware(...middlewares)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}
