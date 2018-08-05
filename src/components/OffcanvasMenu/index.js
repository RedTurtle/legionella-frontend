// @flow
import React from 'react';
import './styles.css';

import LivelliRischioFormContainer from '../../containers/LivelliRischioFormContainer';
import SampleFormContainer from '../../containers/SampleFormContainer';
import SampleRangeFormContainer from '../../containers/SampleRangeFormContainer';
import StandardSettingsFormContainer from '../../containers/StandardSettingsFormContainer';
import RangeLegionellaSettingsFormContainer from '../../containers/RangeLegionellaSettingsFormContainer';
import ActionsSettingsFormContainer from '../../containers/ActionsSettingsFormContainer';
import SampleRangeFilesFormContainer from '../../containers/SampleRangeFilesFormContainer';
import type { ReduxState } from '../../reducers';
import { openCloseMenu } from '../../actions/menu';
import { connect } from 'react-redux';
import SampleDetailContainer from '../../containers/SampleDetailContainer';
import { HotKeys } from 'react-hotkeys';
import FocusTrap from 'focus-trap-react';

type Props = {
  menuIsOpen: boolean,
  menuType: string,
  openCloseMenu: typeof openCloseMenu,
};

type State = {
  activeTrap: boolean,
};

class OffcanvasMenu extends React.Component<Props, State> {
  state = {
    activeTrap: false,
  };

  unmountTrap = () =>
    this.setState({ activeTrap: false }, () => {
      const button = document.querySelector(
        '.add-sample-report-button > button',
      );
      if (button) button.focus();
    });

  render() {
    const { menuIsOpen, menuType, openCloseMenu } = this.props;

    let children = '';
    switch (menuType) {
      case 'sampleDetail':
        children = <SampleDetailContainer />;
        break;
      case 'sampleRangeForm':
        children = <SampleRangeFormContainer />;
        break;
      case 'livelliRischio':
        children = <LivelliRischioFormContainer />;
        break;
      case 'sampleRangeFiles':
        children = <SampleRangeFilesFormContainer />;
        break;
      case 'sampleForm':
        children = <SampleFormContainer />;
        break;
      case 'standardSettings':
        children = <StandardSettingsFormContainer />;
        break;
      case 'rangeLegionellaSettings':
        children = <RangeLegionellaSettingsFormContainer />;
        break;
      case 'actionsSettings':
        children = <ActionsSettingsFormContainer />;
        break;
      default:
        break;
    }

    return (
      <HotKeys
        handlers={{
          close: () => openCloseMenu(),
        }}
      >
        <FocusTrap
          active={menuIsOpen}
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            clickOutsideDeactivates: true,
            escapeDeactivates: false,
          }}
        >
          <div
            className={`offcanvas-menu${menuIsOpen ? ' open' : ''} ${menuType}`}
          >
            <div className="offcanvas-content">{children}</div>
          </div>
        </FocusTrap>
      </HotKeys>
    );
  }
}

const mapStateToProps = (state: ReduxState): { menuIsOpen: boolean } => ({
  menuIsOpen: state.menu.open,
  menuType: state.menu.menuType,
});

const actionMethods = {
  openCloseMenu,
};

export default connect(mapStateToProps, actionMethods)(OffcanvasMenu);
