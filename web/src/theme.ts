import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f0'
    },
    background: {
      default: '#111111',
      paper: '#212121'
    }
  },

  typography: {
    fontSize: 16
  }
});

export default theme;
