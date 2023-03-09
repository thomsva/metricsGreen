import { Box, Typography, Paper } from '@mui/material';

const HomePage = () => {
  return (
    <Box>
      <Paper square={true} variant="outlined" sx={{ p: 2, m: 2 }}>
        <Typography variant="h3">Welcome</Typography>
      </Paper>
    </Box>
  );
};

export default HomePage;
