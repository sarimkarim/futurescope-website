import { useEffect, useState } from "react";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const useGetAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        jobsApplied: 0,
        activeApplicants: 0,
        activeRecruiters: 0,
        loading: true
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/analytics`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAnalytics({
                        jobsApplied: res.data.jobsApplied || 0,
                        activeApplicants: res.data.activeApplicants || 0,
                        activeRecruiters: res.data.activeRecruiters || 0,
                        loading: false
                    });
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setAnalytics(prev => ({ ...prev, loading: false }));
            }
        };
        fetchAnalytics();
    }, []);

    return analytics;
};

export default useGetAnalytics;

