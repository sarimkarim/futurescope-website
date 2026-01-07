import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    getQuestionsByCategory,
    updateQuestion,
    deleteQuestion,
    submitQuiz
} from "../controllers/question.controller.js";

const router = express.Router();

// Public routes (with optional auth for question tracking)
router.route("/category/:categoryId").get(optionalAuth, getQuestionsByCategory); // Get questions for quiz
router.route("/submit").post(isAuthenticated, submitQuiz); // Submit quiz answers

// Admin only routes
router.route("/create").post(isAuthenticated, createQuestion);
router.route("/get").get(isAuthenticated, getAllQuestions);
router.route("/get/:id").get(isAuthenticated, getQuestionById);
router.route("/update/:id").put(isAuthenticated, updateQuestion);
router.route("/delete/:id").delete(isAuthenticated, deleteQuestion);

export default router;

