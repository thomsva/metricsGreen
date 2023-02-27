import { useMutation } from '@apollo/client';
import { Alert, Chip, Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import REGISTER_USER from '../graphQl/mutations/REGISTER_USER';
import { fieldErrorsFromGqlError } from '../formTools';
import USERS from '../graphQl/queries/USERS';

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

interface Props {
  closeForm: () => void;
}

const SignUpForm = ({ closeForm }: Props) => {
  const [serverFieldErrors, setServerFieldErrors] = useState<serverFieldError>(
    {}
  );

  const [signup] = useMutation(REGISTER_USER, {
    refetchQueries: [{ query: USERS }],
    onError: (e) => setServerFieldErrors(fieldErrorsFromGqlError(e)),
    onCompleted: () => {
      reset();
      closeForm();
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
          <Chip label={`${Object.keys(formFieldErrors).length} form errors`} />
          <Chip
            label={`${Object.keys(serverFieldErrors).length} server errors`}
          />
        </Alert>
      )}

      <TextField
        data-testid="username"
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
        data-testid="email"
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
        data-testid="password"
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
        data-testid="passwordRepeat"
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

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          data-testid="cancel"
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => closeForm()}
        >
          Cancel
        </Button>
        <Button
          data-testid="submit"
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
