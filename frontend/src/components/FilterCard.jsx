import React, { useMemo, useCallback, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '@/redux/jobSlice'
import useGetAllCategories from '@/hooks/useGetAllCategories'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'

const FilterCard = () => {
    useGetAllCategories(); // Fetch categories
    const { filters, allJobs } = useSelector(store => store.job);
    const { categories } = useSelector(store => store.category);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false); // Collapsed by default on mobile
    
    // Ensure filters object exists with default values - memoized to prevent re-renders
    const safeFilters = useMemo(() => {
        return filters || {
            location: "",
            category: "",
            salary: ""
        };
    }, [filters]);
    
    // Memoize change handler to prevent re-renders
    const changeHandler = useCallback((filterKey, value) => {
        // If "all" is selected, clear that specific filter
        if (value === "all" || value === "") {
            dispatch(setFilters({ [filterKey]: "" }));
        } else {
            dispatch(setFilters({ [filterKey]: value }));
        }
    }, [dispatch]);
    
    // Clear all filters handler
    const handleClearFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);
    
    // Extract unique locations from all jobs dynamically
    const locationArray = useMemo(() => {
        if (!allJobs || allJobs.length === 0) return [];
        
        // Get all unique locations from jobs
        const locations = allJobs
            .map(job => job.location)
            .filter(location => location && location.trim() !== "") // Filter out empty/null locations
            .filter((location, index, self) => self.indexOf(location) === index) // Get unique values
            .sort(); // Sort alphabetically
        
        return locations;
    }, [allJobs]);
    
    // Build filter data dynamically
    const filterData = useMemo(() => {
        const categoryArray = (categories && Array.isArray(categories) ? categories : []).map(cat => cat.name);
        const salaryArray = ["0-40k", "42-1lakh", "1lakh to 5lakh"];
        
        return [
            {
                filterType: "Location",
                filterKey: "location",
                array: locationArray
            },
            {
                filterType: "Category",
                filterKey: "category",
                array: categoryArray
            },
            {
                filterType: "Salary",
                filterKey: "salary",
                array: salaryArray
            },
        ];
    }, [categories, locationArray]);
    
    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return safeFilters.location || safeFilters.category || safeFilters.salary;
    }, [safeFilters]);

    const toggleFilters = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return (
        <div className='w-full bg-white p-3 md:p-4 rounded-lg sticky top-4 border-2 border-blue-50 shadow-md'>
            {/* Header with toggle button - visible on mobile, always expanded on desktop */}
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                    <h1 className='font-bold text-base md:text-lg text-blue-700'>Filter Jobs</h1>
                    {/* Mobile toggle button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFilters}
                        className="lg:hidden p-1 h-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        aria-label="Toggle filters"
                    >
                        {isOpen ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
                    </Button>
                </div>
                {hasActiveFilters && (
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                    >
                        Clear All
                    </Button>
                )}
            </div>
            
            {/* Filter content - hidden on mobile when collapsed, always visible on desktop */}
            <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
                <hr className='mt-3 mb-4 border-blue-100' />
                {
                    filterData.map((data, index) => {
                    const currentValue = safeFilters[data.filterKey] || "";
                    // Map empty string to "all" for RadioGroup display
                    const radioValue = currentValue || "all";
                    
                    const handleValueChange = (value) => {
                        // Handle the value change - "all" means clear filter
                        if (value === "all") {
                            changeHandler(data.filterKey, "");
                        } else {
                            changeHandler(data.filterKey, value);
                        }
                    };
                    
                    // Skip filter if no options available
                    if (data.array.length === 0) {
                        return null;
                    }
                    
                    return (
                        <div key={index} className={index > 0 ? 'mt-4' : ''}>
                            <h1 className='font-bold text-sm md:text-base mb-2 text-blue-700'>{data.filterType}</h1>
                            <RadioGroup 
                                value={radioValue} 
                                onValueChange={handleValueChange}
                            >
                                {/* Add "All" option */}
                                <div className='flex items-center space-x-2 my-2'>
                                    <RadioGroupItem value="all" id={`all-${index}`} />
                                    <Label htmlFor={`all-${index}`} className="text-sm cursor-pointer">All</Label>
                                </div>
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={idx} className='flex items-center space-x-2 my-2'>
                                                <RadioGroupItem value={item} id={itemId} />
                                                <Label htmlFor={itemId} className="text-sm cursor-pointer">{item}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </RadioGroup>
                        </div>
                    );
                })
                }
            </div>
        </div>
    )
}

export default FilterCard