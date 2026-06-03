import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { ChevronLeft, ChevronRight, ExternalLink, Clock, Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [currentPage, user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await jobService.getMyApplications({
        page: currentPage,
        size: 10
      });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'REVIEWED':
        return <Eye className="w-4 h-4" />;
      case 'ACCEPTED':
        return <Check className="w-4 h-4" />;
      case 'REJECTED':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Your application is being reviewed';
      case 'REVIEWED':
        return 'Your application has been reviewed';
      case 'ACCEPTED':
        return 'Congratulations! Your application was accepted';
      case 'REJECTED':
        return 'Unfortunately, your application was not selected';
      default:
        return 'Application status unknown';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="card">
            <p className="text-gray-500 text-lg mb-4">You haven't applied to any jobs yet.</p>
            <Link to="/" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {application.jobTitle}
                      </Link>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <p className="text-gray-600 mb-3">{application.companyName}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>Applied on {formatDate(application.createdOn)}</span>
                      {application.updatedOn !== application.createdOn && (
                        <span>Updated on {formatDate(application.updatedOn)}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        {getStatusMessage(application.status)}
                      </span>
                    </div>

                    {application.coverLetter && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Your Cover Letter:</h4>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {application.resumeUrl && (
                      <div className="mt-3">
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm underline"
                        >
                          View Submitted Resume
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="ml-6">
                    <Link
                      to={`/jobs/${application.jobId}`}
                      className="btn-secondary text-sm"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === i
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyApplications;