import { Alert, Box, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import CREATE_DEVICE from '../graphQl/mutations/CREATE_DEVICE';
import Devices from './Devices';

const schema = yup
  .object({
    name: yup.string().required().min(3),
    description: yup.string(),
    location: yup.string()
  })
  .required();

type FormValues = yup.InferType<typeof schema>;
type serverFieldError = {
  // Fields to be extracted from GraphQl validation error from server
  name?: string;
  description?: string;
  location?: string;
};

const DeviceForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formFieldErrors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  const [serverFieldErrors, setServerFieldErrors] = useState<serverFieldError>(
    {}
  );

  const [createDevice, { data, loading, error }] = useMutation(CREATE_DEVICE, {
    onError: (e) => {
      // Extract new errors from graphQL error and update state
      console.log('here');
      console.error(e);
      let newErrors = {};
      if (e.message.includes('Argument Validation Error')) {
        e.graphQLErrors[0].extensions.exception.validationErrors.forEach(
          (valError: { property: string; constraints: string[] }) =>
            (newErrors = {
              ...newErrors,
              [valError.property]: Object.values(valError.constraints)
                .map((m) => m)
                .join(' | ')
            })
        );
      }
      setServerFieldErrors(newErrors);
      console.log('<>', newErrors);
    }
  });

  const onSubmit = async (formData: FormValues) => {
    setServerFieldErrors({});
    try {
      await createDevice({
        variables: {
          data: formData
        }
      });
    } catch (e) {
      console.error('error cought', e);
      console.error('error:', error?.graphQLErrors[0]);
      console.log('data: ', data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {(Object.keys(formFieldErrors).length != 0 ||
        Object.keys(serverFieldErrors).length != 0) && (
        <Alert severity="warning">
          The form data was not saved. Please fix errors on the form and
          resubmit. Form errors: {Object.keys(formFieldErrors).length}
          Server errors: {Object.keys(serverFieldErrors).length}
        </Alert>
      )}
      <Alert>{error && error.message}</Alert>
      <TextField
        {...register('name')}
        label="Device name"
        error={'name' in serverFieldErrors || 'name' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          ('name' in serverFieldErrors ? serverFieldErrors.name : '') +
          (formFieldErrors.name ? formFieldErrors.name.message || '' : '')
        }
      />
      <TextField
        {...register('description')}
        label="Description"
        error={
          'description' in serverFieldErrors || 'description' in formFieldErrors
        }
        size="small"
        fullWidth
        margin="dense"
      />
      <TextField
        {...register('location')}
        size="small"
        label="Location"
        error={'location' in serverFieldErrors || 'location' in formFieldErrors}
        fullWidth
        margin="dense"
        helperText={
          formFieldErrors.location ? formFieldErrors.location.message || '' : ''
        }
      />

      <Box display="flex" justifyContent="flex-end" mt={5}>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setServerFieldErrors({})}
        >
          Submit
        </Button>
      </Box>
      <Devices />
    </Box>
  );
};

export default DeviceForm;
