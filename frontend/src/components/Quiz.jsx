import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from './ui/button'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import axios from 'axios'
import { QUESTION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

const Quiz = ({ isOpen, onClose, categoryId, jobId, onQuizComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
    const [timedOutQuestions, setTimedOutQuestions] = useState(new Set()); // Track questions that timed out
    const [visitedQuestions, setVisitedQuestions] = useState(new Set()); // Track questions that have been visited

    useEffect(() => {
        if (isOpen && categoryId) {
            fetchQuestions();
        }
    }, [isOpen, categoryId]);

    // Store answers in ref to access latest value in timer
    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    // Timer effect - countdown and auto-advance
    useEffect(() => {
        // Reset timer only when question index changes (not when answer changes)
        setTimeLeft(30);
        
        // Only start timer if quiz is active and not completed
        if (loading || quizCompleted || questions.length === 0) {
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        // Mark question as visited
        setVisitedQuestions(prev => new Set(prev).add(currentQuestion._id));

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time's up - mark question as timed out and move to next
                    // Check if question was already answered using ref to get latest value
                    const currentAnswer = answersRef.current[currentQuestion._id];
                    const isAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== -1;
                    
                    if (!isAnswered) {
                        // Mark as timed out and set answer to -1
                        setTimedOutQuestions(prevSet => new Set(prevSet).add(currentQuestion._id));
                        setAnswers(prev => ({
                            ...prev,
                            [currentQuestion._id]: -1 // Mark as -1 for timed out
                        }));
                    }
                    
                    // Auto-advance to next question immediately
                    if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(prev => prev + 1);
                    } else {
                        // Last question - auto submit
                        handleSubmitRef.current();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, loading, quizCompleted, questions.length]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            // Ensure categoryId is a string - handle both object and string cases
            let categoryIdStr;
            if (typeof categoryId === 'object' && categoryId !== null) {
                categoryIdStr = categoryId._id || categoryId.toString();
            } else {
                categoryIdStr = String(categoryId);
            }
            
            // Remove any whitespace
            categoryIdStr = categoryIdStr.trim();
            
            console.log("Fetching questions for categoryId:", categoryIdStr);
            
            const res = await axios.get(`${QUESTION_API_END_POINT}/category/${categoryIdStr}?count=20`, {
                withCredentials: true
            });
            if (res.data.success) {
                setQuestions(res.data.questions);
                setAnswers({});
                setCurrentQuestionIndex(0);
                setQuizCompleted(false);
                setQuizResult(null);
                setTimeLeft(30);
                setTimedOutQuestions(new Set());
                setVisitedQuestions(new Set());
            } else {
                toast.error("Failed to load questions");
                onClose();
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            console.error("Error details:", {
                status: error.response?.status,
                message: error.response?.data?.message,
                categoryId: categoryId
            });
            // Handle 404 specifically - no questions found for this category
            if (error.response?.status === 404) {
                const errorMessage = error.response?.data?.message || "No questions available for this category.";
                toast.error(errorMessage);
                // Close quiz modal - user can apply directly without quiz
                onClose();
            } else if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || "Invalid category ID.");
                onClose();
            } else {
                toast.error(error.response?.data?.message || "Failed to load quiz questions");
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answerIndex) => {
        // Don't reset timer when changing answer - timer continues running
        setAnswers({
            ...answers,
            [questionId]: answerIndex
        });
        // Remove from timed out set if user answers after timeout
        if (timedOutQuestions.has(questionId)) {
            setTimedOutQuestions(prev => {
                const newSet = new Set(prev);
                newSet.delete(questionId);
                return newSet;
            });
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            // Timer will reset automatically in useEffect when currentQuestionIndex changes
        }
    };

    const handlePrevious = () => {
        // Disable going back to previous questions
        // Users cannot revisit questions they've already moved past
        return;
    };

    const handleSubmit = useCallback(async () => {
        if (submitting || quizCompleted) return;
        
        try {
            setSubmitting(true);
            // Include all questions - unanswered ones will be marked as wrong
            // Include all questions - unanswered or timed out ones will be marked as wrong (-1)
            const answersArray = questions.map(q => {
                const answer = answers[q._id];
                // If answer is -1 (timed out) or undefined/null (not answered), send -1
                if (answer === -1 || answer === undefined || answer === null) {
                    return {
                        questionId: q._id,
                        selectedAnswer: -1 // -1 indicates no answer or timed out (will be marked wrong)
                    };
                }
                return {
                    questionId: q._id,
                    selectedAnswer: answer
                };
            });

            const res = await axios.post(
                `${QUESTION_API_END_POINT}/submit`,
                { answers: answersArray },
                { withCredentials: true }
            );

            if (res.data.success) {
                setQuizResult(res.data);
                setQuizCompleted(true);
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error(error.response?.data?.message || "Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    }, [questions, answers, submitting, quizCompleted]);

    // Store handleSubmit in ref for timer access
    const handleSubmitRef = useRef(handleSubmit);
    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    }, [handleSubmit]);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-2 sm:mx-auto">
                    <DialogHeader>
                        <DialogTitle>Job Application Quiz</DialogTitle>
                        <DialogDescription>
                            Please answer all {questions.length} questions to complete your application. 
                            You need at least 16 correct answers to pass.
                        </DialogDescription>
                    </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : quizCompleted ? (
                    <div className="py-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                {quizResult.passed ? (
                                    <>
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                        <span className="text-green-600 font-semibold">You Passed!</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-8 w-8 text-red-600" />
                                        <span className="text-red-600 font-semibold">You need at least 16 correct answers</span>
                                    </>
                                )}
                            </div>
                            <div className="text-3xl font-bold mb-2">
                                Score: {quizResult.score}%
                            </div>
                            <div className="text-gray-600 mb-2">
                                Correct: {quizResult.correctCount} / {quizResult.totalQuestions}
                            </div>
                            <div className="text-sm text-gray-500">
                                Required: 16 correct answers to pass
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={onClose} variant="outline">
                                Close
                            </Button>
                            {onQuizComplete && (
                                <Button onClick={() => onQuizComplete(quizResult)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {quizResult.passed ? "Continue Application" : "Submit Application"}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-4">
                        {/* Progress Bar and Timer */}
                        <div className="mb-4 md:mb-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs sm:text-sm mb-2">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <span className="hidden sm:inline">{answeredCount} / {questions.length} answered</span>
                                    <div className={`flex items-center gap-2 font-semibold ${
                                        timeLeft <= 10 ? 'text-red-600' : timeLeft <= 15 ? 'text-orange-600' : 'text-gray-700'
                                    }`}>
                                        <span>Time:</span>
                                        <span className={`px-2 py-1 rounded ${
                                            timeLeft <= 10 ? 'bg-red-100' : timeLeft <= 15 ? 'bg-orange-100' : 'bg-gray-100'
                                        }`}>
                                            {timeLeft}s
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            {/* Timer Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                    className={`h-1 rounded-full transition-all ${
                                        timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 15 ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        {currentQuestion && (
                            <div className="mb-4 md:mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                    <h3 className="text-base md:text-lg font-semibold">
                                        {currentQuestion.question}
                                    </h3>
                                    {timedOutQuestions.has(currentQuestion._id) && (
                                        <span className="text-red-600 text-xs sm:text-sm font-medium bg-red-50 px-2 sm:px-3 py-1 rounded self-start sm:self-auto">
                                            Time's Up!
                                        </span>
                                    )}
                                </div>
                                <RadioGroup
                                    value={answers[currentQuestion._id]?.toString() || ""}
                                    onValueChange={(value) => handleAnswerChange(currentQuestion._id, Number(value))}
                                    disabled={timedOutQuestions.has(currentQuestion._id)}
                                >
                                    {currentQuestion.options.map((option, index) => (
                                        <div key={index} className={`flex items-center space-x-2 mb-3 p-3 rounded-md hover:bg-gray-50 ${
                                            timedOutQuestions.has(currentQuestion._id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        }`}>
                                            <RadioGroupItem 
                                                value={index.toString()} 
                                                id={`option-${index}`}
                                                disabled={timedOutQuestions.has(currentQuestion._id)}
                                            />
                                            <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-end mt-6">
                            {currentQuestionIndex < questions.length - 1 ? (
                                <Button
                                    onClick={handleNext}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Quiz"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Quiz;

