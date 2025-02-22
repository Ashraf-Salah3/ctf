import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./category.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { fetchCategories } from "../../redux/challengeSlice";
import instance from "../../../axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Popup from "../../Popup/Popup";

const Category = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [category, setCategory] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { categories } = useSelector((state) => state.challenge);
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    } else {
      reset({ name: "" });
    }
  }, [category, reset]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await instance.put(`Category/${category.id}`, {
          name: data.name,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success(`${data.name} updated successfully`);
      } else {
        await instance.post("Category", {
          name: data.name,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success(`${data.name} added successfully`);
      }
      setShowPopup(false);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddCategory = () => {
    setCategory(null);
    setIsEdit(false);
    setShowPopup(true);
  };

  const handleEditCategory = (category) => {
    setCategory(category);
    setIsEdit(true);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/Category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Category deleted successfully");
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles["category-container"]}>
      <div className="main-header">
        <h1>Category</h1>
        <button onClick={handleAddCategory}>
          <FaPlus />
          Add New
        </button>
      </div>
      <TableContainer component={Paper} className="tableContainer">
        <Table className="table table-striped table-hover">
          <TableHead className="subhead">
            <TableRow>
              <TableCell>
                <div>Id</div>
              </TableCell>
              <TableCell>
                <div>Category Name</div>
              </TableCell>
              <TableCell>
                <div>Action</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((category, index) => (
              <TableRow key={index} className="subContent">
                <TableCell>
                  <p>{category.id}</p>
                </TableCell>
                <TableCell>
                  <p>{category.name}</p>
                </TableCell>
                <TableCell className="edit">
                  <button
                    className="--btn --btn-primary"
                    onClick={() => handleEditCategory(category)}
                  >
                    <RiEdit2Fill size={18} />
                  </button>
                  <button
                    className="--btn"
                    onClick={() => handleDelete(category.id)}
                  >
                    <RiDeleteBin2Fill size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onSubmit={onSubmit}
          register={register}
          handleSubmit={handleSubmit}
          isEdit={isEdit}
          title={`${isEdit ? "Edit Category" : "Add Category"}`}
        />
      )}
    </div>
  );
};

export default Category;
