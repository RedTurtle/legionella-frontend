// @flow
import './styles.css';

import LoginContainer from '../LoginContainer';
import Dashboard from '../../components/Dashboard';
import Footer from '../../components/Footer';
import GenericModal from '../../components/GenericModal';
import ErrorPage from '../../components/ErrorPage';
import * as React from 'react';
import { Component } from 'react';
import StandardSettingsContainer from '../StandardSettingsContainer';
import RangeLegionellaSettingsContainer from '../RangeLegionellaSettingsContainer';
import LivelliRischioSettingsContainer from '../LivelliRischioSettingsContainer';
import ActionsSettingsContainer from '../ActionsSettingsContainer';
import TopMenu from '../../components/TopMenu';
import UserMenu from '../../components/UserMenu';
import client from '../../helpers/create-apollo-client';
import logo from './logo.svg';
import type { Action } from '../../constants/ActionTypes';
import type { ReduxState } from '../../reducers';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { openCloseMenu } from '../../actions/menu';
import { refreshToken } from '../../actions/user';
import { resetForm } from '../../actions/sampleRangeForm';
import { dismissError } from '../../actions/error';
import OffcanvasBackdrop from '../../components/OffcanvasBackdrop';
import OffcanvasMenu from '../../components/OffcanvasMenu';
import moment from 'moment';
import { HotKeys } from 'react-hotkeys';

type Props = {
  isLogged: boolean,
  refreshToken: $FlowFixMe,
  menuIsOpen: boolean,
  openCloseMenu: $FlowFixMe,
  resetForm: $FlowFixMe,
  applicationHasError: boolean,
  errorMessage: string,
  dismissError: Action,
  hasConnectionError: boolean,
};

type State = {
  timer: $FlowFixMe,
};

type PrivateRouteProps = {
  exact: boolean,
  path: string,
  isLogged: boolean,
  component: $FlowFixMe,
  settingType?: string,
  label?: string,
};

const PrivateRoute = ({
  component: Component,
  isLogged,
  settingType,
  label,
  ...rest
}: PrivateRouteProps) => (
  <Route
    {...rest}
    render={props =>
      isLogged ? (
        <Component {...props} {...{ settingType, label }} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class App extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      timer: null,
    };
  }

  handleCloseMenu = () => {
    const { openCloseMenu /*, resetForm*/ } = this.props;
    openCloseMenu();
    // we don't want to reset the form clicking out
    // resetForm();
  };

  setIntervalForToken = () => {
    const { refreshToken } = this.props;
    const timeout = 1 * 60000; //4 minutes
    let timer = setInterval(() => {
      console.log('refresho il token', moment().format());
      refreshToken();
    }, timeout);
    this.setState({ timer });
  };

  componentDidMount() {
    if (this.props.isLogged) {
      this.setIntervalForToken();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isLogged && nextProps.isLogged) {
      this.setIntervalForToken();
    } else {
      clearInterval(this.state.timer);
      this.setState({ timer: null });
    }
  }

  render() {
    const {
      isLogged,
      menuIsOpen,
      applicationHasError,
      errorMessage,
      dismissError,
      hasConnectionError,
    } = this.props;
    return (
      <ApolloProvider client={client}>
        <Router>
          <HotKeys
            keyMap={{
              close: 'esc',
            }}
          >
            <div className="app">
              <div className="topbar">
                <div className="container">
                  <div className="left-block">
                    <Link className="logo-link" to="/" title="Go to Home">
                      <img src={logo} alt="Logo" />
                    </Link>
                    <div className="title">
                      <span className="big">Registro Unico</span>
                      <span>Temperature / Biossido di cloro / Legionella</span>
                    </div>
                  </div>
                  {isLogged ? <UserMenu /> : ''}
                </div>
              </div>
              {isLogged && !hasConnectionError ? <TopMenu /> : ''}
              <PrivateRoute
                exact
                path="/"
                isLogged={isLogged}
                component={Dashboard}
              />
              <PrivateRoute
                exact
                path="/settings/ditta"
                isLogged={isLogged}
                component={StandardSettingsContainer}
                settingType="company"
                label="Ditta"
              />
              <PrivateRoute
                exact
                path="/settings/ceppi-legionella"
                isLogged={isLogged}
                component={StandardSettingsContainer}
                settingType="legionella"
                label="Ceppi legionella"
              />
              <PrivateRoute
                exact
                path="/settings/livelli-rischio"
                isLogged={isLogged}
                component={LivelliRischioSettingsContainer}
                settingType="risk_level"
                label="Livelli di rischio"
              />
              <PrivateRoute
                exact
                path="/settings/range"
                isLogged={isLogged}
                component={RangeLegionellaSettingsContainer}
              />
              <PrivateRoute
                exact
                path="/settings/azioni"
                isLogged={isLogged}
                component={ActionsSettingsContainer}
              />
              <Route exact path="/login" component={LoginContainer} />

              {hasConnectionError ? <Redirect to="/error" /> : null}
              <Route exact path="/error" component={ErrorPage} />
              <OffcanvasBackdrop
                key="offcanvas-backdrop-wrapper"
                open={menuIsOpen}
                onCloseMenu={this.handleCloseMenu}
              />
              <OffcanvasMenu key="offcanvas-menu" />
              <Footer />
              <GenericModal
                onHandleConfirm={dismissError}
                onHandleCloseModal={dismissError}
                isOpen={applicationHasError}
                confirmLabel="Chiudi"
                showCancelButton={false}
                title="Si è verificato un errore"
              >
                {errorMessage}
              </GenericModal>
            </div>
          </HotKeys>
        </Router>
      </ApolloProvider>
    );
  }
}

const mapStateToProps = (
  state: ReduxState,
): {
  isLogged: boolean,
  menuIsOpen: boolean,
  applicationHasError: boolean,
  hasConnectionError: ?boolean,
  errorMessage: ?string,
} => ({
  isLogged: state.user.isLogged,
  menuIsOpen: state.menu.open,
  applicationHasError: state.error.hasError,
  errorMessage: state.error.message,
  hasConnectionError: state.error.connectionError,
});

const actionMethods = { refreshToken, openCloseMenu, resetForm, dismissError };

export default connect(mapStateToProps, actionMethods)(App);
