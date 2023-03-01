import { gql } from '@apollo/client';

export default gql`
  mutation CreateSensor($name: String!, $deviceId: String!) {
    createSensor(name: $name, deviceId: $deviceId) {
      id
      name
      unit
    }
  }
`;
