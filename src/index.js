import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import 'react-select/dist/react-select.css';
import 'react-vis/dist/style.css';
import './index.css';
import App from './containers/App';
// import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { createSession } from 'redux-session';

const session = createSession({
  ns: 'user',
  selectState(state) {
    return {
      token: state.user.token,
      isLogged: state.user.isLogged,
    };
  },
});

const middleware = [session, thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({ collapsed: true }));
}

export const store = createStore(reducer, applyMiddleware(...middleware));

Modal.setAppElement('#root');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
// registerServiceWorker();
