import React from 'react';
import ReactDOM from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  useMutation,
  useQuery
} from '@apollo/client';
import {
  Alert,
  AppBar,
  Box,
  Button,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material';
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';
import { LOGIN, USERS_QUERY, ME_QUERY } from './graphQl';
import { isLoggedInVar } from './cache';

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

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
}

interface UsersData {
  users: User[];
}

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    token: String!
    nickName: nickName
  }
`;

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('token') || ''
  },
  typeDefs
});

const UserList = () => {
  const { loading, data } = useQuery<UsersData>(USERS_QUERY);
  return (
    <Box>
      {loading ? (
        <HourglassBottomTwoToneIcon />
      ) : (
        <TableContainer component={Paper}>
          <Table>
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
    </Box>
  );
};

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {
  const { loading, data } = useQuery(ME_QUERY);

  const logout = () => {
    console.log('user pressed logout');
    isLoggedInVar(false);
    console.log('islogidin: ', isLoggedInVar());
    console.log('storage', localStorage.getItem('token'));
    localStorage.clear();
    window.location.reload();
    console.log('storage after clear', localStorage.getItem('token'));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {loading ? 'Loading...' : loading}
            Hello {data ? data?.me.nickname : props.name}!
            {isLoggedInVar() ? (
              <Alert severity="success">logid in</Alert>
            ) : (
              <Alert severity="error">not logid in</Alert>
            )}
          </Typography>
          <Button color="inherit">Login</Button>
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const Login = () => {
  type FormValues = {
    nickname: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  const [login] = useMutation(LOGIN);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await login({ variables: data });
    console.log('result is: ', result);
    localStorage.setItem('token', result.data.login as string);
    window.location.reload();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          defaultValue="testuser"
          {...register('nickname', { required: true })}
        />
        <TextField
          defaultValue="pwd"
          {...register('password', { required: true })}
        />
        {errors.nickname && (
          <Alert severity="error">Name field is required</Alert>
        )}
        {errors.password && (
          <Alert severity="error">Password field is required</Alert>
        )}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Welcome name="world" />
        <UserList />
        <Login />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
