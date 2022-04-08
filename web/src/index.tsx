import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useQuery
} from '@apollo/client';
import {
  AppBar,
  Box,
  Button,
  createTheme,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material';
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5'
    },
    secondary: {
      main: '#f50057'
    }
  }
});

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs>
          <Tab label="Users" />
          <Tab label="Other stuff" hidden={true} />
        </Tabs>
      </Box>

      {loading ? (
        <HourglassBottomTwoToneIcon />
      ) : (
        <TableContainer component={Paper}>
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Nickname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.users.map((u) => (
                  <TableRow
                    key={u.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {u.id}
                    </TableCell>
                    <TableCell align="right">{u.nickname}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hello {props.name}!
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Welcome name="world" />
        <UserList />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
