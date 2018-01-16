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
// import wallet from Wallet.dat 3rd party software
// get send max https://github.com/bitpay/copay/blob/6a3bf207b3de5691e412f007d7ca427ade53b8b1/src/js/controllers/confirm.js#L303
// calculate fee using dryRun https://github.com/bitpay/bitcore-wallet-client/blob/26d6debbfe600854f86b412c6a1e3cf13f9e2cbe/lib/api.js#L1729
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
