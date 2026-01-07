import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, QUESTION_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Quiz from './Quiz';
import Navbar from './shared/Navbar';
import useGetJobMatch from '@/hooks/useGetJobMatch';

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [showQuiz, setShowQuiz] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const matchData = useGetJobMatch(jobId);

    const handleApplyClick = async () => {
        // Check if user is logged in
        if (!user) {
            toast.error("Please login to apply for this job");
            navigate("/login");
            return;
        }

        // Check if user is an applicant (not a recruiter)
        if (user.role === 'recruiter') {
            toast.error("Recruiters cannot apply for jobs");
            return;
        }

        if (isApplying) return; // Prevent multiple clicks
        
        if (singleJob?.category) {
            const categoryId = singleJob.category._id || singleJob.category;
            
            // Check if questions exist before showing quiz
            try {
                const res = await axios.get(`${QUESTION_API_END_POINT}/category/${categoryId}?count=1`, {
                    withCredentials: true
                });
                
                if (res.data.success && res.data.questions.length > 0) {
                    // Questions exist, show quiz
                    setShowQuiz(true);
                } else {
                    // No questions, apply directly
                    await handleDirectApply();
                }
            } catch (error) {
                // 404 means no questions exist - this is expected and handled
                if (error.response?.status === 404) {
                    // No questions found, apply directly without quiz
                    await handleDirectApply();
                } else {
                    // Other errors - log but don't show to user unless it's critical
                    console.error("Error checking questions:", error);
                    // Still try to apply directly as fallback
                    await handleDirectApply();
                }
            }
        } else {
            toast.error("Job category not found");
        }
    };

    const handleDirectApply = async () => {
        if (isApplying) return; // Prevent multiple calls
        
        try {
            setIsApplying(true);
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                {
                    quizScore: null,
                    quizResults: []
                },
                { withCredentials: true }
            );
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message || "Application submitted successfully!");
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            toast.error(error.response?.data?.message || "Failed to apply for job");
        } finally {
            setIsApplying(false);
        }
    };

    const handleQuizComplete = async (quizResult) => {
        // Apply for job with quiz results (passed = pending for recruiter review, failed = auto-rejected)
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                {
                    quizScore: quizResult.score,
                    quizResults: quizResult.results.map(r => ({
                        questionId: r.questionId,
                        selectedAnswer: r.selectedAnswer,
                        isCorrect: r.isCorrect
                    }))
                },
                { withCredentials: true }
            );
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                
                // Show message based on status
                if (res.data.status === 'pending') {
                    toast.success(res.data.message || "Your application has been submitted and sent to the recruiter for review.");
                } else if (res.data.status === 'rejected') {
                    toast.error(res.data.message || "Your application has been rejected. You need at least 16 correct answers.");
                } else {
                    toast.success(res.data.message || "Application submitted successfully!");
                }
                
                setShowQuiz(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply for job");
        }
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    // Check if job is saved
    useEffect(() => {
        const checkIfSaved = async () => {
            if (!user || user.role !== 'applicant' || !jobId) return;
            
            try {
                const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, { withCredentials: true });
                if (res.data.success) {
                    const savedJobIds = res.data.savedJobs.map(savedJob => 
                        typeof savedJob === 'object' ? savedJob._id : savedJob
                    );
                    setIsSaved(savedJobIds.includes(jobId));
                }
            } catch (error) {
                console.error("Error checking saved jobs:", error);
            }
        };
        checkIfSaved();
    }, [user, jobId]);

    const handleSaveJob = async () => {
        if (!user || user.role !== 'applicant') {
            toast.error("Please login as an applicant to save jobs");
            return;
        }
        
        setIsSaving(true);
        try {
            if (isSaved) {
                // Unsave job
                const res = await axios.delete(`${USER_API_END_POINT}/unsave-job/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    setIsSaved(false);
                    toast.success("Job unsaved successfully");
                }
            } else {
                // Save job
                const res = await axios.post(`${USER_API_END_POINT}/save-job/${jobId}`, {}, { withCredentials: true });
                if (res.data.success) {
                    setIsSaved(true);
                    toast.success("Job saved successfully");
                }
            }
        } catch (error) {
            console.error("Error saving/unsaving job:", error);
            toast.error(error.response?.data?.message || "Failed to save job");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* Back Button */}
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="mb-6 flex items-center gap-2 hover:bg-gray-100"
                >
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                            <h1 className='font-bold text-lg md:text-xl lg:text-2xl'>{singleJob?.title}</h1>
                            {user && user.role === 'applicant' && !matchData.loading && matchData.matchPercentage > 0 && (
                                <Badge className={`${
                                    matchData.matchPercentage >= 70 ? 'bg-green-100 text-green-700 border-green-300' :
                                    matchData.matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                    'bg-orange-100 text-orange-700 border-orange-300'
                                } font-semibold text-sm border`}>
                                    {matchData.matchPercentage}% Match
                                </Badge>
                            )}
                        </div>
                    <div className='flex items-center gap-2 mt-4 flex-wrap'>
                        {singleJob?.category && (
                            <Badge className={'bg-green-100 text-green-700 border-green-200 font-semibold'} variant="outline">{singleJob.category.name}</Badge>
                        )}
                        <Badge className={'bg-blue-100 text-blue-700 border-blue-200 font-semibold'} variant="outline">{singleJob?.position} Positions</Badge>
                        <Badge className={'bg-orange-100 text-orange-700 border-orange-200 font-semibold'} variant="outline">{singleJob?.jobType}</Badge>
                        <Badge className={'bg-indigo-100 text-indigo-700 border-indigo-200 font-semibold'} variant="outline">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row gap-2'>
                    {user && user.role === 'applicant' && (
                        <Button
                            onClick={handleSaveJob}
                            disabled={isSaving}
                            variant="outline"
                            className={`rounded-lg w-full sm:w-auto border-2 ${
                                isSaved 
                                    ? 'border-green-500 bg-green-50 hover:bg-green-100 text-green-700' 
                                    : 'border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700'
                            }`}
                        >
                            {isSaving ? (
                                'Processing...'
                            ) : (
                                <>
                                    {isSaved ? <BookmarkCheck className='h-4 w-4 mr-2 inline' /> : <Bookmark className='h-4 w-4 mr-2 inline' />}
                                    {isSaved ? 'Saved' : 'Save For Later'}
                                </>
                            )}
                        </Button>
                    )}
                    <Button
                        onClick={isApplied ? null : handleApplyClick}
                        disabled={isApplied || isApplying || !user || user.role === 'recruiter'}
                        className={`rounded-lg w-full sm:w-auto ${isApplied ? 'bg-gray-600 cursor-not-allowed' : (!user || user.role === 'recruiter') ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}>
                        {!user ? 'Login to Apply' : user.role === 'recruiter' ? 'Recruiters Cannot Apply' : isApplied ? 'Already Applied' : isApplying ? 'Applying...' : 'Apply Now'}
                    </Button>
                </div>
            </div>
            <h1 className='border-b-2 border-b-blue-200 font-medium py-4 text-blue-700'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                {singleJob?.category && (
                    <h1 className='font-bold my-1'>Category: <span className='pl-4 font-normal text-gray-800'>{singleJob.category.name}</span></h1>
                )}
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
            </div>

            {/* Skill Match Section */}
            {user && user.role === 'applicant' && !matchData.loading && matchData.matchPercentage > 0 && (
                <div className='my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                    <h2 className='font-bold text-lg mb-4 text-blue-800'>Skill Match Analysis</h2>
                    <div className='mb-4'>
                        <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm font-medium text-gray-700'>Overall Match</span>
                            <span className={`font-bold text-lg ${
                                matchData.matchPercentage >= 70 ? 'text-green-600' :
                                matchData.matchPercentage >= 50 ? 'text-yellow-600' :
                                'text-orange-600'
                            }`}>
                                {matchData.matchPercentage}%
                            </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2.5'>
                            <div 
                                className={`h-2.5 rounded-full ${
                                    matchData.matchPercentage >= 70 ? 'bg-green-600' :
                                    matchData.matchPercentage >= 50 ? 'bg-yellow-600' :
                                    'bg-orange-600'
                                }`}
                                style={{ width: `${matchData.matchPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    {matchData.matchedSkills.length > 0 && (
                        <div className='mb-4'>
                            <h3 className='text-sm font-semibold text-green-700 mb-2 flex items-center gap-2'>
                                <CheckCircle2 className='h-4 w-4' />
                                Matched Skills ({matchData.matchedSkills.length})
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {matchData.matchedSkills.map((skill, index) => (
                                    <Badge key={index} className='bg-green-100 text-green-700 border-green-300'>
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    {matchData.missingSkills.length > 0 && (
                        <div>
                            <h3 className='text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2'>
                                <XCircle className='h-4 w-4' />
                                Missing Skills ({matchData.missingSkills.length})
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {matchData.missingSkills.map((skill, index) => (
                                    <Badge key={index} className='bg-orange-100 text-orange-700 border-orange-300'>
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Quiz Modal */}
            {singleJob?.category && (
                <Quiz
                    isOpen={showQuiz}
                    onClose={() => setShowQuiz(false)}
                    categoryId={singleJob.category._id || singleJob.category}
                    jobId={jobId}
                    onQuizComplete={handleQuizComplete}
                />
            )}
            </div>
        </div>
    )
}

export default JobDescription