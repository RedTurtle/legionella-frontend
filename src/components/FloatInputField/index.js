// @flow
import React from 'react';
import './styles.css';

type Props = {
  value: string,
  cssClass: string,
  label: string,
  index: string,
  fieldId: string,
  handleChange: ({ index: string, fieldId: string, value: string }) => void,
  hasError: boolean,
};

const FloatInputField = (props: Props) => {
  const {
    cssClass,
    label,
    fieldId,
    value,
    index,
    handleChange,
    hasError,
  } = props;
  return (
    <div className={hasError ? `${cssClass} error` : cssClass}>
      <label>
        <span>{label}</span>
        <input
          type="text"
          name={fieldId}
          value={value}
          onChange={e => {
            handleChange({
              index,
              fieldId,
              value: e.target.value.replace(',', '.'),
              label,
            });
          }}
        />
      </label>
    </div>
  );
};

export default FloatInputField;
