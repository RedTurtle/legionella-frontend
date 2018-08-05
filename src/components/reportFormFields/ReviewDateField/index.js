// @flow
import React from 'react';
import Select from 'react-select';
import CalendarIcon from '../../CalendarComponents/CalendarIcon';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fieldWithPermissions } from '../../../hocs/fields';
import moment from 'moment';

type Props = {
  isFieldEditable: any,
  value: any,
  options: Array<any>,
  onHandleChange: any,
};

const ReviewDateField = ({
  isFieldEditable,
  value,
  options,
  onHandleChange,
}: Props) => {
  const isEditable = isFieldEditable('reviewDate');
  const next12Months = Array.from(Array(12).keys()).map(id => {
    const date = moment().add(id, 'months');
    return {
      value: date.format('YYYY-MM-DD'),
      label: date.format('MMMM Y'),
    };
  });
  return (
    <div className="Field follow-up">
      <h3 className="FieldName">Follow-up</h3>
      <span className="FieldDescription">WSP da rivedere nel mese di</span>
      <div className="Calendar">
        <CalendarIcon />
        <Select
          name="reviewDate"
          placeholder="Seleziona il mese"
          value={value}
          disabled={!isEditable}
          options={next12Months}
          clearable={false}
          onChange={option =>
            onHandleChange({
              options: next12Months,
              selectedOption: option,
              fieldName: 'reviewDate',
            })
          }
        />
      </div>
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
)(ReviewDateField);
