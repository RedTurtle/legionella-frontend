import gql from 'graphql-tag';
import reportFragments from '../fragments/report';
import wspFragments from '../fragments/wsp';

export const AllStructuresQuery = gql`
  query {
    allStructure {
      edges {
        node {
          id
          label
          aggregatedWsps
          aggregatedSamplesHot
          aggregatedSamplesCold
          structType {
            value
          }
          alertLevel {
            alCold {
              perfect
              good
              bad
              danger
              critical
            }
            alHot {
              perfect
              good
              bad
              danger
              critical
            }
          }
          wspSet {
            edges {
              node {
                ...WSPDetails
              }
            }
          }
        }
      }
    }
  }
  ${wspFragments.details}
`;

export const SimpleAllStructuresQuery = gql`
  query {
    allStructure {
      edges {
        node {
          id
          structureType
          label
        }
      }
    }
  }
`;

export const ExpandedSampleRowContainerQuery = gql`
  query($id: ID!) {
    structure(id: $id) {
      wspSet {
        edges {
          node {
            id
            code
            reportSet {
              edges {
                node {
                  ...ReportDetails
                }
              }
            }
          }
        }
      }
    }
  }
  ${reportFragments.reportDetails}
`;

export const ExpandedSampleRowEmptyContainerQuery = gql`
  query($id: ID!) {
    structure(id: $id) {
      wspSet {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
