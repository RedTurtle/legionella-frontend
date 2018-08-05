// import { ApolloClient, createNetworkInterface } from 'react-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink, from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { store } from '../index';
import { logoutUser } from '../actions/user';
import { setConnectionError } from '../actions/error';

import { USER_LOGGED_OUT } from '../constants/ActionTypes';

const fetchUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/graphqlapp/graphql'
    : '/graphqlapp/graphql';

const httpLink = createHttpLink({
  uri: fetchUrl,
  headers: {
    authorization: 'Basic ZGVtbzpwbG9uZTEyMw==',
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const { user } = store.getState();
  if (user.isLogged && user.token.length > 0) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: `JWT ${user.token}`,
      },
    }));
  }

  return forward(operation);
});

const logoutLink = onError(data => {
  const { networkError } = data;
  const { user } = store.getState();
  if (networkError) {
    if (networkError.message === 'Failed to fetch') {
      store.dispatch(setConnectionError());
      return;
    }
    if (networkError.response && networkError.response.status === 401) {
      if (user.isLogged) {
        //token expired. Logout user to renew the access
        store.dispatch(logoutUser({ type: USER_LOGGED_OUT }));
        return;
      }
    }
  }
});

const client = new ApolloClient({
  // link: from([authMiddleware, httpLink, logoutLink]),
  link: logoutLink.concat(from([authMiddleware, httpLink])),
  cache: new InMemoryCache({
    // addTypename: false,
  }),
});

export default client;
