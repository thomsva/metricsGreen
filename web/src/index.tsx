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
  uri: 'http://localhost:4000/graphql'
});

// uri: 'http://localhost:4000/graphql',
// headers: {
//   authorization: localStorage.getItem('token') || ''
// }

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
          <div>
            <Link to="/userlist">userlist</Link>
            <Link to="/register">register</Link>
          </div>
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
