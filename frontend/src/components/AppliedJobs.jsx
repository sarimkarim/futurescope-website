import React from 'react'
import Navbar from './shared/Navbar'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Briefcase } from 'lucide-react'

const AppliedJobs = () => {
    useGetAppliedJobs();

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <Briefcase className='h-8 w-8 text-blue-600' />
                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800'>
                            <span className='text-blue-600'>Applied</span> Jobs
                        </h1>
                    </div>
                    <p className='text-gray-600 text-sm md:text-base'>
                        Track the status of all your job applications
                    </p>
                </div>

                <div className='bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6'>
                    <AppliedJobTable />
                </div>
            </div>
        </div>
    )
}

export default AppliedJobs


