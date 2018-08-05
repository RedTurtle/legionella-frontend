// @flow
import React from 'react';
import { connect } from 'react-redux';
import { changeMenuType } from '../../actions/menu';
import { resetForm } from '../../actions/sampleRangeForm';
import './styles.css';

const DashboardTop = ({ changeMenuType, resetForm, userRoles, formMode }) => {
  const openAddMenu = () => {
    if (formMode !== 'add') {
      //form previously was open in edit or view mode
      resetForm();
    }
    changeMenuType({ menuType: 'sampleForm', formMode: 'add' });
  };

  const canAddReport =
    userRoles.length &&
    (userRoles.includes('manager') || userRoles.includes('tecnico'));

  return (
    <div className="dashboard-top">
      {canAddReport ? (
        <div className="add-sample-report-button">
          <button onClick={openAddMenu}>
            <span className="plus">+</span>
            <span className="button-text">Aggiungi rapporto campionamento</span>
          </button>
        </div>
      ) : null}
      <div className="dashboard-top-text">
        <p className="primary">Registro componenti</p>
        <p>
          <strong>Espandi</strong> le sottocentrali per il dettaglio dei punti
          WSP
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  userRoles: state.user.roles,
  formMode: state.menu.formMode,
});

const actionMethods = {
  changeMenuType,
  resetForm,
};

export default connect(mapStateToProps, actionMethods)(DashboardTop);
