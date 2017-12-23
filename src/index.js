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
// rozdelit wallet na btc a wallet
// show balance in USD
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
// TEST https://github.com/tradle/rn-nodeify
// Add import https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-import
// Add export https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-export
