import gql from 'graphql-tag';

export const SettingsQuery = gql`
  query($settingType: String!, $orderBy: String) {
    settings(settingType: $settingType, orderBy: $orderBy) {
      edges {
        node {
          id
          value
          description
          position
        }
      }
    }
  }
`;

export const SettingDetailsQuery = gql`
  query($id: ID!) {
    setting(id: $id) {
      id
      value
      description
      notesActionsJson
    }
  }
`;
