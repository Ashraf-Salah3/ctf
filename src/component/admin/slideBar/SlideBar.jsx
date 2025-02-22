import { NavLink } from "react-router-dom";
import { logo } from "../../../assets";
import styles from "./slide-bar.module.scss";
import { FaFileAlt, FaHome, FaUserAlt } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiFlag1, CiTrophy } from "react-icons/ci";
import { IoMdNotifications } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../redux/usersSlice";

const SlideBar = () => {
  const activeLink = ({ isActive }) => (isActive ? styles.active : "");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [userIsCreator, setUserIsCreator] = useState(false);

  // Fetch user data after initial render
  useEffect(() => {
    dispatch(fetchUserById());
  }, [dispatch]);

  // Check if user is a CreatorCTF and set userIsCreator flag accordingly
  useEffect(() => {
    if (user?.roles?.[0] === "CreatorCTF") {
      setUserIsCreator(true);
    }
  }, [user?.roles]);

  return (
    <div className={styles["slide-container"]}>
      <div className={styles.logo}>
        <img src={logo} alt="" />
        <h2>SPIDER</h2>
      </div>
      <div className={styles["slide-links"]}>
        <ul>
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/adminDashboard" className={activeLink}>
                <FaHome /> <span>DashBoard</span>
              </NavLink>
            </li>
          )}
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/users" className={activeLink}>
                <FaRegCircleUser />
                <span>Users</span>
              </NavLink>
            </li>
          )}
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/scorebord" className={activeLink}>
                <CiTrophy />
                <span>Scorebord</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/admin/challengs" className={activeLink}>
              <CiFlag1 />
              <span>Challengs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/category" className={activeLink}>
              <CiFlag1 />
              <span>Categories</span>
            </NavLink>
          </li>
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/competition" className={activeLink}>
                <CiFlag1 />
                <span>Competition</span>
              </NavLink>
            </li>
          )}
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/submissions" className={activeLink}>
                <FaFileAlt />
                <span>Submissions</span>
              </NavLink>
            </li>
          )}
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/notifications" className={activeLink}>
                <IoMdNotifications />
                <span>Notifications</span>
              </NavLink>
            </li>
          )}
          {!userIsCreator && (
            <li>
              <NavLink to="/admin/account" className={activeLink}>
                <FaUserAlt />
                <span>Account</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SlideBar;
