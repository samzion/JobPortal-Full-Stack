import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import { PlusCircle, Briefcase, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.role === 'COMPANY' && user.isCompanyMode) {
        fetchCompanyJobs();
        fetchCompanyStats();
      } else {
        fetchUserApplications();
      }
    }
  }, [user]);

  const fetchCompanyJobs = async () => {
    try {
      const response = await jobService.getJobs({ page: 0, size: 10 });
      // Filter jobs posted by current user (this should be handled by backend)
      setJobs(response.data.content);
    } catch (error) {
      console.error('Failed to fetch company jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyStats = async () => {
    try {
      const applicationsResponse = await jobService.getCompanyApplications({ page: 0, size: 1 });
      setStats({
        totalJobs: jobs.length,
        totalApplications: applicationsResponse.data.totalElements,
        pendingApplications: applicationsResponse.data.content.filter(app => app.status === 'PENDING').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const response = await jobService.getMyApplications({ page: 0, size: 10 });
      setStats({
        totalApplications: response.data.totalElements,
        pendingApplications: response.data.content.filter(app => app.status === 'PENDING').length,
        acceptedApplications: response.data.content.filter(app => app.status === 'ACCEPTED').length
      });
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isCompanyMode = user?.role === 'COMPANY' && user?.isCompanyMode;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          {isCompanyMode 
            ? 'Manage your job postings and applications' 
            : 'Track your job applications and find new opportunities'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isCompanyMode ? (
          <>
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications Submitted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications || 0}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {isCompanyMode ? (
            <>
              <Link to="/post-job" className="btn-primary flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span>Post New Job</span>
              </Link>
              <Link to="/applications" className="btn-secondary flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>View Applications</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="btn-primary flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Browse Jobs</span>
              </Link>
              <Link to="/my-applications" className="btn-secondary flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>My Applications</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent Jobs (for company mode) */}
      {isCompanyMode && jobs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Recent Job Posts</h2>
          <div className="grid gap-6">
            {jobs.slice(0, 5).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;