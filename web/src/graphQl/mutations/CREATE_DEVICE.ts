import { gql } from '@apollo/client';

export default gql`
  mutation Mutation($data: CreateDeviceInput!) {
    createDevice(data: $data) {
      name
      description
      location
    }
  }
`;
