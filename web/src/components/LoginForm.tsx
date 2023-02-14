import { useMutation } from '@apollo/client';
import { Alert, Box, Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LOGIN } from '../graphQl';
import { isLoggedInVar } from '../cache';

const LoginForm = () => {
  type FormValues = {
    nickname: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  const [login, { client }] = useMutation(LOGIN);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await login({ variables: data });
    localStorage.setItem('token', result.data.login as string);
    isLoggedInVar(true);
    client.resetStore();
    // window.location.reload();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          defaultValue="testuser"
          {...register('nickname', { required: true })}
        />
        <TextField
          defaultValue="pwd"
          {...register('password', { required: true })}
        />
        {errors.nickname && (
          <Alert severity="error">Name field is required</Alert>
        )}
        {errors.password && (
          <Alert severity="error">Password field is required</Alert>
        )}
        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
