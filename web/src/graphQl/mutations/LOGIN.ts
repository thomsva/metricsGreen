import { gql } from '@apollo/client';

export default gql`
  mutation Login($password: String!, $username: String!) {
    login(password: $password, username: $username)
  }
`;
