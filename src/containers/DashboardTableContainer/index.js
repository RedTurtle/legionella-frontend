// @flow
import './styles.css';

import React, { Component } from 'react';
import { object } from 'prop-types';

import AddSampleButton from '../../components/AddSampleButton';
import DashboardColumn from '../../components/DashboardColumn';
import SampleReportAggregatedEmpty from '../../components/SampleReportAggregatedEmpty';
import StructureRowContainer from '../StructureRowContainer';
import SampleRangeColumnContainer from '../SampleRangeColumnContainer';
import SampleRangeDetails from '../../components/SampleRangeDetails';
import Spinner from '../../components/Spinner';
import { graphql } from 'react-apollo';
import { AllStructuresQuery } from '../../graphql/queries/structures';

type Props = {
  loading: boolean,
  allStructure: object,
  allSampleranges: object,
  hasNextPage: boolean,
};

class DashboardTableContainer extends Component<Props> {
  render() {
    const { loading, allStructure, allSampleranges, hasNextPage } = this.props;
    if (loading) {
      return <Spinner />;
    }

    const structuresInfos =
      allStructure && allStructure.edges
        ? allStructure.edges.reduce(
            (accumulator, node, idx) => {
              const structure = node.node;
              accumulator.ids.push(structure.id);
              accumulator.rows.push(
                <StructureRowContainer key={idx} structureData={structure} />,
              );
              return accumulator;
            },
            {
              ids: [],
              rows: [],
            },
          )
        : null;
    return (
      <div className="dashboard-table">
        <DashboardColumn className="structures-column">
          <AddSampleButton />
          {structuresInfos ? structuresInfos.rows : null}
        </DashboardColumn>
        <div className="sliding-columns">
          {allSampleranges && allSampleranges.edges.length ? (
            allSampleranges.edges.map((sampleRange, idx) => {
              return (
                <SampleRangeColumnContainer
                  key={idx}
                  sampleRange={sampleRange.node}
                  structureIds={structuresInfos ? structuresInfos.ids : []}
                />
              );
            })
          ) : (
            <div className="no-sample-ranges">
              Nessun intervallo di campionamento presente.
            </div>
          )}
          {hasNextPage && (
            <DashboardColumn className="fake-column">
              <SampleRangeDetails
                id=""
                description=""
                title=""
                company=""
                changeMenuType={data => {}}
                userRoles={[]}
                freezeDate=""
                finalBlock
                tecnicoBlock
                managerBlock
              />
              {structuresInfos
                ? structuresInfos.ids.map(id => (
                    <SampleReportAggregatedEmpty
                      key={id}
                      structureId={id}
                      sampleRange={{ finalBlock: true }}
                    />
                  ))
                : null}
            </DashboardColumn>
          )}
        </div>
      </div>
    );
  }
}

// export default DashboardTableContainer;

export default graphql(AllStructuresQuery, {
  // $FlowFixMe
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, allStructure } }) => ({
    loading,
    allStructure,
  }),
})(DashboardTableContainer);
