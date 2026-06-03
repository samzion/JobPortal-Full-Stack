import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { MapPin, Calendar, Building, ThumbsUp, ThumbsDown, DollarSign, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeUrl: ''
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobService.getJob(id);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      await jobService.voteJob(id, voteType);
      fetchJob();
      toast.success(`${voteType === 'LIKE' ? 'Liked' : 'Disliked'} job`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await jobService.applyForJob(id, applicationData);
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({ coverLetter: '', resumeUrl: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id);
        toast.success('Job deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const canApply = user && user.role === 'USER' && !user.isCompanyMode;
  const canEdit = user && job && job.postedBy === user.id;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <Building className="w-5 h-5" />
                <span className="font-medium">{job.company}</span>
              </div>
              {job.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.salaryRange && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-5 h-5" />
                  <span>{job.salaryRange}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-5 h-5" />
                <span>Posted {formatDate(job.createdOn)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {job.categoryName}
              </span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote('LIKE')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded ${
                    job.userVote === 'LIKE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{job.likes || 0}</span>
                </button>
                
                <button
                  onClick={() => handleVote('DISLIKE')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded ${
                    job.userVote === 'DISLIKE' 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{job.dislikes || 0}</span>
                </button>
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/post-job?edit=${id}`)}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-xl font-semibold mb-4">Job Description</h3>
          <div className="whitespace-pre-wrap text-gray-700">
            {job.description}
          </div>
        </div>

        {canApply && (
          <div className="border-t pt-6">
            {!showApplicationForm ? (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="btn-primary"
              >
                Apply for this Job
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="text-lg font-semibold">Apply for this Position</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({
                      ...applicationData,
                      coverLetter: e.target.value
                    })}
                    rows={6}
                    className="input-field"
                    placeholder="Tell us why you're perfect for this role..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={applicationData.resumeUrl}
                    onChange={(e) => setApplicationData({
                      ...applicationData,
                      resumeUrl: e.target.value
                    })}
                    className="input-field"
                    placeholder="https://example.com/your-resume.pdf"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;