import { gql } from '@apollo/client';

export default gql`
  query Devices {
    devices {
      id
      name
      description
      location
      user {
        id
        username
      }
      sensors {
        id
        metric {
          metricName
        }
      }
    }
  }
`;
