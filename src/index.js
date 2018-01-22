import { AppRegistry, Platform } from 'react-native';
// import { AsyncStorage } from 'react-native';
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
// fetch prices and balance in saga
// notifications like in copay
// import wallet from Wallet.dat 3rd party software
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
