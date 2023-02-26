import { gql } from '@apollo/client';

export default gql`
  mutation Mutation($data: updateDeviceInput!) {
    updateDevice(data: $data) {
      name
      description
      location
    }
  }
`;
