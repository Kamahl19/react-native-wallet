import { combineReducers } from 'redux';

import auth, { LOGOUT } from '../../features/auth/ducks';
import spinner from '../../features/spinner/ducks';

const rootReducer = combineReducers({
  auth,
  spinner,
});

export default (state, action) => {
  if (action.type === LOGOUT) {
    return rootReducer(undefined, action);
  }

  return rootReducer(state, action);
};
