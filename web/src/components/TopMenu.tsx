import { useQuery, useReactiveVar } from '@apollo/client';
import { Box, AppBar, Toolbar, Typography, Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { isLoggedInVar } from '../cache';
import { ME_QUERY } from '../graphQl';
import LoginForm from './LoginForm';

interface WelcomeProps {
  name: string;
}

const TopMenu = (props: WelcomeProps) => {
  const { client, loading, data } = useQuery(ME_QUERY);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    // Open login form
    setOpen(true);
  };

  const handleClose = () => {
    // Hide login form
    setOpen(false);
  };

  const logout = async () => {
    isLoggedInVar(false);
    localStorage.clear();
    try {
      await client.resetStore();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {loading ? 'Loading...' : loading}
            Hello {data?.me ? data?.me.nickname : props.name}!
          </Typography>
          <Box>
            {isLoggedIn && (
              <Button color="inherit" onClick={() => logout()}>
                Logout
              </Button>
            )}
            {!isLoggedIn && (
              <Button color="inherit" onClick={handleClickOpen}>
                Login
              </Button>)}
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Provide username and password to log in.
                  </DialogContentText>
                  <LoginForm closeForm={handleClose}/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                  
                </DialogActions>
              </Dialog>
      
          </Box>
        </Toolbar>
      </AppBar>{' '}
      <Box>
        {isLoggedIn ? (
          <Alert severity="success">logid in</Alert>
        ) : (
          <Alert severity="error">not logid in</Alert>
        )}
      </Box>
    </Box>
  );
};

export default TopMenu;
