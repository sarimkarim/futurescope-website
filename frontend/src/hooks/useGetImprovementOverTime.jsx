import { useState, useEffect } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const useGetImprovementOverTime = () => {
    const [trendData, setTrendData] = useState([]);
    const [improvement, setImprovement] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [currentAverage, setCurrentAverage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImprovement = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/performance/improvement`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setTrendData(res.data.trendData || []);
                    setImprovement(res.data.improvement || 0);
                    setTotalAttempts(res.data.totalAttempts || 0);
                    setCurrentAverage(res.data.currentAverage || 0);
                }
            } catch (error) {
                console.error("Error fetching improvement data:", error);
                setError(error.response?.data?.message || "Failed to fetch improvement data");
            } finally {
                setLoading(false);
            }
        };

        fetchImprovement();
    }, []);

    return { trendData, improvement, totalAttempts, currentAverage, loading, error };
};

export default useGetImprovementOverTime;

