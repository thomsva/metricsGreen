import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($password: String!, $nickname: String!) {
    login(password: $password, nickname: $nickname)
  }
`;
