import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories } from '@/redux/categorySlice'
import { CATEGORY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const useGetCategoriesWithJobs = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(store => store.category);
    
    useEffect(() => {
        // Fetch categories that have jobs
        const fetchCategoriesWithJobs = async () => {
            try {
                const res = await axios.get(`${CATEGORY_API_END_POINT}/get-with-jobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCategories(res.data.categories || []));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCategoriesWithJobs();
    }, [dispatch]);
}

export default useGetCategoriesWithJobs


