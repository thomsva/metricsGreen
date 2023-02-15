import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($password: String!, $nickname: String!) {
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

export const REGISTER = gql`
  mutation Register($data: NewUserInput!) {
    register(data: $data) {
      id
      nickname
      email
      password
      role
    }
  }
`;

// export const CREATE_COURSE = gql`
//   mutation createCourse($data: CourseInput!) {
//     createCourse(data: $data) {
//       id
//       maxGroupSize
//       minGroupSize
//       title
//       description
//       code
//       deadline
//       published
//       groupsPublished
//       teachers {
//         id
//       }
//     }
//   }
// `;
