// @flow
import * as React from 'react';
import Select from 'react-select';
import CalendarIcon from '../../CalendarComponents/CalendarIcon';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fieldWithPermissions } from '../../../hocs/fields';

type Props = {
  isFieldEditable: any,
  value: any,
  options: Array<any>,
  onHandleChange: any,
  handleBlur: () => void,
  disabled: boolean,
  required: boolean,
  error: React.Node,
};

const SampleRangeField = ({
  isFieldEditable,
  value,
  options,
  onHandleChange,
  handleBlur,
  disabled,
  required = false,
  error,
}: Props) => {
  const isEditable = isFieldEditable('sampleRange') && !disabled;
  return (
    <div
      className={`Field ${required ? 'required' : ''}`}
      id="sampling-interval"
    >
      <h3 className="FieldName">
        Campionamento{required && (
          <span title="Campo obbligatorio" className="required-label" />
        )}
      </h3>
      <span className="FieldDescription">
        {isEditable
          ? 'Seleziona un intervallo di campionamento'
          : 'Intervallo di campionamento'}
      </span>
      {error ? <div className="error-message">{error}</div> : null}

      {isEditable ? (
        <div className="Calendar">
          <CalendarIcon />
          <Select
            name="sampleRange"
            placeholder="Seleziona un intervallo"
            value={value}
            options={options}
            clearable={false}
            onChange={onHandleChange}
            onBlur={handleBlur}
          />
        </div>
      ) : (
        <span>
          {options.reduce((label, option) => {
            if (label) {
              return label;
            }
            return option.value === value ? option.label : label;
          }, '')}
        </span>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  restrictedFields: state.sampleRangeForm.restrictedFields,
  visibleFields: state.sampleRangeForm.visibleFields,
});

const actionMethods = {};

export default compose(
  connect(mapStateToProps, actionMethods),
  fieldWithPermissions,
)(SampleRangeField);
