import { makeVar } from '@apollo/client';

// Apollo Client reactive variable.
// Initializes to true if localStorage includes a 'token' key,
// false otherwise
export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem('token'));
