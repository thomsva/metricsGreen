import { Grid, Paper, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';

import ReactApexChart from 'react-apexcharts';
import theme from '../theme';

interface Props {
  title: string;
  unit: string;
  dates: string[];
  values: number[];
}

const LineChart = ({ title, unit, dates, values }: Props) => {
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
        name: 'Temperature',
        type: 'line',
        data: values
      }
    ]
  };

  return (
    <Paper square={true} variant="outlined" sx={{ pt: 2, pb: 2 }}>
      <Typography sx={{ ml: 2 }} variant="h5">
        {title} ({unit})
      </Typography>
      <ReactApexChart
        options={chartData}
        series={chartData.series}
        height="400"
      />
    </Paper>
  );
};

export default LineChart;
