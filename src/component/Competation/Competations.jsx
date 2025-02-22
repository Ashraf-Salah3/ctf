import { useDispatch, useSelector } from "react-redux";
import styles from "./competations.module.scss";
import { useEffect, useCallback, useState } from "react";
import {
  fetchCompetations,
  setCompetitionFilter,
} from "../redux/competationSlice";
import { formatDistanceToNow, format, isValid } from "date-fns";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { checkUserInTeam } from "../redux/checkUserSlice";
import { toast } from "sonner";
import instance from "../../axios";
import Loading from "../Loading/Loading";

const Competitions = () => {
  const [competitionIsStarted, setCompetitionIsStarted] = useState(false);
  const [competitionIsEnded, setCompetitionIsEnded] = useState(false);
  const { competations, competationFilter, totalPages, competationStatus } =
    useSelector((state) => state.competation);
  const { userInteam } = useSelector((state) => state.checkUsers);
  const [loading, setLoading] = useState(false);
  const [webSite, setWebSite] = useState("");

  const nameIdentifier = localStorage.getItem("nameIdentifier");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompetations(competationFilter));
  }, [dispatch, competationFilter]);

  useEffect(() => {
    instance.get("Website", { params : {webiste: "competition" }}).then((res) => {
      setWebSite(res.data.data.url);
    });
  }, []);

  console.log(webSite)

  const formatDateAndTimeLeft = useCallback((dateStr) => {
    const utcDate = new Date(dateStr);
    if (!isValid(utcDate)) {
      return { formattedDate: "Invalid Date", timeLeft: "Invalid Date" };
    }
    const localDate = new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
    );
    const formattedDate = format(localDate, "MMM dd, yyyy");
    const timeLeft = formatDistanceToNow(localDate, { addSuffix: true });
    return { formattedDate, timeLeft };
  }, []);

  const handlePageChange = useCallback(
    (_, page) => {
      dispatch(setCompetitionFilter({ ...competationFilter, PageIndex: page }));
    },
    [dispatch, competationFilter]
  );

  const handleJoinClick = async (id) => {
    try {
      setLoading(true);
      const response = await instance.get(`Competation/${id}`);
      if (response.data.statusCode === 400) {
        setCompetitionIsEnded(true);
      } else if (response.data.statusCode === 200) {
        setCompetitionIsStarted(true);
      }
      await dispatch(checkUserInTeam(id)).unwrap();
      setLoading(false);
      setTimeout(() => {
        if (competitionIsEnded) {
          toast.info("Competition has ended.");
          return;
        } else if (competitionIsStarted && !userInteam) {
          toast.info("Competition has already started.");
        } else {
          window.open(
            `${webSite}/?id=${id}&userId=${nameIdentifier}`,
            "_blank"
          );
        }
      }, 100);
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className={styles["competation-container"]}>
      {competationStatus === "loading" ? (
        <Loading />
      ) : competationStatus === "failed" ? (
        <p className="loading">Failed. Please check your connection.</p>
      ) : competations.length > 0 ? (
        <div className="container">
          <h1>Competitions</h1>
          <div className={styles["competitions"]}>
            {competations?.map((competition) => {
              const { formattedDate, timeLeft } = formatDateAndTimeLeft(
                competition.startDate
              );

              return (
                <div
                  key={competition.id}
                  className={styles["competition-card"]}
                >
                  <span
                    style={{
                      background:
                        competition?.status?.toLowerCase() === "public"
                          ? "rgba(222, 209, 206, 0.31)"
                          : "rgba(64, 16, 6, 0.31)",
                    }}
                  >
                    {competition?.status}
                  </span>
                  <div className={styles.image}>
                    <img src={competition.attachment} alt="Competition" />
                  </div>
                  <h3>{competition.name}</h3>
                  <p>{competition.description}</p>
                  <p className={styles.date}>{formattedDate}</p>
                  <div className={styles["competition-join"]}>
                    <button
                      onClick={() => handleJoinClick(competition.id)}
                      disabled={loading}
                    >
                      {loading ? "loading" : "Join"}
                    </button>
                    <p>{timeLeft}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.pagination}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={competationFilter?.PageIndex || 1}
                color="primary"
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          </div>
        </div>
      ) : (
        <p className="loading">No results found.</p>
      )}
    </div>
  );
};

export default Competitions;
