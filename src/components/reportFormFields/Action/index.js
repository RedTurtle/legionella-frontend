// @flow
import React from 'react';
import Select from 'react-select';

type Props = {
  action: $FlowFixMe,
  index: number,
  onUpdateAction: any,
  isEditable: boolean,
};

const Action = ({ action, index, onUpdateAction, isEditable }: Props) => (
  <div className="SamplingActionField">
    <label>
      <input
        type="checkbox"
        name={`sampling_actions_${index}`}
        checked={action.value}
        {...(isEditable ? {} : { disabled: 'disabled' })}
        onChange={() => {
          onUpdateAction({ ...action, value: !action.value });
        }}
      />
      <span>
        <strong>{index + 1}.</strong> {action.label}
      </span>
    </label>
    {action.children.length > 0 ? (
      <Select
        name={`sampling_subactions_${index}`}
        value={action.selectedChildren}
        disabled={!isEditable || !action.value}
        options={action.children.map(subaction => {
          return { value: subaction, label: subaction };
        })}
        clearable={false}
        placeholder="Seleziona..."
        onChange={option =>
          onUpdateAction({ ...action, selectedChildren: option.value })
        }
      />
    ) : null}
  </div>
);

export default Action;
