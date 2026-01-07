import mongoose from "mongoose";

const userQuestionHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    askedQuestions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        askedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalAttempts: {
        type: Number,
        default: 0
    },
    lastResetAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries
userQuestionHistorySchema.index({ user: 1, category: 1 }, { unique: true });

export const UserQuestionHistory = mongoose.model("UserQuestionHistory", userQuestionHistorySchema);

