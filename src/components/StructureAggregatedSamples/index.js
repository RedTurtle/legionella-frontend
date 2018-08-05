// @flow
import './index.css';
import * as React from 'react';
import type { AlertLevels } from '../../helpers/types.js.flow';

type Props = {
  type: 'cold' | 'hot',
  structType: 'ingresso' | 'sottocentrale' | 'torre',
  counter: number,
  data: AlertLevels,
  label: string,
};

const StructureAggregatedSamples = ({
  type,
  counter,
  structType,
  data,
  label,
}: Props) => {
  const keys = [
    ...(structType !== 'torre' ? ['perfect'] : []),
    'good',
    'bad',
    'danger',
    ...(structType === 'torre' ? ['critical'] : []),
  ];
  let aggregatedData = '';

  if (data) {
    aggregatedData = (
      <div className={`aggregated-data ${type}`}>
        {keys.reduce((alerts, key) => {
          const alertValue = data[key];
          if (alertValue === undefined) {
            return alerts;
          }
          const alertClass = `alert alert-${key}`;
          const alertItem = (
            <div key={key} className={alertClass}>
              <svg height="44" width="44">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="#E7E7E7"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  className="colored"
                  cx="22"
                  cy="22"
                  r="18"
                  transform="rotate(-90 22 22)"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={`${0.36 * 3.14 * alertValue}, ${36 * 3.15}`}
                />
              </svg>
              <span>{alertValue}%</span>
            </div>
          );
          alerts.push(alertItem);
          return alerts;
        }, [])}
      </div>
    );
  }

  return (
    <div className="aggregated-sample">
      <div className={`sample-label ${type}`}>
        <span>{label}</span>
        <div className="samples-counter">
          <strong>
            <span>{counter}</span> camp.
          </strong>{' '}
          previsti
        </div>
      </div>
      {aggregatedData}
    </div>
  );
};

export default StructureAggregatedSamples;
