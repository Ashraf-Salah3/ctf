import { useForm } from "react-hook-form";
import styles from "./profile-setting.module.scss";
import instance from "../../../axios";
import { toast } from "sonner";
import { IoPerson } from "react-icons/io5";
import { useEffect } from "react";
import PropTypes from "prop-types";

const ProfileSetting = ({ user }) => {
  const {
    register: updateProfileRegister,
    handleSubmit: handleUpdatedProfile,
    reset,
    formState: { errors: profileErrors },
  } = useForm();
  const {
    register: changePasswordRegister,
    handleSubmit: handleChangePassword,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      const { firstName, lastName, email } = user;
      reset({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
      });
    }
  }, [user, reset]);

  const handleProfileSubmit = async (data) => {
    const formData = new FormData();

    formData.append("FirstName", data.firstName);
    formData.append("LastName", data.lastName);

    try {
      await instance.put(`Account/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      reset({ firstName: data.firstName, lastName: data.lastName });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await instance.put(
        "Account/ChangePassword",
        {
          confirmPassword: data.confirmNewPassword,
          newPassword: data.newPassword,
          oldPassword: data.currentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Password changed successfully");
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className={styles["profile-setting"]}>
      {/* Profile Update */}
      <div className={styles["setting-box"]}>
        <div className={styles.title}>
          <IoPerson size={22} />
          <h3>Profile Setting</h3>
        </div>
        <form onSubmit={handleUpdatedProfile(handleProfileSubmit)}>
          <div className={styles["input-group"]}>
            <div className={styles["form-input"]}>
              <label htmlFor="firstName">Frist Name</label>
              <input
                type="text"
                id="firstName"
                {...updateProfileRegister("firstName", {
                  required: "firstName Name is required",
                })}
              />
              {profileErrors.firstName && (
                <p className={styles["error-text"]}>
                  {profileErrors.firstName.message}
                </p>
              )}
            </div>
            <div className={styles["form-input"]}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                {...updateProfileRegister("lastName", {
                  required: "Last Name is required",
                })}
              />
              {profileErrors.lastName && (
                <p className={styles["error-text"]}>
                  {profileErrors.lastName.message}
                </p>
              )}
            </div>
            <div className={styles["form-input"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                readOnly
                id="email"
                {...updateProfileRegister("email", {
                  required: "Email is required",
                })}
              />

              {profileErrors.email && (
                <p className={styles["error-text"]}>
                  {profileErrors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className={styles["btn"]}>
            <button type="submit">Update Profile</button>
          </div>
        </form>
      </div>

      {/* Password Update */}
      <div className={styles["setting-box"]}>
        <div className={styles.title}>
          <IoPerson size={22} />
          <h3>Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword(handlePasswordSubmit)}>
          <div className={styles["input-group"]}>
            <div className={styles["form-input"]}>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                {...changePasswordRegister("currentPassword", {
                  required: "Current Password is required",
                })}
              />
              {errors.currentPassword && (
                <p className={styles["error-text"]}>
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className={styles["form-input"]}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                {...changePasswordRegister("newPassword", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long.",
                  },
                })}
              />
              {errors.newPassword && (
                <p className={styles["error-text"]}>
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className={styles["form-input"]}>
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                {...changePasswordRegister("confirmNewPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    "Passwords do not match.",
                })}
              />
              {errors.confirmNewPassword && (
                <p className={styles["error-text"]}>
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className={styles["btn"]}>
            <button type="submit">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileSetting.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileSetting;
