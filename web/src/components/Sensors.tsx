import { useQuery } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import MY_SENSORS from '../graphQl/queries/MY_SENSORS';
import LineChart from './LineChart';

interface Sensor {
  id: string;
  name: string;
  unit: string;
  device: { id: string; name: string };
  readings: [{ id: string; content: number; createdAt: string }];
}

const Sensors = () => {
  const [values, setValues] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const { loading, data, error } = useQuery<{ mySensors: Sensor[] }>(
    MY_SENSORS,
    {
      onCompleted: (d) => {
        console.log('data loaded');
        setValues(d.mySensors[1].readings.map((d) => d.content));
        setDates(d.mySensors[1].readings.map((d) => d.createdAt));
      }
    }
  );
  console.log('hello s');

  if (loading) return <Typography>loading...</Typography>;
  if (error) return <Typography>error!!</Typography>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper
          square={true}
          variant="outlined"
          sx={{ pt: 2, pb: 2, mt: 2, ml: 2, mr: 2 }}
        >
          {data?.mySensors.map((s) => (
            <LineChart
              key={s.id}
              title={s.name}
              unit={s.unit}
              dates={s.readings.map((r) => r.createdAt)}
              values={s.readings.map((r) => r.content)}
            />
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Sensors;
