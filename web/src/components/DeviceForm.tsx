import { Alert, Box, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Devices from './Devices';
import CREATE_DEVICE from '../graphQl/mutations/CREATE_DEVICE';
import DEVICES from '../graphQl/queries/DEVICES';

// Schema for form validation
const schema = yup
  .object({
    name: yup.string().required().min(3),
    description: yup.string(),
    location: yup.string()
  })
  .required();

// Infer type from schema
type FormValues = yup.InferType<typeof schema>;

// Fields validated on server
type serverFieldError = {
  name?: string;
  description?: string;
  location?: string;
};

const DeviceForm = () => {
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

  const [errorMessage, setErrorMessage] = useState('');

  const [createDevice] = useMutation(CREATE_DEVICE, {
    refetchQueries: [{ query: DEVICES }],
    onError: (e) => {
      // Extract new errors from graphQL and update state
      let newErrors = {};
      if (e.message.includes('Argument Validation Error')) {
        e.graphQLErrors[0].extensions.exception.validationErrors.forEach(
          (valError: { field: string; msg: string[] }) =>
            (newErrors = {
              ...newErrors,
              [valError.field]: Object.values(valError.msg)
                .map((m) => m)
                .join(' | ')
            })
        );
      } else {
        // Other error than validation error
        setErrorMessage(e.message);
      }
      setServerFieldErrors(newErrors);
    }
  });

  const onSubmit = async (formData: FormValues) => {
    setServerFieldErrors({});
    setErrorMessage('');
    try {
      await createDevice({
        variables: {
          data: formData
        }
      });
      reset();
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
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

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
