import { combineReducers } from 'redux';

import wallet from '../../features/wallet/ducks';
import prices from '../../features/prices/ducks';
import spinner from '../../features/spinner/ducks';

const rootReducer = combineReducers({
  wallet,
  spinner,
  prices,
});

export default (state, action) => rootReducer(state, action);
