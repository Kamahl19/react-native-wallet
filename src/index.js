import { AppRegistry, Platform } from 'react-native';
// import {AsyncStorage } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';

import Root from './app/containers/Root';

AppRegistry.registerComponent('bitcoinwallet', () => Root);

if (Platform.OS === 'ios') {
  KeyboardManager.setEnableDebugging(__DEV__);
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableAutoToolbar(false);
}

// setTimeout(() => {
//   AsyncStorage.clear();
// }, 3000);

// TODO
// Test Send transaction
// Add Labels to Selects
