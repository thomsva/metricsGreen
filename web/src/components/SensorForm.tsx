import { Alert, Box, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { fieldErrorsFromGqlError } from '../formTools';
import UPDATE_SENSOR from '../graphQl/mutations/UPDATE_SENSOR';
import CREATE_SENSOR from '../graphQl/mutations/CREATE_SENSOR';

// Schema for form validation
const schema = yup
  .object({
    name: yup.string().required().min(3),
    unit: yup.string().required()
  })
  .required();

// Infer type from schema
type FormValues = yup.InferType<typeof schema>;

// Fields validated on server
type serverFieldError = {
  name?: string;
  unit?: string;
};

interface Sensor {
  id: number;
  name: string;
  deviceId?: string;
}

interface Props {
  Sensor: Sensor | undefined;
  closeForm: () => void;
}

// eslint-disable-next-line react/prop-types
const SensorForm = ({ Sensor, closeForm }: Props) => {
  const createMode = Sensor === undefined;
  console.log('createMode', createMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formFieldErrors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  const [serverFieldErrors, setServerFieldErrors] = useState<serverFieldError>(
    {}
  );

  const [createSensor] = useMutation(CREATE_SENSOR, {
    refetchQueries: [],
    onError: (e) => setServerFieldErrors(fieldErrorsFromGqlError(e)),
    onCompleted: () => reset()
  });

  const [updateSensor] = useMutation(UPDATE_SENSOR, {
    refetchQueries: [],
    onError: (e) => {
      setServerFieldErrors(fieldErrorsFromGqlError(e));
    },
    onCompleted: () => {
      reset();
      closeForm();
    }
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      if (createMode) {
        await createSensor({
          variables: {
            data: formData
          }
        });
      } else {
        console.log('about to send:', {
          id: Sensor.id,
          name: formData.name
        });
        await updateSensor({
          variables: {
            data: {
              id: Sensor.id,
              name: formData.name,
              unit: formData.unit
            }
          }
        });
      }
    } catch (e) {
      console.error('Oops, something went wrong: ', e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {(Object.keys(formFieldErrors).length != 0 ||
        Object.keys(serverFieldErrors).length != 0) && (
        <Alert severity="warning">
          The form data was not saved. Please fix errors on the form and
          resubmit.
        </Alert>
      )}

      <TextField
        {...register('name')}
        label="Sensor name"
        error={'name' in serverFieldErrors || 'name' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        defaultValue={createMode ? '' : Sensor.name}
        helperText={
          ('name' in serverFieldErrors ? serverFieldErrors.name : '') +
          (formFieldErrors.name ? formFieldErrors.name.message || '' : '')
        }
      />
      <TextField
        {...register('unit')}
        label="Unit of measurement"
        error={'unit' in serverFieldErrors || 'unit' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        defaultValue={createMode ? '' : Sensor.name}
        helperText={
          ('unit' in serverFieldErrors ? serverFieldErrors.unit : '') +
          (formFieldErrors.unit ? formFieldErrors.unit.message || '' : '')
        }
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        {closeForm !== undefined && (
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => closeForm()}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          type="submit"
          onClick={() => setServerFieldErrors({})}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SensorForm;
