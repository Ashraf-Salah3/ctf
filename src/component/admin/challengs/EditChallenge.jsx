import { toast } from "sonner";
import styles from "./challengs.module.scss";
import { useCallback, useEffect } from "react";
import { fetchCategories } from "../../redux/challengeSlice";
import instance from "../../../axios";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchCompetations } from "../../redux/competationSlice";

const EditChallenge = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.challenge);
  const { competations, competationFilter } = useSelector(
    (state) => state.competation
  );
  const location = useLocation();

  const {
    attachmentUrl,
    categoryId,
    flag,
    id,
    message,
    name,
    status,
    type,
    value,
    level,
    hint,
    hintValue,
    CompetationId,
  } = location.state;

  const caseValue =
    location.state.case === true ? "caseSensitive" : "caseInsensitive";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      Name: name || "",
      CategoryId: categoryId || "",
      Status: status || "",
      Value: value || "",
      Type: type || "",
      Message: message || "",
      Case: caseValue || "",
      Flag: flag || "",
      Level: level || "",
      Hint: hint || "",
      HintValue: hintValue || "",
      file: attachmentUrl || "",
      CompetationId: CompetationId || "",
      MinusVlaue:""
    },
  });
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  useEffect(() => {
    if (competationFilter) {
      dispatch(fetchCompetations(competationFilter));
    }
  }, [competationFilter, dispatch]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "file") {
            formData.append(key, value[0] || null);
          } else if (key === "Case") {
            formData.append(
              "Case",
              data.Case === "caseSensitive" ? true : false
            );
          } else {
            formData.append(key, value);
          }
        });
        await instance.put(`Challenge/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Challenge Updated Successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    },
    [id]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      setValue("CategoryId", categoryId);
    }
    if (CompetationId) {
      setValue("CompetationId", CompetationId);
    }
  }, [categoryId, setValue, CompetationId]);

  return (
    <div className={styles["challenge-container"]}>
      <div className="main-header">
        <h1>Edit Challenge</h1>
      </div>
      <div className={styles["form"]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["from-inputs"]}>
            {/* Name Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Name">Name</label>
              <input
                id="Name"
                type="text"
                {...register("Name", { required: "Name is required" })}
              />
              {errors.Name && (
                <p className={styles["error"]}>{errors.Name.message}</p>
              )}
            </div>

            {/* Category Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="CategoryId">Category</label>
              <select
                id="CategoryId"
                {...register("CategoryId", {
                  required: "Category is required",
                })}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.CategoryId && (
                <p className={styles["error"]}>{errors.CategoryId.message}</p>
              )}
            </div>

            {/* Status Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Status">Status</label>
              <select
                id="Status"
                {...register("Status", { required: "Status is required" })}
              >
                <option value="">Choose a Status</option>
                <option value="Visible">Visible</option>
                <option value="Hidden">Hidden</option>
              </select>
              {errors.Status && (
                <p className={styles["error"]}>{errors.Status.message}</p>
              )}
            </div>

            {/* Case Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Case">Case</label>
              <select id="Case" {...register("Case")}>
                <option value="">Choose a Case</option>
                <option value="caseSensitive">Case Sensitive</option>
                <option value="caseInsensitive">Case Insensitive</option>
              </select>
            </div>

            {/* Value Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Value">Value</label>
              <input
                id="Value"
                type="text"
                {...register("Value", { required: "Value is required" })}
              />
              {errors.Value && (
                <p className={styles["error"]}>{errors.Value.message}</p>
              )}
            </div>

            {/* Type Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Type">Type</label>
              <select
                id="Type"
                {...register("Type", { required: "Type is required" })}
              >
                <option value="">Choose a Type</option>
                <option value="Static">Static</option>
                <option value="Dynamic">Dynamic</option>
              </select>
              {errors.Type && (
                <p className={styles["error"]}>{errors.Type.message}</p>
              )}
            </div>

            {/* Flag Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Flag">Flag</label>
              <input id="Flag" type="text" {...register("Flag")} />
            </div>

            {/* Level Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Level">Level</label>
              <select
                id="Level"
                {...register("Level", { required: "Level is required" })}
              >
                <option value="">Choose a Level</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {errors.Level && (
                <p className={styles["error"]}>{errors.Level.message}</p>
              )}
            </div>

            {/* Hint Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="Hint">Hint</label>
              <input id="Hint" type="text" {...register("Hint")} />
              {errors.Hint && (
                <p className={styles["error"]}>{errors.Hint.message}</p>
              )}
            </div>

            {/* Hint Value Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="HintValue">HintValue</label>
              <input
                id="HintValue"
                type="text"
                {...register("HintValue", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "HintValue must be an integer",
                  },
                })}
              />
              {errors.HintValue && (
                <p className={styles["error"]}>{errors.HintValue.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="CompetationId">Add To Competition</label>
              <select id="CompetationId" {...register("CompetationId")}>
                <option value="">Choose a Competition</option>
                {/* Competition Options */}
                {competations?.map((competation) => (
                  <option key={competation.id} value={competation.id}>
                    {competation.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="MinusVlaue">MinusVlaue</label>
              <input
                id="MinusVlaue"
                type="text"
                {...register("MinusVlaue", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "MinusVlaue must be an integer",
                  },
                })}
              />
              {errors.MinusVlaue && (
                <p className={styles["error"]}>{errors.MinusVlaue.message}</p>
              )}
            </div>

            {/* File Upload Field */}
            <div className={styles["inputGroup"]}>
              <label htmlFor="file">Upload file</label>
              <input id="file" type="file" {...register("file")} />

              {errors.file && <p>{errors.file.message}</p>}
            </div>
          </div>

          {/* Message Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="Message">Message</label>
            <textarea id="Message" type="text" {...register("Message")} />
          </div>

          <div className={styles.buttons}>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChallenge;
