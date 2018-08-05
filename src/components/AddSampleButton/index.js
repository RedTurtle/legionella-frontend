import React from 'react';
import './styles.css';
import { connect } from 'react-redux';
import { changeMenuType } from '../../actions/menu';

const AddSampleButton = ({ changeMenuType }) => {
  const openFormMenu = () => {
    changeMenuType({ menuType: 'sampleRangeForm', formMode: 'add' });
  };

  return (
    <div className="add-sample-button">
      <div className="button-content">
        <button onClick={() => openFormMenu()}>
          <span>+</span>
        </button>
      </div>
    </div>
  );
};

const actionMethods = {
  changeMenuType,
};

export default connect(() => ({}), actionMethods)(AddSampleButton);
