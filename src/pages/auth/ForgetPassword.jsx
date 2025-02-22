import { useForm } from "react-hook-form";
import styles from "./auth.module.scss";
import instance from "../../axios";
import { toast } from "sonner";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm({defaultValues:{
    email: "",
  }});

  const onsubmit = async (data) => {
    try {
      await instance.post("Account/forget-password", {
        email: data.email,
        clientUrl: `${window.location.origin}/reset-password`,
      });
      toast.success("Check Your Email");
      navigate("/login");
    } catch {
      toast.error("Failed Please Enter Vaild Email");
    }
  };
  return (
    <div className={styles.auth}>
      <div className={styles.form}>
        <h2>Forget Password</h2>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className={styles["form-input"]}>
            <div
              className={
                errors.email
                  ? `${styles.inputGroup} ${styles.invalid}`
                  : styles.inputGroup
              }
            >
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                id="email"
                {...register("email", {
                  required: "This Field Is Required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                  onChange: () => trigger("email"),
                })}
                onBlur={() => trigger("email")}
              />
              <MdOutlineMailOutline size={22} />
              {errors.email && (
                <p className={styles["error-text"]}>{errors.email.message}</p>
              )}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
