import { Commet } from "react-loading-indicators";
import styles from "./loading.module.scss";
const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.snipper}>
        <Commet color="var(--main-color)" size="medium" text="" textColor="" />;
      </div>
    </div>
  );
};

export default Loading;
