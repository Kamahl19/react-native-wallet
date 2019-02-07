import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import { CenterView, ActivityIndicator } from '../../common/components';
import configureStore from '../store/configureStore';
import App from './App';

const { store, persistor } = configureStore();

const Root = () => (
  <Provider store={store}>
    <PersistGate
      loading={
        <CenterView>
          <ActivityIndicator size="large" />
        </CenterView>
      }
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
);

export default Root;
