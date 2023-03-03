import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import KeyIcon from '@mui/icons-material/Key';
import { useState } from 'react';
import DeleteDeviceDialog from './DeleteDeviceDialog';
import DeviceForm from './DeviceForm';
import SensorForm from './SensorForm';
import GENERATE_DEVICE_SECRET from '../graphQl/mutations/GENERATE_DEVICE_SECRET';
import MY_DEVICES from '../graphQl/queries/MY_DEVICES';
import { useMutation } from '@apollo/client';

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
  if (device === undefined) return <HourglassBottomIcon />;
  const [deviceToUpdate, setDeviceToUpdate] = useState<Device | undefined>();
  const [deviceToDelete, setDeviceToDelete] = useState<Device | undefined>();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [createSensorOpen, setCreateSensorOpen] = useState(false);

  const [generateDeviceSecret, { data }] = useMutation(GENERATE_DEVICE_SECRET, {
    refetchQueries: [{ query: MY_DEVICES }]
  });

  const handleGenerateDeviceSecret = async () => {
    await generateDeviceSecret({
      variables: {
        data: { id: device.id }
      }
    });
    console.log('mutation sent');

    console.log('key', data);
  };

  return (
    <>
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

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h4">{device.name}</Typography>
        </Grid>
        <Grid item>
          <Typography>{device.id}</Typography>
        </Grid>
        <Grid item>
          <Typography>{device.description}</Typography>
        </Grid>
        <Grid item>
          <Typography>{device.location}</Typography>
        </Grid>
        <Grid item>
          <Typography>{device.sensorsCount}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setDeviceToUpdate(device)}
            >
              Edit
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setDeviceToDelete(device)}
            >
              Delete
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setCreateSensorOpen(true)}
            >
              Add sensor
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<KeyIcon />}
              onClick={() => handleGenerateDeviceSecret()}
            >
              Generate secret key
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};
export default DeviceDetails;
