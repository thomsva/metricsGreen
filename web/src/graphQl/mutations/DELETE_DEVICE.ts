import { gql } from '@apollo/client';

export default gql`
  mutation DeleteDevice($data: DeleteDeviceInput!) {
    deleteDevice(data: $data)
  }
`;
