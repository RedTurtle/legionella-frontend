import gql from 'graphql-tag';
import sampleRangeFragments from '../fragments/sampleRange';

export const DashboardQuery = gql`
  query($cursor: String) {
    allSampleranges(first: 2, after: $cursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...SampleRangeInfos
          reportsFreeze
        }
      }
    }
    firstSampleRange: allSampleranges(first: 1) {
      edges {
        cursor
      }
    }
    lastSampleRange: allSampleranges(last: 1) {
      edges {
        cursor
      }
    }
  }
  ${sampleRangeFragments.sampleRangeInfos}
`;

export const PrevSampleRangesQuery = gql`
  query($cursor: String) {
    allSampleranges(first: 2, before: $cursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...SampleRangeInfos
        }
      }
    }
  }
  ${sampleRangeFragments.sampleRangeInfos}
`;

export const SampleRangeDetailsQuery = gql`
  query($id: ID!) {
    sampleRange(id: $id) {
      ...SampleRangeDetails
    }
  }
  ${sampleRangeFragments.sampleRangeDetails}
`;

export const SampleRangeFilesQuery = gql`
  query($id: ID!) {
    sampleRange(id: $id) {
      documentSet {
        edges {
          node {
            id
            description
            fileUrl
            documentSizeHuman
          }
        }
      }
    }
  }
`;
