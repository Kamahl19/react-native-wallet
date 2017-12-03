import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import {
  prepareRequestInterceptor,
  handleResponsesInterceptor,
} from '../../common/services/apiClient';
import { reloginRequest } from '../../features/auth/ducks';
import Spinner from '../../features/spinner';
import configureStore from '../store/configureStore';
import App from './App';

const { store, persistor } = configureStore();

prepareRequestInterceptor(store);
handleResponsesInterceptor(store);

function relogin() {
  const state = store.getState();

  if (state && state.auth && state.auth.token) {
    store.dispatch(reloginRequest());
  }
}

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={<Spinner large />} persistor={persistor} onBeforeLift={relogin}>
      <App />
    </PersistGate>
  </Provider>
);

export default Root;
