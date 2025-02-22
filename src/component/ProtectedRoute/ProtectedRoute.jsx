import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, 
  };
export default ProtectedRoute;
