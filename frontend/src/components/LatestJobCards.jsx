import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-lg shadow-lg bg-white border-2 border-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center gap-2 mb-2'>
                <Avatar className="w-12 h-12">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
                        {job?.company?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location || 'Pakistan'}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                {job?.category && (
                    <Badge className={'bg-green-100 text-green-700 border-green-200 font-semibold'} variant="outline">{job.category.name}</Badge>
                )}
                <Badge className={'bg-blue-100 text-blue-700 border-blue-200 font-semibold'} variant="outline">{job?.position} Positions</Badge>
                <Badge className={'bg-orange-100 text-orange-700 border-orange-200 font-semibold'} variant="outline">{job?.jobType}</Badge>
                <Badge className={'bg-indigo-100 text-indigo-700 border-indigo-200 font-semibold'} variant="outline">{job?.salary}LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards