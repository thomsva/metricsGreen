import { useQuery } from '@apollo/client';
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Alert,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  ButtonGroup,
  IconButton
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import DeviceForm from './DeviceForm';
import MY_DEVICES from '../graphQl/queries/MY_DEVICES';
import DeleteDeviceDialog from './DeleteDeviceDialog';
import SensorForm from './SensorForm';

interface Device {
  id: string;
  name: string;
  description?: string;
  location: string;
  sensorsCount: number;
}

const Devices = () => {
  const [deviceToUpdate, setDeviceToUpdate] = useState<Device | undefined>();
  const [deviceToDelete, setDeviceToDelete] = useState<Device | undefined>();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [createSensorOpen, setCreateSensorOpen] = useState(false);
  const { loading, data, error } = useQuery<{ myDevices: Device[] }>(
    MY_DEVICES
  );
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
          <DialogContentText>Fill in new device data.</DialogContentText>
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
        <DialogTitle>Update device</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill in changed device data.</DialogContentText>
          <DeviceForm
            device={deviceToUpdate}
            closeForm={() => setDeviceToUpdate(undefined)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deviceToDelete !== undefined}
        onClose={() => setDeviceToDelete(undefined)}
      >
        <DialogTitle>Delete device</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirmation.</DialogContentText>
          {deviceToDelete !== undefined && (
            <DeleteDeviceDialog
              device={deviceToDelete}
              closeForm={() => setDeviceToDelete(undefined)}
            />
          )}
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
              <TableCell>Sensors</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.myDevices.map((d) => (
                <TableRow key={d.id}>
                  <Dialog
                    open={createSensorOpen}
                    onClose={() => setCreateSensorOpen(false)}
                  >
                    <DialogTitle>Create sensor</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Fill in new sensor data.
                      </DialogContentText>
                      <SensorForm
                        sensor={undefined}
                        deviceId={d.id}
                        closeForm={() => setCreateSensorOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell>
                    {d.sensorsCount}
                    <ButtonGroup>
                      <IconButton onClick={() => setCreateSensorOpen(true)}>
                        <AddIcon />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <IconButton onClick={() => setDeviceToUpdate(d)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setDeviceToDelete(d)}>
                        <DeleteIcon />
                      </IconButton>
                    </ButtonGroup>
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
