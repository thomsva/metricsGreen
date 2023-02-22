import { gql } from '@apollo/client';

export default gql`
  mutation Login($password: String!, $nickname: String!) {
    login(password: $password, nickname: $nickname)
  }
`;
