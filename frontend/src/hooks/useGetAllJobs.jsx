import { setAllJobs, setIsLoadingJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);
    
    useEffect(()=>{
        isMountedRef.current = true;
        
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        const currentController = abortControllerRef.current;
        
        const fetchAllJobs = async () => {
            // Set loading state immediately when starting fetch
            dispatch(setIsLoadingJobs(true));
            
            try {
                // Properly encode the keyword for URL (empty string if no query)
                const keyword = searchedQuery && searchedQuery.trim() 
                    ? encodeURIComponent(searchedQuery.trim()) 
                    : "";
                const url = `${JOB_API_END_POINT}/get?keyword=${keyword}`;
                console.log("🔍 Fetching jobs with keyword:", searchedQuery || "(all jobs)", "URL:", url);
                
                const res = await axios.get(url, {
                    withCredentials: true,
                    signal: currentController.signal
                });
                
                if(res.data.success && isMountedRef.current && !currentController.signal.aborted){
                    console.log(`✅ Received ${res.data.jobs?.length || 0} jobs from backend for query: "${searchedQuery || 'all'}"`);
                    console.log("📦 Setting allJobs in Redux with", res.data.jobs?.length || 0, "jobs");
                    dispatch(setAllJobs(res.data.jobs || []));
                }
            } catch (error) {
                // Don't log error if request was aborted
                if (error.name !== 'CanceledError' && error.name !== 'AbortError' && !axios.isCancel(error)) {
                    console.error("❌ Error fetching jobs:", error);
                    // Set empty array on error to prevent UI issues
                    if (isMountedRef.current && !currentController.signal.aborted) {
                        dispatch(setAllJobs([]));
                    }
                }
            } finally {
                // Clear loading state when fetch completes (success or error)
                if (isMountedRef.current && !currentController.signal.aborted) {
                    dispatch(setIsLoadingJobs(false));
                }
            }
        }
        
        fetchAllJobs();
        
        // Cleanup function
        return () => {
            isMountedRef.current = false;
            if (currentController) {
                currentController.abort();
            }
        };
    },[searchedQuery, dispatch]) // Refetch when searchedQuery changes
}

export default useGetAllJobs