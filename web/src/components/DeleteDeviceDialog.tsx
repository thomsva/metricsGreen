import { useMutation } from '@apollo/client';
import { Alert, Box, Button } from '@mui/material';
import DELETE_DEVICE from '../graphQl/mutations/DELETE_DEVICE';
import MY_DEVICES from '../graphQl/queries/MY_DEVICES';

interface Device {
  id: string;
  name: string;
  description?: string;
  location: string;
}

interface Props {
  device: Device;
  closeForm: () => void;
}

const DeleteDeviceDialog = ({ device, closeForm }: Props) => {
  const [deleteDevice] = useMutation(DELETE_DEVICE, {
    refetchQueries: [{ query: MY_DEVICES }]
  });

  const onConfirm = async () => {
    try {
      await deleteDevice({
        variables: {
          data: { id: device?.id }
        }
      });
      closeForm();
    } catch (e) {
      console.log('could not delete');
    }
  };

  return (
    <Box>
      <Alert severity="warning">Deleting device. Are you sure?</Alert>
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={() => closeForm()}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onConfirm()}>
          Yes
        </Button>
      </Box>
    </Box>
  );
};
export default DeleteDeviceDialog;
