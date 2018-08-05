// @flow
import * as React from 'react';
import { Component } from 'react';
import './styles.css';
import { connect } from 'react-redux';
import ExpandedSampleRowContainer from '../../containers/ExpandedSampleRowContainer';
import SampleReportAggregatedTower from '../SampleReportAggregatedTower';
import SampleReportAggregatedGeneric from '../SampleReportAggregatedGeneric';

type Props = {
  aggregatedData: $FlowFixMe,
  sampleRangeId: string,
  openStructures: Array<string>,
  reportsFreeze: string,
  freezeDate: any,
  sampleRange: $FlowFixMe,
};

class SampleReportAggregated extends Component<Props> {
  render() {
    const {
      aggregatedData,
      sampleRangeId,
      openStructures,
      reportsFreeze,
      freezeDate,
      sampleRange,
    } = this.props;
    const { structureType } = aggregatedData;
    const isOpen =
      aggregatedData.structureGlobalId &&
      openStructures.indexOf(aggregatedData.structureGlobalId) !== -1;

    const sampleRangeChildren = isOpen ? (
      <ExpandedSampleRowContainer
        graphqlSampleRangeId={sampleRangeId}
        sampleRange={sampleRange}
        graphqlStructureId={aggregatedData.structureGlobalId}
        reportsFreeze={freezeDate ? JSON.parse(reportsFreeze) : []}
      />
    ) : (
      ''
    );

    const aggregatedElement =
      // structureType === 'torre' ? (
      structureType === 'torre' ? (
        <SampleReportAggregatedTower {...this.props} />
      ) : (
        <SampleReportAggregatedGeneric {...this.props} />
      );
    return (
      <div className={`sample-report-aggregated${isOpen ? ' open' : ''}`}>
        {aggregatedElement}
        {sampleRangeChildren}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openStructures: state.structure.openStructures,
});

const actionMethods = {};

export default connect(mapStateToProps, actionMethods)(SampleReportAggregated);
