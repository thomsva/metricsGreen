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
import { USERS_QUERY } from '../graphQl';

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
}

interface UsersData {
  users: User[];
}

const UserList = () => {
  const { loading, data, error } = useQuery<UsersData>(USERS_QUERY);
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (loading) return <HourglassBottomIcon />;
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nickname</TableCell>
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
                  <TableCell component="th" scope="row">
                    {u.id}
                  </TableCell>
                  <TableCell>{u.nickname}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
