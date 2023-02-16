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
  IconButton,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { isLoggedInVar } from '../cache';
import { ME_QUERY } from '../graphQl';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { Link as RouterLink } from 'react-router-dom';

interface WelcomeProps {
  name: string;
}

const pages = ['Sensors', 'Users', 'Register'];
const settings = ['Account', 'Logout'];

const TopMenu = (props: WelcomeProps) => {
  const { client, loading, data } = useQuery(ME_QUERY);

  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [openLogin, setOpenLogin] = useState(false); // For opening login form
  const [openSignUp, setOpenSignUp] = useState(false); // For opening signup form

  const logout = async () => {
    isLoggedInVar(false);
    localStorage.clear();
    setOpenLogin(false);
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
            <Link
              component={RouterLink}
              sx={{ textDecoration: 'inherit' }}
              color="inherit"
              to="/"
            >
              {loading ? 'Loading...' : loading}
              Hello {data?.me ? data?.me.nickname : props.name}!
            </Link>
            <Link
              component={RouterLink}
              sx={{ textDecoration: 'inherit', pl: 2 }}
              color="inherit"
              to="/userlist"
            >
              Users
            </Link>
            <Link
              component={RouterLink}
              sx={{ textDecoration: 'inherit', pl: 2 }}
              color="inherit"
              to="/register"
            >
              Register
            </Link>
          </Typography>
          <Box>
            {isLoggedIn && (
              <Button color="inherit" onClick={() => logout()}>
                Log out
              </Button>
            )}
            {!isLoggedIn && (
              <Box>
                <Button color="inherit" onClick={() => setOpenSignUp(true)}>
                  Sign up
                </Button>
                <Button color="inherit" onClick={() => setOpenLogin(true)}>
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
        <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
          <DialogActions>
            <IconButton onClick={() => setOpenLogin(false)}>
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
        <Dialog open={openSignUp} onClose={() => setOpenSignUp(false)}>
          <DialogActions>
            <IconButton onClick={() => setOpenSignUp(false)}>
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
