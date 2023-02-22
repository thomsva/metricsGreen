import { gql } from '@apollo/client';

export default gql`
  mutation Mutation($data: AddDeviceInput!) {
    createDevice(data: $data) {
      name
      type
      description
      location
    }
  }
`;
