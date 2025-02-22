import { useForm } from "react-hook-form";
import styles from "./competition.module.scss";
import instance from "../../../axios";
import { toast } from "sonner";
import { useState } from "react";
import { GoUpload } from "react-icons/go";

const AddCompetition = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      Name: "",
      Description: "",
      StartDate: "",
      Status: "",
      Duration: "",
      Password: "",
    },
  });

  const selectedStatus = watch("Status");

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (data.StartDate) {
        const utcDate = new Date(data.StartDate).toISOString();
        formData.append("StartDate", utcDate);
      }

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      if (image) {
        formData.append("Attachment", image);
      }
      await instance.post("/Competation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Competition Added Successfully");
      reset();
      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["competition-container"]}>
      <div className="main-header">
        <h1>Add Competition</h1>
      </div>
      <div className={styles["form-container"]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["form-inputs"]}>
            <div className={styles["input-field"]}>
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                id="Name"
                placeholder="Enter competition name"
                {...register("Name", { required: "This field is required" })}
              />
              {errors.Name && (
                <p className={styles["error"]}>{errors.Name.message}</p>
              )}
            </div>

            <div className={styles["input-field"]}>
              <label htmlFor="Description">Description</label>
              <input
                type="text"
                id="Description"
                placeholder="Enter competition description"
                {...register("Description", {
                  required: "This field is required",
                })}
              />
              {errors.Description && (
                <p className={styles["error"]}>{errors.Description.message}</p>
              )}
            </div>

            <div className={styles["input-field"]}>
              <label htmlFor="StartDate">Start Date</label>
              <input
                type="datetime-local"
                id="StartDate"
                {...register("StartDate", {
                  required: "This field is required",
                })}
              />
              {errors.StartDate && (
                <p className={styles["error"]}>{errors.StartDate.message}</p>
              )}
            </div>

            <div className={styles["input-field"]}>
              <label htmlFor="Status">Status</label>
              <select
                id="Status"
                {...register("Status", { required: "This field is required" })}
              >
                <option value="">Choose a Status</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {errors.Status && (
                <p className={styles["error"]}>{errors.Status.message}</p>
              )}
            </div>

            <div className={styles["input-field"]}>
              <label htmlFor="Duration">Duration</label>
              <input
                type="text"
                id="Duration"
                placeholder="Enter competition Duration"
                {...register("Duration", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Value must be an integer",
                  },
                })}
              />
              {errors.Duration && (
                <p className={styles["error"]}>{errors.Duration.message}</p>
              )}
            </div>

            {selectedStatus === "Private" && (
              <div className={styles["input-field"]}>
                <label htmlFor="Password">Password</label>
                <input
                  type="text"
                  id="Password"
                  placeholder="Enter competition Password"
                  {...register("Password", {
                    required: "This field is required for private competitions",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                      message:
                        "Password must include uppercase, lowercase, number, and symbol.",
                    },
                  })}
                />
                {errors.Password && (
                  <p className={styles["error"]}>{errors.Password.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Upload Image */}
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
                      ? `url(${URL.createObjectURL(image)})`
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

          <div className={styles["submit-btn"]}>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Add Competition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompetition;
