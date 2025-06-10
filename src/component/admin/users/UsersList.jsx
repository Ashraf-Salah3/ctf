import styles from "./users-list.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
//import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect } from "react";
import instance from "../../../axios";
import { toast } from "sonner";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Switch } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/usersSlice";

const UsersList = () => {
  const { users, userFilter,  } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers(userFilter));
  }, [dispatch, userFilter]);

  /*const handlePageChange = (_, page) => {
    dispatch(setUserFilter({ ...userFilter, PageIndex: page }));
  };*/

  const handleDelete = async (id) => {
    try {
      await instance.delete(`Account/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("User deleted successfully!");
      dispatch(fetchUsers(userFilter));
    } catch (error) {
      toast.error(error.message || "Failed to delete user.");
    }
  };

  const handleSwitchChange = async (id, checked) => {
    try {
      if (checked) {
        await instance.post(
          `Account/role`,
          { userId: id, role: "CreatorCtf" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        await instance.delete(`Account/role?UserId=${id}&Role=CreatorCtf`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      }
      dispatch(fetchUsers(userFilter));
    } catch {
      toast.error("Failed to update role.");
    }
  };

  return (
    <div className={styles["users-container"]}>
      <div className="main-header">
        <h1>Users</h1>
      </div>

      <TableContainer
        component={Paper}
        className="tableContainer"
        style={{ backgroundColor: "#101010" }}
      >
        <Table className="table table-striped table-hover">
          <TableHead className="subhead">
            <TableRow>
              <TableCell>
                <div>Id</div>
              </TableCell>
              <TableCell>
                <div>User</div>
              </TableCell>
              <TableCell>
                <div>Email</div>
              </TableCell>
              <TableCell>
                <div>Country</div>
              </TableCell>
              <TableCell>
                <div>Actions</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index} className="subContent">
                <TableCell>
                  <p>{user.id?.slice(0, 4)}</p>
                </TableCell>
                <TableCell>
                  <p>{user.displayName}</p>
                </TableCell>
                <TableCell>
                  <p>{user.email}</p>
                </TableCell>
                <TableCell>
                  <p>{user.country}</p>
                </TableCell>
                <TableCell className="edit">
                  <button
                    className={styles.editButton}
                    onClick={() => handleDelete(user.id)}
                  >
                    <RiDeleteBin2Fill size={18} />
                  </button>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.roles?.includes("CreatorCTF")}
                    onChange={(checked) => handleSwitchChange(user.id, checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*<Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={userFilter.PageIndex || 1}
          color="primary"
          onChange={handlePageChange}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>*/}
    </div>
  );
};

export default UsersList;
