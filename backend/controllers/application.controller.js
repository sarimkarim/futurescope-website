import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Question } from "../models/question.model.js";
import { Category } from "../models/category.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const { quizScore, quizResults } = req.body;
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId).populate('category');
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        // Check if questions exist for this category
        const categoryId = job.category?._id || job.category;
        const questionsExist = categoryId ? await Question.countDocuments({ category: categoryId }) > 0 : false;

        let applicationStatus = 'pending'; // Default status
        let correctCount = 0;

        // If questions exist, validate quiz results and determine status
        if (questionsExist) {
            if (quizScore === undefined || !quizResults || !Array.isArray(quizResults)) {
                return res.status(400).json({
                    message: "Quiz results are required to apply for this job.",
                    success: false
                });
            }

            // Count correct answers
            correctCount = quizResults.filter(result => result.isCorrect === true).length;
            
            // Set status based on correct answers: 16+ = pending (sent to recruiter), <16 = rejected
            const quizPassed = correctCount >= 16;
            if (quizPassed) {
                applicationStatus = 'pending'; // Passed quizzes are sent to recruiter for review
            } else {
                applicationStatus = 'rejected'; // Failed quizzes are automatically rejected
            }
        }

        // create a new application (with or without quiz results)
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
            quizScore: questionsExist ? quizScore : null,
            quizPassed: questionsExist ? (correctCount >= 16) : null,
            quizResults: questionsExist ? quizResults : [],
            status: applicationStatus
        });

        job.applications.push(newApplication._id);
        await job.save();
        
        // Return appropriate message based on status
        let message = "Job applied successfully.";
        if (questionsExist) {
            if (applicationStatus === 'pending') {
                message = `Congratulations! You answered ${correctCount} questions correctly. Your application has been submitted and sent to the recruiter for review.`;
            } else {
                message = `You answered ${correctCount} out of 20 questions correctly. You need at least 16 correct answers. Your application has been rejected.`;
            }
        } else {
            message = "Job applied successfully. (No quiz required for this category)";
        }
        
        return res.status(201).json({
            message: message,
            success: true,
            status: applicationStatus,
            correctCount: questionsExist ? correctCount : null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        // Application.find() always returns an array, so check length instead
        return res.status(200).json({
            application: application || [],
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:[
                {
                    path:'applicant'
                },
                {
                    path:'quizResults.questionId',
                    select:'question'
                }
            ]
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// View applicant resume (for recruiters)
export const viewApplicantResume = async (req, res) => {
    try {
        const recruiterId = req.id; // Current user (recruiter)
        const { applicationId } = req.params;

        // Find the application
        const application = await Application.findById(applicationId).populate({
            path: 'job',
            select: 'created_by'
        }).populate({
            path: 'applicant',
            select: 'profile'
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        // Verify that the recruiter is the owner of the job
        if (application.job.created_by.toString() !== recruiterId) {
            return res.status(403).json({
                message: "You don't have permission to view this resume",
                success: false
            });
        }

        // Check if applicant has a resume
        if (!application.applicant?.profile?.resume) {
            return res.status(404).json({
                message: "Resume not found",
                success: false
            });
        }

        const resumeUrl = application.applicant.profile.resume;

        // Fetch PDF from Cloudinary
        const response = await fetch(resumeUrl);

        if (!response.ok) {
            return res.status(404).json({
                message: "Failed to fetch resume",
                success: false
            });
        }

        const pdfBuffer = await response.arrayBuffer();

        // Set headers to view PDF in browser instead of downloading
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${application.applicant.profile.resumeOriginalName || 'resume.pdf'}"`);
        res.setHeader('Access-Control-Allow-Origin', frontendUrl);
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Send PDF buffer
        res.status(200).send(Buffer.from(pdfBuffer));
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get performance history (past simulation attempts)
export const getPerformanceHistory = async (req, res) => {
    try {
        const userId = req.id;
        
        // Get all applications with quiz results, sorted by date
        const applications = await Application.find({
            applicant: userId,
            quizScore: { $ne: null } // Only applications with quiz scores
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'job',
            select: 'title company category',
            populate: [
                {
                    path: 'company',
                    select: 'name'
                },
                {
                    path: 'category',
                    select: 'name'
                }
            ]
        })
        .populate({
            path: 'quizResults.questionId',
            select: 'question category difficulty',
            populate: {
                path: 'category',
                select: 'name'
            }
        });

        // Format the data for frontend
        const performanceHistory = applications.map(app => ({
            id: app._id,
            date: app.createdAt,
            jobTitle: app.job?.title || 'N/A',
            companyName: app.job?.company?.name || 'N/A',
            category: app.job?.category?.name || 'N/A',
            score: app.quizScore,
            passed: app.quizPassed,
            correctCount: app.quizResults.filter(r => r.isCorrect).length,
            totalQuestions: app.quizResults.length,
            status: app.status
        }));

        return res.status(200).json({
            success: true,
            performanceHistory
        });
    } catch (error) {
        console.log("Error getting performance history:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get improvement over time (score trends)
export const getImprovementOverTime = async (req, res) => {
    try {
        const userId = req.id;
        
        // Get all applications with quiz scores, sorted by date
        const applications = await Application.find({
            applicant: userId,
            quizScore: { $ne: null }
        })
        .sort({ createdAt: 1 }) // Oldest first for trend analysis
        .select('quizScore createdAt quizPassed');

        // Group by month for trend analysis
        const monthlyData = {};
        applications.forEach(app => {
            const date = new Date(app.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    scores: [],
                    attempts: 0,
                    passed: 0
                };
            }
            
            monthlyData[monthKey].scores.push(app.quizScore);
            monthlyData[monthKey].attempts++;
            if (app.quizPassed) {
                monthlyData[monthKey].passed++;
            }
        });

        // Calculate averages and format for chart
        const trendData = Object.keys(monthlyData)
            .sort()
            .map(key => {
                const data = monthlyData[key];
                const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
                return {
                    month: key,
                    averageScore: Math.round(avgScore),
                    attempts: data.attempts,
                    passed: data.passed,
                    passRate: Math.round((data.passed / data.attempts) * 100)
                };
            });

        // Calculate overall improvement
        let improvement = 0;
        if (applications.length >= 2) {
            const firstScore = applications[0].quizScore;
            const lastScore = applications[applications.length - 1].quizScore;
            improvement = lastScore - firstScore;
        }

        return res.status(200).json({
            success: true,
            trendData,
            improvement,
            totalAttempts: applications.length,
            currentAverage: applications.length > 0 
                ? Math.round(applications.reduce((sum, app) => sum + app.quizScore, 0) / applications.length)
                : 0
        });
    } catch (error) {
        console.log("Error getting improvement over time:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get skill growth by category
export const getSkillGrowth = async (req, res) => {
    try {
        const userId = req.id;
        
        // Get all applications with quiz results
        const applications = await Application.find({
            applicant: userId,
            quizResults: { $exists: true, $ne: [] }
        })
        .populate({
            path: 'job',
            select: 'category',
            populate: {
                path: 'category',
                select: 'name'
            }
        })
        .populate({
            path: 'quizResults.questionId',
            select: 'category difficulty',
            populate: {
                path: 'category',
                select: 'name'
            }
        });

        // Group performance by category
        const categoryPerformance = {};
        
        applications.forEach(app => {
            app.quizResults.forEach(result => {
                const question = result.questionId;
                if (!question || !question.category) return;
                
                const categoryName = question.category.name;
                
                if (!categoryPerformance[categoryName]) {
                    categoryPerformance[categoryName] = {
                        category: categoryName,
                        totalQuestions: 0,
                        correctAnswers: 0,
                        attempts: 0,
                        scores: []
                    };
                }
                
                categoryPerformance[categoryName].totalQuestions++;
                if (result.isCorrect) {
                    categoryPerformance[categoryName].correctAnswers++;
                }
            });
            
            // Track attempts per category
            const categoryName = app.job?.category?.name;
            if (categoryName && categoryPerformance[categoryName]) {
                categoryPerformance[categoryName].attempts++;
                if (app.quizScore) {
                    categoryPerformance[categoryName].scores.push(app.quizScore);
                }
            }
        });

        // Calculate performance metrics for each category
        const skillGrowth = Object.keys(categoryPerformance).map(categoryName => {
            const data = categoryPerformance[categoryName];
            const accuracy = data.totalQuestions > 0 
                ? Math.round((data.correctAnswers / data.totalQuestions) * 100)
                : 0;
            const avgScore = data.scores.length > 0
                ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
                : 0;
            
            return {
                category: categoryName,
                accuracy,
                averageScore: avgScore,
                totalQuestions: data.totalQuestions,
                correctAnswers: data.correctAnswers,
                attempts: data.attempts
            };
        }).sort((a, b) => b.accuracy - a.accuracy); // Sort by accuracy descending

        return res.status(200).json({
            success: true,
            skillGrowth
        });
    } catch (error) {
        console.log("Error getting skill growth:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}