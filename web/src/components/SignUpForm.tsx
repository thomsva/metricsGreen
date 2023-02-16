import { useMutation } from '@apollo/client';
import { Alert, Box, Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { REGISTER } from '../graphQl';

const SignUpForm = () => {
  type FormValues = {
    nickname: string;
    email: string;
    password: string;
    passwordRepeat: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  const [signup] = useMutation(REGISTER);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await signup({
        variables: {
          data: {
            nickname: data.nickname,
            email: data.email,
            password: data.password
          }
        }
      });
      console.log('New user:', result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        size="small"
        label="User name"
        fullWidth
        margin="dense"
        {...register('nickname', { required: true })}
      />
      <TextField
        size="small"
        label="E-mail address"
        fullWidth
        margin="dense"
        {...register('email', { required: true })}
      />
      <TextField
        size="small"
        label="Select a password"
        fullWidth
        margin="dense"
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
