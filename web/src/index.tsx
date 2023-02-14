import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client';
import { ThemeProvider } from '@mui/material';

import theme from './theme';
import UserList from './components/UserList';
import LoginForm from './components/LoginForm';
import TopMenu from './components/TopMenu';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('token') || ''
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <TopMenu name="world" />
        <UserList />
        <LoginForm />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
