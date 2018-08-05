// @flow
import React, { Component } from 'react';
import './styles.css';

import ClickOutComponent from 'react-onclickout';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

type Props = {
  label: string,
  voices: Array<{
    id: string,
    label: string,
    path: string,
    settingType?: string,
  }>,
  location: $FlowFixMe,
};
type State = { dropdownIsOpen: boolean };

class TopMenuDropdownVoice extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      dropdownIsOpen: false,
    };
  }

  triggerDropdown = (e: $FlowFixMe): void => {
    e.preventDefault();
    this.setState((): State => ({
      dropdownIsOpen: !this.state.dropdownIsOpen,
    }));
  };

  onClickOut = (event: Event): void => {
    this.setState((): State => ({
      dropdownIsOpen: false,
    }));
  };

  render() {
    const { label, voices, location } = this.props;
    const { dropdownIsOpen } = this.state;
    const isActive = voices.reduce((active, menuItem) => {
      if (active) {
        return active;
      }
      return menuItem.path === location.pathname;
    }, false);
    let renderElements = [
      <a
        key="dropdown-label"
        href="/"
        onClick={this.triggerDropdown}
        className={isActive ? 'active' : ''}
      >
        <span>{label}</span>
        {dropdownIsOpen ? <FaCaretUp /> : <FaCaretDown />}
      </a>,
    ];
    if (dropdownIsOpen) {
      renderElements.push(
        <ClickOutComponent onClickOut={this.onClickOut} key="dropdown-keys">
          <ul className="dropdown-keys">
            {voices.map(voice => (
              <li key={`${label}.${voice.id}`}>
                <Link
                  onClick={() =>
                    this.setState((): State => ({
                      dropdownIsOpen: false,
                    }))
                  }
                  to={{
                    pathname: voice.path,
                  }}
                >
                  {voice.label}
                </Link>
              </li>
            ))}
          </ul>
        </ClickOutComponent>,
      );
    }
    return <li className="menu-item dropdown">{renderElements}</li>;
  }
}

export default withRouter(TopMenuDropdownVoice);
