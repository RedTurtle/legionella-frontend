import gql from 'graphql-tag';

const userFragments = {
  details: gql`
    fragment UserDetails on User {
      id
      username
      firstName
      lastName
      roles
    }
  `,
};

export default userFragments;
