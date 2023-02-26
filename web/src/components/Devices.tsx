import { useQuery } from '@apollo/client';
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Alert,
  Typography,
  Button,
  TableBody
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DEVICES from '../graphQl/queries/DEVICES';
import { useState } from 'react';
import DeviceForm from './DeviceForm';

interface Device {
  id: number;
  name: string;
  description?: string;
  location: string;
}

const Devices = () => {
  const [deviceToUpdate, setDeviceToUpdate] = useState<Device | undefined>();
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
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.devices.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => setDeviceToUpdate(d)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {deviceToUpdate && <DeviceForm device={deviceToUpdate} />}
    </Box>
  );
};
export default Devices;
