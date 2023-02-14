import { useQuery, useReactiveVar } from '@apollo/client';
import { Box, AppBar, Toolbar, Typography, Alert, Button } from '@mui/material';
import { isLoggedInVar } from '../cache';
import { ME_QUERY } from '../graphQl';
import LoginForm from './LoginForm';

interface WelcomeProps {
  name: string;
}

const TopMenu = (props: WelcomeProps) => {
  const { client, loading, data, error } = useQuery(ME_QUERY);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const logout = async () => {
    // console.log('user pressed logout');
    isLoggedInVar(false);
    // console.log('islogidin: ', isLoggedInVar());
    // console.log('storage1', localStorage.getItem('token'));
    localStorage.clear();
    // console.log('storage2', localStorage.getItem('token'));
    // client.cache.reset();
    try {
      await client.resetStore();
    } catch (e) {
      console.log(e);
    }
    //window.location.reload();
    //console.log('storage after clear', localStorage.getItem('token'));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {loading ? 'Loading...' : loading}
            Hello {data && !error ? data?.me.nickname : props.name}!
            {isLoggedIn ? (
              <Alert severity="success">logid in</Alert>
            ) : (
              <Alert severity="error">not logid in</Alert>
            )}
            {error && error.message}
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={() => logout()}>
              Logout
            </Button>
          ) : (
            <LoginForm />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopMenu;
