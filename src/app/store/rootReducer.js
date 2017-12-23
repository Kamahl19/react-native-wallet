import { combineReducers } from 'redux';

import wallet from '../../features/wallet/ducks';
import price from '../../features/price/ducks';
import spinner from '../../features/spinner/ducks';

const rootReducer = combineReducers({
  wallet,
  spinner,
  price,
});

export default (state, action) => rootReducer(state, action);
