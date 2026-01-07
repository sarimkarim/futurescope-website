import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2, Loader2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAdminJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const dispatch = useDispatch();

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const [deleteLoading, setDeleteLoading] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{ 
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
            return;
        }

        try {
            setDeleteLoading({ [jobId]: true });
            const res = await axios.delete(
                `${JOB_API_END_POINT}/delete/${jobId}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                // Remove deleted job from the list
                const updatedJobs = allAdminJobs.filter(job => job._id !== jobId);
                dispatch(setAllAdminJobs(updatedJobs));
                
                // Refetch jobs to ensure consistency
                try {
                    const refreshRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                    if (refreshRes.data.success) {
                        dispatch(setAllAdminJobs(refreshRes.data.jobs));
                    }
                } catch (refreshError) {
                    console.error("Error refreshing jobs:", refreshError);
                    // Don't show error to user as deletion was successful
                }
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error(error.response?.data?.message || "Failed to delete job");
        } finally {
            setDeleteLoading({ [jobId]: false });
        }
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[120px]">Company Name</TableHead>
                        <TableHead className="min-w-[150px]">Role</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="text-right min-w-[80px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell className="font-medium">{job?.company?.name}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell className="text-sm">{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-40">
                                            <div onClick={()=> navigate(`/admin/jobs/edit/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer hover:text-blue-600'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2 hover:text-blue-600'>
                                                <Eye className='w-4'/>
                                                <span>Applicants</span>
                                            </div>
                                            <div 
                                                onClick={()=> handleDelete(job._id)} 
                                                className='flex items-center w-fit gap-2 cursor-pointer mt-2 hover:text-red-600'
                                            >
                                                {deleteLoading[job._id] ? (
                                                    <Loader2 className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <Trash2 className='w-4'/>
                                                )}
                                                <span>Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable