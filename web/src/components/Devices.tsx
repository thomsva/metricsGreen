import { useQuery } from '@apollo/client';
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Typography
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DEVICES from '../graphQl/queries/DEVICES';

interface Device {
  id: number;
  name: string;
  description?: string;
  location: string;
}

// interface UsersData {
//   users: User[];
// }

const Devices = () => {
  const { loading, data, error } = useQuery<{ devices: Device[] }>(DEVICES);
  if (error)
    return (
      <Alert severity="error">tällanen tuli kupiti lataa {error.message}</Alert>
    );
  if (loading) return <HourglassBottomIcon />;
  return (
    <Box>
      <Typography>Devices</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      {data &&
        data.devices.map((d) => <Typography key={d.id}>{d.name}</Typography>)}
    </Box>
  );
};
export default Devices;
