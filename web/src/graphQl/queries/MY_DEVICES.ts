import { gql } from '@apollo/client';

export default gql`
  query MyDevices {
    myDevices {
      id
      name
      location
      description
      sensors {
        id
        name
      }
    }
  }
`;
