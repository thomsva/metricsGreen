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
  Radio,
  Paper,
  Grid,
  Typography,
  Stack
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
    <Grid container spacing={3}>
      <Grid item xs={6} sm={8}>
        <Paper
          square={true}
          variant="outlined"
          sx={{ pt: 3, pb: 3, mt: 3, ml: 3 }}
        >
          <RadioGroup onChange={updateSelection}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      Device ID
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      Sensors
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.myDevices.map((d) => (
                      <TableRow
                        key={d.id}
                        sx={{
                          ...(d.id === activeDeviceId && {
                            bgcolor: '#101010'
                          })
                        }}
                      >
                        <TableCell>
                          <Radio value={d.id} />
                        </TableCell>
                        <TableCell>{d.name}</TableCell>
                        <TableCell
                          sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                        >
                          <Link underline="hover">{d.id.substring(0, 12)}</Link>
                        </TableCell>
                        <TableCell
                          sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                        >
                          {d.sensorsCount}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Grid container sx={{ pt: 3, pl: 3 }}>
                <Grid item>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateFormOpen(true)}
                  >
                    Create new device
                  </Button>
                </Grid>
              </Grid>
              {/* <Box display="flex" justifyContent="flex-end" mt={3}>
                
              </Box> */}
            </TableContainer>
          </RadioGroup>

          <Dialog
            open={createFormOpen}
            onClose={() => setCreateFormOpen(false)}
          >
            <DialogTitle>Create device</DialogTitle>
            <DialogContent>
              <DialogContentText>Fill in new device data.</DialogContentText>
              <DeviceForm
                device={undefined}
                closeForm={() => setCreateFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={4}>
        <Paper
          square={true}
          variant="outlined"
          sx={{ pt: 3, pb: 3, pl: 3, pr: 3, mt: 3, mr: 3 }}
        >
          {activeDeviceId !== undefined && data ? (
            <DeviceDetails
              device={data?.myDevices.find((d) => d.id === activeDeviceId)}
            />
          ) : (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography variant="h4">Select a device</Typography>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
export default Devices;
