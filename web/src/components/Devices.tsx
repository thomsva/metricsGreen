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
  Link,
  RadioGroup,
  Radio
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AddIcon from '@mui/icons-material/Add';
import DeviceForm from './DeviceForm';
import MY_DEVICES from '../graphQl/queries/MY_DEVICES';
import DeviceDetails from './DeviceDetails';
import { useEffect, useState } from 'react';

interface Device {
  id: string;
  name: string;
  description?: string;
  location: string;
  sensorsCount: number;
}

const Devices = () => {
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );
  const [createFormOpen, setCreateFormOpen] = useState(false);

  const { loading, data, error } = useQuery<{ myDevices: Device[] }>(
    MY_DEVICES
  );

  useEffect(() => {
    if (data !== undefined) {
      if (data.myDevices.find((d) => d.id === activeDeviceId) === undefined)
        setActiveDeviceId(undefined);
    }
  }),
    [data];

  const updateSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setActiveDeviceId(value);
  };

  if (error)
    return (
      <Alert severity="error">
        Error while loading devices {error.message}
      </Alert>
    );
  if (loading) return <HourglassBottomIcon />;
  return (
    <Box sx={{ width: '100%' }}>
      {activeDeviceId !== undefined && data ? (
        <DeviceDetails
          device={data?.myDevices.find((d) => d.id === activeDeviceId)}
        />
      ) : (
        <HourglassBottomIcon />
      )}

      <RadioGroup onChange={updateSelection}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Device ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Sensors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.myDevices.map((d) => (
                  <TableRow
                    key={d.id}
                    sx={{
                      ...(d.id === activeDeviceId && {
                        bgcolor: '#eeeeee'
                      })
                    }}
                  >
                    <TableCell>
                      <Radio value={d.id} />
                    </TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>
                      <Link underline="hover">{d.id.substring(0, 12)}</Link>
                    </TableCell>
                    <TableCell>{d.description}</TableCell>
                    <TableCell>{d.location}</TableCell>
                    <TableCell>{d.sensorsCount}</TableCell>
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
      </RadioGroup>
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
    </Box>
  );
};
export default Devices;
