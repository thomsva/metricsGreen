import { gql } from '@apollo/client';

export default gql`
  mutation CreateSensor($data: CreateSensorInput!) {
    createSensor(data: $data) {
      id
      name
      unit
    }
  }
`;
