import { useState, useEffect } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';

const useGetJobMatch = (jobId) => {
    const { user } = useSelector(store => store.auth);
    const [matchData, setMatchData] = useState({
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchMatch = async () => {
            if (!user || user.role !== 'applicant' || !jobId) {
                setMatchData(prev => ({ ...prev, loading: false }));
                return;
            }
            
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/match/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    setMatchData({
                        matchPercentage: res.data.matchPercentage,
                        matchedSkills: res.data.matchedSkills || [],
                        missingSkills: res.data.missingSkills || [],
                        loading: false,
                        error: null
                    });
                } else {
                    setMatchData(prev => ({ ...prev, error: res.data.message, loading: false }));
                }
            } catch (error) {
                console.error("Error fetching job match:", error);
                setMatchData(prev => ({ 
                    ...prev, 
                    error: error.response?.data?.message || "Failed to fetch match data", 
                    loading: false 
                }));
            }
        };
        
        fetchMatch();
    }, [user, jobId]);

    return matchData;
};

export default useGetJobMatch;







