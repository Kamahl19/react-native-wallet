import { combineReducers } from 'redux';

import wallet from '../../features/wallet/ducks';
import spinner from '../../features/spinner/ducks';

const rootReducer = combineReducers({
  wallet,
  spinner,
});

export default (state, action) => rootReducer(state, action);
