// @flow
import React, { Component } from 'react';
import EmptySampleSlot from '../../components/EmptySampleSlot';
import Spinner from '../../components/Spinner';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { updateFormField } from '../../actions/sampleRangeForm';
import { changeMenuType } from '../../actions/menu';
import { ExpandedSampleRowContainerQuery } from '../../graphql/queries/structures';
import { SettingsQuery } from '../../graphql/queries/settings';
import SampleReport from '../../components/SampleReport';

type Props = {
  updateFormField: $FlowFixMe,
  changeMenuType: $FlowFixMe,
  graphqlSampleRangeId: String,
  graphqlStructureId: String,
  loading: boolean,
  structure: $FlowFixMe,
  sampleRangeForm: $FlowFixMe,
  reportsFreeze: Array<any>,
  actions: $FlowFixMe,
  sampleRange: $FlowFixMe,
  userRoles: Array<string>,
};

class ExpandedSampleRowContainer extends Component<Props> {
  presetFormFields = (data: $FlowFixMe) => {
    const { updateFormField, changeMenuType, sampleRangeForm } = this.props;
    changeMenuType({ menuType: 'sampleForm', formMode: 'add' });
    updateFormField({
      fields: Object.assign({}, sampleRangeForm, data),
    });
  };

  setSampleForm = (data: $FlowFixMe) => {
    const {
      changeMenuType,
      updateFormField,
      sampleRangeForm,
      actions,
    } = this.props;
    let { sampleRange, id, formMode, ...newState } = data;
    if (newState.notesActions && newState.notesActions.length > 0) {
      if (typeof newState.notesActions === 'string') {
        // active reports have a json string, so parse it
        // freeze reports are a big json, so this is just parsed and is in a correct shape
        newState.notesActions = JSON.parse(newState.notesActions);
      }
    } else {
      newState.notesActions = actions.edges.map(({ node }) => {
        const typeActions =
          node.notesActionsJson.length === 0
            ? []
            : JSON.parse(node.notesActionsJson);
        return {
          label: node.value,
          actions: typeActions.map(action => {
            const subActions = action.children ? action.children : [];
            return {
              label: action.label,
              value: false,
              children: subActions,
              selectedChildren: null,
            };
          }),
          text: '',
        };
      });
    }
    // fix sampling selections hotUfclSamplingSelection an ufclType;
    ['hot', 'hotFlow', 'cold', 'coldFlow'].map(key => {
      if (newState[`${key}UfclSamplingSelection`]) {
        newState[`${key}UfclSamplingSelection`] =
          newState[`${key}UfclSamplingSelection`].id;
      }
      if (newState[`${key}UfclType`]) {
        newState[`${key}UfclType`] = newState[`${key}UfclType`].id;
      }
      return key;
    });
    //add custom fields
    newState.reportId = id;
    if (sampleRange) {
      newState.sampleRange = sampleRange.id;
    }
    updateFormField({
      fields: { ...sampleRangeForm, ...newState },
    });
    changeMenuType({ menuType: 'sampleForm', formMode });
  };

  getReportForCurrentSampleRange = wsp => {
    const { graphqlSampleRangeId, reportsFreeze } = this.props;
    if (reportsFreeze.length) {
      const report = reportsFreeze.reduce((accumulator, report) => {
        if (accumulator !== undefined) {
          //found report
          return accumulator;
        }
        return report.wsp.code === wsp.code ? report : undefined;
      }, undefined);
      if (report) {
        //BBB #freezehack to add a reference to sampleRange.
        // with this id, SampleForm can query it and know if its freeze.
        // need some refactor
        report.sampleRange = { id: graphqlSampleRangeId };
      }
      return report;
    }
    const reports = wsp.reportSet ? wsp.reportSet : {};
    return reports.edges.reduce((accumulator, reportNode) => {
      if (accumulator !== undefined) {
        //found report
        return accumulator;
      }
      const report = reportNode.node;
      return report.sampleRange.id === graphqlSampleRangeId
        ? report
        : undefined;
    }, undefined);
  };

  render() {
    const {
      loading,
      graphqlSampleRangeId,
      structure,
      reportsFreeze,
      sampleRange,
      userRoles,
    } = this.props;
    if (loading) {
      return <Spinner />;
    }
    const wsps = structure ? structure.wspSet : {};
    const sampleRangeValidations = {
      tecnicoBlock: sampleRange.tecnicoBlock,
      managerBlock: sampleRange.managerBlock,
      finalBlock: sampleRange.finalBlock,
    };
    const canAddReport =
      !sampleRangeValidations.finalBlock &&
      !sampleRangeValidations.tecnicoBlock &&
      !sampleRangeValidations.managerBlock &&
      userRoles.length > 0 &&
      (userRoles.includes('manager') || userRoles.includes('tecnico'));

    const canEditReport =
      userRoles.length &&
      (userRoles.includes('manager') || userRoles.includes('tecnico')) &&
      reportsFreeze.length === 0 &&
      !sampleRangeValidations.finalBlock &&
      // c'è il blocco tecnico e l'utente è solo un tecnico
      !(
        sampleRangeValidations.tecnicoBlock &&
        userRoles.length === 1 &&
        userRoles[0] === 'tecnico'
      ); //&&
    // c'è il blocco tecnico e l'utente è solo manager
    // BBB questo lo commento perché il manager deve poter modificare ancora le azioni
    // !(
    //   sampleRangeValidations.managerBlock &&
    //   userRoles.length === 1 &&
    //   userRoles[0] === 'manager'
    // );
    const sampleReports = wsps.edges
      ? wsps.edges.map((wspNode, idx) => {
          const wsp = wspNode.node;
          const reportForCurrentSampleRange = this.getReportForCurrentSampleRange(
            wsp,
          );
          return reportForCurrentSampleRange ? (
            <SampleReport
              key={idx}
              buttonMode={canEditReport ? 'edit' : 'view'}
              report={reportForCurrentSampleRange}
              handleOpenForm={() =>
                this.setSampleForm({
                  ...reportForCurrentSampleRange,
                  ...{ wsp: wsp.id },
                  sampleRangeValidations,
                  formMode: canEditReport ? 'edit' : 'view',
                })
              }
            />
          ) : (
            <EmptySampleSlot
              key={idx}
              canAddReport={canAddReport}
              handleClick={() =>
                this.presetFormFields({
                  sampleRange: graphqlSampleRangeId,
                  wsp: wsp.id,
                })
              }
            />
          );
        })
      : null;
    return <div className="child-reports">{sampleReports}</div>;
  }
}

const mapStateToProps = state => ({
  sampleRangeForm: state.sampleRangeForm.fields,
  userRoles: state.user.roles,
});

const actionMethods = { changeMenuType, updateFormField };

export default compose(
  // $FlowFixMe
  connect(mapStateToProps, actionMethods),
  // $FlowFixMe
  graphql(ExpandedSampleRowContainerQuery, {
    options: ({ graphqlStructureId }) => ({
      variables: { id: graphqlStructureId },
    }),
    props: ({ data: { loading, structure } }) => ({
      loading,
      structure,
    }),
  }),
  // $FlowFixMe
  graphql(SettingsQuery, {
    // $FlowFixMe
    options: () => ({
      variables: { settingType: 'notes_actions' },
    }),
    props: ({ data: { loading, settings } }) => {
      return {
        loading,
        actions: settings,
      };
    },
  }),
)(ExpandedSampleRowContainer);
