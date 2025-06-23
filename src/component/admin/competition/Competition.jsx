import styles from "./competition.module.scss";
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
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import instance from "../../../axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompetations,
  setCompetitionFilter,
} from "../../redux/competationSlice";
import { useEffect } from "react";

const Competition = () => {
  const { competations, competationFilter, totalPages } = useSelector(
    (state) => state.competation
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCompetations(competationFilter));
  }, [dispatch, competationFilter]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized: No token found");
        return;
      }

      await instance.delete(`Competation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted Successfully");
      dispatch(fetchCompetations(competationFilter));
    } catch {
      toast.error("Failed to delete competition");
    }
  };

  const handlePageChange = (_, page) => {
    dispatch(setCompetitionFilter({ ...competationFilter, PageIndex: page }));
  };

  return (
    <div className={styles["competition-container"]}>
      <div className="main-header">
        <h1>Competition</h1>
        <button onClick={() => navigate("/admin/addCompetition")}>
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
              {[
                "Id",
                "Name",
                "Description",
                "StartDate",
                "Status",
                "Duration",
                "Action",
              ].map((header) => (
                <TableCell key={header}>
                  <div>{header}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {competations?.map((competation, index) => (
              <TableRow key={index} className="subContent">
                <TableCell>
                  <p>{competation.id}</p>
                </TableCell>
                <TableCell>
                  <p>{competation.name}</p>
                </TableCell>
                <TableCell>
                  <p>{competation.description}</p>
                </TableCell>
                <TableCell>
                  <p>{competation.startDate}</p>
                </TableCell>
                <TableCell>
                  <p>{competation.status}</p>
                </TableCell>
                <TableCell>
                  <p>{competation.duration}</p>
                </TableCell>
                <TableCell className="edit">
                  <button
                    className="--btn"
                    onClick={() =>
                      navigate("/admin/edit-competition", {
                        state: competation,
                      })
                    }
                  >
                    <RiEdit2Fill size={18} />
                  </button>
                  <button
                    className="--btn"
                    onClick={() => handleDelete(competation.id)}
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
        <div className={styles["pagination"]}>
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
      )}{" "}
    </div>
  );
};

export default Competition;
