// @flow
import React, { Component } from 'react';

import WSPDetailsReport from '../../components/WSPDetailsReport';

type Props = {
  report: $FlowFixMe,
};

class WSPDetailsReportContainer extends Component<Props> {
  getRightReportInfos = () => {
    const { report } = this.props;
    if (
      !report.sampleRange.finalBlock &&
      report.sampleRange.reportsFreeze === '{}'
    ) {
      // not freezed
      return report;
    }
    //BBB: #freezehack. Get freeze report with its data, and add sampleRange infos
    const { reportsFreeze, ...sampleRangeInfos } = report.sampleRange;
    const freezeReport = JSON.parse(reportsFreeze).reduce(
      (reportData, reportNode) => {
        if (reportData) {
          return reportData;
        }
        return reportNode.wsp.code === report.wsp.code ? reportNode : null;
      },
      null,
    );
    if (freezeReport) {
      freezeReport.sampleRange = sampleRangeInfos;
    }
    return freezeReport;
  };

  render() {
    return <WSPDetailsReport report={this.getRightReportInfos()} />;
  }
}

export default WSPDetailsReportContainer;
