// @flow
import React, { Component } from 'react';
import TempIcon from '../../icons/TempIcon';
import MoleculeIcon from '../../icons/MoleculeIcon';
import BacteriaIcon from '../../icons/BacteriaIcon';
import Select from 'react-select';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fieldWithPermissions } from '../../../hocs/fields';

type Props = {
  label: string,
  fieldId: string,
  sampleRangeForm: $FlowFixMe,
  onChangeHandler: $FlowFixMe,
  samplingValues: $FlowFixMe,
  legionellaTypes: $FlowFixMe,
  selectedWsp: $FlowFixMe,
  restrictedFields: $FlowFixMe,
  visibleFields: $FlowFixMe,
  isFieldEditable: $FlowFixMe,
};

type State = {
  temperatureHasError: boolean,
  chlorineHasError: boolean,
  ufclHasError: boolean,
};

const initialState = {
  temperatureHasError: false,
  chlorineHasError: false,
  ufclHasError: false,
};

class SampleReportMeasureField extends Component<Props, State> {
  constructor() {
    super();
    this.state = initialState;
  }

  componentWillReceiveProps(newProps) {
    const { fieldId, sampleRangeForm } = newProps;
    const temperatureField = `${fieldId}Temperature`;
    const chlorineField = `${fieldId}ChlorineDioxide`;
    const ufclValueField = `${fieldId}Ufcl`;

    let newState = {
      temperatureHasError: !this.isValidNumericValue(
        sampleRangeForm[temperatureField],
      ),
      chlorineHasError: !this.isValidNumericValue(
        sampleRangeForm[chlorineField],
      ),
      ufclHasError: !this.isValidNumericValue(sampleRangeForm[ufclValueField]),
    };
    this.setState(newState);
  }

  isValidNumericValue = value => {
    // FIXME BBB sarebbe meglio convertire tutto a stringa nel container
    if (typeof value === 'number') return true;
    //undefined or null are also valid values
    return value ? value.match(/^-?\d*((?:\.|,)\d+)?$/) !== null : true;
  };

