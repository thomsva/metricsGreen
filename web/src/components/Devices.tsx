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
  TableBody,
  Button
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
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
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const { loading, data, error } = useQuery<{ devices: Device[] }>(DEVICES);
  if (error)
    return (
      <Alert severity="error">
        Error while loading devices {error.message}
      </Alert>
    );
  if (loading) return <HourglassBottomIcon />;
  return (
    <Box sx={{ width: '100%' }}>
      {deviceToUpdate ? (
        <DeviceForm
          device={deviceToUpdate}
          closeForm={() => setDeviceToUpdate(undefined)}
        />
      ) : createFormOpen ? (
        <DeviceForm
          device={undefined}
          closeForm={() => setCreateFormOpen(false)}
        />
      ) : (
        <TableContainer component={Paper} sx={{ width: '100%', mb: 2 }}>
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
                      <EditIcon onClick={() => setDeviceToUpdate(d)} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateFormOpen(true)}
          >
            Create new device
          </Button>
        </TableContainer>
      )}
    </Box>
  );
};
export default Devices;
