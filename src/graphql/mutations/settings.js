import gql from 'graphql-tag';

export const CreateSettingMutation = gql`
  mutation CreateSettingMutation($input: CreateSettingInput!) {
    createSettings(input: $input) {
      ok
    }
  }
`;

export const UpdateSettingMutation = gql`
  mutation UpdateSettingMutation($input: UpdateSettingInput!) {
    updateSetting(input: $input) {
      ok
    }
  }
`;

export const DeleteSettingMutation = gql`
  mutation DeleteSettingMutation($input: DeleteSettingInput!) {
    deleteSetting(input: $input) {
      ok
    }
  }
`;
