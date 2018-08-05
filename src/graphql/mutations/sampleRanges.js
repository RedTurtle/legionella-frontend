import gql from 'graphql-tag';

export const CreateSampleRangeMutation = gql`
  mutation CreateSampleRangeMutation($input: CreateSampleRangeInput!) {
    createSamplerange(input: $input) {
      samplerange {
        id
      }
    }
  }
`;

export const UpdateSampleRangeMutation = gql`
  mutation UpdateSampleRangeMutation($input: UpdateSampleRangeInput!) {
    updateSamplerange(input: $input) {
      sampleRange {
        id
      }
    }
  }
`;

export const DeleteSampleRangeMutation = gql`
  mutation DeleteSampleRangeMutation($input: DeleteSampleRangeInput!) {
    deleteSamplerange(input: $input) {
      ok
    }
  }
`;

export const DeleteDocumentMutation = gql`
  mutation DeleteDocumentMutation($input: DeleteDocumentInput!) {
    deleteFile(input: $input) {
      ok
    }
  }
`;
