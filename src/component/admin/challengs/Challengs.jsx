import styles from "./challengs.module.scss";
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
import { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchChallenges,
  setChallengeFilter,
} from "../../redux/challengeSlice";
import instance from "../../../axios";
import { toast } from "sonner";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";

const Challengs = () => {
  const navigate = useNavigate();
  const { challenges, challengeFilter, totalPages } = useSelector(
    (state) => state.challenge
  );
  const nameIdentifier = localStorage.getItem("nameIdentifier");

  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(fetchChallenges({ ...challengeFilter, PageSize: 10 , UserId:nameIdentifier}));
  }, [dispatch, challengeFilter,nameIdentifier]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      try {
        await instance.delete(`Challenge/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Challenge deleted successfully!");
        // Re-fetch challenges with the current filter
        dispatch(fetchChallenges({ ...challengeFilter, UserId:nameIdentifier}));
      } catch {
        toast.error("Failed to delete challenge.");
      }
    }
  };

  // Handle page change
  const handlePageChange = (_, page) => {
    dispatch(setChallengeFilter({ ...challengeFilter, PageIndex: page }));
  };

  return (
    <div className={styles["challengs-container"]}>
      <div className="main-header">
        <h1>Challenges</h1>
        <button onClick={() => navigate("/admin/addChallenge")}>
          <FaPlus />
          Add New
        </button>
      </div>
      <TableContainer
        component={Paper}
        className="tableContainer"
        style={{ backgroundColor: "#101010" }}
      >
        <Table className="table table-striped table-hover">
          <TableHead className="subhead">
            <TableRow>
              <TableCell>
                <div>User Name</div>
              </TableCell>
              <TableCell>
                <div>Name</div>
              </TableCell>
              <TableCell>
                <div>Category</div>
              </TableCell>
              <TableCell>
                <div>Competation Name</div>
              </TableCell>
              <TableCell>
                <div>Level</div>
              </TableCell>
              <TableCell>
                <div>Value</div>
              </TableCell>
              <TableCell>
                <div>Type</div>
              </TableCell>
              <TableCell>
                <div>State</div>
              </TableCell>
              <TableCell>
                <div>Accepted</div>
              </TableCell>
              <TableCell>
                <div>Action</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges?.map((challenge, index) => (
              <TableRow key={index} className="subContent">
                <TableCell>
                  <p>{challenge.userName}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.name}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.categoryName}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.competationName}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.level}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.value}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.type}</p>
                </TableCell>
                <TableCell>
                  <p>{challenge.status}</p>
                </TableCell>
                <TableCell>
                  <p style={{color : challenge.isAccepted? "green" : "red"}}>{challenge.isAccepted? "Accepted" : "Not Accepted"}</p>
                </TableCell>
                <TableCell className="edit">
                  <button
                    className="--btn"
                    onClick={() =>
                      navigate(`/admin/edit-challenge/${challenge.id}`)
                    }
                  >
                    <RiEdit2Fill size={18} />
                  </button>
                  <button
                    className="--btn"
                    onClick={() => handleDelete(challenge.id)}
                  >
                    <RiDeleteBin2Fill size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default Challengs;
