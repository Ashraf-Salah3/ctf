import { NavLink } from "react-router-dom";
import { logo } from "../../../assets";
import styles from "./slide-bar.module.scss";
import { FaFileAlt, FaUserAlt } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiFlag1, CiTrophy } from "react-icons/ci";
import { IoMdNotifications } from "react-icons/io";
import { useSelector } from "react-redux";
import { TbCategoryFilled } from "react-icons/tb";
import { GiTrophyCup } from "react-icons/gi";
import { useMemo } from "react";

const SlideBar = () => {
  const activeLink = ({ isActive }) => (isActive ? styles.active : "");
  const { user } = useSelector((state) => state.users);

  const userIsCreator = useMemo(() => user?.roles?.includes("CreatorCTF"), [user?.roles]);

  return (
    <div className={styles["slide-container"]}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
        <h2>SPIDER</h2>
      </div>
      <div className={styles["slide-links"]}>
        <ul>
          {!userIsCreator && (
            <>
              <li>
                <NavLink to="/admin/users" className={activeLink}>
                  <FaRegCircleUser />
                  <span>Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/scorebord" className={activeLink}>
                  <CiTrophy />
                  <span>Scorebord</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/competition" className={activeLink}>
                  <GiTrophyCup />
                  <span>Competition</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/submissions" className={activeLink}>
                  <FaFileAlt />
                  <span>Submissions</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/notifications" className={activeLink}>
                  <IoMdNotifications />
                  <span>Notifications</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/account" className={activeLink}>
                  <FaUserAlt />
                  <span>Account</span>
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to="/admin/challenges" className={activeLink}>
              <CiFlag1 />
              <span>Challengs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/category" className={activeLink}>
              <TbCategoryFilled />
              <span>Categories</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SlideBar;
