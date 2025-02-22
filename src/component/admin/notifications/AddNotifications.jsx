import { useForm } from "react-hook-form";
import styles from "./notifications.module.scss";
import instance from "../../../axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCompetations } from "../../redux/competationSlice";

const AddNotifications = () => {
  const { competations, competationFilter } = useSelector(
    (state) => state.competation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompetations(competationFilter));
  }, [dispatch, competationFilter]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      Content: "",
      competationId: null,
    },
  });

  const onsubmit = async (data) => {
    try {
      await instance.post("Notification", {
        Title: data.title,
        Content: data.Content,
        competationId: data.competationId ? data.competationId : null,

        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast.success(
        `${
          data.competationId
            ? "Notification added Successfully to Competation"
            : "Notification added Successfully"
        }`
      );
      reset();
    } catch {
      toast.error("Failed to add notification");
    }
  };
  return (
    <div className={styles["notifications-container"]}>
      <div className="main-header">
        <h1>Add Notification</h1>
      </div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className={styles["form-inputs"]}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "This Field is Requierd" })}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="Content">Content</label>
            <textarea
              id="Content"
              rows={10}
              {...register("Content", { required: "This Field Is Required" })}
            />
            {errors.Content && (
              <p className={styles.error}>{errors.Content.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="competationId">Choose Competation</label>
            <select id="competationId" {...register("competationId")}>
              <option value="">Choose Competation </option>
              {competations.map((competation) => (
                <option key={competation.id} value={competation.id}>
                  {competation.name}
                </option>
              ))}
            </select>
            {errors.CategoryId && (
              <p className={styles["error"]}>{errors.CategoryId.message}</p>
            )}
          </div>
        </div>
        <div className={styles["submit-button"]}>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddNotifications;
