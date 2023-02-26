import { gql } from '@apollo/client';

export default gql`
  mutation Mutation($data: createDeviceInput!) {
    createDevice(data: $data) {
      name
      description
      location
    }
  }
`;
