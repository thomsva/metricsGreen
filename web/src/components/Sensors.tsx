import { useQuery } from '@apollo/client';
import { Chip, Typography } from '@mui/material';
import MY_SENSORS from '../graphQl/queries/MY_SENSORS';

interface Sensor {
  id: string;
  name: string;
  unit: string;
  device: { id: string; name: string };
  readings: [{ id: string; content: string }];
}

const Sensors = () => {
  const { loading, data, error } = useQuery<{ mySensors: Sensor[] }>(
    MY_SENSORS
  );
  console.log('hello s');
  // return <Typography>Hello Sensors...</Typography>;

  if (loading) return <Typography>loading...</Typography>;
  if (error) return <Typography>error!!</Typography>;

  return (
    <>
      <Typography>Sensors list</Typography>
      {data &&
        data.mySensors.map((s) => (
          <Typography key={s.id}>
            {s.id} {s.name}
            {s.readings &&
              s.readings.map((r) => <Chip key={r.id} label={r.content} />)}
          </Typography>
        ))}
    </>
  );
};

export default Sensors;
