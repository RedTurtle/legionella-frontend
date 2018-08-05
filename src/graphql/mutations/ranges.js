import gql from 'graphql-tag';

export const CreateRangeLegionellaSettingsMutation = gql`
  mutation CreateRangeLegionellaSettingsMutation($input: CreateRangeInput!) {
    createRange(input: $input) {
      ok
    }
  }
`;

export const UpdateRangeLegionellaSettingsMutation = gql`
  mutation UpdateRange($input: UpdateRangeInput!) {
    updateRange(input: $input) {
      ok
    }
  }
`;

// const DeleteRangeLegionellaSettingsMutation = gql`
//   mutation DeleteRangeLegionellaSettingsMutation($input: DeleteRangeLegionellaSettingsInput!) {
//     deleteSamplerange(input: $input) {
//       ok
//     }
//   }
// `;
