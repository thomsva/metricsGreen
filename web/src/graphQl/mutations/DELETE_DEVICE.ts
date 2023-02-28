import { gql } from '@apollo/client';

export default gql`
  mutation DeleteDevice($deleteDeviceId: Int!) {
    deleteDevice(id: $deleteDeviceId)
  }
`;
