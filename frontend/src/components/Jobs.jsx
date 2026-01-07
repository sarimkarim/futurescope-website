import React, { useEffect, useState, useMemo } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    useGetAllJobs(); // Fetch jobs when component mounts
    const { allJobs, searchedQuery, filters, isLoadingJobs } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    // Memoize filters to prevent infinite loops
    const safeFilters = useMemo(() => {
        return filters || {
            location: "",
            category: "",
            salary: ""
        };
    }, [filters]);

    // Extract filter values for dependency array
    const filterLocation = safeFilters.location || "";
    const filterCategory = safeFilters.category || "";
    const filterSalary = safeFilters.salary || "";

    useEffect(() => {
        let filteredJobs = [...allJobs];
        
        // Apply text search filter (search in title, description, location, category name, company name)
        if (searchedQuery && searchedQuery.trim()) {
            const queryLower = searchedQuery.toLowerCase().trim();
            filteredJobs = filteredJobs.filter((job) => {
                const titleMatch = job.title?.toLowerCase().includes(queryLower);
                const descriptionMatch = job.description?.toLowerCase().includes(queryLower);
                const locationMatch = job.location?.toLowerCase().includes(queryLower);
                const categoryMatch = job.category?.name?.toLowerCase().includes(queryLower);
                const companyMatch = job.company?.name?.toLowerCase().includes(queryLower);
                
                return titleMatch || descriptionMatch || locationMatch || categoryMatch || companyMatch;
            });
        }
        
        // Apply location filter
        if (filterLocation && filterLocation.trim()) {
            filteredJobs = filteredJobs.filter((job) => {
                if (!job.location) return false;
                return job.location.toLowerCase().trim().includes(filterLocation.toLowerCase().trim());
            });
        }
        
        // Apply category filter
        if (filterCategory && filterCategory.trim()) {
            filteredJobs = filteredJobs.filter((job) => {
                if (!job.category || !job.category.name) return false;
                return job.category.name.toLowerCase().trim() === filterCategory.toLowerCase().trim();
            });
        }
        
        // Apply salary filter
        if (filterSalary && filterSalary.trim()) {
            filteredJobs = filteredJobs.filter((job) => {
                // Convert salary to number if it's a string
                const jobSalary = typeof job.salary === 'string' ? parseFloat(job.salary) : Number(job.salary);
                
                // Handle NaN or invalid salary values
                if (isNaN(jobSalary) || jobSalary === null || jobSalary === undefined) {
                    return false;
                }
                
                if (filterSalary === "0-40k") {
                    return jobSalary >= 0 && jobSalary <= 40000;
                } else if (filterSalary === "42-1lakh") {
                    return jobSalary >= 42000 && jobSalary <= 100000;
                } else if (filterSalary === "1lakh to 5lakh") {
                    return jobSalary >= 100000 && jobSalary <= 500000;
                }
                return false;
            });
        }
        
        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery, filterLocation, filterCategory, filterSalary]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <div className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full lg:w-1/5'>
                        <FilterCard />
                    </div>
                    {
                        isLoadingJobs ? (
                            <div className="flex-1 text-center py-10">
                                <span className="text-gray-500">Loading jobs...</span>
                            </div>
                        ) : filterJobs.length <= 0 ? (
                            <div className="flex-1 text-center py-10">
                                <span className="text-gray-500">Job not found</span>
                            </div>
                        ) : (
                            <div className='flex-1 pb-5'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs