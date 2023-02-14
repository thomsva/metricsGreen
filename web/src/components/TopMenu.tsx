import { useQuery } from '@apollo/client';
import { Box, AppBar, Toolbar, Typography, Alert, Button } from '@mui/material';
import { isLoggedInVar } from '../cache';
import { ME_QUERY } from '../graphQl';

interface WelcomeProps {
  name: string;
}

const TopMenu = (props: WelcomeProps) => {
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

export default TopMenu;
