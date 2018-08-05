import gql from 'graphql-tag';

export const CreateReportMutation = gql`
  mutation CreateReportMutation($input: CreateReportInput!) {
    createReport(input: $input) {
      report {
        id
      }
    }
  }
`;

export const UpdateReportMutation = gql`
  mutation UpdateReportMutation($input: UpdateReportInput!) {
    updateReport(input: $input) {
      report {
        id
      }
    }
  }
`;

export const DeleteReportMutation = gql`
  mutation DeleteReportMutation($input: DeleteReportInput!) {
    deleteReport(input: $input) {
      ok
    }
  }
`;
