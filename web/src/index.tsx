import React from 'react';
import ReactDOM from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
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
import { LOGIN } from './graphQl';

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
    console.log(data);
    console.log('result is: ', await login({ variables: data }));
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
