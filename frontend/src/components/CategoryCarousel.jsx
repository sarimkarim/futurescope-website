import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { CATEGORY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        // Fetch categories that have jobs
        const fetchCategoriesWithJobs = async () => {
            try {
                const res = await axios.get(`${CATEGORY_API_END_POINT}/get-with-jobs`, { withCredentials: true });
                if (res.data.success) {
                    setCategories(res.data.categories || []);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCategoriesWithJobs();
    }, []);
    
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="px-4">
            <Carousel className="w-full max-w-xl mx-auto my-10 md:my-20">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {
                        categories.map((cat, index) => (
                            <CarouselItem key={cat._id || index} className="pl-2 md:pl-4 basis-auto shrink-0">
                                <Button onClick={()=>searchJobHandler(cat.name)} variant="outline" className="rounded-full text-sm md:text-base whitespace-nowrap border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 font-medium shadow-sm">{cat.name}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel