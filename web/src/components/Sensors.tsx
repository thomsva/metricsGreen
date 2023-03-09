import { useQuery } from '@apollo/client';
import { Chip, Grid, Paper, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import MY_SENSORS from '../graphQl/queries/MY_SENSORS';
import theme from '../theme';

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
        setValues(d.mySensors[0].readings.map((d) => d.content));
        setDates(d.mySensors[0].readings.map((d) => d.createdAt));
      }
    }
  );
  console.log('hello s');

  const chartData: ApexOptions = {
    chart: {
      type: 'line',
      id: 'apexchart-example',
      foreColor: theme.palette.primary.main
    },
    xaxis: {
      type: 'datetime',
      categories: dates
    },
    markers: { size: 3 },
    tooltip: {
      enabled: true,
      fillSeriesColor: true,
      theme: 'dark',
      x: { show: false }
    },
    series: [
      {
        name: 'Distance Traveled',
        type: 'line',
        data: values
      }
    ]
  };

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
          <ReactApexChart
            options={chartData}
            series={chartData.series}
            height="400"
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Sensors;
