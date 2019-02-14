import { combineReducers } from 'redux';

import spinner from '../../common/services/spinner';
import wallet from '../../features/wallet/ducks';
import prices from '../../features/prices/ducks';

const rootReducer = combineReducers({
  spinner,
  wallet,
  prices,
});

export default (state, action) => rootReducer(state, action);
