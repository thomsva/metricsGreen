import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Box, CssBaseline, Grid, ThemeProvider } from '@mui/material';
import theme from './theme';
import Users from './components/Users';
import Devices from './components/Devices';
import Sensors from './components/Sensors';
import AppBar from './components/AppBar';
import HomePage from './components/HomePage';
// import { DeviceConnectInfo } from './components/DeviceConnectInfo';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : `${window.location.origin}/graphql`
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
        <CssBaseline />
        <Router>
          <AppBar />
          {/* <Box sx={{ backgroundColor: 'red', display: 'flex' }}> */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/sensors" element={<Sensors />} />
            {/* <Route path="/connect" element={<DeviceConnectInfo/>}/> */}
          </Routes>
          {/* </Box> */}
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
