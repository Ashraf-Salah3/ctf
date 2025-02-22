import { useEffect } from "react";
import {
  fetchUsersSubmissions,
  setSubmissionFilter,
} from "../../redux/submissionSlice";
import styles from "./submissions.module.scss";
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

const Submissions = () => {
  const { submissions, submissionStatus, totalPages, submissionFilter } =
    useSelector((state) => state.submission);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsersSubmissions(submissionFilter));
  }, [dispatch, submissionFilter]);

  const handlePageChange = (_, page) => {
    if (page !== submissionFilter?.PageIndex) {
      dispatch(setSubmissionFilter({ ...submissionFilter, PageIndex: page }));
    }
  };

  const convertData = (order) => {
    if (!order?.date) return "N/A";
    const date = new Date(order.date);
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString(
      "en-GB"
    )}`;
  };

  return (
    <div className={styles["submissions-container"]}>
      {" "}
      <div className="main-header">
        <h1>Submissions</h1>
      </div>
      {submissionStatus === "loading" ? (
        <p className="loading">Loading...</p>
      ) : submissionStatus === "failed" ? (
        <p className="loading">No Challenges Founded</p>
      ) : submissions.length > 0 ? (
        <TableContainer
          component={Paper}
          className="tableContainer"
          style={{ backgroundColor: "#101010" }}
        >
          <Table className="table table-striped table-hover">
            <TableHead className="subhead">
              <TableRow>
                <TableCell>
                  <div>Id</div>
                </TableCell>
                <TableCell>
                  <div>User Name</div>
                </TableCell>
                <TableCell>
                  <div>Challenge</div>
                </TableCell>
                <TableCell>
                  <div>Category</div>
                </TableCell>
                <TableCell>
                  <div>Competition</div>
                </TableCell>
                <TableCell>
                  <div>Status</div>
                </TableCell>
                <TableCell>
                  <div>Provided</div>
                </TableCell>
                <TableCell>
                  <div>Date</div>
                </TableCell>
                {/*<TableCell>
                <div>Delete</div>
              </TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission, index) => (
                <TableRow key={index} className="subContent">
                  <TableCell>
                    <p>{submission.id}</p>
                  </TableCell>
                  <TableCell>
                    <p>{submission.userName}</p>
                  </TableCell>
                  <TableCell>
                    <p>{submission.challengeName}</p>
                  </TableCell>
                  <TableCell>
                    <p>{submission.challengeCategory}</p>
                  </TableCell>
                 
                    <TableCell>
                      <p>{submission.competationName}</p>
                    </TableCell>
              
                  <TableCell
                    className={
                      submission.status === true
                        ? styles.correct
                        : styles.inCorrect
                    }
                  >
                    <p>
                      {submission.status === true ? "Correct" : "InCorrect"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{submission.provided}</p>
                  </TableCell>
                  <TableCell>
                    <p>{convertData(submission)}</p>
                  </TableCell>
                  {/*<TableCell className="edit">
                  <button
                    className={styles.editButton}
                    onClick={() => handleDelete(submission.id)}
                  >
                    <RiDeleteBin2Fill size={18} />
                  </button>
                </TableCell>*/}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p className="loading">No Result Found</p>
      )}
      {totalPages > 1 &&
      <div className={styles.pagination}>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={submissionFilter?.PageIndex || 1}
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
      </div>}
    </div>
  );
};

export default Submissions;
