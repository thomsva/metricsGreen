import { gql } from '@apollo/client';

export default gql`
  mutation DeleteDevice($deleteDeviceId: String!) {
    deleteDevice(id: $deleteDeviceId)
  }
`;