  render() {
    const {
      label,
      fieldId,
      sampleRangeForm,
      onChangeHandler,
      samplingValues,
      legionellaTypes,
      selectedWsp,
      isFieldEditable,
    } = this.props;
    const { temperatureHasError, ufclHasError, chlorineHasError } = this.state;
    const isVisible = selectedWsp ? selectedWsp[fieldId] : true;
    if (!isVisible) {
      return '';
    }
    // field ids
    const temperatureField = `${fieldId}Temperature`;
    const chlorineField = `${fieldId}ChlorineDioxide`;
    const legionellaSelectionField = `${fieldId}UfclSamplingSelection`;
    const ufclField = `${fieldId}Ufcl`;
    const ufclTypeField = `${fieldId}UfclType`;

    const ufclTypeValue = sampleRangeForm[ufclTypeField]
      ? sampleRangeForm[ufclTypeField]
      : '';
    let legionellaRangesElement = '';
    let legionellaTypesElement = '';
    const legionellaFormValue = sampleRangeForm[legionellaSelectionField];
    const hasLegionellaType = samplingValues
      ? samplingValues.edges.reduce((accumulator, { node }) => {
          if (accumulator) {
            return accumulator;
          }
          if (legionellaFormValue === node.id) {
            accumulator = node.hasLegionellaType;
          }
          return accumulator;
        }, false)
      : false;

    const errorMessage = (
      <p className="field-error">Controlla il numero inserito</p>
    );

    // disabled fields
    const ufclFieldDisabled = !hasLegionellaType || !isFieldEditable(ufclField);
    const ufclTypeFieldDisabled =
      !hasLegionellaType || !isFieldEditable(ufclTypeField);

    if (samplingValues) {
      legionellaRangesElement = samplingValues.edges.map(({ node }) => {
        return (
          <label
            key={`${fieldId}-${node.id}`}
            {...(hasLegionellaType ? { className: 'has-type' } : {})}
          >
            <input
              type="radio"
              name={legionellaSelectionField}
              value={node.id}
              {...(isFieldEditable(legionellaSelectionField)
                ? {}
                : { disabled: 'disabled' })}
              checked={sampleRangeForm[legionellaSelectionField] === node.id}
              onChange={event =>
                onChangeHandler({
                  [legionellaSelectionField]: event.target.value,
                })
              }
            />
            <div className="circle" />
            <span>{node.value} UFC/L</span>
            <div className="triangle" />
          </label>
        );
      });
    }
    if (legionellaTypes) {
      legionellaTypesElement = (
        <div
          className={`legionella-types${ufclFieldDisabled ? ' disabled' : ''}`}
        >
          {ufclHasError ? errorMessage : null}
          <div className="bacteria bacteria-input">
            <BacteriaIcon />
            <input
              {...(ufclHasError ? { className: 'error' } : {})}
              name={ufclField}
              type="text"
              value={sampleRangeForm[ufclField] || ''}
              onChange={event =>
                onChangeHandler({
                  [ufclField]: event.target.value.replace(',', '.'),
                })
              }
              disabled={ufclFieldDisabled}
            />
            <span>UFC/L</span>
          </div>
          <div className="bacteria bacteria-select">
            <BacteriaIcon />
            <Select
              name={ufclTypeField}
              value={ufclTypeValue}
              options={legionellaTypes.edges.map(({ node }) => ({
                value: node.id,
                label: node.value,
              }))}
              clearable={false}
              onChange={option =>
                onChangeHandler({
                  [ufclTypeField]: option.value,
                })
              }
              placeholder="Seleziona il tipo"
              disabled={ufclTypeFieldDisabled}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        className={`Report${
          fieldId.slice(0, 3) === 'hot' ? ' HotWater' : ' ColdWater'
        }`}
      >
        <div className="header">
          <div className="Code">{`${fieldId.slice(0, 3) === 'hot' ? 'C' : 'F'}${
            selectedWsp ? selectedWsp.code : ''
          }${fieldId.slice(fieldId.length - 4) === 'Flow' ? '-S' : ''}`}</div>
          <div className="Water">{label}</div>
        </div>
        <div className="first-row">
          <div
            className={`Degrees ${
              isFieldEditable(temperatureField) ? '' : 'disabled'
            }`}
          >
            <label>
              <p>Temperatura</p>
              <div>
                <TempIcon />
                <input
                  {...(temperatureHasError ? { className: 'error' } : {})}
                  name={temperatureField}
                  type="text"
                  value={sampleRangeForm[temperatureField] || ''}
                  onChange={event =>
                    onChangeHandler({
                      [temperatureField]: event.target.value.replace(',', '.'),
                    })
                  }
                  disabled={!isFieldEditable(temperatureField)}
                />
                <span>°C</span>
              </div>
              {temperatureHasError ? errorMessage : null}
            </label>
          </div>
          <div
            className={`ChlorineDioxide ${
              isFieldEditable(chlorineField) ? '' : 'disabled'
            }`}
          >
            <label>
              <p>Biossido di cloro</p>
              <div>
                <MoleculeIcon />
                <input
                  {...(chlorineHasError ? { className: 'error' } : {})}
                  name={chlorineField}
                  type="text"
                  disabled={!isFieldEditable(chlorineField)}
                  value={sampleRangeForm[chlorineField] || ''}
                  onChange={event =>
                    onChangeHandler({
                      [chlorineField]: event.target.value.replace(',', '.'),
                    })
                  }
                />
                <span>mg/L</span>
              </div>
              {chlorineHasError ? errorMessage : null}
            </label>
          </div>
        </div>
        <div className="second-row">
          <div className="UFC">
            <p>Legionella</p>
            <div
              className={`ranges ${hasLegionellaType ? 'has-type' : ''} ${
                isFieldEditable(legionellaSelectionField) ? '' : 'disabled'
              }`}
            >
              {legionellaRangesElement}
            </div>
            {legionellaTypesElement}
          </div>
        </div>
      </div>
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
)(SampleReportMeasureField);
