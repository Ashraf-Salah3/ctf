import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./scoreboard.module.scss";
import { GiTrophyCup } from "react-icons/gi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
/*import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";*/

import { useQuery } from "@tanstack/react-query";
import instance from "../../axios";
import Loading from "../Loading/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Scoreboard = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: "users",
    queryFn: async () => {
      const response = await instance.get("Account/users");
      return response.data.data.items;
    },
  });

  const [usersSorted, setUsersSorted] = useState([]);

  useEffect(() => {
    if (users?.length) {
      const sortedUsers = [...users]
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 10);
      setUsersSorted(sortedUsers);
    }
  }, [users]);

  const colors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
  ];

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: { color: "white" },
        grid: {
          color: "rgba(255, 255, 255, 0.5)",
          borderDash: [8, 4],
          borderDashOffset: 2,
        },
      },
      y: {
        ticks: { color: "white" },
        grid: {
          color: "rgba(255, 255, 255, 0.5)",
          borderDash: [8, 4],
          borderDashOffset: 2,
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: "white" },
        position: "bottom",
      },
      title: {
        display: true,
        text: "Top 10 Users by Rank",
        color: "white",
        font: {
          size: 24,
        },
      },
    },
  };

  const chartData = {
    labels: usersSorted.map((user) => user.displayName),
    datasets: [
      {
        label: "Total Score",
        data: usersSorted.map((user) => user.totalScore),
        borderColor: colors[0],
        backgroundColor: colors[0].replace("0.8", "0.2"),
        tension: 0.4,
      },
      {
        label: "Challenges Solved",
        data: usersSorted.map((user) => user.tottalSolved),
        borderColor: colors[1],
        backgroundColor: colors[1].replace("0.8", "0.2"),
        tension: 0.4,
      },
    ],
  };

  /* const handlePageChange = (event, page) => {
    dispatch(setUserFilter({ ...userFilter, PageIndex: page }));
  };*/

  if (isLoading) return <Loading />;
  if (isError) return <p className="loading">Faild Please Try Again.</p>

  return (
    <div className={styles["scoreboard-container"]}>
      <h1 className="main-heading">Scoreboard</h1>
      {users?.length > 0 ? (
        <div className={styles["scoreboard-items"]}>
          <div className={styles.chart}>
            {usersSorted?.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p>No data available for the chart.</p>
            )}
          </div>
          <div className={styles["tabel-container"]}>
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
                        <div>Rank</div>
                      </TableCell>
                      <TableCell>
                        <div>User Name</div>
                      </TableCell>
                      <TableCell>
                        <div>Challenges Solved</div>
                      </TableCell>
                      <TableCell>
                        <div>Points Earned</div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index} className={styles["subContent"]}>
                        <TableCell>
                          <div className={styles["items"]}>
                            {index < 3 && (
                              <GiTrophyCup
                                color={
                                  index === 0
                                    ? "gold"
                                    : index === 1
                                    ? "silver"
                                    : "#CD7F32"
                                }
                                size={22}
                              />
                            )}
                            <p>{index + 1}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={styles["items"]}>
                            {/* <div className={styles.image}>
                              <img src={user?.imageCover} alt="" />
                            </div> */}
                            <p>{user.displayName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={styles["items"]}>
                            <p>{user.tottalSolved}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={styles["items"]}>
                            <p>{user.totalScore}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/*totalPages > 1 && (
                <div className={styles.pagination}>
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPages}
                      page={userFilter?.PageIndex || 1}
                      color="primary"
                      onChange={handlePageChange}
                      renderItem={(item) => (
                        <PaginationItem
                          sx={{ color: "white" }}
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
              )*/}
            </div>
          </div>
        </div>
      ) : (
        <p className="loading">No results found.</p>
      )}
    </div>
  );
};

export default Scoreboard;
