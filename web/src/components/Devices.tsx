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
  Typography
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SensorsIcon from '@mui/icons-material/Sensors';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
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
  key: boolean;
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
        setActiveDeviceId(data.myDevices[0]?.id);
    }
  }),
    [data];

  const updateSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setActiveDeviceId(value);
  };

  const noDevices = data?.myDevices.length === 0;

  if (error)
    return (
      <Alert severity="error">
        Error while loading devices {error.message}
      </Alert>
    );

  if (loading) return <HourglassBottomIcon />;
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={noDevices ? 12 : 5}
        sm={noDevices ? 12 : 6}
        md={noDevices ? 12 : 8}
      >
        <Paper
          square={true}
          variant="outlined"
          sx={
            noDevices
              ? { pt: 2, pb: 2, mt: 2, ml: 2, mr: 2 }
              : { pt: 2, pb: 2, mt: 2, ml: 2 }
          }
        >
          {data?.myDevices.length === 0 ? (
            <Box sx={{ pl: 2, pr: 2 }}>
              <Typography variant="h4">Welcome</Typography>
              <Typography>Create a new device to get started.</Typography>
            </Box>
          ) : (
            <RadioGroup
              onChange={updateSelection}
              defaultValue={data?.myDevices[0].id}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        Device ID
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: 'none', sm: 'none', md: 'table-cell' }
                        }}
                      >
                        Sensors
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: 'none', sm: 'none', md: 'table-cell' }
                        }}
                      >
                        Key
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
                          <TableCell
                            sx={{
                              pl: { xs: 0, sm: 2 },
                              pr: { xs: 0, sm: 2 }
                            }}
                          >
                            <Radio value={d.id} />
                          </TableCell>
                          <TableCell
                            sx={{
                              pl: { xs: 1, sm: 2 }
                            }}
                          >
                            {d.name}
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                          >
                            <Link underline="hover">
                              {d.id.substring(0, 12)}
                            </Link>
                          </TableCell>
                          <TableCell
                            sx={{
                              display: {
                                xs: 'none',
                                sm: 'none',
                                md: 'table-cell'
                              }
                            }}
                          >
                            {d.sensorsCount > 0 && <SensorsIcon />}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: {
                                xs: 'none',
                                sm: 'none',
                                md: 'table-cell'
                              }
                            }}
                          >
                            {d.key ? (
                              <KeyIcon color="primary" />
                            ) : (
                              <KeyOffIcon color="error" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </RadioGroup>
          )}

          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ pt: 4, pb: 4, pl: 2, pr: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateFormOpen(true)}
                >
                  Create new device
                </Button>
              </Box>
            </Grid>
          </Grid>

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
      {data?.myDevices.length !== 0 && (
        <Grid item xs={7} sm={6} md={4}>
          <Paper
            square={true}
            variant="outlined"
            sx={{ pt: 2, pb: 4, pl: 2, pr: 2, mt: 2, mr: 2 }}
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
      )}
    </Grid>
  );
};
export default Devices;
