import * as React from 'react';
import './styles.css';
import DashboardControls from '../DashboardControls';
import DashboardTop from '../DashboardTop';
import DashboardTableContainer from '../../containers/DashboardTableContainer';
import { graphql } from 'react-apollo';
import ChartsContainer from '../../containers/ChartsContainer';
import {
  DashboardQuery,
  PrevSampleRangesQuery,
} from '../../graphql/queries/sampleRanges';

type Props = {
  loading: boolean,
  allSampleranges: object,
  loadNextEntries: $FlowFixMe,
  loadPrevEntries: $FlowFixMe,
  hasPrevPage: boolean,
  hasNextPage: boolean,
};

const Dashboard = (props: Props) => (
  <React.Fragment>
    <ChartsContainer />
    <div className="dashboard container">
      <div className="controls-wrapper">
        <DashboardControls
          loadNextEntries={props.loadNextEntries}
          loadPrevEntries={props.loadPrevEntries}
          hasPrevPage={props.hasPrevPage}
          hasNextPage={props.hasNextPage}
        />
      </div>
      <div className="top-wrapper">
        <DashboardTop />
      </div>
      <DashboardTableContainer {...props} />
    </div>
  </React.Fragment>
);

export default graphql(DashboardQuery, {
  // $FlowFixMe
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({
    data: {
      loading,
      allSampleranges,
      firstSampleRange,
      lastSampleRange,
      fetchMore,
    },
  }) => {
    const firstCursor =
      firstSampleRange && firstSampleRange.edges.length
        ? firstSampleRange.edges[0].cursor
        : '';
    const lastCursor =
      lastSampleRange && lastSampleRange.edges.length
        ? lastSampleRange.edges[0].cursor
        : '';
    const hasPrevPage =
      allSampleranges && allSampleranges.pageInfo.startCursor
        ? allSampleranges.pageInfo.startCursor !== firstCursor
        : false;
    const hasNextPage =
      allSampleranges && allSampleranges.pageInfo.endCursor
        ? allSampleranges.pageInfo.endCursor !== lastCursor
        : false;
    return {
      loading,
      allSampleranges,
      hasPrevPage,
      hasNextPage,
      loadNextEntries: () => {
        return fetchMore({
          variables: {
            cursor: allSampleranges.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allSampleranges.edges;
            const pageInfo = fetchMoreResult.allSampleranges.pageInfo;
            return newEdges.length
              ? {
                  allSampleranges: {
                    __typename: previousResult.allSampleranges.__typename,
                    edges: newEdges,
                    pageInfo,
                  },
                  hasPrevPage: pageInfo.startCursor
                    ? pageInfo.startCursor !== firstCursor
                    : false,
                  hasNextPage: pageInfo.endCursor
                    ? pageInfo.endCursor !== lastCursor
                    : false,
                }
              : previousResult;
          },
        });
      },
      loadPrevEntries: () => {
        return fetchMore({
          query: PrevSampleRangesQuery,
          variables: {
            cursor: allSampleranges.pageInfo.startCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allSampleranges.edges;
            const pageInfo = fetchMoreResult.allSampleranges.pageInfo;
            return newEdges.length
              ? {
                  // Put the new comments at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  allSampleranges: {
                    __typename: previousResult.allSampleranges.__typename,
                    edges: newEdges,
                    pageInfo,
                  },
                  hasPrevPage: pageInfo.startCursor
                    ? pageInfo.startCursor !== firstCursor
                    : false,
                  hasNextPage: pageInfo.endCursor
                    ? pageInfo.endCursor !== lastCursor
                    : false,
                }
              : previousResult;
          },
        });
      },
    };
  },
})(Dashboard);
