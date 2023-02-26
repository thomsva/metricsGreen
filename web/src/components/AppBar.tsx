import { useState, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  AppBar as MuiAppBar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  IconButton,
  Container,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import LoginForm from './LoginForm';
import { useQuery, useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from '../cache';
import ME from '../graphQl/queries/ME';
import SignUpForm from './SignUpForm';

const pages = ['Users', 'Devces'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const AppBar = () => {
  const { client, loading, data } = useQuery(ME);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false); // For opening login form
  const [openSignUp, setOpenSignUp] = useState(false); // For opening signup form

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
    <>
      <MuiAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

            <Box sx={{ flexGrow: 0, display: { xs: 'block', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <MenuItem>
                  <Link
                    component={RouterLink}
                    sx={{ textDecoration: 'inherit' }}
                    color="inherit"
                    to="/devices"
                    onClick={handleCloseNavMenu}
                  >
                    Devices
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    component={RouterLink}
                    sx={{ textDecoration: 'inherit' }}
                    color="inherit"
                    to="/users"
                    onClick={handleCloseNavMenu}
                  >
                    Users
                  </Link>
                </MenuItem>
              </Menu>
            </Box>

            <Box
              sx={{ flexGrow: 0, display: { xs: 'block', md: 'none' }, mr: 1 }}
            >
              <AdbIcon />
            </Box>

            <Box
              sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }}
            ></Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link
                  component={RouterLink}
                  sx={{ textDecoration: 'inherit' }}
                  color="inherit"
                  to="/devices"
                >
                  Devices
                </Link>
              </Button>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link
                  component={RouterLink}
                  sx={{ textDecoration: 'inherit' }}
                  color="inherit"
                  to="/users"
                >
                  Users
                </Link>
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1 }}></Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open user settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isLoggedIn ? (
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography onClick={() => logout()}>Logout</Typography>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography onClick={() => setOpenLogin(true)}>
                        Login
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography onClick={() => setOpenSignUp(true)}>
                        Register
                      </Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>

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
      </MuiAppBar>
      <Box>
        {isLoggedIn ? (
          <Alert severity="success">logid in</Alert>
        ) : (
          <Alert severity="error">not logid in</Alert>
        )}
      </Box>
    </>
  );
};

export default AppBar;

{
  /* <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
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
      </Dialog> */
}
