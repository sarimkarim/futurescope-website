import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import categoryRoute from "./routes/category.route.js";
import questionRoute from "./routes/question.route.js";
import resumeRoute from "./routes/resume.route.js";

dotenv.config({});

const app = express();

// middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition']
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/resume", resumeRoute);



// Start server and connect to database
const startServer = async () => {
    // Start server - bind to 0.0.0.0 for Railway/cloud hosting
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running at port ${PORT}`);
        console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
    
    // Connect to database (will retry if it fails)
    // Don't block server startup - connection will retry in background
    connectDB().catch(error => {
        console.error('Initial database connection failed:', error.message);
        console.log('Server is running. Database connection will retry automatically.');
    });
};

startServer();