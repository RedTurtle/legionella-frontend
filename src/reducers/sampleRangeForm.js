// @flow
import * as types from '../constants/ActionTypes';
import moment from 'moment';

export type SampleRangeFormState = {
  fields: $FlowFixMe,
  formErrors: $FlowFixMe,
  validationErrors: boolean,
  visibleFields: Array<string>,
  restrictedFields: Array<string>,
  selectedWsp: $FlowFixMe,
  sampleRangeValidations: {
    tecnicoBlock: boolean,
    managerBlock: boolean,
    finalBlock: boolean,
  },
};

export type SampleRangeFormAction = {
  data: $FlowFixMe,
  type: string,
  errors: Array<string>,
};

const initialStateFactory = (): SampleRangeFormState => ({
  fields: {
    afterSamplingStatus: {},
    coldChlorineDioxide: '',
    coldFlowChlorineDioxide: '',
    coldFlowTemperature: '',
    coldFlowUfcl: '',
    coldFlowUfclSamplingSelection: '',
    coldFlowUfclType: '',
    coldTemperature: '',
    coldUfcl: '',
    coldUfclSamplingSelection: '',
    coldUfclType: '',
    hotChlorineDioxide: '',
    hotFlowChlorineDioxide: '',
    hotFlowTemperature: '',
    hotFlowUfcl: '',
    hotFlowUfclSamplingSelection: '',
    hotFlowUfclType: '',
    hotTemperature: '',
    hotUfcl: '',
    hotUfclSamplingSelection: '',
    hotUfclType: '',
    sampleRange: '',
    notesActions: [],
    reviewDate: moment().format('YYYY-MM-DD'),
    samplingDate: moment().format('YYYY-MM-DD'),
    wsp: '',
  },
  formErrors: null,
  validationErrors: false,
  restrictedFields: [],
  visibleFields: [],
  selectedWsp: null,
  sampleRangeValidations: {
    tecnicoBlock: false,
    managerBlock: false,
    finalBlock: false,
  },
});

const initialState = initialStateFactory();

const sampleRangeForm = (
  state: SampleRangeFormState = initialState,
  action: SampleRangeFormAction,
): SampleRangeFormState => {
  switch (action.type) {
    case types.UPDATE_SAMPLE_RANGE_FORM_FIELD:
      return { ...state, ...action.data, formErrors: null };
    case types.UPDATE_SAMPLE_RANGE_FORM_FIELD_FOR_ADD:
      return {
        ...state,
        fields: { ...initialState.fields, ...action.data.fields },
        formErrors: null,
      };
    case types.UPDATE_SAMPLE_RANGE_FORM_NOTES_ACTIONS:
      return {
        ...state,
        fields: { ...state.fields, notesActions: action.data },
      };
    case types.RESET_SAMPLE_RANGE_FORM:
      return { ...initialState };
    case types.ADD_SAMPLE_RANGE_FORM_ERROR:
      return { ...state, ...{ formErrors: action.errors } };
    default:
      return state;
  }
};

export default sampleRangeForm;
