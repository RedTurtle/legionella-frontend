import gql from 'graphql-tag';
import RangeLegionellaSettingsFormContainer from '../../containers/RangeLegionellaSettingsFormContainer';

export const AllRangesQuery = gql`
  query {
    allRanges(flag: true) {
      edges {
        node {
          ...RangeDetails
        }
      }
    }
  }
  ${RangeLegionellaSettingsFormContainer.fragments.range}
`;
