import {  Outlet, useNavigate } from "react-router-dom";
import styles from "./admin.module.scss";
import SlideBar from "../../component/admin/slideBar/SlideBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../component/redux/usersSlice";

const Admin = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const nameIdentifier = localStorage.getItem("nameIdentifier");
  const navigate = useNavigate();

  // Fetch user data after initial render
  useEffect(() => {
    if (nameIdentifier) {
      dispatch(fetchUserById(nameIdentifier));
    }
  }, [dispatch, nameIdentifier]);

  // Navigate if the user has no roles
  useEffect(() => {
    if ( user.roles?.length === 0) {
      navigate("/");
    }
  }, [user, navigate]);

  if (user.roles?.length === 0) return null; 

  return (
    <div className={styles.adminPage}>
      <div className={styles.sidebar}>
        <SlideBar />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
