// @flow
import * as types from '../constants/ActionTypes';

export const dismissError = (): types.Action => ({
  type: types.DISMISS_APPLICATION_ERROR,
});

export const setApplicationError = (data: {
  message: string,
}): types.Action => ({
  type: types.SET_APPLICATION_ERROR,
  ...data,
});

export const dismissConnectionError = (): types.Action => ({
  type: types.DISMISS_CONNECTION_ERROR,
});

export const setConnectionError = (data: {
  message: string,
}): types.Action => ({
  type: types.SET_CONNECTION_ERROR,
  ...data,
});
