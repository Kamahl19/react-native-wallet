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
// scan QRcode in Send
// import from QRCode

// rozdelit wallet na btc a wallet
// format USD with https://github.com/ExodusMovement/format-currency
// format BTC with https://github.com/ExodusMovement/number-unit
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
// TEST https://github.com/tradle/rn-nodeify
