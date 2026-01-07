import { Job } from "../models/job.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { calculateSkillMatch, getMatchedSkills } from "../utils/skillMatcher.js";
import { getAllUserSkills } from "../utils/cvSkillExtractor.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, categoryId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !categoryId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        // Validate categoryId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                message: "Invalid category ID.",
                success: false
            });
        }

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({
                message: "Category not found.",
                success: false
            });
        }

        // Validate companyId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        // Check if company exists
        const { Company } = await import("../models/company.model.js");
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "Company not found.",
                success: false
            });
        }

        // Validate and convert experience to number
        const experienceNum = Number(experience);
        if (isNaN(experienceNum) || experienceNum < 0) {
            return res.status(400).json({
                message: "Experience level must be a valid number.",
                success: false
            });
        }

        // Validate and convert position to number
        const positionNum = Number(position);
        if (isNaN(positionNum) || positionNum < 1) {
            return res.status(400).json({
                message: "Number of positions must be a valid number greater than 0.",
                success: false
            });
        }

        // Validate and convert salary to number
        const salaryNum = Number(salary);
        if (isNaN(salaryNum) || salaryNum < 0) {
            return res.status(400).json({
                message: "Salary must be a valid number.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: salaryNum,
            location,
            jobType,
            experienceLevel: experienceNum,
            position: positionNum,
            company: companyId,
            category: categoryId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log("Error creating job:", error);
        // Provide more specific error messages
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message || "Validation error occurred.",
                success: false
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid data format.",
                success: false
            });
        }
        // Handle MongoDB connection errors
        if (error.name === 'MongoServerError' || 
            error.name === 'MongooseError' ||
            error.message?.includes('buffering') || 
            error.message?.includes('connection') ||
            error.message?.includes('ETIMEOUT') ||
            error.message?.includes('timeout')) {
            console.error("Database connection error:", error.message);
            return res.status(503).json({
                message: "Database connection error. Please check your internet connection and try again.",
                success: false
            });
        }
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
}
// applicant k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        
        console.log("Search keyword received:", keyword);
        
        // Get all jobs with populated company and category
        let jobs = await Job.find({}).populate({
            path: "company",
            select: "name logo"
        }).populate({
            path: "category",
            select: "name"
        }).sort({ createdAt: -1 });
        
        console.log(`Total jobs before filtering: ${jobs.length}`);
        
        // Filter by keyword if provided (search in title, description, category name, company name)
        if (keyword && keyword.trim()) {
            const keywordLower = keyword.toLowerCase().trim();
            const originalLength = jobs.length;
            
            // First, check if the search term matches any category name
            const allCategories = await Category.find({}, 'name');
            let matchingCategory = null;
            
            // Check for exact match first
            matchingCategory = allCategories.find(cat => {
                const catNameLower = cat.name.toLowerCase();
                return catNameLower === keywordLower;
            });
            
            // If no exact match, check if keyword matches the first word of any category
            // e.g., "frontend" should match "Frontend Developer"
            if (!matchingCategory) {
                const keywordFirstWord = keywordLower.split(' ')[0];
                matchingCategory = allCategories.find(cat => {
                    const catNameLower = cat.name.toLowerCase();
                    const catFirstWord = catNameLower.split(' ')[0];
                    // Match if keyword is the first word of category or vice versa
                    return catFirstWord === keywordFirstWord || 
                           catNameLower.includes(keywordFirstWord) ||
                           keywordFirstWord.includes(catFirstWord);
                });
            }
            
            // If search term matches a category, ONLY show jobs from that category
            if (matchingCategory) {
                const matchingCategoryName = matchingCategory.name.toLowerCase();
                console.log(`Category search detected: "${keyword}" matches category "${matchingCategory.name}". Filtering to show only jobs from this category.`);
                
                jobs = jobs.filter(job => {
                    const jobCategoryName = (job.category?.name || "").toLowerCase();
                    const matches = jobCategoryName === matchingCategoryName;
                    if (matches) {
                        console.log(`✓ Job matched (category): "${job.title}" - Category: "${job.category?.name}"`);
                    }
                    return matches;
                });
                console.log(`Category search result: Showing ${jobs.length} jobs from "${matchingCategory.name}" category only.`);
            } else {
                // If not a category match, use flexible search but prioritize category matching
                // Split keyword into individual words for more precise matching
                const keywordWords = keywordLower.split(/\s+/).filter(w => w.length > 0);
                
                // Helper function to check if a word matches using word boundaries (prevents "frontend" matching "backend")
                const wordMatches = (text, word) => {
                    if (!text || !word) return false;
                    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const wordBoundaryRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
                    return wordBoundaryRegex.test(text.toLowerCase());
                };
                
                // For category: ALL words must match with word boundaries
                const checkCategoryMatch = (categoryName) => {
                    if (!categoryName) return false;
                    const catLower = categoryName.toLowerCase();
                    return keywordWords.every(word => wordMatches(catLower, word));
                };
                
                // For company: ALL words must match with word boundaries
                const checkCompanyMatch = (companyName) => {
                    if (!companyName) return false;
                    const compLower = companyName.toLowerCase();
                    return keywordWords.every(word => wordMatches(compLower, word));
                };
                
                // For title: ALL words must match with word boundaries
                const checkTitleMatch = (title) => {
                    if (!title) return false;
                    const titleLower = title.toLowerCase();
                    return keywordWords.every(word => wordMatches(titleLower, word));
                };
                
                jobs = jobs.filter(job => {
                    // Category: ALL words must match (most important - should be precise)
                    const categoryName = job.category?.name || "";
                    const categoryMatch = checkCategoryMatch(categoryName);
                    
                    // Company: ALL words must match (most important - should be precise)
                    const companyName = job.company?.name || "";
                    const companyMatch = checkCompanyMatch(companyName);
                    
                    // Title: ALL words must match with word boundaries
                    const title = job.title || "";
                    const titleMatch = checkTitleMatch(title);
                    
                    // Description: substring match (more flexible for detailed searches)
                    const descriptionMatch = (job.description || "").toLowerCase().includes(keywordLower);
                    
                    // Location: substring match
                    const locationMatch = (job.location || "").toLowerCase().includes(keywordLower);
                    
                    // Priority: Category match is most important
                    // If category matches, include it
                    // If category doesn't match but job has a category, exclude it (prevents cross-category matches)
                    // Only allow description/location matches if no category exists or category already matched
                    let matches = false;
                    
                    if (categoryMatch) {
                        // Category matches - always include
                        matches = true;
                    } else if (companyMatch || titleMatch) {
                        // Company or title matches - include if job has no category, or if category doesn't conflict
                        matches = true;
                    } else if (job.category?.name) {
                        // Job has a category but it doesn't match - exclude even if description matches
                        // This prevents "frontend" from matching "Backend Developer" jobs
                        matches = false;
                    } else {
                        // No category - allow description/location matches
                        matches = descriptionMatch || locationMatch;
                    }
                    
                    if (matches) {
                        const matchType = categoryMatch ? 'category' : companyMatch ? 'company' : titleMatch ? 'title' : descriptionMatch ? 'description' : 'location';
                        console.log(`✓ Job matched (${matchType}): "${job.title}" - Category: "${job.category?.name}", Company: "${job.company?.name}"`);
                    }
                    
                    return matches;
                });
            }
            
            console.log(`Jobs after filtering with "${keyword}": ${jobs.length} out of ${originalLength}`);
        }
        
        return res.status(200).json({
            jobs: jobs || [],
            success: true
        })
    } catch (error) {
        console.log("Error in getAllJobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// applicant
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        }).populate({
            path: "category"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// Update job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, categoryId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false
            });
        }

        // Find the job and verify ownership
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You don't have permission to update this job.",
                success: false
            });
        }

        // Validate required fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !categoryId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Validate categoryId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                message: "Invalid category ID.",
                success: false
            });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({
                message: "Category not found.",
                success: false
            });
        }

        // Validate companyId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        const { Company } = await import("../models/company.model.js");
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "Company not found.",
                success: false
            });
        }

        // Validate and convert experience to number
        const experienceNum = Number(experience);
        if (isNaN(experienceNum) || experienceNum < 0) {
            return res.status(400).json({
                message: "Invalid experience level.",
                success: false
            });
        }

        // Validate and convert salary to number
        const salaryNum = Number(salary);
        if (isNaN(salaryNum) || salaryNum < 0) {
            return res.status(400).json({
                message: "Invalid salary.",
                success: false
            });
        }

        // Validate and convert position to number
        const positionNum = Number(position);
        if (isNaN(positionNum) || positionNum < 1) {
            return res.status(400).json({
                message: "Invalid number of positions.",
                success: false
            });
        }

        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                requirements,
                salary: salaryNum,
                location,
                jobType,
                experience: experienceNum,
                position: positionNum,
                companyId,
                categoryId
            },
            { new: true, runValidators: true }
        ).populate({
            path: 'company',
            select: 'name logo description website location'
        }).populate({
            path: "category",
            select: 'name description'
        });

        return res.status(200).json({
            message: "Job updated successfully.",
            job: updatedJob,
            success: true
        });
    } catch (error) {
        console.log("Error updating job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        
        if (!adminId) {
            return res.status(401).json({
                message: "Unauthorized. Please login.",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({
                message: "Invalid user ID.",
                success: false
            });
        }

        const jobs = await Job.find({ created_by: adminId })
            .populate({
                path: 'company',
                select: 'name logo description website location'
            })
            .populate({
                path: "category",
                select: 'name description'
            })
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance and to avoid potential issues with Mongoose documents
        
        return res.status(200).json({
            jobs: jobs || [],
            success: true
        })
    } catch (error) {
        console.log("Error in getAdminJobs:", error);
        console.log("Error stack:", error.stack);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
}

// Delete job (Admin only - only the creator can delete)
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Check if the user is the creator of the job
        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this job.",
                success: false
            });
        }

        // Delete associated applications
        const { Application } = await import("../models/application.model.js");
        await Application.deleteMany({ job: jobId });

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job and associated applications deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log("Error deleting job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get skill match percentage for a job
export const getJobMatchPercentage = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id; // From authentication middleware

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // Get the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Get the user's skills
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if user is an applicant
        if (user.role !== 'applicant') {
            return res.status(403).json({
                message: "Only applicants can view match percentages.",
                success: false
            });
        }

        // Get all skills from profile and CV
        const candidateSkills = await getAllUserSkills(user);
        const jobRequirements = job.requirements || [];

        // Calculate match percentage
        const matchPercentage = calculateSkillMatch(candidateSkills, jobRequirements);
        const { matched, missing } = getMatchedSkills(candidateSkills, jobRequirements);

        return res.status(200).json({
            matchPercentage,
            matchedSkills: matched,
            missingSkills: missing,
            success: true
        });
    } catch (error) {
        console.log("Error calculating match percentage:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get recommended jobs based on skill match (for authenticated applicants)
export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.id; // From authentication middleware
        const limit = parseInt(req.query.limit) || 6; // Default to 6 jobs

        // Get the user's skills
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if user is an applicant
        if (user.role !== 'applicant') {
            return res.status(403).json({
                message: "Only applicants can view recommended jobs.",
                success: false
            });
        }

        // Get all skills from profile and CV
        const candidateSkills = await getAllUserSkills(user);

        // Get all jobs with populated company and category
        const jobs = await Job.find({}).populate({
            path: "company",
            select: "name logo"
        }).populate({
            path: "category",
            select: "name"
        }).sort({ createdAt: -1 });

        // Calculate match percentage for each job
        const jobsWithMatch = jobs.map(job => {
            const matchPercentage = calculateSkillMatch(candidateSkills, job.requirements || []);
            return {
                ...job.toObject(),
                matchPercentage
            };
        });

        // Sort by match percentage (descending) and take top N
        const recommendedJobs = jobsWithMatch
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, limit);

        return res.status(200).json({
            jobs: recommendedJobs,
            success: true
        });
    } catch (error) {
        console.log("Error getting recommended jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
