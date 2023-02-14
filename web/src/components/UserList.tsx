import { useQuery } from '@apollo/client';
import {
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
  const { loading, data } = useQuery<UsersData>(USERS_QUERY);
  return (
    <Box>
      {loading ? (
        <HourglassBottomIcon />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Nickname</TableCell>
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
                    <TableCell align="right">{u.nickname}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserList;
