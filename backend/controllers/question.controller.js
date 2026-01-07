import { Question } from "../models/question.model.js";
import { Category } from "../models/category.model.js";
import { UserQuestionHistory } from "../models/userQuestionHistory.model.js";
import mongoose from "mongoose";

// Create question (Admin only)
export const createQuestion = async (req, res) => {
    try {
        const { question, options, correctAnswer, categoryId, difficulty } = req.body;

        if (!question || !options || !Array.isArray(options) || options.length < 2 || correctAnswer === undefined || !categoryId) {
            return res.status(400).json({
                message: "Question, options (at least 2), correct answer, and category are required.",
                success: false
            });
        }

        // Validate correctAnswer is within options range
        if (correctAnswer < 0 || correctAnswer >= options.length) {
            return res.status(400).json({
                message: "Correct answer index is out of range.",
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

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({
                message: "Category not found.",
                success: false
            });
        }

        const newQuestion = await Question.create({
            question: question.trim(),
            options: options.map(opt => opt.trim()),
            correctAnswer: Number(correctAnswer),
            category: categoryId,
            difficulty: difficulty || 'medium'
        });

        return res.status(201).json({
            message: "Question created successfully.",
            question: newQuestion,
            success: true
        });
    } catch (error) {
        console.log("Error creating question:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};

// Get questions by category (for quiz) with smart rotation
export const getQuestionsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { count = 20 } = req.query; // Default 20 questions
        const userId = req.id; // Get user ID from authenticated request

        console.log("Fetching questions for category:", categoryId, "for user:", userId);

        if (!categoryId) {
            return res.status(400).json({
                message: "Category ID is required.",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                message: "Invalid category ID format.",
                success: false
            });
        }

        // Get all questions for this category
        const allQuestions = await Question.find({ category: categoryId });
        console.log(`Found ${allQuestions.length} questions for category ${categoryId}`);

        if (allQuestions.length === 0) {
            return res.status(404).json({
                message: "No questions found for this category. Please contact the administrator to add questions.",
                success: false
            });
        }

        let selectedQuestions = [];
        let userHistory = null;

        // If user is authenticated, track question history
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            // Get or create user question history for this category
            userHistory = await UserQuestionHistory.findOne({ 
                user: userId, 
                category: categoryId 
            });

            if (!userHistory) {
                userHistory = await UserQuestionHistory.create({
                    user: userId,
                    category: categoryId,
                    askedQuestions: [],
                    totalAttempts: 0
                });
            }

            // Get question IDs that user has already been asked (with timestamps)
            const askedQuestionMap = new Map();
            userHistory.askedQuestions.forEach(q => {
                askedQuestionMap.set(q.questionId.toString(), q.askedAt);
            });
            
            // Separate questions into never-asked and previously-asked
            const neverAskedQuestions = allQuestions.filter(
                q => !askedQuestionMap.has(q._id.toString())
            );
            
            const previouslyAskedQuestions = allQuestions.filter(
                q => askedQuestionMap.has(q._id.toString())
            ).map(q => ({
                question: q,
                lastAsked: askedQuestionMap.get(q._id.toString())
            })).sort((a, b) => a.lastAsked - b.lastAsked); // Sort by oldest first

            console.log(`User has seen ${askedQuestionMap.size} questions, ${neverAskedQuestions.length} never asked, ${previouslyAskedQuestions.length} previously asked`);

            // Strategy: ONLY use never-asked questions until ALL are exhausted
            // Then mix old and new questions
            if (neverAskedQuestions.length >= Number(count)) {
                // We have enough never-asked questions - use ONLY new questions
                const shuffled = neverAskedQuestions.sort(() => 0.5 - Math.random());
                selectedQuestions = shuffled.slice(0, Number(count));
                console.log(`✓ Using ${selectedQuestions.length} NEW questions (never asked before)`);
            } else if (neverAskedQuestions.length > 0) {
                // We have some new questions but not enough - use all new + fill with old
                const shuffledNew = neverAskedQuestions.sort(() => 0.5 - Math.random());
                selectedQuestions = [...shuffledNew];
                const remainingNeeded = Number(count) - neverAskedQuestions.length;
                
                // Fill remaining with least-recently-asked questions (shuffled)
                const shuffledOld = previouslyAskedQuestions
                    .map(item => item.question)
                    .sort(() => 0.5 - Math.random());
                
                const additionalQuestions = shuffledOld.slice(0, remainingNeeded);
                selectedQuestions = [...selectedQuestions, ...additionalQuestions];
                
                // Final shuffle to mix new and old questions
                selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
                console.log(`✓ Using ${neverAskedQuestions.length} NEW + ${remainingNeeded} OLD questions (mixed)`);
            } else {
                // All questions have been asked - reset history and start fresh cycle
                console.log(`All ${allQuestions.length} questions have been asked. Resetting history and starting fresh cycle.`);
                userHistory.askedQuestions = [];
                userHistory.lastResetAt = new Date();
                
                // Now all questions are "new" again - shuffle and select
                const shuffled = allQuestions.sort(() => 0.5 - Math.random());
                selectedQuestions = shuffled.slice(0, Number(count));
                console.log(`✓ Starting new cycle with ${selectedQuestions.length} questions`);
            }

            // Update user history with newly asked questions
            const newAskedQuestions = selectedQuestions.map(q => ({
                questionId: q._id,
                askedAt: new Date()
            }));

            // Add new questions to history (avoid duplicates)
            const existingIds = userHistory.askedQuestions.map(q => q.questionId.toString());
            const uniqueNewQuestions = newAskedQuestions.filter(
                q => !existingIds.includes(q.questionId.toString())
            );

            userHistory.askedQuestions.push(...uniqueNewQuestions);
            userHistory.totalAttempts += 1;
            await userHistory.save();

        } else {
            // No user authentication, use simple random selection
            const shuffled = allQuestions.sort(() => 0.5 - Math.random());
            selectedQuestions = shuffled.slice(0, Math.min(Number(count), allQuestions.length));
        }

        // Remove correctAnswer from response (don't send answers to frontend)
        const questionsForQuiz = selectedQuestions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            difficulty: q.difficulty
        }));

        return res.status(200).json({
            questions: questionsForQuiz,
            totalQuestions: allQuestions.length,
            success: true
        });
    } catch (error) {
        console.log("Error fetching questions:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all questions (Admin)
export const getAllQuestions = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let query = {};
        
        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            query.category = categoryId;
        }

        const questions = await Question.find(query).populate({
            path: 'category',
            select: 'name'
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            questions: questions || [],
            success: true
        });
    } catch (error) {
        console.log("Error fetching questions:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get question by ID
export const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findById(questionId).populate({
            path: 'category',
            select: 'name'
        });

        if (!question) {
            return res.status(404).json({
                message: "Question not found.",
                success: false
            });
        }

        return res.status(200).json({
            question,
            success: true
        });
    } catch (error) {
        console.log("Error fetching question:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Update question (Admin only)
export const updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const { question, options, correctAnswer, categoryId, difficulty } = req.body;

        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({
                message: "Question not found.",
                success: false
            });
        }

        // Validate if updating
        if (options && (!Array.isArray(options) || options.length < 2)) {
            return res.status(400).json({
                message: "Options must be an array with at least 2 items.",
                success: false
            });
        }

        if (correctAnswer !== undefined && options) {
            if (correctAnswer < 0 || correctAnswer >= options.length) {
                return res.status(400).json({
                    message: "Correct answer index is out of range.",
                    success: false
                });
            }
        }

        // Update fields
        if (question) existingQuestion.question = question.trim();
        if (options) existingQuestion.options = options.map(opt => opt.trim());
        if (correctAnswer !== undefined) existingQuestion.correctAnswer = Number(correctAnswer);
        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({
                    message: "Invalid category ID.",
                    success: false
                });
            }
            existingQuestion.category = categoryId;
        }
        if (difficulty) existingQuestion.difficulty = difficulty;

        await existingQuestion.save();

        return res.status(200).json({
            message: "Question updated successfully.",
            question: existingQuestion,
            success: true
        });
    } catch (error) {
        console.log("Error updating question:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};

// Delete question (Admin only)
export const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;

        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({
                message: "Question not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Question deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log("Error deleting question:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Submit quiz answers and get score
export const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedAnswer }
        const userId = req.id;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                message: "Answers are required.",
                success: false
            });
        }

        // Get all questions with their correct answers
        const questionIds = answers.map(a => a.questionId);
        const questions = await Question.find({ _id: { $in: questionIds } });

        if (questions.length !== answers.length) {
            return res.status(400).json({
                message: "Some questions not found.",
                success: false
            });
        }

        // Calculate score
        let correctCount = 0;
        const results = answers.map(answer => {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            const selectedAnswer = Number(answer.selectedAnswer);
            // -1 means no answer was selected (timed out or skipped)
            const isCorrect = question && selectedAnswer !== -1 && question.correctAnswer === selectedAnswer;
            if (isCorrect) correctCount++;
            
            return {
                questionId: answer.questionId,
                question: question?.question,
                selectedAnswer: selectedAnswer === -1 ? null : selectedAnswer,
                correctAnswer: question?.correctAnswer,
                isCorrect,
                timedOut: selectedAnswer === -1
            };
        });

        const score = (correctCount / answers.length) * 100;
        // Pass if 16 or more questions are correct (out of 20)
        const passed = correctCount >= 16;

        return res.status(200).json({
            score: Math.round(score),
            correctCount,
            totalQuestions: answers.length,
            passed,
            results,
            success: true
        });
    } catch (error) {
        console.log("Error submitting quiz:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

