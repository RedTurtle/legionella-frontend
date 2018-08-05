// @flow
import * as types from '../constants/ActionTypes';

export type UserState = {
  isLogged: boolean,
  token: string,
  clientMutationId: string,
  tokenReniewTimer: $FlowFixMe,
  loginError: string,
  username: ?string,
  firstName: ?string,
  lastName: ?string,
  roles: Array<string>,
};

export type UserAction = {
  data: $FlowFixMe,
  type: string,
  storedState: $FlowFixMe,
};

const initialStateFactory = (): UserState => ({
  isLogged: false,
  token: '',
  clientMutationId: '',
  tokenReniewTimer: null,
  loginError: '',
  username: null,
  firstName: null,
  lastName: null,
  roles: [],
});

const initialState = initialStateFactory();

const user = (
  state: UserState = initialState,
  action: UserAction,
): UserState => {
  switch (action.type) {
    case types.GET_USERINFOS:
      return Object.assign({}, state, action.data);
    case types.USER_LOGGED_IN:
      return Object.assign({}, state, {
        isLogged: true,
        token: action.data.token,
        clientMutationId: action.data.clientMutationId,
        tokenReniewTimer: action.data.tokenReniewTimer,
      });
    case types.USER_LOGGED_IN_ERROR:
      return Object.assign({}, state, {
        isLogged: false,
        token: '',
        loginError: action.data.message,
      });
    case types.USER_LOGGED_OUT:
      return initialStateFactory();
    case 'REFRESH_USER_TOKEN':
      return Object.assign({}, state, { token: action.data.token });
    case 'LOAD_STORED_STATE':
      return Object.assign({}, state, action.storedState);
    default:
      return state;
  }
};

export default user;
