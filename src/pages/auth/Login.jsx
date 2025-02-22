import styles from "./auth.module.scss";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuLock } from "react-icons/lu";
import instance from "../../axios";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
const Login = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await instance.post("Account/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        const decodedToken = decodeToken(token);
        const nameIdentifier =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        localStorage.setItem("nameIdentifier", nameIdentifier);
        navigate("/challenge");
        reset();
      } else {
        toast.error("Error: Email or password is incorrect");
      }
    } catch {
      toast.error("Error: Email or password is incorrect");
    }
  };

  const decodeToken = (authToken) => {
    try {
      const decoded = jwtDecode(authToken);
      return decoded;
    } catch {
      return null;
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/challenge" />;
  }
  return (
    <div className={styles.auth}>
      <div className={styles.form}>
        <h2>Sign In</h2>
        <p>--or--</p>
        <NavLink to="/register" className={styles.register}>
          Create a new account
        </NavLink>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["form-input"]}>
            <div
              className={
                errors.email
                  ? `${styles.inputGroup} ${styles.invalid}`
                  : styles.inputGroup
              }
            >
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                  onChange: () => trigger("email"),
                })}
                onBlur={() => trigger("email")}
                aria-invalid={!!errors.email}
                aria-describedby="emailError"
              />
              <MdOutlineMailOutline size={22} />
              {errors.email && (
                <p id="emailError" className={styles["error-text"]}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div
              className={
                errors.password
                  ? `${styles.inputGroup} ${styles.invalid}`
                  : styles.inputGroup
              }
            >
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  onChange: () => trigger("password"),
                })}
                onBlur={() => trigger("password")}
                aria-invalid={!!errors.password}
                aria-describedby="passwordError"
              />
              <LuLock size={22} />
              {errors.password && (
                <p id="passwordError" className={styles["error-text"]}>
                  {errors.password.message}
                </p>
              )}
            </div>
            <NavLink to="/forget-password" className={styles.forgotPassword}>
              Reset Password?
            </NavLink>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
