// @flow
import React, { Component } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import FaUser from 'react-icons/lib/fa/user';
import { loginUser } from '../../actions/user';

type State = { email: string, password: string };
type Props = {
  loginUser: $FlowFixMe,
  loginError: string,
  isLogged: boolean,
};

class LoginContainer extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  resetState = () => {
    this.setState(() => ({ email: '', password: '' }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { loginUser } = this.props;
    const { email, password } = this.state;
    loginUser({ email, password });
  };

  updateEmail = event => {
    const value = event.target.value;
    this.setState(() => ({ email: value }));
  };

  updatePassword = event => {
    const value = event.target.value;
    this.setState(() => ({ password: value }));
  };

  render() {
    const { loginError, isLogged } = this.props;
    if (isLogged) {
      return <Redirect to="/" />;
    }
    let error = '';
    if (loginError) {
      error = <div className="error-message">{loginError}</div>;
    }

    return (
      <div className="login-form-wrapper">
        <div className="login-form-header container">
          <h1>Effettua il login per accedere ai dati</h1>
        </div>
        <div className="login-form-content container">
          {error}
          <form onSubmit={this.handleSubmit}>
            <div className="email-field">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="username email"
                  value={this.state.email}
                  onChange={this.updateEmail}
                />
              </label>
            </div>
            <div className="password-field">
              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={this.updatePassword}
                />
              </label>
            </div>
            <div className="Controls">
              <button className="login" type="submit">
                <FaUser />
                <span>Accedi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginError: state.user.loginError,
  isLogged: state.user.isLogged,
});

const actionMethods = {
  loginUser,
};

export default connect(mapStateToProps, actionMethods)(LoginContainer);
