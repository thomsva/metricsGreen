import { ApolloError } from 'apollo-client';

export const fieldErrorsFromGqlError = (e: ApolloError) => {
  // Extract error message per field from ApolloError
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
    }
    if (str.includes('email')) {
      newErrors = { email: 'email is already taken' };
    }
  }
  return newErrors;
};
