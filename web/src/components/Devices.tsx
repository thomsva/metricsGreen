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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DEVICES from '../graphQl/queries/DEVICES';
import { useState } from 'react';
import DeviceForm from './DeviceForm';
import SignUpForm from './SignUpForm';

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
      {/* {deviceToUpdate ? (
        <DeviceForm
          device={deviceToUpdate}
          closeForm={() => setDeviceToUpdate(undefined)}
        />
      ) : createFormOpen ? (
        
      ) : ( */}
      <Dialog open={createFormOpen} onClose={() => setCreateFormOpen(false)}>
        <DialogTitle>Create device</DialogTitle>
        <DialogContent>
          <DialogContentText>Register as a new user.</DialogContentText>
          <DeviceForm
            device={undefined}
            closeForm={() => setCreateFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deviceToUpdate !== undefined}
        onClose={() => setDeviceToUpdate(undefined)}
      >
        <DialogTitle>Create device</DialogTitle>
        <DialogContent>
          <DialogContentText>Register as a new user.</DialogContentText>
          <DeviceForm
            device={deviceToUpdate}
            closeForm={() => setDeviceToUpdate(undefined)}
          />
        </DialogContent>
      </Dialog>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell></TableCell>
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
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateFormOpen(true)}
          >
            Create new device
          </Button>
        </Box>
      </TableContainer>
      {/* )} */}
    </Box>
  );
};
export default Devices;
