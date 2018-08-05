// @flow
import React from 'react';
import './styles.css';
import { RadialChart } from 'react-vis';

export type Props = {
  className: string,
  title: string,
  ranges: {
    perfect: number,
    good: number,
    bad: number,
    danger: number,
    critical: number,
  },
  totalCount: number,
  wspsPercentage: number,
};

const Chart = (props: Props) => {
  const { className, title, ranges, totalCount, wspsPercentage } = props;
  const rangeKeys = Object.keys(ranges).filter(key => ranges[key] > 0);
  return (
    <div className={`chart ${className}`}>
      <div className="chart-content">
        <div className="first-row">
          <RadialChart
            innerRadius={40}
            radius={90}
            data={
              rangeKeys.length
                ? rangeKeys.map(key => ({
                    angle: ranges[key],
                    className: `range-${key}`,
                  }))
                : [{ angle: 1, className: 'range-empty' }]
            }
            width={220}
            height={200}
            style={{ stroke: null, fill: null }}
          />
          <span className="total-count">
            <strong>{totalCount}</strong> camp.
          </span>
          <div className="quantities">
            {rangeKeys.length ? (
              rangeKeys.map(key => (
                <p key={key}>
                  <span className={`range-${key}`} />
                  <strong>{ranges[key]}</strong> campionamenti ({(
                    ranges[key] *
                    100 /
                    totalCount
                  ).toFixed(0)}%)
                </p>
              ))
            ) : (
              <p>
                <span className="range-empty" />
                <strong>0</strong> campionamenti
              </p>
            )}
          </div>
        </div>
        <div className="chart-title">
          <p>
            <span>{title}</span>
          </p>
          <p>{wspsPercentage}% dei WSP</p>
        </div>
      </div>
    </div>
  );
};

Chart.defaultProps = {
  className: '',
};

export default Chart;
