// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ExpandedSampleRowEmptyContainer from '../../containers/ExpandedSampleRowEmptyContainer';
import EmptySampleSlot from '../EmptySampleSlot';

type Props = {
  structureId: string,
  openStructures: $FlowFixMe,
  sampleRange: $FlowFixMe,
};

class SampleReportAggregatedEmpty extends Component<Props> {
  render() {
    const { structureId = '', openStructures, sampleRange } = this.props;
    const isOpen =
      structureId.length > 0 && openStructures.indexOf(structureId) !== -1;
    const sampleRangeChildren = isOpen ? (
      <ExpandedSampleRowEmptyContainer
        structureId={structureId}
        sampleRange={sampleRange}
      />
    ) : (
      ''
    );

    return (
      <div className={`sample-report-aggregated${isOpen ? ' open' : ''}`}>
        <EmptySampleSlot highlighted={isOpen} />
        {sampleRangeChildren}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openStructures: state.structure.openStructures,
});

const actionMethods = {};

export default connect(mapStateToProps, actionMethods)(
  SampleReportAggregatedEmpty,
);
