import { gql } from '@apollo/client';

export default gql`
  query MySensors {
    mySensors {
      id
      name
      unit
      minReading
      maxReading
      averageReading
      readingsCount
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
