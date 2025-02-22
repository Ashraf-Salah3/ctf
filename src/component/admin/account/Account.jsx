import { useForm } from "react-hook-form";
import styles from "./account.module.scss";
import instance from "../../../axios";
import { toast } from "sonner";

const Account = () => {
  const {
    register: competitionRegister,
    formState: { errors: competitionErrors },
    handleSubmit: handleSubmitCompetition,
    reset: resetCompetition
  } = useForm();

  const {
    register: ctfRegister,
    formState: { errors: ctfErrors },
    handleSubmit: handleSubmitCtf,
    reset:resetCtf
  } = useForm();

  const handleCompetitionSubmit = async (data) => {
    try {
      instance.post("Website", { website: "competition", url: data.url });
      toast.success("Added Website Successfully");
      resetCompetition();
    } catch {
      toast.error("Failed to Add Website");
    }
  };
  const handleCtfSubmit = async (data) => {
    try {
      instance.post("Website", { website: "ctf", url: data.url });
      toast.success("Added Website Successfully");
      resetCtf();
    } catch {
      toast.error("Failed to Add Website");
    }
  };
  return (
    <div className={styles["account-container"]}>
      <div className="container">
        <div className={styles["account-items"]}>
          <div className={styles["form"]}>
            <h2>Add Competition WebSite</h2>
            <form onSubmit={handleSubmitCompetition(handleCompetitionSubmit)}>
              <div className={styles["input-field"]}>
                <label>URL</label>
                <input
                  type="text"
                  placeholder="URL"
                  {...competitionRegister("url", {
                    required: "this field Is required",
                  })}
                />
                {competitionErrors.url && (
                  <p className={styles["error"]}>
                    {competitionErrors.url.message}
                  </p>
                )}
              </div>{" "}
              <div className={styles["btn"]}>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>

          <div className={styles["form"]}>
            <h2>Add CTF WebSite</h2>
            <form onSubmit={handleSubmitCtf(handleCtfSubmit)}>
              <div className={styles["input-field"]}>
                <label>URL</label>
                <input
                  type="text"
                  placeholder="URL"
                  {...ctfRegister("url", {
                    required: "this field Is required",
                  })}
                />
                {ctfErrors.url && (
                  <p className={styles["error"]}>{ctfErrors.url.message}</p>
                )}
              </div>{" "}
              <div className={styles["btn"]}>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
