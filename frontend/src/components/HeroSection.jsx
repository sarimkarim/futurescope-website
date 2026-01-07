import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, FileText } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const searchJobHandler = () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            toast.error("Please enter a search term");
            return;
        }
        dispatch(setSearchedQuery(trimmedQuery));
        navigate("/browse");
    }

    return (
        <div className='relative text-center px-4 py-12 md:py-20 overflow-hidden'>
            {/* Blue gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 -z-10'></div>
            {/* Decorative circles */}
            <div className='absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob -z-10'></div>
            <div className='absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 -z-10'></div>
            <div className='absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 -z-10'></div>
            
            <div className='relative flex flex-col gap-4 md:gap-5 my-6 md:my-10'>
                <span className='mx-auto px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm md:text-base border border-blue-200 shadow-sm'>No. 1 Job Hunt Website</span>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold px-4 text-gray-800'>Search, Apply & <br className="hidden sm:block" /> Get Your <span className='text-blue-600'>Dream Jobs</span></h1>
                <p className='text-sm md:text-base px-4 text-gray-600'>Your Dream Job Awaits – Find It with FutureScope!</p>
                <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] shadow-xl border-2 border-blue-200 bg-white pl-3 rounded-full items-center gap-2 md:gap-4 mx-auto focus-within:border-blue-500 transition-colors'>
                    <input
                        type="text"
                        placeholder='Search by job title, category, or company name...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                searchJobHandler();
                            }
                        }}
                        className='outline-none border-none w-full text-sm md:text-base bg-transparent'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-blue-600 hover:bg-blue-700 shrink-0 shadow-md">
                        <Search className='h-4 w-4 md:h-5 md:w-5' />
                    </Button>
                </div>
                {user && (
                    <div className='mt-4 md:mt-6'>
                        <Button 
                            onClick={() => navigate('/resume-builder')} 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto"
                        >
                            <FileText className='h-4 w-4 md:h-5 md:w-5' />
                            <span className='text-sm md:text-base font-semibold'>AI Resume Builder</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroSection