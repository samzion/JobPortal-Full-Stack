import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get('edit');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();

  useEffect(() => {
    fetchCategories();
    if (editJobId) {
      setIsEditing(true);
      fetchJobForEdit();
    }
  }, [editJobId]);

  const fetchCategories = async () => {
    try {
      const response = await jobService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchJobForEdit = async () => {
    try {
      const response = await jobService.getJob(editJobId);
      const job = response.data;
      
      setValue('title', job.title);
      setValue('description', job.description);
      setValue('company', job.company);
      setValue('location', job.location);
      setValue('salaryRange', job.salaryRange);
      setValue('categoryId', job.categoryId);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/dashboard');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await jobService.updateJob(editJobId, data);
        toast.success('Job updated successfully!');
      } else {
        await jobService.createJob(data);
        toast.success('Job posted successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'post'} job`);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if user is not a company or not in company mode
  if (!user || user.role !== 'COMPANY' || !user.isCompanyMode) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Job' : 'Post a New Job'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your job posting' : 'Fill out the details to post your job opportunity'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Job title is required'
              })}
              className="input-field"
              placeholder="e.g. Senior Software Engineer"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              {...register('company', {
                required: 'Company name is required'
              })}
              className="input-field"
              placeholder="Your company name"
              defaultValue={user.companyName}
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="input-field"
                placeholder="e.g. New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                {...register('salaryRange')}
                className="input-field"
                placeholder="e.g. $80,000 - $120,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('categoryId', {
                required: 'Please select a category'
              })}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              {...register('description', {
                required: 'Job description is required',
                minLength: {
                  value: 50,
                  message: 'Description must be at least 50 characters'
                }
              })}
              rows={8}
              className="input-field"
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (isEditing ? 'Updating...' : 'Posting...') 
                : (isEditing ? 'Update Job' : 'Post Job')
              }
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;