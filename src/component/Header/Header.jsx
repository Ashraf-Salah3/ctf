import { NavLink, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { logo } from "../../assets";
import { RiNotification2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import instance from "../../axios";
import { useDispatch } from "react-redux";
import { checkUserInCompetition } from "../redux/checkUserSlice";

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPage, setScrollPage] = useState(false);
  const [count, setCount] = useState(0);
  const isAuthenticated = localStorage.getItem("authToken");
  const nameIdentifier = localStorage.getItem("nameIdentifier");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fixNavbar = () => setScrollPage(window.scrollY > 50);
    window.addEventListener("scroll", fixNavbar);
    return () => window.removeEventListener("scroll", fixNavbar);
  }, []);

  useEffect(() => {
    dispatch(checkUserInCompetition());
  }, [dispatch]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const hideMenu = () => {
    setShowMenu(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("nameIdentifier");
    localStorage.removeItem("competationId");
    navigate("/");
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await instance.get("Notification/count", {
          params: { userId: nameIdentifier },
        });
        setCount(response.data);
      } catch {
        return null;
      }
    };
    fetchCount();
  }, [nameIdentifier]);
  return (
    <>
      <header className={scrollPage ? styles.fixed : ""}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="" />
            <h3>SPIDER CTF</h3>
          </div>
          <nav
            className={
              showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
            }
          >
            <div className={styles.links}>
              <ul>
                <li className={styles["logo-mobile"]}>
                  <div className={styles.logo}>
                    <img src={logo} alt="" />
                    <h3>SPIDER CTF</h3>
                  </div>
                  <FaTimes size={22} color="#fff" onClick={hideMenu} />
                </li>
                <li>
                  <NavLink to="/scoreboard" className={activeLink}>
                    Scoreboard{" "}
                  </NavLink>
                </li>

                  <li>
                    <NavLink to="/challenge" className={activeLink}>
                      Challenges{" "}
                    </NavLink>
                  </li>
                <li>
                  <NavLink to="/competations" className={activeLink}>
                    Competations{" "}
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
          <div className={styles["header-right"]}>
            <NavLink to="/notification">
              <div className={styles.notification}>
                <RiNotification2Fill size={22} />
                <span>{count}</span>
              </div>
            </NavLink>

            <NavLink to="/profile" className={activeLink}>
              <div className={styles.profile}>
                <span>{}</span>
                Profile
              </div>
            </NavLink>
            {isAuthenticated && (
              <NavLink onClick={handleLogout} className={styles.logout}>
                <FiLogOut />
              </NavLink>
            )}
          </div>
          <div className={styles["menu-icon"]}>
            <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} color="white" />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
