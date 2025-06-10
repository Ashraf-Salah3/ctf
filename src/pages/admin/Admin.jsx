
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./admin.module.scss";
import SlideBar from "../../component/admin/slideBar/SlideBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../component/Loading/Loading";
import { fetchUserById } from "../../component/redux/usersSlice";

const Admin = () => {
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
      if (!user.roles?.includes("Admin") && !user.roles?.includes("CreatorCTF")) {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate,userIdStatus]);
  
  if (userIdStatus === "loading") {
    return <Loading/>
  }

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
