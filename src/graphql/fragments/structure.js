import gql from 'graphql-tag';
import wspFragments from '../fragments/wsp';

const structureFragments = {
  details: gql`
    fragment StructureDetails on Structure {
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
    ${wspFragments.details}
  `,
};

export default structureFragments;
