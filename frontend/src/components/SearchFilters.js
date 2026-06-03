import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { jobService } from '../services/jobService';

const SearchFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    sortBy: 'CREATED_ON'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await jobService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltersChange(filters);
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Jobs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Job title, company, or keywords..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="CREATED_ON">Latest</option>
              <option value="LIKES">Most Liked</option>
              <option value="TITLE">Title A-Z</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary flex items-center space-x-2 md:w-auto w-full justify-center"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;