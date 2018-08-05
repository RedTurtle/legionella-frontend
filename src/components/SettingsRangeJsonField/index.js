// @flow
import React from 'react';
import Select from 'react-select';
import './styles.css';
// import DragHandle from '../DragHandle';
import FloatInputField from '../FloatInputField';
import FaTrash from 'react-icons/lib/fa/trash';

export type Props = {
  to: string,
  from: string,
  level: string,
  priority: string,
  indexValue: number,
  errors: {
    to: string | null,
    from: string | null,
  },
  handleChange: ({ index: string, fieldId: string, value: string }) => void,
  handleRemoveVoice: ({ index: string }) => void,
};

const SettingsRangeJsonField = (props: Props) => {
  const {
    to,
    from,
    level,
    indexValue,
    handleChange,
    handleRemoveVoice,
    errors,
  } = props;
  const levelOptions = [
    { value: 'critical', label: 'critical', className: 'critical' },
    { value: 'danger', label: 'danger', className: 'danger' },
    { value: 'bad', label: 'bad', className: 'bad' },
    { value: 'good', label: 'good', className: 'good' },
    { value: 'perfect', label: 'perfect', className: 'perfect' },
  ];

  const errorsWrapper =
    errors.to || errors.from ? (
      <div className="field-errors">
        {errors.to ? <div>{errors.to}</div> : null}
        {errors.from ? <div>{errors.from}</div> : null}
      </div>
    ) : null;
  return (
    <div className="json-field">
      <div className="field-wrapper">
        {/* <DragHandle /> */}
        <FloatInputField
          cssClass="field-from"
          label="Da"
          fieldId="from"
          value={from}
          hasError={errors.from !== null}
          index={indexValue.toString()}
          handleChange={handleChange}
        />
        <FloatInputField
          cssClass="field-to"
          label="a"
          fieldId="to"
          value={to}
          hasError={errors.to !== null}
          index={indexValue.toString()}
          handleChange={handleChange}
        />
        <div className="field-level">
          <label>
            <span>Liv.</span>
            <Select
              name="level"
              value={level}
              options={levelOptions}
              clearable={false}
              placeholder="Seleziona..."
              onChange={option =>
                handleChange({
                  index: indexValue.toString(),
                  fieldId: 'level',
                  value: option.value,
                  priority: levelOptions.reduce(
                    (accumulator, optionEntry, index) => {
                      if (accumulator) {
                        return accumulator;
                      }
                      return optionEntry.value === option.value
                        ? index
                        : accumulator;
                    },
                    null,
                  ),
                })
              }
            />
          </label>
        </div>
        <button
          type="button"
          className="remove-range-item"
          title="Rimuovi riga"
          onClick={() => handleRemoveVoice({ index: indexValue })}
        >
          <FaTrash />
        </button>
      </div>
      {errorsWrapper}
    </div>
  );
};

export default SettingsRangeJsonField;
