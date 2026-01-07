import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import Job from './Job'
import { Badge } from './ui/badge'
import { Sparkles } from 'lucide-react'

const RecommendedJobs = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/recommended?limit=6`, { withCredentials: true });
                if (res.data.success) {
                    setRecommendedJobs(res.data.jobs || []);
                }
            } catch (error) {
                console.error("Error fetching recommended jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, []);

    if (loading) {
        return (
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='text-center py-10'>
                    <span className="text-gray-500">Loading recommended jobs...</span>
                </div>
            </div>
        );
    }

    if (recommendedJobs.length === 0) {
        return null; // Don't show section if no recommended jobs
    }

    return (
        <div className='max-w-7xl mx-auto my-10 md:my-20 px-4'>
            <div className='flex items-center gap-3 mb-6'>
                <Sparkles className='h-6 w-6 md:h-8 md:w-8 text-blue-600' />
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800'>
                    <span className='text-blue-600'>Recommended</span> Jobs For You
                </h1>
            </div>
            <p className='text-sm md:text-base text-gray-600 mb-6'>
                These jobs match your skills and profile. Jobs are ranked by skill match percentage.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                {recommendedJobs.map((job) => (
                    <Job key={job._id} job={job} />
                ))}
            </div>
            {recommendedJobs.length >= 6 && (
                <div className='text-center mt-8'>
                    <button
                        onClick={() => navigate("/jobs")}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium'
                    >
                        View All Jobs
                    </button>
                </div>
            )}
        </div>
    )
}

export default RecommendedJobs







