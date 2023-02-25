import { useMutation } from '@apollo/client';
import { Alert, Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import REGISTER_USER from '../graphQl/mutations/REGISTER_USER';

// Schema for form validation
const schema = yup
  .object({
    username: yup.string().required().min(3),
    email: yup.string().required().email(),
    password: yup.string().required(),
    passwordRepeat: yup
      .string()
      .oneOf([yup.ref('password'), ''], 'Passwords must match')
  })
  .required();

// Infer type from schema
type FormValues = yup.InferType<typeof schema>;

// Fields validated on server
type serverFieldError = {
  username?: string;
  email?: string;
  password?: string;
};

const SignUpForm = () => {
  const [serverFieldErrors, setServerFieldErrors] = useState<serverFieldError>(
    {}
  );
  const [signup, { data, error }] = useMutation(REGISTER_USER, {
    onError: (e) => {
      // Extract new errors from graphQL error and update state

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
      if (e.message.includes('duplicate key value')) {
        const str = e.graphQLErrors[0].extensions.exception.detail;
        if (str.includes('username')) {
          newErrors = { username: 'username is already taken' };
          console.log('1');
        }
        if (str.includes('email')) {
          newErrors = { email: 'email is already taken' };
          console.log('11');
        }
      }

      setServerFieldErrors(newErrors);
      console.log('<>', newErrors);
    },
    onCompleted: (d) => {
      console.log('added to db:', d);
      reset();
    }
  });

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

  const onSubmit = async (formData: FormValues) => {
    setServerFieldErrors({});
    console.log('fd', formData);
    try {
      await signup({
        variables: {
          data: {
            username: formData.username,
            email: formData.email,
            password: formData.password
          }
        }
      });
      console.log('foo:', data);
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

      <TextField
        {...register('username')}
        label="User name"
        error={'username' in serverFieldErrors || 'username' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          ('username' in serverFieldErrors ? serverFieldErrors.username : '') +
          (formFieldErrors.username
            ? formFieldErrors.username.message || ''
            : '')
        }
      />
      <TextField
        {...register('email')}
        label="E-mail address"
        error={'email' in serverFieldErrors || 'email' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          ('email' in serverFieldErrors ? serverFieldErrors.email : '') +
          (formFieldErrors.email ? formFieldErrors.email.message || '' : '')
        }
      />
      <TextField
        {...register('password')}
        label="Select a password"
        error={'password' in serverFieldErrors || 'password' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        type="password"
        helperText={
          ('password' in serverFieldErrors ? serverFieldErrors.password : '') +
          (formFieldErrors.password
            ? formFieldErrors.password.message || ''
            : '')
        }
      />
      <TextField
        {...register('passwordRepeat')}
        size="small"
        label="Repeat password"
        error={
          'passwordRepeat' in serverFieldErrors ||
          'passwordRepeat' in formFieldErrors
        }
        fullWidth
        margin="dense"
        type="password"
        helperText={
          formFieldErrors.passwordRepeat
            ? formFieldErrors.passwordRepeat.message || ''
            : ''
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
    </Box>
  );
};

export default SignUpForm;
