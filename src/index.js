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
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
// TEST https://github.com/tradle/rn-nodeify
// Add history https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-history
// Add status https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-status
// Add recreate https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-recreate
// Add import https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-import
// Add export https://github.com/bitpay/bitcore-wallet/blob/master/bin/wallet-export
