import { CiFlag1, CiTrophy } from "react-icons/ci";
import { useEffect, useState } from "react";
import instance from "../../axios";
import styles from "./profile.module.scss";
import SolvedChallenge from "./solvedChallenge/SolvedChallenge";
import ProfileSetting from "./ProfileSetting/ProfileSetting";

const Profile = () => {
  const nameIdentifier = localStorage.getItem("nameIdentifier");
  const [user, setUser] = useState(null);
  const [showSolvedChallenge, setShowSolvedChallenge] = useState(false);
  const [showProfileSetting, setShowProfileSetting] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await instance.get(`Account/${nameIdentifier}`);
        setUser(response.data.data);
      } catch {
        return null;
      }
    };
    fetchUser();
  }, [nameIdentifier]);

  const handleSolvedChange = () => {
    setShowSolvedChallenge(true);
    setShowProfileSetting(false);
  };

  const handleSettingChange = () => {
    setShowProfileSetting(true);
    setShowSolvedChallenge(false);
  };

  return (
    <div className={styles.profile}>
      <div className="container">
        <div className={styles.pictureContainer}>
          <div className={styles.image}>
            <img src={user?.imageCover} alt="Image Cover" />
          </div>
          <h2>{user?.displayName}</h2>
        </div>

        <div className={styles.profileDetails}>
          {[
            {
              icon: <CiFlag1 size={30} />,
              title: "Points",
              value: user?.totalScore || 0,
            },
            {
              icon: <CiTrophy size={30} />,
              title: "Solved",
              value: user?.tottalSolved || 0,
            },
          ].map((item, index) => (
            <div key={index} className={styles.box}>
              {item.icon}
              <div>
                <h4>{item.title}</h4>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles["profile-actions"]}>
          <button
            onClick={handleSolvedChange}
            className={`${showSolvedChallenge ? styles.active : ""}`}
          >
            Solved Challenges
          </button>
          <button
            onClick={handleSettingChange}
            className={`${showProfileSetting ? styles.active : ""}`}
          >
            Settings
          </button>
        </div>

        {showProfileSetting && <ProfileSetting user={user} />}
        {showSolvedChallenge && <SolvedChallenge />}
      </div>
    </div>
  );
};

export default Profile;
