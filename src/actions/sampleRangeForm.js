// @flow
import * as types from '../constants/ActionTypes';

export const updateFormField = (data: $FlowFixMe) => {
  return {
    type: types.UPDATE_SAMPLE_RANGE_FORM_FIELD,
    data,
  };
};

export const resetFormFieldForAdd = (data: $FlowFixMe) => {
  return {
    type: types.UPDATE_SAMPLE_RANGE_FORM_FIELD_FOR_ADD,
    data,
  };
};

export const updateNotesActions = (data: $FlowFixMe) => {
  return {
    type: types.UPDATE_SAMPLE_RANGE_FORM_NOTES_ACTIONS,
    data,
  };
};

export const resetForm = () => {
  return {
    type: types.RESET_SAMPLE_RANGE_FORM,
  };
};

export const addErrorMessage = (errors: $FlowFixMe) => {
  return {
    type: types.ADD_SAMPLE_RANGE_FORM_ERROR,
    errors,
  };
};
