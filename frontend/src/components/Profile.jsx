import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import UpdateProfileDialog from './UpdateProfileDialog'
import PerformanceHistory from './PerformanceHistory'
import { useSelector } from 'react-redux'
import { USER_API_END_POINT } from '@/utils/constant'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    // Helper function to open resume using backend proxy endpoint
    const handleResumeClick = (e) => {
        e.preventDefault();
        // Use backend proxy endpoint to serve PDF with proper headers
        const resumeUrl = `${USER_API_END_POINT}/profile/resume`;
        window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-4 md:p-8 mx-4 md:mx-auto'>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-4'>
                    <div className='flex items-center gap-3 md:gap-4'>
                        <Avatar className="h-16 w-16 md:h-24 md:w-24">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-lg md:text-xl'>{user?.fullname}</h1>
                            <p className='text-sm md:text-base'>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="self-start sm:self-auto" variant="outline"><Pen className="h-4 w-4" /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="text-sm md:text-base break-all">{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact className="h-4 w-4 shrink-0" />
                        <span className="text-sm md:text-base">{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className="text-base md:text-lg font-semibold mb-2">Skills</h1>
                    <div className='flex items-center gap-1 flex-wrap'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index} className="text-xs">{item}</Badge>) : <span className="text-gray-500">NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full items-center gap-1.5'>
                    <Label className="text-sm md:text-md font-bold">Resume</Label>
                    {
                        user?.profile?.resume ? (
                            <a 
                                onClick={handleResumeClick}
                                className='text-blue-500 w-full hover:underline cursor-pointer text-sm md:text-base break-all'
                            >
                                {user?.profile?.resumeOriginalName || 'View Resume'}
                            </a>
                        ) : (
                            <span className="text-gray-500">NA</span>
                        )
                    }
                </div>
            </div>
            {/* Performance History Section */}
            <div className='my-8 w-full'>
                <PerformanceHistory />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile