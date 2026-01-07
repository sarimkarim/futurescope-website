import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X, BookmarkCheck, Briefcase } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='sticky top-0 z-50 bg-white border-b-2 border-blue-100 shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                        <img 
                            src="/futurescope_logo.png" 
                            alt="FutureScope Logo" 
                            className="h-20 md:h-36 w-auto cursor-pointer"
                        />
                    </Link>
                </div>
                
                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-8 lg:gap-12'>
                    <ul className='flex font-medium items-center gap-4 lg:gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link></li>
                                    <li><Link to="/admin/companies" className="hover:text-blue-600 transition-colors font-medium">Companies</Link></li>
                                    <li><Link to="/admin/jobs" className="hover:text-blue-600 transition-colors font-medium">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link></li>
                                    <li><Link to="/jobs" className="hover:text-blue-600 transition-colors font-medium">Jobs</Link></li>
                                    <li><Link to="/browse" className="hover:text-blue-600 transition-colors font-medium">Browse</Link></li>
                                    <li><Link to="/saved-jobs" className="hover:text-blue-600 transition-colors font-medium">Saved Jobs</Link></li>
                                    <li><Link to="/applied-jobs" className="hover:text-blue-600 transition-colors font-medium">Applied Jobs</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline" size="sm" className="border-blue-200 hover:border-blue-300 hover:bg-blue-50">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer h-8 w-8">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'applicant' && (
                                                    <>
                                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                            <User2 />
                                                            <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                        </div>
                                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                            <BookmarkCheck />
                                                            <Button variant="link"> <Link to="/saved-jobs">Saved Jobs</Link></Button>
                                                        </div>
                                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                            <Briefcase />
                                                            <Button variant="link"> <Link to="/applied-jobs">Applied Jobs</Link></Button>
                                                        </div>
                                                    </>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className='md:hidden p-2 rounded-md hover:bg-gray-100'
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className='md:hidden border-t border-gray-200 bg-white'>
                    <div className='px-4 py-4 space-y-4'>
                        <ul className='flex flex-col font-medium gap-4'>
                            {
                                user && user.role === 'recruiter' ? (
                                    <>
                                        <li><Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Dashboard</Link></li>
                                        <li><Link to="/admin/companies" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Companies</Link></li>
                                        <li><Link to="/admin/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Jobs</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Home</Link></li>
                                        <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Jobs</Link></li>
                                        <li><Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Browse</Link></li>
                                        <li><Link to="/saved-jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Saved Jobs</Link></li>
                                        <li><Link to="/applied-jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-blue-600 transition-colors font-medium">Applied Jobs</Link></li>
                                    </>
                                )
                            }
                        </ul>
                        {
                            !user ? (
                                <div className='flex flex-col gap-2 pt-4 border-t border-gray-200'>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full border-blue-200 hover:border-blue-300 hover:bg-blue-50">Login</Button></Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}><Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">Signup</Button></Link>
                                </div>
                            ) : (
                                <div className='pt-4 border-t border-gray-200'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                            <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        {
                                            user && user.role === 'applicant' && (
                                                <>
                                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                                                        <Button variant="outline" className="w-full justify-start">
                                                            <User2 className="mr-2 h-4 w-4" />
                                                            View Profile
                                                        </Button>
                                                    </Link>
                                                    <Link to="/saved-jobs" onClick={() => setMobileMenuOpen(false)}>
                                                        <Button variant="outline" className="w-full justify-start">
                                                            <BookmarkCheck className="mr-2 h-4 w-4" />
                                                            Saved Jobs
                                                        </Button>
                                                    </Link>
                                                    <Link to="/applied-jobs" onClick={() => setMobileMenuOpen(false)}>
                                                        <Button variant="outline" className="w-full justify-start">
                                                            <Briefcase className="mr-2 h-4 w-4" />
                                                            Applied Jobs
                                                        </Button>
                                                    </Link>
                                                </>
                                            )
                                        }
                                        <Button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} variant="outline" className="w-full justify-start">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar