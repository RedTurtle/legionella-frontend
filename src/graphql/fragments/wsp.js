import gql from 'graphql-tag';

const wspFragments = {
  details: gql`
    fragment WSPDetails on Wsp {
      id
      code
      cold
      coldFlow
      hot
      hotFlow
      description
      operativeStatus
      startDate
      obsolenceDate
      riskLevel {
        value
        description
        position
      }
      structure {
        label
      }
      building {
        label
      }
      description
      code
      floor {
        label
      }
      nextReviewDate
      alertLevel
      sector {
        edges {
          node {
            label
            description
          }
        }
      }
    }
  `,
};

export default wspFragments;
