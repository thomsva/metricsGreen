import { useMutation } from '@apollo/client';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { REGISTER } from '../graphQl';
import * as yup from 'yup';

const schema = yup
  .object({
    nickname: yup.string().required().min(3),
    email: yup.string().required().email(),
    password: yup.string().required(),
    passwordRepeat: yup.string().required()
  })
  .required();

type FormValues = yup.InferType<typeof schema>;

const SignUpForm = () => {
  type serverFieldError = {
    // Fields to be extracted from GraphQl validation error from server
    nickname?: string;
    email?: string;
    password?: string;
  };

  const [serverFieldErrors, setServerFieldErrors] = useState<serverFieldError>(
    {}
  );
  const [signup, { data, loading, error }] = useMutation(REGISTER, {
    onError: (e) => {
      // Extract new errors from graphQL error and update state
      let newErrors = {};
      e.graphQLErrors[0].extensions.exception.validationErrors.forEach(
        (valError: { property: string; constraints: string[] }) =>
          (newErrors = {
            ...newErrors,
            [valError.property]: Object.values(valError.constraints)
              .map((m) => m)
              .join(' | ')
          })
      );
      setServerFieldErrors(newErrors);
      console.log('<>', newErrors);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formFieldErrors }
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  //  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {

  const onSubmit = async (formData: FormValues) => {
    setServerFieldErrors({});
    try {
      const result = await signup({
        variables: {
          data: {
            nickname: formData.nickname,
            email: formData.email,
            password: formData.password
          }
        }
      });
      console.log('Result from server', result);
    } catch (e) {
      console.error('error cought', e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error">
          Error:
          {
            error.graphQLErrors[0].extensions.exception.validationErrors[0]
              .property
          }
        </Alert>
      )}

      {serverFieldErrors && (
        <Alert severity="warning">
          {'email' in serverFieldErrors ? 'email' : 'nope'}
        </Alert>
      )}

      <TextField
        {...register('nickname')}
        label="User name"
        error={'nickname' in serverFieldErrors || 'nickname' in formFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          ('nickname' in serverFieldErrors ? serverFieldErrors.nickname : '') +
          (formFieldErrors.nickname
            ? formFieldErrors.nickname.message || ''
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
        error={'password' in serverFieldErrors}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          'password' in serverFieldErrors ? serverFieldErrors.password : ''
        }
      />
      <TextField
        {...register('passwordRepeat')}
        size="small"
        label="Repeat password"
        fullWidth
        margin="dense"
      />

      {formFieldErrors.nickname && (
        <Alert severity="error">{formFieldErrors.nickname.message}</Alert>
      )}
      {formFieldErrors.email && (
        <Alert severity="error">{formFieldErrors.email.message}</Alert>
      )}
      {formFieldErrors.password && (
        <Alert severity="error">{formFieldErrors.password.message}</Alert>
      )}
      {formFieldErrors.passwordRepeat && (
        <Alert severity="error">{formFieldErrors.passwordRepeat.message}</Alert>
      )}

      <Box display="flex" justifyContent="flex-end" mt={5}>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpForm;
