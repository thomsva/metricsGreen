import { createTheme } from '@mui/material';

const palette = {
  primary: { main: '#3f51b5' },
  secondary: { main: '#f50057' }
};

const components = {
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: '#F5F5F5'
      }
    }
  }
};

const theme = createTheme({
  palette,
  components
});

export default theme;
