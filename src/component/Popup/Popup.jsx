import PropTypes from "prop-types";
import styles from "./popup.module.scss";

const Popup = ({ onClose, onSubmit, register, handleSubmit, isEdit, title,label }) => {
  return (
    <div className={styles["popup-overlay"]} onClick={onClose}>
      <div
        className={styles["popup-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["form-input"]}>
            <label htmlFor="name">{label}</label>
            <input
              id="name"
              type="text"
              {...register("name", { required: true })}
            />
          </div>
          <div className="--btn-action">
            <button
              className="--btn --btn-small --btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="--btn --btn-primary --btn-small"
              type="submit"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Popup;
