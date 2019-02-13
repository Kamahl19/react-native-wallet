import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import DropdownAlert from 'react-native-dropdownalert';

import AlertService from '../common/services/alert';
import { CenterView, ActivityIndicator } from '../common/components';

import configureStore from './store/configureStore';
import AppNavigator from './AppNavigator';

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
      <Fragment>
        <AppNavigator />
        <DropdownAlert ref={ref => AlertService.setAlert(ref)} />
      </Fragment>
    </PersistGate>
  </Provider>
);

export default Root;
