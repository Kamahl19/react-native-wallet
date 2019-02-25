import { combineReducers } from 'redux';

import spinner from '../../common/services/spinner';
import btcWallet from '../../features/btc-wallet/ducks';
import ethWallet from '../../features/eth-wallet/ducks';
import prices from '../../features/prices/ducks';

const rootReducer = combineReducers({
  spinner,
  btcWallet,
  ethWallet,
  prices,
});

export default (state, action) => rootReducer(state, action);
