import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!email) {
            return res.status(400).json({
                message: "email is missing",
                success: false
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "password is missing",
                success: false
            });
        }
        if (!fullname || !phoneNumber || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        let profilePhotoUrl = '';
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (error) {
                console.log('Error uploading profile photo:', error);
            }
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: profilePhotoUrl,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: "email is missing",
                success: false
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "password is missing",
                success: false
            });
        }
        if (!role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        let cloudResponse = null;
        // cloudinary ayega idhar
        if (file) {
            const fileUri = getDataUri(file);
            // For PDF files, use 'raw' resource_type, otherwise use 'auto' to let Cloudinary detect
            const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: isPdf ? 'raw' : 'auto'
            });
        }



        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
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

// Proxy endpoint to serve PDF from Cloudinary with proper headers
export const viewResume = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        
        if (!user || !user.profile?.resume) {
            return res.status(404).json({
                message: "Resume not found",
                success: false
            });
        }

        const resumeUrl = user.profile.resume;
        
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
        res.setHeader('Content-Disposition', `inline; filename="${user.profile.resumeOriginalName || 'resume.pdf'}"`);
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

// Analytics endpoint
export const getAnalytics = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Get active users count (applicants)
        const activeApplicants = await User.countDocuments({ role: 'applicant' });
        
        // Get active recruiters count
        const activeRecruiters = await User.countDocuments({ role: 'recruiter' });

        // Get jobs applied count for the current user (if applicant)
        let jobsApplied = 0;
        if (user.role === 'applicant') {
            jobsApplied = await Application.countDocuments({ applicant: userId });
        }

        return res.status(200).json({
            jobsApplied,
            activeApplicants,
            activeRecruiters,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Save job for later
export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if user is an applicant
        if (user.role !== 'applicant') {
            return res.status(403).json({
                message: "Only applicants can save jobs.",
                success: false
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Check if job is already saved
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Job is already saved.",
                success: false
            });
        }

        // Add job to savedJobs array
        user.savedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Job saved successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Unsave job
export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if user is an applicant
        if (user.role !== 'applicant') {
            return res.status(403).json({
                message: "Only applicants can unsave jobs.",
                success: false
            });
        }

        // Check if job is saved
        if (!user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Job is not saved.",
                success: false
            });
        }

        // Remove job from savedJobs array
        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();

        return res.status(200).json({
            message: "Job unsaved successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get saved jobs
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: [
                { path: 'company', select: 'name logo' },
                { path: 'category', select: 'name' }
            ]
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if user is an applicant
        if (user.role !== 'applicant') {
            return res.status(403).json({
                message: "Only applicants can view saved jobs.",
                success: false
            });
        }

        return res.status(200).json({
            savedJobs: user.savedJobs || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}