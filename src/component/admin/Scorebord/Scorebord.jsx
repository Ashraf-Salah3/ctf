import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect } from "react";
import { fetchUsers } from "../../redux/usersSlice";
import { useDispatch, useSelector } from "react-redux";

const Scorebord = () => {
  const dispatch = useDispatch();
  const { users, userFilter, userStatus, } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers(userFilter));
  }, [dispatch, userFilter]);

  // const handlePageChange = (event, newPage) => {
  //   dispatch(fetchUsers({ ...userFilter, pageIndex: newPage }));
  // };

  return (
    <div>
      <div className="main-header">
        <h1>Scoreboard</h1>
      </div>
      {userStatus === "loading" ? (
        <p className="loading">Loading...</p>
      ) : userStatus === "failed" ? (
        <p className="loading">Faild Please Check Your Connection.</p>
      ) : userStatus?.length > 0 ? (
        <div className="tabel-container">
          <div>
            <TableContainer
              component={Paper}
              className="tableContainer"
              style={{ backgroundColor: "#101010" }}
            >
              <Table className="table table-striped table-hover">
                <TableHead className="subhead">
                  <TableRow>
                    <TableCell>
                      <div>Rank</div>
                    </TableCell>
                    <TableCell>
                      <div>User Name</div>
                    </TableCell>
                    <TableCell>
                      <div>Challenges Solved</div>
                    </TableCell>
                    <TableCell>
                      <div>Points Earned</div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((user, index) => (
                    <TableRow key={index} className="subContent">
                      <TableCell>
                        <p>{index + 1}</p>
                      </TableCell>
                      <TableCell>
                        <p>{user.displayName}</p>
                      </TableCell>
                      <TableCell>
                        <p>{user.tottalSolved}</p>
                      </TableCell>
                      <TableCell>
                        <p>{user.totalScore}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* {totalPages > 1 && (
              <div>
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={userFilter?.PageIndex || 1}
                    color="primary"
                    onChange={handlePageChange}
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                        }}
                        {...item}
                      />
                    )}
                  />
                </Stack>
              </div> }
            )*/}
          </div>
        </div>
      ) : (
        <p className="loading">No Result Found</p>
      )}
    </div>
  );
};

export default Scorebord;
