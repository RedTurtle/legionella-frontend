import gql from 'graphql-tag';

export const ChartsQuery = gql`
  query(
    $structType: String
    $structId: ID
    $startDate: String!
    $endDate: String!
  ) {
    chart(
      startDate: $startDate
      endDate: $endDate
      structType: $structType
      structId: $structId
    ) {
      coldChart {
        ranges {
          perfect
          good
          bad
          danger
          critical
        }
        totalCount
        wspsPercentage
      }
      hotChart {
        ranges {
          perfect
          good
          bad
          danger
          critical
        }
        totalCount
        wspsPercentage
      }
    }
  }
`;
