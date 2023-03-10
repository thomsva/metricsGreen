import { useQuery } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { number } from 'yup';
import MY_SENSORS from '../graphQl/queries/MY_SENSORS';
import LineChart from './LineChart';

interface Sensor {
  id: string;
  name: string;
  unit: string;
  minReading: number;
  maxReading: number;
  readingsCount: number;
  averageReading: number;
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
    <Grid container spacing={2} sx={{ pl: 2, pr: 2 }}>
      {data?.mySensors.map((s) => (
        <>
          <Grid item xs={3}>
            <Paper
              square={true}
              variant="outlined"
              sx={{ pt: 2, pb: 4, pl: 2, pr: 2, mt: 2 }}
            >
              <Typography variant="h5">min:</Typography>
              <Typography variant="h2">
                {s.minReading ? s.minReading : '-'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper
              square={true}
              variant="outlined"
              sx={{ pt: 2, pb: 4, pl: 2, pr: 2, mt: 2 }}
            >
              <Typography variant="h5">max:</Typography>
              <Typography variant="h2">
                {s.maxReading ? s.maxReading : '-'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper
              square={true}
              variant="outlined"
              sx={{ pt: 2, pb: 4, pl: 2, pr: 2, mt: 2 }}
            >
              <Typography variant="h5">avg:</Typography>
              <Typography variant="h2">
                {s.averageReading ? s.averageReading : '-'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper
              square={true}
              variant="outlined"
              sx={{ pt: 2, pb: 4, pl: 2, pr: 2, mt: 2 }}
            >
              <Typography variant="h5">count:</Typography>
              <Typography variant="h2">
                {s.readingsCount ? s.readingsCount : '-'}
              </Typography>
            </Paper>
          </Grid>
          <Grid key={s.id} item xs={12}>
            <LineChart
              title={s.name}
              unit={s.unit}
              dates={s.readings.map((r) => r.createdAt)}
              values={s.readings.map((r) => r.content)}
            />
          </Grid>
        </>
      ))}
    </Grid>
  );
};

export default Sensors;
