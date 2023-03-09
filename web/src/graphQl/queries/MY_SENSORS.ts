import { gql } from '@apollo/client';

export default gql`
  query MySensors {
    mySensors {
      id
      name
      unit
      device {
        id
        name
      }
      readings {
        createdAt
        content
      }
    }
  }
`;
