import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createCategory,
    getAllCategories,
    getCategoriesWithJobs,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";

const router = express.Router();

// Public routes
router.route("/get").get(getAllCategories);
router.route("/get-with-jobs").get(getCategoriesWithJobs);
router.route("/get/:id").get(getCategoryById);

// Admin only routes
router.route("/create").post(isAuthenticated, createCategory);
router.route("/update/:id").put(isAuthenticated, updateCategory);
router.route("/delete/:id").delete(isAuthenticated, deleteCategory);

export default router;







