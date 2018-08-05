// @flow
import React from 'react';
import './styles.css';
// import DateRangeWrapper from '../DateRangeWrapper';
import PrevNextButton from '../PrevNextButton';
import XlsIcon from '../icons/XlsIcon';

type Props = {
  loadNextEntries: $FlowFixMe,
  loadPrevEntries: $FlowFixMe,
  hasPrevPage: boolean,
  hasNextPage: boolean,
};

const DashboardControls = ({
  loadNextEntries,
  loadPrevEntries,
  hasPrevPage,
  hasNextPage,
}: Props) => {
  const baseUrl =
    process && process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : '';
  const downloadUrl = `${baseUrl}/graphqlapp/download`;
  return (
    <div className="dashboard-controls">
      <div className="left-block">
        {/* <DateRangeWrapper /> */}
        <div className="db-export">
          <a className="export-link" href={downloadUrl}>
            <XlsIcon />
            <span>Esporta tutto in XLS</span>
          </a>
        </div>
      </div>
      <div className="right-block">
        <PrevNextButton
          direction="prev"
          {...(!hasPrevPage ? { disabled: true } : {})}
          onClick={loadPrevEntries}
        />
        <PrevNextButton
          direction="next"
          {...(!hasNextPage ? { disabled: true } : {})}
          onClick={loadNextEntries}
        />
      </div>
    </div>
  );
};

export default DashboardControls;
