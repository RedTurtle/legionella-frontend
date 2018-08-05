import React from 'react';
import './styles.css';
import FaCaretRight from 'react-icons/lib/fa/caret-right';
import { connect } from 'react-redux';
import { changeMenuType } from '../../actions/menu';

const WSPDetailsButton = ({ changeMenuType, wspId }) => (
  <div className="wsp-details-button">
    <button
      onClick={() => {
        changeMenuType({ menuType: 'sampleDetail', entryId: wspId });
      }}
      title="Dettaglio del WSP"
    >
      <FaCaretRight />
    </button>
  </div>
);

const mapStateToProps = (state: ReduxState): { menuIsOpen: boolean } => ({});

const actionMethods = { changeMenuType };

export default connect(mapStateToProps, actionMethods)(WSPDetailsButton);
