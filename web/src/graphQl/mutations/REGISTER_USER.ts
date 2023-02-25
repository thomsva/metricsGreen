import { gql } from '@apollo/client';

export default gql`
  mutation Register($data: NewUserInput!) {
    register(data: $data) {
      id
      username
      email
      password
      role
    }
  }
`;
