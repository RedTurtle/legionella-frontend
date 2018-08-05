// @flow
import React from 'react';
import './styles.css';
import Select from 'react-select';

export type Props = {
  name: string,
  title: string,
  options: Array<{ value: string | number, label: string }>,
  value: string | number,
  onChange: ({ value: string }) => void,
};

const ChartFilter = ({ name, title, options, value, onChange }: Props) => (
  <div className="chart-filter">
    <label className={name}>
      <span>{title}</span>
      <Select
        clearable={false}
        {...{
          name,
          options,
          value,
          onChange,
        }}
      />
    </label>
  </div>
);

export default ChartFilter;
