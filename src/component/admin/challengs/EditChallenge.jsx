import { toast } from "sonner";
import styles from "./challengs.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import instance from "../../../axios";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../../redux/challengeSlice";
import { fetchCompetations } from "../../redux/competationSlice";
import Loading from "../../Loading/Loading";

const EditChallenge = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { categories } = useSelector((state) => state.challenge);
  const { competations, competationFilter } = useSelector(
    (state) => state.competation
  );
  const { user } = useSelector((state) => state.users);
  const nameIdentifier = localStorage.getItem("nameIdentifier");
  const userIsCreator = useMemo(
    () => user?.roles?.includes("CreatorCTF"),
    [user?.roles]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (id !== undefined) {
      const fetchChallengeById = async () => {
        setLoading(true);
        try {
          const response = await instance.get(`Challenge/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          const data = response.data.data;
          setLoading(false);
          // Prepare form data with camelCase keys
          const formValues = {
            name: data?.name || "",
            categoryId: data?.categoryId || "",
            status: data?.status || "",
            value: data?.value || "",
            type: data?.type || "",
            message: data?.message || "",
            case: data?.case ? "caseSensitive" : "caseInsensitive",
            flag: data?.flag || "",
            level: data?.level || "",
            hint: data?.hint || "",
            hintValue: data?.hintValue || "",
            file: data?.attachmentUrl || [],
            competitionId: data?.competitionId || "",
            minusValue: data?.minusValue || "",
            isAccepted: data?.isAccepted ?"true": "false",
          };
          reset(formValues);
        } catch {
          toast.error("Failed to Please Try Again");
          setLoading(false);
          navigate("/admin/challenges")
        
 
        }
      };
      fetchChallengeById();
    }
  }, [id, reset,navigate]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  useEffect(() => {
    dispatch(fetchCompetations(competationFilter));
  }, [competationFilter, dispatch]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        const formData = new FormData();
        formData.append("Name", data.name);
        formData.append("CategoryId", data.categoryId);
        formData.append("IsAccepted", data.isAccepted);
        formData.append("Status", data.status);
        formData.append("Value", data.value);
        formData.append("Type", data.type);
        formData.append("Message", data.message);
        formData.append("Flag", data.flag);
        formData.append("Level", data.level);
        formData.append("Hint", data.hint);
        formData.append("HintValue", data.hintValue);
        formData.append("MinusValue", data.minusValue);
        formData.append("IsAccepted", data.isAccepted);
        formData.append("Attachment", data.file[0] || null);
        formData.append("CompetationId", data.competitionId);
        formData.append("Case", data.case === "caseSensitive");
        formData.append("UserId", nameIdentifier);

        await instance.put(`Challenge/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Challenge updated successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    },
    [id, nameIdentifier]
  );

  return (
    <>
      {loading ? (
        <Loading/>
      ) : (
        <div className={styles["challenge-container"]}>
          <div className="main-header">
            <h1>Edit Challenge</h1>
          </div>
          <div className={styles["form"]}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles["from-inputs"]}>
                {/* Name Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className={styles["error"]}>{errors.name.message}</p>
                  )}
                </div>

                {/* Category Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    {...register("categoryId", {
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
                  {errors.categoryId && (
                    <p className={styles["error"]}>
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Status Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    {...register("status", { required: "Status is required" })}
                  >
                    <option value="">Choose a Status</option>
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                  {errors.status && (
                    <p className={styles["error"]}>{errors.status.message}</p>
                  )}
                </div>

                {/* Case Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="case">Case</label>
                  <select id="case" {...register("case")}>
                    <option value="">Choose a Case</option>
                    <option value="caseSensitive">Case Sensitive</option>
                    <option value="caseInsensitive">Case Insensitive</option>
                  </select>
                </div>

                {/* Value Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="value">Value</label>
                  <input
                    id="value"
                    type="text"
                    {...register("value", { required: "Value is required" })}
                  />
                  {errors.value && (
                    <p className={styles["error"]}>{errors.value.message}</p>
                  )}
                </div>

                {/* Type Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    {...register("type", { required: "Type is required" })}
                  >
                    <option value="">Choose a Type</option>
                    <option value="Static">Static</option>
                    <option value="Dynamic">Dynamic</option>
                  </select>
                  {errors.type && (
                    <p className={styles["error"]}>{errors.type.message}</p>
                  )}
                </div>

                {/* Flag Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="flag">Flag</label>
                  <input id="flag" type="text" {...register("flag")} />
                </div>

                {/* Level Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="level">Level</label>
                  <select
                    id="level"
                    {...register("level", { required: "Level is required" })}
                  >
                    <option value="">Choose a Level</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  {errors.level && (
                    <p className={styles["error"]}>{errors.level.message}</p>
                  )}
                </div>

                {/* Hint Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="hint">Hint</label>
                  <input id="hint" type="text" {...register("hint")} />
                  {errors.hint && (
                    <p className={styles["error"]}>{errors.hint.message}</p>
                  )}
                </div>

                {/* Hint Value Field */}
                <div className={styles.inputGroup}>
                  <label htmlFor="hintValue">Hint Value</label>
                  <input
                    id="hintValue"
                    type="text"
                    {...register("hintValue", {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Hint Value must be an integer",
                      },
                    })}
                  />
                  {errors.hintValue && (
                    <p className={styles["error"]}>
                      {errors.hintValue.message}
                    </p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="competitionId">Add To Competition</label>
                  <select id="competitionId" {...register("competitionId")}>
                    <option value="">Choose a Competition</option>
                    {competations?.map((competition) => (
                      <option key={competition.id} value={competition.id}>
                        {competition.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="minusValue">Minus Value</label>
                  <input
                    id="minusValue"
                    type="text"
                    {...register("minusValue", {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Minus Value must be an integer",
                      },
                    })}
                  />
                  {errors.minusValue && (
                    <p className={styles["error"]}>
                      {errors.minusValue.message}
                    </p>
                  )}
                </div>

                {/* File Upload Field */}
                <div className={styles["inputGroup"]}>
                  <label htmlFor="file">Upload file</label>
                  <input id="file" type="file" multiple {...register("file")} />
                  {errors.file && <p>{errors.file.message}</p>}
                </div>

                {!userIsCreator && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="isAccepted">Accepted</label>
                    <select
                      id="isAccepted"
                      {...register("isAccepted")}
                    >
                      <option value="">Choose a value</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                    {errors.isAccepted && (
                      <p className={styles["error"]}>
                        {errors.isAccepted.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Message Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" {...register("message")} />
              </div>

              <div className={styles.buttons}>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditChallenge;
