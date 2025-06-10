import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../redux/usersSlice";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Loading from "../Loading/Loading";

const AdminProtect = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userIdStatus } = useSelector((state) => state.users);

  useEffect(() => {
    if (userIdStatus === "idle") {
      dispatch(fetchUserById());
    }
  }, [dispatch, userIdStatus]);

  useEffect(() => {
    if (userIdStatus === "succeeded" && user) {
      if (
        !user.roles?.includes("Admin") &&
        !user.roles?.includes("CreatorCTF")
      ) {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate, userIdStatus]);

  if (userIdStatus === "loading") {
    return <Loading />;
  }

  return children;
};
AdminProtect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtect;
