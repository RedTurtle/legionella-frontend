// @flow
import './styles.css';
import React, { Component } from 'react';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import ClickOutComponent from 'react-onclickout';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { saveUserInfos, logoutUser } from '../../actions/user';
import logout from './logout.svg';
import paola from './profilo-paola.png';
import { UserQuery } from '../../graphql/queries/user';
import userFragments from '../../graphql/fragments/user';
import { filter } from 'graphql-anywhere';

type Props = {
  user: any,
  loading: boolean,
  saveUserInfos: $FlowFixMe,
  logoutUser: $FlowFixMe,
};

type State = {
  isOpen: boolean,
};

class UserMenu extends Component<Props, State> {
  state = {
    isOpen: false,
  };

  componentWillReceiveProps(newProps) {
    const { user } = newProps;
    if (user) {
      this.props.saveUserInfos(filter(userFragments.details, user));
    }
  }

  handleLogout = () => {
    this.props.logoutUser();
  };

  toggleMenu = (): void => {
    this.setState((state: State): State => ({
      isOpen: !state.isOpen,
    }));
  };

  closeMenu = (): void => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { user } = this.props;
    let username = '';
    if (!user) {
      return '';
    }
    if (user.firstName.length > 0 || user.lastName.length > 0) {
      username = `${user.firstName} ${user.lastName}`;
    } else {
      username = user.username;
    }

    const adminHost =
      process && process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : '';

    return (
      <div className="right-block">
        <div className="user-container">
          <button
            className="logged-user"
            type="button"
            onClick={this.toggleMenu}
          >
            <div className="user-icon">
              {user.username === 'paola' && (
                <img src={paola} alt="Foto profilo" />
              )}
            </div>
            <span className="username">{username}</span>
            <span className="caret-icon">
              {this.state.isOpen ? <FaCaretUp /> : <FaCaretDown />}
            </span>
          </button>
          {this.state.isOpen && (
            <ClickOutComponent onClickOut={this.closeMenu}>
              <div className="user-dropdown">
                <ul>
                  <li>
                    <a href={`${adminHost}/amministrazione`}>
                      Pannello di amministrazione
                    </a>
                  </li>
                </ul>
              </div>
            </ClickOutComponent>
          )}
        </div>
        <div className="logout-wrapper">
          <button onClick={this.handleLogout}>
            <span>Esci</span>
            <img src={logout} alt="Esci" />
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const actionMethods = { saveUserInfos, logoutUser };

// $FlowFixMe
export default connect(mapStateToProps, actionMethods)(
  graphql(UserQuery, {
    // $FlowFixMe
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: ({ data: { loading, user } }) => ({
      loading,
      user,
    }),
    // $FlowFixMe
  })(UserMenu),
);
