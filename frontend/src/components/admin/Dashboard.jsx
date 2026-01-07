import React from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '../ui/button'
import { Building2, Briefcase, FolderKanban, Users, Plus, ArrowRight } from 'lucide-react'
import AnalyticsChart from '../analytics/AnalyticsChart'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import useGetAllCategories from '@/hooks/useGetAllCategories'
import useGetAnalytics from '@/hooks/useGetAnalytics'

const Dashboard = () => {
    useGetAllAdminJobs();
    useGetAllCompanies();
    useGetAllCategories();
    const analytics = useGetAnalytics();
    
    const navigate = useNavigate();
    const { allAdminJobs } = useSelector(store => store.job);
    const { companies } = useSelector(store => store.company);
    const { categories } = useSelector(store => store.category);
    const { user } = useSelector(store => store.auth);
    
    // Calculate statistics
    const totalJobs = allAdminJobs.length;
    const totalCompanies = companies.length;
    const totalCategories = categories.length;
    
    // Calculate total applicants across all jobs
    const totalApplicants = allAdminJobs.reduce((sum, job) => {
        return sum + (job.applications?.length || 0);
    }, 0);

    const statsCards = [
        {
            title: "Total Jobs",
            value: totalJobs,
            icon: Briefcase,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            link: "/admin/jobs"
        },
        {
            title: "Companies",
            value: totalCompanies,
            icon: Building2,
            color: "text-green-600",
            bgColor: "bg-green-100",
            link: "/admin/companies"
        },
        {
            title: "Categories",
            value: totalCategories,
            icon: FolderKanban,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            link: "/admin/categories"
        },
        {
            title: "Total Applicants",
            value: totalApplicants,
            icon: Users,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            link: "/admin/jobs"
        }
    ];

    const quickActions = [
        {
            title: "Post New Job",
            description: "Create a new job posting",
            icon: Plus,
            onClick: () => navigate("/admin/jobs/create"),
            color: "bg-blue-600 hover:bg-blue-700"
        },
        {
            title: "Create Company",
            description: "Register a new company",
            icon: Building2,
            onClick: () => navigate("/admin/companies/create"),
            color: "bg-green-600 hover:bg-green-700"
        },
        {
            title: "Manage Categories",
            description: "Add or edit job categories",
            icon: FolderKanban,
            onClick: () => navigate("/admin/categories"),
            color: "bg-purple-600 hover:bg-purple-700"
        }
    ];

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6 md:my-10 px-4'>
                <div className='mb-6 md:mb-8'>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>Dashboard</h1>
                    <p className='text-sm md:text-base text-gray-600'>Welcome back! Here's an overview of your account.</p>
                </div>

                {/* Statistics Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={index} 
                                className='bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow'
                                onClick={() => navigate(stat.link)}
                            >
                                <div className='flex flex-row items-center justify-between mb-4'>
                                    <h3 className='text-sm font-medium text-gray-600'>
                                        {stat.title}
                                    </h3>
                                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className='text-2xl md:text-3xl font-bold mb-2'>{stat.value}</div>
                                <div className='flex items-center text-xs text-gray-500'>
                                    <span>View details</span>
                                    <ArrowRight className='h-3 w-3 ml-1' />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Analytics Charts */}
                {!analytics.loading && (
                    <div className='mb-8'>
                        <h2 className='text-xl md:text-2xl font-bold mb-4'>Platform Analytics</h2>
                        <AnalyticsChart
                            jobsApplied={analytics.jobsApplied}
                            activeApplicants={analytics.activeApplicants}
                            activeRecruiters={analytics.activeRecruiters}
                            userRole={user?.role}
                        />
                    </div>
                )}

                {/* Quick Actions */}
                <div className='mb-6 md:mb-8'>
                    <h2 className='text-xl md:text-2xl font-bold mb-4'>Quick Actions</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <div 
                                    key={index} 
                                    className='bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow'
                                    onClick={action.onClick}
                                >
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className={`${action.color} p-2 rounded-lg text-white`}>
                                            <Icon className='h-5 w-5' />
                                        </div>
                                        <h3 className='text-lg font-bold'>{action.title}</h3>
                                    </div>
                                    <p className='text-sm text-gray-600'>{action.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
                        <h3 className='text-lg font-bold mb-2'>Manage Jobs</h3>
                        <p className='text-sm text-gray-600 mb-4'>View and manage all your job postings</p>
                        <Button 
                            variant="outline" 
                            className='w-full'
                            onClick={() => navigate("/admin/jobs")}
                        >
                            Go to Jobs <ArrowRight className='ml-2 h-4 w-4' />
                        </Button>
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
                        <h3 className='text-lg font-bold mb-2'>Manage Companies</h3>
                        <p className='text-sm text-gray-600 mb-4'>View and manage your companies</p>
                        <Button 
                            variant="outline" 
                            className='w-full'
                            onClick={() => navigate("/admin/companies")}
                        >
                            Go to Companies <ArrowRight className='ml-2 h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

