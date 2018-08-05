import gql from 'graphql-tag';
import userFragments from '../fragments/user';

export const UserQuery = gql`
  query {
    user {
      ...UserDetails
    }
  }
  ${userFragments.details}
`;
