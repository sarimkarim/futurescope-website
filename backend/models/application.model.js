import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    quizScore:{
        type:Number,
        default:null
    },
    quizPassed:{
        type:Boolean,
        default:null
    },
    quizResults:[{
        questionId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Question'
        },
        selectedAnswer:Number,
        isCorrect:Boolean
    }]
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);