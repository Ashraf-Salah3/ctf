import { useDispatch, useSelector } from "react-redux";
import styles from "./notification.module.scss";
import { fetchNotifications } from "../redux/NotificationSlice";
import { useEffect } from "react";
import instance from "../../axios";
import Loading from "../Loading/Loading";


const Notification = () => {
  const { notifications, notificationStatus, notificationFilter } = useSelector(
    (state) => state.notification
  );
  const { userIsInCompetition, competationId } = useSelector(
    (state) => state.checkUsers
  );

  const nameIdentifier = localStorage.getItem("nameIdentifier");
  const dispatch = useDispatch();
  


  useEffect(() => {
    if (nameIdentifier) {
      dispatch(
        fetchNotifications({
          ...notificationFilter,
          UserId: nameIdentifier,
        })
      );
    }
  }, [
    dispatch,
    notificationFilter,
    nameIdentifier,
    userIsInCompetition,
    competationId,
  ]);

  useEffect(() => {
    if (notifications.length > 0 && nameIdentifier) {
      const notificationsArray = notifications.map((notification) => ({
        userId: nameIdentifier,
        notificationId: notification.id,
      }));

      (async () => {
        try {
          await instance.post("Notification/seen", notificationsArray);
        } catch{
          return null
        }
      })();
    }
  }, [notifications, nameIdentifier]);
  return (
    <div className={styles.notification}>
      <div className="container">
        <h1 className="main-heading">Notification</h1>
        {notificationStatus === "loading" ? (
         <Loading/>
        ) : notificationStatus === "failed" ? (
          <p className="loading">Faild Please Check Your Connection.</p>
        ) : notifications.length > 0 ? (
          <div className={styles["notification-items"]}>
            {notifications?.map((notification) => (
              <div
                key={notification.id}
                className={styles["notification-content"]}
              >
                <div className={styles["desc"]}>
                  <h4>{notification.title}</h4>
                  <p>{notification.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="loading">No Result Found!</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
