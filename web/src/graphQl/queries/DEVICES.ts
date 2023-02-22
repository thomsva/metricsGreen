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
        nickname
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
