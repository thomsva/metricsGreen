import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($password: String!, $nickname: String!) {
    login(password: $password, nickname: $nickname)
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      nickname
      email
      role
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      nickname
      email
      role
    }
  }
`;
