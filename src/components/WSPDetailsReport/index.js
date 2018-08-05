// @flow
import * as React from 'react';
import WSPDetailsReportColumn from '../WSPDetailsReportColumn';

type Props = {
  report: $FlowFixMe,
};

const WSPDetailsReport = ({ report }: Props) => {
  const { worstStates, notesActionsJson = '' } = report;
  const types = ['cold', 'coldFlow', 'hot', 'hotFlow'];
  const notesActions =
    notesActionsJson.length > 0 ? JSON.parse(notesActionsJson) : [];
  const notesActionsRender = Array.isArray(notesActions)
    ? notesActions.map((category, categoryIndex) => (
        <div className="category" key={`category-${categoryIndex}`}>
          {/* <h4>{category.label}</h4> */}
          {category.actions.length || category.text.length ? (
            <div className="actions-wrapper">
              <ul>
                {category.actions
                  .filter(action => action.value)
                  .map((action, actionIndex) => (
                    <li className="action" key={`action-${actionIndex}`}>
                      {action.selectedChildren && action.selectedChildren.length
                        ? `${action.label}: ${action.selectedChildren}`
                        : action.label}
                    </li>
                  ))}
                <li className="action">{category.text}</li>
              </ul>
            </div>
          ) : (
            ''
          )}
        </div>
      ))
    : '';
  const samplingSelections = types.reduce((acc, typeId) => {
    const selection = report[`${typeId}UfclSamplingSelection`];
    return {
      ...acc,
      [typeId]: selection && selection.value,
    };
  }, {});

  return (
    <div className="table-row">
      <div className="table-cell state">
        <div className={`state-circle ${worstStates.absoluteWorstState}`} />
      </div>
      <div className="table-cell sample-cell">
        <div className="label">{report.sampleRange.title}</div>
        <div>{report.sampleRange.description}</div>
      </div>
      {types.map((typeId, idx) => {
        const capitalizedId = typeId.charAt(0).toUpperCase() + typeId.slice(1);
        const worstState = worstStates[`worstState${capitalizedId}`];
        return (
          <WSPDetailsReportColumn
            {...{ typeId, worstState, report, samplingSelections }}
            key={idx}
          />
        );
      })}
      <div className="table-cell actions">{notesActionsRender}</div>
    </div>
  );
};

export default WSPDetailsReport;
