import { useDispatch, useSelector } from "react-redux";
import styles from "./challenge.module.scss";
import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchChallenges,
  setChallengeFilter,
} from "../redux/challengeSlice";
import { PiCoinsFill } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import instance from "../../axios";
import { toast } from "sonner";
import { PaginationItem, Pagination, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiltersSidebar from "../FiltersSidebar/FiltersSidebar";
import PropTypes from "prop-types";
import Loading from "../Loading/Loading";
import { motion } from "framer-motion";

const Challenge = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsShown, setHintsShown] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { challenges, challengeFilter, challengeStatus, totalPages } =
    useSelector((state) => state.challenge);
  const dispatch = useDispatch();
  const nameIdentifier = localStorage.getItem("nameIdentifier");

  useEffect(() => {
    dispatch(fetchChallenges({ ...challengeFilter, UserId: nameIdentifier }));
    dispatch(fetchCategories());
  }, [dispatch, challengeFilter, nameIdentifier]);

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setShowPopup(true);
  };

  const handlePageChange = (event, page) => {
    dispatch(setChallengeFilter({ ...challengeFilter, PageIndex: page }));
  };

  const onSubmit = async (data) => {
    try {
      const response = await instance.post("Submission", {
        userId: nameIdentifier,
        challengeId: selectedChallenge.id,
        provided: data.Flag,
      });
      if (response.data.data.status) {
        toast.success("Challenge Solved!");
        dispatch(
          fetchChallenges({ ...challengeFilter, UserId: nameIdentifier })
        );
        reset();
        closePopup();
      } else {
        toast.error("Incorrect Flag. Try Again!");
        reset();
      }
    } catch {
      toast.error("Incorrect Flag. Try Again!");
      reset();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleShowHint = async () => {
    setShowHint(true);
    setHintsShown((prevHints) => [...prevHints, selectedChallenge.id]);
    try {
      await instance.post("/Challenge/showhint", {
        challengeId: selectedChallenge.id,
        userId: nameIdentifier,
      });
    } catch {
      return null;
    }
  };

  const handleDownload = async (imageUrl) => {
    if (!imageUrl) {
      toast.error("No file to download");
      return;
    }
    setLoading(true);
    try {
      const response = await instance.get("Challenge/download", {
        params: { link: imageUrl },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Credential.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to Download");
    } finally {
      setLoading(false);
    }
  };
  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.7 } },
  };

  return (
    <div className={styles["challenge-container"]}>
      <div className={styles["sidebar-container"]}>
        <FiltersSidebar />
      </div>
      <div className={styles["challenge-items"]}>
        {challengeStatus === "loading" ? (
          <Loading />
        ) : challengeStatus === "failed" ? (
          <p className="loading">Failed. Please check your connection.</p>
        ) : challenges?.length > 0 ? (
          <div className={styles.main}>
            <div className={styles.title}>
              <h1>Challenges</h1>
            </div>
            <motion.div
              className={styles["challenges"]}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {challenges?.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  className={`${styles["box"]} ${
                    challenge?.isSolved ? styles["solved"] : ""
                  }`}
                  onClick={() => handleChallengeClick(challenge)}
                  variants={itemVariants}
                  style={{
                    animation: `fadeInUp 2s ease-in-out forwards`,
                    animationDelay: `${5 * (index + 1)}s`,
                  }}
                >
                  <div className={styles["box-top"]}>
                    <p>{challenge.categoryName}</p>
                    <p
                      className={styles.level}
                      style={{
                        background:
                          challenge.level === "Easy"
                            ? "#127c69"
                            : challenge.level === "Medium"
                            ? "#d97920"
                            : challenge.level === "Hard"
                            ? "#c62648"
                            : "",
                      }}
                    >
                      {challenge.level}
                    </p>
                  </div>
                  <h4>{challenge.name}</h4>
                  <p className={styles.value}>
                    <span className={styles["value-icon"]}>
                      <PiCoinsFill />
                    </span>
                    {challenge.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={challengeFilter?.PageIndex || 1}
                    color="primary"
                    onChange={handlePageChange}
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                        }}
                        {...item}
                      />
                    )}
                  />
                </Stack>
              </div>
            )}
          </div>
        ) : (
          <p className="loading">No Result Found</p>
        )}
      </div>

      {showPopup && (
        <div className={styles["popup-overlay"]} onClick={closePopup}>
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <IoClose
              size={22}
              className={styles["close-icon"]}
              onClick={closePopup}
            />
            {selectedChallenge && (
              <>
                <div className={styles.type}>
                  <h4
                    className={styles.level}
                    style={{
                      background:
                        selectedChallenge.level === "Easy"
                          ? "#127c69"
                          : selectedChallenge.level === "Medium"
                          ? "#d97920"
                          : selectedChallenge.level === "Hard"
                          ? "#c62648"
                          : "",
                    }}
                  >
                    {selectedChallenge.level}
                  </h4>
                  <p>{selectedChallenge.userSolverCounts} Users Solved</p>
                </div>

                <div className={styles.items}>
                  <h2>{selectedChallenge.name}</h2>
                  <p className={styles.value}>
                    <span className={styles["value-icon"]}>
                      <PiCoinsFill color="#FE8901" />
                    </span>
                    {selectedChallenge.value}
                  </p>
                  <p>
                    {selectedChallenge.message}{" "}
                    {selectedChallenge.attachmentUrl !==
                      "https://ctfchallenge.runasp.net/files/Challanges/" && (
                      <button
                        className={styles["download-file"]}
                        onClick={() =>
                          handleDownload(selectedChallenge?.attachmentUrl)
                        }
                        disabled={loading}
                      >
                        download file
                      </button>
                    )}
                  </p>

                  {!hintsShown.includes(selectedChallenge.id) && (
                    <button
                      onClick={handleShowHint}
                      className={styles["hint-btn"]}
                    >
                      Hint For {selectedChallenge.hintValue} Points
                    </button>
                  )}
                </div>
                {showHint && hintsShown.includes(selectedChallenge.id) && (
                  <p className={styles.hint}>Hint: {selectedChallenge.hint}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles["form-input"]}>
                    <input
                      id="Flag"
                      type="text"
                      placeholder="Flag"
                      {...register("Flag", { required: true })}
                    />
                  </div>
                  <div className={styles["submit-button"]}>
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Challenge.propTypes = {
  challenges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      categoryName: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      isSolved: PropTypes.bool,
      message: PropTypes.string,
      attachmentUrl: PropTypes.string,
      hint: PropTypes.string,
      hintValue: PropTypes.number,
      userSolverCounts: PropTypes.number,
    })
  ).isRequired,
  challengeFilter: PropTypes.shape({
    PageIndex: PropTypes.number,
  }).isRequired,
  totalPages: PropTypes.number.isRequired,
  challengeStatus: PropTypes.oneOf(["loading", "failed", "succeeded"])
    .isRequired,
  userIsInCompetition: PropTypes.bool.isRequired,
};

export default Challenge;
