// @flow
import * as types from '../constants/ActionTypes';

export type ErrorState = {
  hasError: boolean,
  message: ?string,
  connectionError: ?boolean,
};

export type ErrorAction = {
  type: string,
  message: string,
};

const initialStateFactory = (): ErrorState => ({
  hasError: false,
  message: null,
  connectionError: false,
});

const initialState = initialStateFactory();

const error = (
  state: ErrorState = initialState,
  action: ErrorAction,
): ErrorState => {
  switch (action.type) {
    case types.SET_APPLICATION_ERROR:
      return { ...state, hasError: true, message: action.message };
    case types.DISMISS_APPLICATION_ERROR:
      return { ...state, ...initialStateFactory() };
    case types.SET_CONNECTION_ERROR:
      return { ...state, connectionError: true, message: action.message };
    case types.DISMISS_CONNECTION_ERROR:
      return { ...state, ...initialStateFactory() };
    default:
      return state;
  }
};

export default error;
