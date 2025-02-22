import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../redux/usersSlice";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const AdminProtect = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);


  // Fetch user data after initial render
  useEffect(() => {
    dispatch(fetchUserById());
  }, [dispatch]);

  // Check if user is a CreatorCTF and set userIsCreator flag accordingly

  if (user?.roles?.[0] === "CreatorCTF") {
    return <Navigate to="/admin" />;
  }
  return  children;
};
AdminProtect.propTypes = {
  children: PropTypes.node.isRequired,

}


export default AdminProtect;
