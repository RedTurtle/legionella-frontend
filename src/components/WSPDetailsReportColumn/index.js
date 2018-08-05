// @flow
import * as React from 'react';

type Props = {
  typeId: string,
  worstState: string,
  report: any,
  samplingSelections: any,
};

const WSPDetailsReportColumn = (props: Props) => {
  const { typeId, worstState, report, samplingSelections } = props;
  const temperature = !report[`${typeId}Temperature`] ? null : (
    <p className={`alert-level ${report[`${typeId}TemperatureAlertLevel`]}`}>
      {report[`${typeId}Temperature`]} °C
    </p>
  );
  const ufcl = !samplingSelections[typeId] ? null : (
    <p className={`alert-level ${report[`${typeId}UfclAlertLevel`]}`}>
      {samplingSelections[typeId] === '> 100'
        ? report[`${typeId}Ufcl`]
        : samplingSelections[typeId]}
      UFC/L
    </p>
  );
  const chlorineDioxide = !report[`${typeId}ChlorineDioxide`] ? null : (
    <p
      className={`alert-level ${report[`${typeId}ChlorineDioxideAlertLevel`]}`}
    >
      {report[`${typeId}ChlorineDioxide`]} mg/L
    </p>
  );
  return (
    <div className={`table-cell value ${typeId}`}>
      {temperature || ufcl || chlorineDioxide ? (
        <div className={`state-bar ${worstState}`}>
          {temperature}
          {ufcl}
          {chlorineDioxide}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default WSPDetailsReportColumn;
