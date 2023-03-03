import { gql } from '@apollo/client';

export default gql`
  mutation GenerateDeviceSecret($data: GenerateDeviceSecretInput!) {
    generateDeviceSecret(data: $data)
  }
`;
