import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Briefcase, FileText, PlusCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, toggleCompanyMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleToggleMode = async () => {
    try {
      await toggleCompanyMode();
      toast.success(`Switched to ${user.isCompanyMode ? 'User' : 'Company'} mode`);
    } catch (error) {
      toast.error('Failed to toggle mode');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            JobFinder
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, {user.firstName}
                </span>
                
                {user.role === 'COMPANY' && (
                  <button
                    onClick={handleToggleMode}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600"
                  >
                    {user.isCompanyMode ? (
                      <>
                        <ToggleRight className="w-5 h-5" />
                        <span>Company Mode</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5" />
                        <span>User Mode</span>
                      </>
                    )}
                  </button>
                )}

                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {user.role === 'COMPANY' && user.isCompanyMode && (
                  <>
                    <Link to="/post-job" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Job</span>
                    </Link>
                    <Link to="/applications" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <Briefcase className="w-4 h-4" />
                      <span>Applications</span>
                    </Link>
                  </>
                )}

                {(!user.isCompanyMode || user.role === 'USER') && (
                  <Link to="/my-applications" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                    <FileText className="w-4 h-4" />
                    <span>My Applications</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;