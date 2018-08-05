import gql from 'graphql-tag';
import reportFragments from '../fragments/report';
import wspFragments from '../fragments/wsp';

export const WspDetailsQuery = gql`
  query($id: ID!) {
    wsp(id: $id) {
      ...WSPDetails
      reportSet {
        edges {
          node {
            ...ReportDetails
            worstStates {
              worstStateCold
              worstStateHot
              worstStateColdFlow
              worstStateHotFlow
              absoluteWorstState
            }
          }
        }
      }
    }
  }
  ${wspFragments.details}
  ${reportFragments.reportDetails}
`;

export const WspListQuery = gql`
  query WSPList($id: ID!) {
    structure(id: $id) {
      wspSet {
        edges {
          node {
            ...WSPDetails
          }
        }
      }
    }
  }
  ${wspFragments.details}
`;
