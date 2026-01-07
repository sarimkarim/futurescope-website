import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, viewApplicantResume, getPerformanceHistory, getImprovementOverTime, getSkillGrowth } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/:applicationId/resume").get(isAuthenticated, viewApplicantResume);
router.route("/performance/history").get(isAuthenticated, getPerformanceHistory);
router.route("/performance/improvement").get(isAuthenticated, getImprovementOverTime);
router.route("/performance/skills").get(isAuthenticated, getSkillGrowth);
 

export default router;

