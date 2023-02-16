import { useMutation } from '@apollo/client';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { REGISTER } from '../graphQl';

const SignUpForm = () => {
  type FormValues = {
    nickname: string;
    email: string;
    password: string;
    passwordRepeat: string;
  };

  type formError = {
    field: string;
    errorMessages: string;
  };

  const [formErrors, setFormErrors] = useState<formError[]>([]);

  const [signup, { data, loading, error }] = useMutation(REGISTER, {
    onError: (e) => {
      // Extract new errors from graphQL error and update state
      const newErrors =
        e.graphQLErrors[0].extensions.exception.validationErrors.map(
          (valError: { property: string; constraints: string[] }) => {
            return {
              field: valError.property,
              errorMessages: Object.values(valError.constraints)
                .map((m) => m)
                .join(' | ')
            };
          }
        );
      setFormErrors(newErrors);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  const onSubmit = async (formData: FormValues) => {
    setFormErrors([]);
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
          Error:{formErrors.length}
          {
            error.graphQLErrors[0].extensions.exception.validationErrors[0]
              .property
          }
        </Alert>
      )}

      {/* {formErrors &&
        formErrors.map((x) => (
          <Alert key={x.field} severity="error">
            {x.field}
            {': '}
            {x.errorMessages}
          </Alert>
        ))} */}

      <TextField
        label="User name"
        error={formErrors.some((e) => e.field === 'nickname')}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          formErrors.some((e) => e.field === 'nickname')
            ? formErrors.filter((e) => e.field === 'nickname')[0].errorMessages
            : false
        }
        {...register('nickname', { required: true })}
      />
      <TextField
        label="E-mail address"
        error={formErrors.some((e) => e.field === 'email')}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          formErrors.some((e) => e.field === 'email')
            ? formErrors.filter((e) => e.field === 'email')[0].errorMessages
            : false
        }
        {...register('email', { required: true })}
      />
      <TextField
        label="Select a password"
        error={formErrors.some((e) => e.field === 'password')}
        size="small"
        fullWidth
        margin="dense"
        helperText={
          formErrors.some((e) => e.field === 'password')
            ? formErrors.filter((e) => e.field === 'password')[0].errorMessages
            : false
        }
        {...register('password', { required: true })}
      />
      <TextField
        size="small"
        label="Repeat password"
        fullWidth
        margin="dense"
        {...register('passwordRepeat', { required: true })}
      />

      {errors.nickname && (
        <Alert severity="error">Name field is required</Alert>
      )}
      {errors.password && (
        <Alert severity="error">Password field is required</Alert>
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
