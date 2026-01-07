import express from "express";
import { generateResume } from "../controllers/resume.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Handle OPTIONS preflight request for CORS
router.options("/generate", (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.writeHead(200, {
        'Access-Control-Allow-Origin': frontendUrl,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
});

router.post("/generate", isAuthenticated, generateResume);

export default router;


