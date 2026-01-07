import { useState, useEffect } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const useGetPerformanceHistory = () => {
    const [performanceHistory, setPerformanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerformanceHistory = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/performance/history`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setPerformanceHistory(res.data.performanceHistory || []);
                }
            } catch (error) {
                console.error("Error fetching performance history:", error);
                setError(error.response?.data?.message || "Failed to fetch performance history");
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceHistory();
    }, []);

    return { performanceHistory, loading, error };
};

export default useGetPerformanceHistory;

