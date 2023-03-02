import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
  IconButton,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useState } from 'react';
import DeleteDeviceDialog from './DeleteDeviceDialog';
import DeviceForm from './DeviceForm';
import SensorForm from './SensorForm';

interface Device {
  id: string;
  name: string;
  description?: string;
  location: string;
  sensorsCount: number;
}

interface Props {
  device: Device | undefined;
}

const DeviceDetails = ({ device }: Props) => {
  const [deviceToUpdate, setDeviceToUpdate] = useState<Device | undefined>();
  const [deviceToDelete, setDeviceToDelete] = useState<Device | undefined>();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [createSensorOpen, setCreateSensorOpen] = useState(false);

  if (device === undefined) return <HourglassBottomIcon />;

  return (
    <Box sx={{ width: '100%' }}>
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

      <Dialog
        open={createSensorOpen}
        onClose={() => setCreateSensorOpen(false)}
      >
        <DialogTitle>Create sensor</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill in new sensor data.</DialogContentText>
          <SensorForm
            sensor={undefined}
            deviceId={device.id}
            closeForm={() => setCreateSensorOpen(false)}
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
              <TableCell>Sensors</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{device.id}</TableCell>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.description}</TableCell>
              <TableCell>{device.location}</TableCell>
              <TableCell>
                {device.sensorsCount}
                <ButtonGroup>
                  <IconButton onClick={() => setCreateSensorOpen(true)}>
                    <AddIcon />
                  </IconButton>
                </ButtonGroup>
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <IconButton onClick={() => setDeviceToUpdate(device)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeviceToDelete(device)}>
                    <DeleteIcon />
                  </IconButton>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* )} */}
    </Box>
  );
};
export default DeviceDetails;
