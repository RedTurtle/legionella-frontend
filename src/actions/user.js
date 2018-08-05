// @flow
import * as types from '../constants/ActionTypes';

const callApi = (route, options) => {
  const baseUrl =
    process && process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : '';

  return fetch(`${baseUrl}/graphqlapp/${route}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: 'Basic ZGVtbzpwbG9uZTEyMw==',
    }),
    body: JSON.stringify(options),
  }).then(response => response.json());
};

// export const loginUser = data => {
//   return {
//     type: types.USER_LOGGED_IN,
//     data,
//   };
// };

export const loginUser = (data: $FlowFixMe) => (
  dispatch: $FlowFixMe,
  getState: $FlowFixMe,
) => {
  return callApi('login', data)
    .then(result => {
      const { non_field_errors, token, password } = result;
      if (non_field_errors && non_field_errors.length > 0) {
        return dispatch({
          type: types.USER_LOGGED_IN_ERROR,
          data: { message: non_field_errors[0] },
        });
      } else if (password && password.length > 0) {
        return dispatch({
          type: types.USER_LOGGED_IN_ERROR,
          data: { message: 'Password è un campo obbligatorio ' },
        });
      } else if (token && token.length > 0) {
        return dispatch({ type: types.USER_LOGGED_IN, data: { token } });
      }
      // if (success) {
      //   return dispatch({ type: types.REFRESH_USER_TOKEN, data: { token } });
      // }
    })
    .catch(e => {
      console.trace(e);
    });
};

export const logoutUser = () => {
  return {
    type: types.USER_LOGGED_OUT,
  };
};

export const refreshToken = () => (dispatch: any, getState: any) => {
  const state = getState();
  const token = state.user.token;
  if (token.length > 0) {
    return callApi('refresh-token', { token })
      .then(({ token }) => {
        if (token) {
          return dispatch({ type: types.REFRESH_USER_TOKEN, data: { token } });
        }
      })
      .catch(e => {
        console.trace(e);
      });
  }
};

export const saveUserInfos = (data: any) => {
  return {
    type: types.GET_USERINFOS,
    data,
  };
};
