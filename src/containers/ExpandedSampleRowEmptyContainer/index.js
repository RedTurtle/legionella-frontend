// @flow
import React, { Component } from 'react';
import { string } from 'prop-types';
import EmptySampleSlot from '../../components/EmptySampleSlot';
import { ExpandedSampleRowEmptyContainerQuery } from '../../graphql/queries/structures';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import {
  updateFormField,
  resetFormFieldForAdd,
} from '../../actions/sampleRangeForm';
import { changeMenuType } from '../../actions/menu';
import Spinner from '../../components/Spinner';

type Props = {
  structureId: string,
  sampleRange: $FlowFixMe,
  updateFormField: $FlowFixMe,
  changeMenuType: $FlowFixMe,
  loading: boolean,
  structure: $FlowFixMe,
  sampleRangeForm: $FlowFixMe,
  userRoles: Array<string>,
  formMode: string,
};

class ExpandedSampleRowEmptyContainer extends Component<Props> {
  presetFormFields(data) {
    const {
      updateFormField,
      resetFormFieldForAdd,
      changeMenuType,
      sampleRangeForm,
      formMode,
    } = this.props;
    formMode !== 'add'
      ? resetFormFieldForAdd({ fields: data })
      : updateFormField({ fields: { ...sampleRangeForm, ...data } });
    changeMenuType({ menuType: 'sampleForm', formMode: 'add' });
  }

  render() {
    const { loading, structure, sampleRange, userRoles } = this.props;
    if (loading) {
      return <Spinner />;
    }
    const wsps = structure ? structure.wspSet : null;
    let sampleReports = '';
    if (wsps) {
      sampleReports = wsps.edges.map((wspNode, idx) => {
        const wsp = wspNode.node;
        const canAddReport =
          !sampleRange.finalBlock &&
          !sampleRange.tecnicoBlock &&
          !sampleRange.managerBlock &&
          userRoles.length > 0 &&
          (userRoles.includes('manager') || userRoles.includes('tecnico'));
        return (
          <EmptySampleSlot
            key={idx}
            canAddReport={canAddReport}
            handleClick={() =>
              this.presetFormFields({
                sampleRange: sampleRange.id,
                wsp: wsp.id,
              })
            }
          />
        );
      });
    }
    return <div className="child-reports">{sampleReports}</div>;
  }
}

ExpandedSampleRowEmptyContainer.propTypes = {
  structureId: string,
};

const mapStateToProps = state => ({
  sampleRangeForm: state.sampleRangeForm.fields,
  userRoles: state.user.roles,
  formMode: state.menu.formMode,
});

const actionMethods = { updateFormField, changeMenuType, resetFormFieldForAdd };

export default connect(mapStateToProps, actionMethods)(
  graphql(ExpandedSampleRowEmptyContainerQuery, {
    options: ({ structureId }) => ({
      variables: { id: structureId },
    }),
    props: ({ data: { loading, structure } }) => ({
      loading,
      structure,
    }),
  })(ExpandedSampleRowEmptyContainer),
);

// export default ExpandedSampleRowEmptyContainer;
