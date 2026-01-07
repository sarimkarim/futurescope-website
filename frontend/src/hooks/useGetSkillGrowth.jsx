import { useState, useEffect } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const useGetSkillGrowth = () => {
    const [skillGrowth, setSkillGrowth] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkillGrowth = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/performance/skills`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSkillGrowth(res.data.skillGrowth || []);
                }
            } catch (error) {
                console.error("Error fetching skill growth:", error);
                setError(error.response?.data?.message || "Failed to fetch skill growth");
            } finally {
                setLoading(false);
            }
        };

        fetchSkillGrowth();
    }, []);

    return { skillGrowth, loading, error };
};

export default useGetSkillGrowth;

