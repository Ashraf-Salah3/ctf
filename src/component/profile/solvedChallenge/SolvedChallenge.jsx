import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  PaginationItem,
  Pagination,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./solved-challenges.module.scss";
import { fetchUsersSubmissions, setSubmissionFilter } from "../../redux/submissionSlice";
import Loading from "../../Loading/Loading";

const SolvedChallenge = () => {
  const { submissions, submissionStatus, totalPages, submissionFilter } =
    useSelector((state) => state.submission);
  const dispatch = useDispatch();
  const nameIdentifier = localStorage.getItem("nameIdentifier");
  useEffect(() => {
    dispatch(
      fetchUsersSubmissions({
        ...submissionFilter,
        PageSize: 5,
        UserId: nameIdentifier,
        Status: true,
      })
    );
  }, [dispatch, submissionFilter, nameIdentifier, totalPages]);

  const handlePageChange = (_, page) => {
    dispatch(setSubmissionFilter({ ...submissionFilter, PageIndex: page }));
  };
  const convertData = (order) => {
    const timestamp = order?.date;
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB");

    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <div className={styles["solved-challenges"]}>
      {submissionStatus === "loading" ? (
        <Loading/>
      ) : submissionStatus === "failed" ? (
        <p className={styles.loading}>No Challenges Founded</p>
      ) : submissions.length > 0 ? (
        <div className={styles["challenges"]}>
          <TableContainer
            component={Paper}
            className={styles["tableContainer"]}
            style={{ backgroundColor: "#101010" }}
          >
            <Table className="table table-striped table-hover">
              <TableHead className={styles["subhead"]}>
                <TableRow>
                  <TableCell>
                    <div>Name</div>
                  </TableCell>
                  <TableCell>
                    <div>Category</div>
                  </TableCell>
                  <TableCell>
                    <div>Point Value</div>
                  </TableCell>
                  <TableCell>
                    <div>Level</div>
                  </TableCell>
                  <TableCell>
                    <div>Type</div>
                  </TableCell>
                  <TableCell>
                    <div>Date</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions?.map((submission, index) => (
                  <TableRow key={index} className={styles["subContent"]}>
                    <TableCell><p>{submission.challengeName}</p></TableCell>
                    <TableCell><p>{submission.challengeCategory}</p></TableCell>
                    <TableCell><p>{submission.pointValue}</p></TableCell>
                    <TableCell><p>{submission.level}</p></TableCell>
                    <TableCell><p>{submission.challengeType}</p></TableCell>
                    <TableCell><p>{convertData(submission)}</p></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className={styles.pagination}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={submissionFilter?.PageIndex || 1}
                color="primary"
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    sx={{ color: "white" }}
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          </div>
        </div>
      ) : (
        <p className={styles.loading}>No Result Found</p>
      )}
    </div>
  );
};

export default SolvedChallenge;
