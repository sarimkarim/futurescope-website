import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(()=>{
        // Only fetch if user is logged in
        if (!user) {
            dispatch(setAllAppliedJobs([]));
            return;
        }

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                console.log("Applied Jobs Response:", res.data);
                if(res.data.success){
                    // Ensure we're setting an array, even if empty
                    const applications = Array.isArray(res.data.application) ? res.data.application : [];
                    console.log("Setting applied jobs:", applications);
                    dispatch(setAllAppliedJobs(applications));
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                dispatch(setAllAppliedJobs([]));
            }
        }
        fetchAppliedJobs();
    },[user, dispatch])
};
export default useGetAppliedJobs;