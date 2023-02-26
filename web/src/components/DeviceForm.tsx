import { Alert, Box, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import Devices from './Devices';
import CREATE_DEVICE from '../graphQl/mutations/CREATE_DEVICE';
import DEVICES from '../graphQl/queries/DEVICES';
import { fieldErrorsFromGqlError } from '../formTools';
import UPDATE_DEVICE from '../graphQl/mutations/UPDATE_DEVICE';

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
  // description?: string;
  // location?: string;
};

interface Device {
  id: number;
  name: string;
  description?: string;
  location: string;
}

interface Props {
  device: Device | undefined;
  closeForm?: () => void;
}

// eslint-disable-next-line react/prop-types
const DeviceForm = ({ device, closeForm }: Props) => {
  const createMode = device === undefined;

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

  const [createDevice] = useMutation(CREATE_DEVICE, {
    refetchQueries: [{ query: DEVICES }],
    onError: (e) => setServerFieldErrors(fieldErrorsFromGqlError(e)),
    onCompleted: () => reset()
  });

  const [updateDevice] = useMutation(UPDATE_DEVICE, {
    refetchQueries: [{ query: DEVICES }],
    onError: (e) => setServerFieldErrors(fieldErrorsFromGqlError(e)),
    onCompleted: () => reset()
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      if (createMode) {
        await createDevice({
          variables: {
            data: formData
          }
        });
      } else {
        console.log('about to send:', {
          id: device.id,
          name: formData.name,
          description: formData.description,
          location: formData.location
        });
        await updateDevice({
          variables: {
            data: {
              id: device.id,
              name: formData.name,
              description: formData.description,
              location: formData.location
            }
          }
        });
      }
      if (closeForm !== undefined) closeForm();
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
        label="Device name"
        error={'name' in serverFieldErrors || 'name' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        defaultValue={createMode ? '' : device.name}
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
        defaultValue={createMode ? '' : device.description}
      />
      <TextField
        {...register('location')}
        size="small"
        label="Location"
        error={'location' in serverFieldErrors || 'location' in formFieldErrors}
        fullWidth
        margin="dense"
        defaultValue={createMode ? '' : device.location}
        helperText={
          formFieldErrors.location ? formFieldErrors.location.message || '' : ''
        }
      />

      <Box display="flex" justifyContent="flex-end" mt={5}>
        {closeForm !== undefined && (
          <Button variant="outlined" onClick={() => closeForm()}>
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

export default DeviceForm;
