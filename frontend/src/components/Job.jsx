import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import useGetJobMatch from '@/hooks/useGetJobMatch'

const Job = ({job, onUnsave}) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const matchData = useGetJobMatch(job?._id);

    // Check if job is saved
    useEffect(() => {
        const checkIfSaved = async () => {
            if (!user || user.role !== 'applicant' || !job?._id) return;
            
            try {
                const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, { withCredentials: true });
                if (res.data.success) {
                    const savedJobIds = res.data.savedJobs.map(savedJob => 
                        typeof savedJob === 'object' ? savedJob._id : savedJob
                    );
                    setIsSaved(savedJobIds.includes(job._id));
                }
            } catch (error) {
                console.error("Error checking saved jobs:", error);
            }
        };
        checkIfSaved();
    }, [user, job?._id]);

    const handleSaveJob = async (e) => {
        e.stopPropagation();
        if (!user || user.role !== 'applicant') {
            toast.error("Please login as an applicant to save jobs");
            return;
        }
        
        setIsSaving(true);
        try {
            if (isSaved) {
                // Unsave job
                const res = await axios.delete(`${USER_API_END_POINT}/unsave-job/${job._id}`, { withCredentials: true });
                if (res.data.success) {
                    setIsSaved(false);
                    toast.success("Job unsaved successfully");
                    // Call onUnsave callback if provided (e.g., from SavedJobs page)
                    if (onUnsave) {
                        onUnsave(job._id);
                    }
                }
            } else {
                // Save job
                const res = await axios.post(`${USER_API_END_POINT}/save-job/${job._id}`, {}, { withCredentials: true });
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

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    // Get match color based on percentage
    const getMatchColor = (percentage) => {
        if (percentage >= 70) return 'bg-green-100 text-green-700 border-green-300';
        if (percentage >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        return 'bg-orange-100 text-orange-700 border-orange-300';
    };

    return (
        <div className='p-4 md:p-5 rounded-lg shadow-lg bg-white border-2 border-blue-50 hover:border-blue-200 transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center justify-between'>
                <p className='text-xs md:text-sm text-blue-600 font-medium'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <div className='flex items-center gap-2'>
                    {user && user.role === 'applicant' && !matchData.loading && matchData.matchPercentage > 0 && (
                        <Badge className={`${getMatchColor(matchData.matchPercentage)} font-semibold text-xs border`}>
                            {matchData.matchPercentage}% Match
                        </Badge>
                    )}
                    {user && user.role === 'applicant' && (
                        <Button 
                            variant="outline" 
                            className="rounded-full border-blue-200 hover:border-blue-300 hover:bg-blue-50" 
                            size="icon"
                            onClick={handleSaveJob}
                            disabled={isSaving}
                        >
                            {isSaved ? <BookmarkCheck className="h-4 w-4 text-blue-600 fill-blue-600" /> : <Bookmark className="h-4 w-4 text-blue-600" />}
                        </Button>
                    )}
                </div>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-4 md:p-6" variant="outline" size="icon">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold text-sm md:text-base">
                            {job?.company?.name?.charAt(0)?.toUpperCase() || 'C'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-base md:text-lg'>{job?.company?.name}</h1>
                    <p className='text-xs md:text-sm text-gray-500'>{job?.location || 'Pakistan'}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-base md:text-lg my-2'>{job?.title}</h1>
                <p className='text-xs md:text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                {job?.category && (
                    <Badge className={'bg-green-100 text-green-700 border-green-200 font-semibold text-xs'} variant="outline">{job.category.name}</Badge>
                )}
                <Badge className={'bg-blue-100 text-blue-700 border-blue-200 font-semibold text-xs'} variant="outline">{job?.position} Positions</Badge>
                <Badge className={'bg-orange-100 text-orange-700 border-orange-200 font-semibold text-xs'} variant="outline">{job?.jobType}</Badge>
                <Badge className={'bg-indigo-100 text-indigo-700 border-indigo-200 font-semibold text-xs'} variant="outline">{job?.salary}LPA</Badge>
            </div>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline" className="w-full sm:w-auto border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700">Details</Button>
                {user && user.role === 'applicant' && (
                    <Button 
                        onClick={handleSaveJob}
                        disabled={isSaving}
                        className={`w-full sm:w-auto shadow-md ${
                            isSaved 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {isSaving ? "Processing..." : isSaved ? "Saved" : "Save For Later"}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Job