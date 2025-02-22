import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import instance from "../../../axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { fetchNotifications } from "../../redux/NotificationSlice";
import { RiDeleteBin2Fill } from "react-icons/ri";

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const handleDelete = async (id) => {
    try {
      await instance.delete(`Notification/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Notification deleted successfully");
      dispatch(fetchNotifications());
    } catch {
      toast.error("Failed to delete notification");
    }
  };
  return (
    <div>
      <div className="main-header">
        <h1>Notification</h1>
        <button onClick={() => navigate("/admin/addnotification")}>
          <FaPlus />
          Add New
        </button>
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
                <div>Title</div>
              </TableCell>
              <TableCell>
                <div>Content</div>
              </TableCell>
              <TableCell>
                <div>Action</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications?.map((notification, index) => (
              <TableRow key={index} className="subContent">
                <TableCell>
                  <p>{notification.id}</p>
                </TableCell>
                <TableCell>
                  <p>{notification.title}</p>
                </TableCell>
                <TableCell>
                  <p>{notification.content}</p>
                </TableCell>
                <TableCell className="edit">
                  <button
                    className="--btn"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <RiDeleteBin2Fill size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {}
    </div>
  );
};

export default Notifications;
