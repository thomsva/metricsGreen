import { gql } from '@apollo/client';

export default gql`
  query MyDevices {
    myDevices {
      id
      name
      description
      location
      sensorsCount
      sensors {
        id
        name
      }
    }
  }
`;
