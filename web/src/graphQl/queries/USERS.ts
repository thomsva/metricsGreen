import { gql } from '@apollo/client';

export default gql`
  query Users {
    users {
      id
      nickname
      email
      role
    }
  }
`;
