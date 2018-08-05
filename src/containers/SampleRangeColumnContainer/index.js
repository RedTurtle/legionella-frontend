// @flow
import React, { Component } from 'react';
import DashboardColumn from '../../components/DashboardColumn';
import SampleRangeDetails from '../../components/SampleRangeDetails';
import SampleReportAggregatedEmpty from '../../components/SampleReportAggregatedEmpty';
import SampleReportAggregated from '../../components/SampleReportAggregated';
import { filter } from 'graphql-anywhere';
import sampleRangeFragments from '../../graphql/fragments/sampleRange';

type Props = {
  sampleRange: $FlowFixMe,
  structureIds: Array<string>,
};

class SampleRangeColumnContainer extends Component<Props> {
  render() {
    const { sampleRange, structureIds } = this.props;
    const aggregatedSamples = sampleRange
      ? sampleRange.structureAggregatedSamples
      : [];
    const reportContainers = structureIds.map((id, idx) => {
      // check if there is a samplerange for this structure id
      const record = aggregatedSamples.reduce((acc, aggregate) => {
        if (aggregate.structureGlobalId === id) {
          acc = aggregate;
        }
        return acc;
      }, null);
      return record !== null ? (
        <SampleReportAggregated
          key={idx}
          aggregatedData={record}
          sampleRangeId={sampleRange.id}
          reportsFreeze={sampleRange.reportsFreeze}
          freezeDate={sampleRange.freezeDate}
          sampleRange={sampleRange}
        />
      ) : (
        <SampleReportAggregatedEmpty
          key={idx}
          structureId={id}
          sampleRange={sampleRange}
        />
      );
    });
    return (
      <DashboardColumn>
        <SampleRangeDetails
          {...filter(sampleRangeFragments.sampleRangeDetails, sampleRange)}
        />
        {reportContainers}
      </DashboardColumn>
    );
  }
}

export default SampleRangeColumnContainer;
