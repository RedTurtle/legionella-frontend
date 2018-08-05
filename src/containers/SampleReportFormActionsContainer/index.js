// @flow
import React, { Component } from 'react';
import ActionCategoryContainer from '../ActionCategoryContainer';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fieldWithPermissions } from '../../hocs/fields';

type Props = {
  actions: $FlowFixMe,
  onActionChange: $FlowFixMe,
  isFieldEditable: $FlowFixMe,
};

class SampleReportFormActionsContainer extends Component<Props> {
  updateNoteActions = (data: { newCategory: $FlowFixMe, index: number }) => {
    const { newCategory, index } = data;
    const newNotes = this.props.actions.map((category, categoryIndex) => {
      return index === categoryIndex ? newCategory : category;
    });
    this.props.onActionChange(newNotes);
  };

  render() {
    const { actions, isFieldEditable } = this.props;
    const isEditable = isFieldEditable('notesActions');
    const actionsRender = Array.isArray(actions) ? (
      actions.map((category, index) => (
        <ActionCategoryContainer
          key={`action-category-${index}`}
          id={`action-category-${index}`}
          isEditable={isEditable}
          category={category}
          onUpdateCategory={newCategory =>
            this.updateNoteActions({ newCategory, index })
          }
        />
      ))
    ) : (
      <div className="wrong-actions-format">
        Le azioni salvate sono in un formato non valido. Cancellale dal backend.
      </div>
    );
    return actions.length ? (
      <div className="SamplingActions">{actionsRender}</div>
    ) : (
      ''
    );
  }
}

const mapStateToProps = state => ({
  restrictedFields: state.sampleRangeForm.restrictedFields,
  visibleFields: state.sampleRangeForm.visibleFields,
});

const actionMethods = {};

export default compose(
  connect(mapStateToProps, actionMethods),
  fieldWithPermissions,
)(SampleReportFormActionsContainer);
