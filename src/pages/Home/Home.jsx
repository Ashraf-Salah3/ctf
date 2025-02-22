import { FaFacebook, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa";
import styles from "./home.module.scss";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.homeItem}>
        <div className={styles.typewriter}>
          <h2>
            Welcome To <span>Spider</span> Ctf 
          </h2>
        </div>
        <p className={styles.desc}>
          Get ready to test your skills in our exciting challenges. Follow us on
          social media to stay updated
        </p>
        <div className={styles.icons}>
          <a
            href="https://www.youtube.com/@SPIDERS5667"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={30} color="#fff" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61552356623053&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={30} color="#fff" />
          </a>
          <a
            href="https://www.linkedin.com/company/spiders-for-cyber-security/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={30} color="#fff" />
          </a>
          <a
            href="https://wa.me/201061440936"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={30} color="#fff" />
          </a>
        </div>
        <div className={styles.btn}>
          <p>
            <NavLink to="/login">Click Here</NavLink> to login and setup your
            CTF
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
