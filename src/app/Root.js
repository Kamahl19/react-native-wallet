import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import DropdownAlert from 'react-native-dropdownalert';

import configureStore from './store/configureStore';
import AlertService from '../common/services/alert';
import { CenterView, ActivityIndicator, View } from '../common/components';

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
      <View style={styles.component}>
        <AppNavigator />
        <DropdownAlert ref={ref => AlertService.setAlert(ref)} />
      </View>
    </PersistGate>
  </Provider>
);

export default Root;

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
