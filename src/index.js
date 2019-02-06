import { AppRegistry } from 'react-native';

import Root from './app/containers/Root';

AppRegistry.registerComponent('bitcoinwallet', () => Root);

// TODO
// BUG in bitcore-lib https://github.com/bitpay/bitcore-lib/issues/184
