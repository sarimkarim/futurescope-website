import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import useGetAllCategories from '@/hooks/useGetAllCategories'

const EditJob = () => {
    useGetAllCategories(); // Fetch categories
    const { id } = useParams();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        categoryId: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const { categories } = useSelector(store => store.category);
    
    // Fetch job data on component mount
    useEffect(() => {
        const fetchJob = async () => {
            try {
                setFetching(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
                    withCredentials: true
                });
                
                if (res.data.success && res.data.job) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: job.requirements || "",
                        salary: job.salary || "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experience || "",
                        position: job.position || 0,
                        companyId: job.companyId || job.company?._id || "",
                        categoryId: job.categoryId || job.category?._id || ""
                    });
                } else {
                    toast.error("Failed to load job details");
                    navigate("/admin/jobs");
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                toast.error(error.response?.data?.message || "Failed to load job details");
                navigate("/admin/jobs");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id, navigate]);
    
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput({...input, companyId: selectedCompany._id});
        }
    };

    const categorySelectHandler = (value) => {
        const selectedCategory = categories.find((category)=> category.name.toLowerCase() === value);
        if (selectedCategory && selectedCategory._id) {
            setInput({...input, categoryId: selectedCategory._id});
        } else {
            toast.error("Category not found. Please try again.");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!input.categoryId) {
            toast.error("Please select a category");
            return;
        }
        if (!input.companyId) {
            toast.error("Please select a company");
            return;
        }
        if (!input.experience || input.experience === "" || isNaN(Number(input.experience))) {
            toast.error("Please enter a valid experience level");
            return;
        }
        if (!input.salary || input.salary === "" || isNaN(Number(input.salary))) {
            toast.error("Please enter a valid salary");
            return;
        }
        if (!input.position || input.position === "" || isNaN(Number(input.position)) || Number(input.position) < 1) {
            toast.error("Please enter a valid number of positions (at least 1)");
            return;
        }
        
        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Error updating job:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update job. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div>
                <Navbar />
                <div className='flex items-center justify-center h-screen'>
                    <Loader2 className='h-8 w-8 animate-spin' />
                </div>
            </div>
        );
    }

    // Get selected company and category names for display
    const selectedCompany = companies.find(c => c._id === input.companyId);
    const selectedCategory = categories.find(c => c._id === input.categoryId);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5 px-4'>
                <form onSubmit={submitHandler} className='p-4 md:p-8 max-w-4xl w-full border border-gray-200 shadow-lg rounded-md'>
                    <h2 className='text-xl md:text-2xl font-bold mb-6'>Edit Job</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary (in LPA)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                min="0"
                                step="1000"
                                placeholder="e.g., 50000"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level (Years)</Label>
                            <Input
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                min="0"
                                step="0.5"
                                placeholder="e.g., 2"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length > 0 && (
                                <div>
                                    <Label>Company</Label>
                                    <Select 
                                        onValueChange={selectChangeHandler}
                                        value={selectedCompany?.name?.toLowerCase() || ""}
                                    >
                                        <SelectTrigger className="w-full my-1">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company, index) => {
                                                        return (
                                                            <SelectItem key={index} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                        {
                            categories.length > 0 && (
                                <div>
                                    <Label>Category</Label>
                                    <Select 
                                        onValueChange={categorySelectHandler}
                                        value={selectedCategory?.name?.toLowerCase() || ""}
                                    >
                                        <SelectTrigger className="w-full my-1">
                                            <SelectValue placeholder="Select a Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    categories.map((category, index) => {
                                                        return (
                                                            <SelectItem key={index} value={category?.name?.toLowerCase()}>{category.name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div> 
                    {
                        loading ? (
                            <Button className="w-full my-4" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Update Job</Button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default EditJob


