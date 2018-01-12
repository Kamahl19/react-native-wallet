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
// research backup wallet and mnemonic
// wallet helpers (get balance)
// non-selectable fee (like exodus)
// format USD with https://github.com/ExodusMovement/format-currency
// format BTC with https://github.com/ExodusMovement/number-unit
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
