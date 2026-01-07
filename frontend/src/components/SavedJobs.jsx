import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { BookmarkCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const SavedJobs = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in or not an applicant
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.role !== 'applicant') {
            navigate("/");
            return;
        }

        const fetchSavedJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, { withCredentials: true });
                if (res.data.success) {
                    setSavedJobs(res.data.savedJobs || []);
                }
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [user, navigate]);

    // Function to remove job from saved list when unsaved
    const handleJobUnsave = (jobId) => {
        setSavedJobs(prevJobs => prevJobs.filter(job => {
            const id = typeof job === 'object' ? job._id : job;
            return id !== jobId;
        }));
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <BookmarkCheck className='h-8 w-8 text-blue-600' />
                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800'>
                            <span className='text-blue-600'>Saved</span> Jobs
                        </h1>
                    </div>
                    <p className='text-gray-600 text-sm md:text-base'>
                        {savedJobs.length === 0 
                            ? "You haven't saved any jobs yet. Start saving jobs to view them here!"
                            : `You have ${savedJobs.length} saved job${savedJobs.length === 1 ? '' : 's'}`
                        }
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <span className="text-gray-500">Loading saved jobs...</span>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <BookmarkCheck className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Saved Jobs</h2>
                        <p className="text-gray-500 mb-6">Start exploring jobs and save the ones you're interested in!</p>
                        <button
                            onClick={() => navigate("/browse")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                        {savedJobs.map((job) => {
                            const jobId = typeof job === 'object' ? job._id : job;
                            return (
                                <motion.div
                                    key={jobId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Job job={job} onUnsave={handleJobUnsave} />
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedJobs







