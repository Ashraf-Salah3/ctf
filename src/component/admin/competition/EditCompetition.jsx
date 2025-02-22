import { useForm } from "react-hook-form";
import styles from "./competition.module.scss";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import instance from "../../../axios";
import { toast } from "sonner";
import { GoUpload } from "react-icons/go";

const EditCompetition = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const competation = location.state;

  const { name, description, startDate, status, duration, id, attachment } =
    competation;
    const [image, setImage] = useState(attachment || "")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name || "",
      description: description || "",
      startDate: startDate || new Date(),
      status: status || "",
      duration: duration || 0,
    },
  });
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await instance.put(`Competation/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setLoading(false);
      toast.success("Competation updated successfully");
    } catch {
      toast.error(" failed to update");
    }
  };
  return (
    <div className={styles["competition-container"]}>
      <div className="main-header">
        <h1>Edit Competition</h1>
      </div>
      <div className={styles["form-container"]}>
        {/* Form to add competition */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Input fields */}
          <div className={styles["form-inputs"]}>
            <div className={styles["input-field"]}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter competition name"
                {...register("name", { required: "This Faild Is Required" })}
              />
              {errors.name && (
                <p className={styles["error"]}>{errors.name.message}</p>
              )}
            </div>
            <div className={styles["input-field"]}>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                placeholder="Enter competition description"
                {...register("description", {
                  required: "This Faild Is Required",
                })}
              />
              {errors.description && (
                <p className={styles["error"]}>{errors.description.message}</p>
              )}
            </div>
            <div className={styles["input-field"]}>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                {...register("startDate", {
                  required: "This Faild Is Required",
                })}
              />
              {errors.startDate && (
                <p className={styles["error"]}>{errors.startDate.message}</p>
              )}
            </div>
            <div className={styles["input-field"]}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                {...register("status", { required: "This Faild Is Required" })}
              >
                <option value="">Choose a Status</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {errors.status && (
                <p className={styles["error"]}>{errors.status.message}</p>
              )}
            </div>
            <div className={styles["input-field"]}>
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                placeholder="Enter competition duration"
                {...register("duration", {
                  required: "This Faild Is Required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Value must be an integer",
                  },
                })}
              />
              {errors.duration && (
                <p className={styles["error"]}>{errors.duration.message}</p>
              )}
            </div>
          </div>
          <div className={styles["image-upload-section"]}>
            <div
              className={`${styles["image-upload"]} ${styles.cover}`}
              style={{ border: image ? "none" : "2px dashed var(--accent)" }}
            >
              <label htmlFor="coverImg">
                <input
                  type="file"
                  id="coverImg"
                  onChange={handleImageChange}
                  accept="image/*"
                  hidden
                />
                <div
                  className={styles.productPicture}
                  style={{
                    backgroundImage: image
                      ? image instanceof File
                        ? `url(${URL.createObjectURL(image)})`
                        : `url(${image})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: "5rem",
                  }}
                >
                  {!image && (
                    <div>
                      <GoUpload />
                      <h4>
                        Drag & Drop or <span>Choose file</span> to upload Image
                        Cover
                      </h4>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className={styles["submit-btn"]}>
            <button type="submit" disabled={loading}>
              {" "}
              {loading ? "Loading" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompetition;
