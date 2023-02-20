import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ThemeProvider } from '@mui/material';

import theme from './theme';
import UserList from './components/UserList';
import TopMenu from './components/TopMenu';
import SignUpForm from './components/SignUpForm';

const httpLink = createHttpLink({
  uri:
    process.env.REACT_APP_ENV === 'development'
      ? 'http://localhost:4000/graphql/'
      : `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/graphql/`
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <TopMenu name="world" />
          <Routes>
            <Route path="/userlist" element={<UserList />} />
            <Route path="/register" element={<SignUpForm />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
