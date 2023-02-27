import { useMutation } from '@apollo/client';
import { Alert, Box, Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import LOGIN from '../graphQl/mutations/LOGIN';
import { isLoggedInVar } from '../cache';

interface Props {
  closeForm: () => void;
}

const LoginForm = ({ closeForm }: Props) => {
  type FormValues = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  const [login, { client }] = useMutation(LOGIN, {
    onError: (e) => console.log('hep', e)
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await login({ variables: data });
    if (result.data.login === null) {
      console.log('login failed');
    } else {
      // Store token
      localStorage.setItem('token', result.data.login.token);
      localStorage.setItem(
        'userLoggedInUsername',
        result.data.login.user.username
      );
      localStorage.setItem('userLoggedInRole', result.data.login.user.role);
      isLoggedInVar(true);
      client.resetStore();
      closeForm();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        data-testid="username"
        size="small"
        defaultValue="testuser"
        label="User name"
        fullWidth
        margin="dense"
        {...register('username', { required: true })}
      />
      <TextField
        data-testid="password"
        size="small"
        defaultValue="pwd"
        label="Password"
        fullWidth
        margin="dense"
        {...register('password', { required: true })}
      />
      {errors.username && (
        <Alert severity="error">Name field is required</Alert>
      )}
      {errors.password && (
        <Alert severity="error">Password field is required</Alert>
      )}

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          data-testid="cancel"
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => closeForm()}
        >
          Cancel
        </Button>
        <Button data-testid="submit" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
