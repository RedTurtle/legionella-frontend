import gql from 'graphql-tag';
import wspFragments from '../fragments/wsp';

export const ReportFormQuery = gql`
  query {
    allSampleranges {
      edges {
        node {
          id
          title
          tecnicoBlock
          managerBlock
          finalBlock
          reportSet {
            edges {
              cursor
              node {
                wsp {
                  id
                }
              }
            }
          }
        }
      }
    }
    allStructure {
      edges {
        node {
          id
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
    samplingValues: settings(settingType: "sampling_value") {
      edges {
        node {
          id
          value
          settingType
          hasLegionellaType
        }
      }
    }
    legionellaTypes: settings(settingType: "legionella") {
      edges {
        node {
          id
          value
          settingType
        }
      }
    }
    actions: settings(settingType: "noteaction") {
      edges {
        node {
          id
          value
          notesActionsJson
        }
      }
    }
    fields: settings(settingType: "field_permission") {
      edges {
        node {
          id
          value
          owner {
            name
          }
        }
      }
    }
  }
  ${wspFragments.details}
`;
