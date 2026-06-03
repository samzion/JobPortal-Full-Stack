import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Building, ThumbsUp, ThumbsDown } from 'lucide-react';
import { jobService } from '../services/jobService';
import toast from 'react-hot-toast';

const JobCard = ({ job, onVote }) => {
  const handleVote = async (voteType) => {
    try {
      await jobService.voteJob(job.id, voteType);
      onVote && onVote();
      toast.success(`${voteType === 'LIKE' ? 'Liked' : 'Disliked'} job`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link to={`/jobs/${job.id}`} className="block">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-2">
              {job.title}
            </h3>
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
            {job.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(job.createdOn)}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-3">
            {job.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                {job.categoryName}
              </span>
              {job.salaryRange && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {job.salaryRange}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote('LIKE')}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
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
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
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
      </div>
    </div>
  );
};

export default JobCard;