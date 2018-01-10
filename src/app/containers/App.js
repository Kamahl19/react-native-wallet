import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';

import { View } from '../../common/components';
import AlertService from '../../common/services/alert';
import AppNavigator from '../navigators/AppNavigator';

const App = () => (
  <View style={styles.component}>
    <AppNavigator />
    <DropdownAlert ref={ref => AlertService.setAlert(ref)} />
  </View>
);

export default App;

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
