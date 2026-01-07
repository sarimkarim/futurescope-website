import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, deleteJob, updateJob, getJobMatchPercentage, getRecommendedJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs); // Public endpoint for browsing jobs
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById); // Public endpoint for viewing job details
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
router.route("/match/:id").get(isAuthenticated, getJobMatchPercentage); // Get match percentage for a job
router.route("/recommended").get(isAuthenticated, getRecommendedJobs); // Get recommended jobs

export default router;

