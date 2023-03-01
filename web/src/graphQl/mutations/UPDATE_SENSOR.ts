import { gql } from '@apollo/client';

export default gql`
  mutation UpdateSensor($data: UpdateSensorInput!) {
    updateSensor(data: $data) {
      id
      name
      unit
      device {
        id
        name
      }
    }
  }
`;
