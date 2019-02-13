import flattenDeep from 'lodash.flattendeep';

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const createActionType = (...parts) => flattenDeep(parts).join('_');

export const createActionCreator = (...type) => payload => ({
  type: createActionType(type),
  payload,
});

export const createApiActionCreators = (...type) => ({
  request: createActionCreator(type, REQUEST),
  success: createActionCreator(type, SUCCESS),
  failure: createActionCreator(type, FAILURE),
});

export const createReducer = (initialState, reducerMap) => {
  const iterator = (reducersObj, initial = {}, prefix = []) =>
    Object.entries(reducersObj).reduce(
      (acc, [actionType, reducerFn]) =>
        typeof reducerFn === 'function'
          ? {
              ...acc,
              [createActionType(prefix, actionType)]: reducerFn,
            }
          : iterator(reducerFn, acc, [createActionType(prefix, actionType)]),
      initial
    );

  const flattened = iterator(reducerMap);

  return (state = initialState, action) => {
    const reducer = flattened[action.type];
    return reducer ? reducer(state, action.payload) : state;
  };
};

export const replaceInArray = (array, selector, value) => {
  const idx = array.findIndex(selector);

  return idx >= 0 ? [...array.slice(0, idx), value, ...array.slice(idx + 1)] : array;
};

export const removeFromArray = (array, selector) => {
  const idx = array.findIndex(selector);

  return idx >= 0 ? [...array.slice(0, idx), ...array.slice(idx + 1)] : array;
};
