import { gql } from '@apollo/client';

export default gql`
  mutation UpdateDevice($data: UpdateDeviceInput!) {
    updateDevice(data: $data) {
      name
      description
      location
    }
  }
`;
