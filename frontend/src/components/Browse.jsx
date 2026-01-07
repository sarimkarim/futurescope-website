import React, { useEffect, useMemo, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { toast } from 'sonner';

const Browse = () => {
    const {allJobs, searchedQuery, isLoadingJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    const [query, setQuery] = useState(searchedQuery || "");
    
    // Always call hook (it handles empty query internally)
    useGetAllJobs();
    
    // Update query when searchedQuery changes
    useEffect(() => {
        setQuery(searchedQuery || "");
    }, [searchedQuery]);
    
    const searchJobHandler = () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            toast.error("Please enter a search term");
            return;
        }
        dispatch(setSearchedQuery(trimmedQuery));
        // Stay on browse page, just update the search
    }
    
    // Log whenever allJobs changes
    useEffect(() => {
        console.log("Browse: allJobs changed to", allJobs.length, "jobs. Search query:", searchedQuery);
        if (searchedQuery && allJobs.length > 0) {
            console.log("First job details:", {
                title: allJobs[0]?.title,
                category: allJobs[0]?.category?.name,
                company: allJobs[0]?.company?.name
            });
        }
    }, [allJobs, searchedQuery]);
    
    // Memoize to prevent unnecessary re-renders
    const displayJobs = useMemo(() => {
        return allJobs;
    }, [allJobs]);
    
    // If no search query, show message
    if (!searchedQuery || !searchedQuery.trim()) {
        return (
            <div>
                <Navbar />
                <div className='max-w-7xl mx-auto my-10 px-4'>
                    {/* Search Bar */}
                    <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] shadow-lg border-2 border-blue-200 bg-white pl-3 rounded-full items-center gap-2 md:gap-4 mx-auto mb-8 focus-within:border-blue-500 transition-colors'>
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
                    <div className='text-center py-10 md:py-20'>
                        <h1 className='text-xl md:text-2xl font-bold mb-4'>Discover Your Next Opportunity</h1>
                        <p className='text-sm md:text-base text-gray-500'>Use the search bar above to find jobs that match your interests and skills</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* Search Bar */}
                <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] shadow-lg border-2 border-blue-200 bg-white pl-3 rounded-full items-center gap-2 md:gap-4 mx-auto mb-8 focus-within:border-blue-500 transition-colors'>
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
                <h1 className='font-bold text-lg md:text-xl my-6 md:my-10'>
                    Search Results for "{searchedQuery}" ({displayJobs.length})
                </h1>
                {isLoadingJobs ? (
                    <div className='text-center py-10'>
                        <p className='text-gray-500'>Loading search results...</p>
                    </div>
                ) : displayJobs.length === 0 ? (
                    <div className='text-center py-10'>
                        <p className='text-gray-500'>No jobs found for "{searchedQuery}". Try a different search term.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                        {
                            displayJobs.map((job) => {
                                return (
                                    <Job key={job._id} job={job}/>
                                )
                            })
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse