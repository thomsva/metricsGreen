import { useQuery } from '@apollo/client';
import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import USERS from '../graphQl/queries/USERS';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UsersData {
  users: User[];
}

const UserList = () => {
  const { loading, data, error } = useQuery<UsersData>(USERS);
  if (error)
    return (
      <Alert data-testid="usersDataError" severity="error">
        {error.message}
      </Alert>
    );
  if (loading) return <HourglassBottomIcon />;
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.users.map((u) => (
                <TableRow
                  key={u.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    data-testid={'id' + u.id}
                    component="th"
                    scope="row"
                  >
                    {u.id}
                  </TableCell>
                  <TableCell data-testid={'username' + u.id}>
                    {u.username}
                  </TableCell>
                  <TableCell data-testid={'email' + u.id}>{u.email}</TableCell>
                  <TableCell data-testid={'role' + u.id}>{u.role}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
