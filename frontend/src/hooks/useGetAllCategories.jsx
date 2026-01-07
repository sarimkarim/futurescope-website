import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCategories } from '@/redux/categorySlice'
import { CATEGORY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const useGetAllCategories = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        // Always fetch all categories to ensure we have the complete list
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${CATEGORY_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCategories(res.data.categories || []));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCategories();
    }, [dispatch]);
}

export default useGetAllCategories







