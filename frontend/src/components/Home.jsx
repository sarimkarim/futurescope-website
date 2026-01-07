import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import RecommendedJobs from './RecommendedJobs'
import Footer from './shared/Footer'
import AnalyticsChart from './analytics/AnalyticsChart'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import useGetAnalytics from '@/hooks/useGetAnalytics'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const analytics = useGetAnalytics();
  
  // Clear search query when on home page so it shows all jobs
  useEffect(() => {
    dispatch(setSearchedQuery(""));
  }, [dispatch]);
  
  // Fetch jobs (will use empty query from above)
  useGetAllJobs();
  
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);
  
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      {user && user.role === 'applicant' && <RecommendedJobs />}
      <LatestJobs />
      {user && user.role === 'applicant' && (
        <div className='max-w-7xl mx-auto my-6 md:my-10 px-4'>
          <div className='mb-6 md:mb-8'>
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>Analytics Dashboard</h1>
            <p className='text-sm md:text-base text-gray-600'>Track your job applications and platform statistics</p>
          </div>
          {!analytics.loading && (
            <AnalyticsChart
              jobsApplied={analytics.jobsApplied}
              activeApplicants={analytics.activeApplicants}
              activeRecruiters={analytics.activeRecruiters}
              userRole={user?.role}
            />
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Home