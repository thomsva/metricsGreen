import { useQuery, useReactiveVar } from '@apollo/client';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { isLoggedInVar } from '../cache';
import { ME_QUERY } from '../graphQl';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

interface WelcomeProps {
  name: string;
}

const TopMenu = (props: WelcomeProps) => {
  const { client, loading, data } = useQuery(ME_QUERY);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const [open, setOpen] = useState(false); // For opening login form
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
    setOpen(false);
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
                Log out
              </Button>
            )}
            {!isLoggedIn && (
              <Box>
                <Button color="inherit" onClick={handleClickOpen}>
                  Sign up
                </Button>
                <Button color="inherit" onClick={handleClickOpen}>
                  Log in
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box>
        {isLoggedIn ? (
          <Alert severity="success">logid in</Alert>
        ) : (
          <Alert severity="error">not logid in</Alert>
        )}
      </Box>

      {/* Below is the dialog for login form. */}
      {!isLoggedIn && (
        <Dialog open={open} onClose={handleClose}>
          <DialogActions>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogTitle>Log in </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide username and password to log in.
            </DialogContentText>
            <LoginForm />
          </DialogContent>
        </Dialog>
      )}

      {/* Below is the dialog for sign up form. */}
      {!isLoggedIn && (
        <Dialog open={open} onClose={handleClose}>
          <DialogActions>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogTitle>Sign up </DialogTitle>
          <DialogContent>
            <DialogContentText>Register as a new user.</DialogContentText>
            <SignUpForm />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default TopMenu;
