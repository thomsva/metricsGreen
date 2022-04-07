import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useQuery
} from '@apollo/client';

const USERS_QUERY = gql`
  query Users {
    users {
      id
      nickname
      email
      role
    }
  }
`;

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
}

interface UsersData {
  users: User[];
}

const UserList = () => {
  const { loading, data } = useQuery<UsersData>(USERS_QUERY);
  return (
    <div>
      <h3>List of users</h3>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nickname</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nickname}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {
  return <h1>Hello {props.name}!</h1>;
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Welcome name="world" />
      <UserList />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
