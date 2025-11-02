import { useState } from 'react';
import { X, User, Mail, Phone, Hash, Code, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function AddToLeaderboardForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    branch: '',
    phoneNo: '',
    email: '',
    rollNo: '',
    leetcodeId: '',
    codechefId: '',
    codeforcesId: '',
    gfgId: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else {
      // Phone number validation (10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phoneNo)) {
        newErrors.phoneNo = 'Phone number must be 10 digits';
      }
    }
    if (!formData.rollNo) {
      newErrors.rollNo = 'Roll number is required';
    }

    // At least one coding platform ID is required
    if (!formData.leetcodeId && !formData.codechefId && !formData.codeforcesId && !formData.gfgId) {
      newErrors.platforms = 'At least one coding platform ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      // Convert rollNo to number
      const submissionData = {
        ...formData,
        rollNo: parseInt(formData.rollNo, 10),
      };

      await api.post('/leaderboard/add', submissionData);
      toast.success('Successfully added to leaderboard!');
      setSubmitted(true);
      
      // Wait a bit before calling onSuccess to show the success message
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error adding to leaderboard:', error);
      toast.error(error.response?.data?.message || 'Failed to add to leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center px-4 py-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-green-500/10 border-2 border-green-500/50">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Successfully Added!</h3>
        <p className="text-gray-400 mb-6">
          You've been added to the leaderboard. Your rankings will be updated shortly.
        </p>
        <button
          onClick={onClose}
          className="btn-primary"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-h-[80vh] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 bg-dark/95 backdrop-blur-lg z-10 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gradient font-display">
              Join the Leaderboard
            </h2>
            <p className="text-gray-400 mt-1 text-sm">Fill in your details to get ranked</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close form"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all ${
                  errors.branch ? 'border-red-500' : ''
                }`}
              >
                <option value="" className="bg-dark text-gray-400">Select branch</option>
                <option value="Computer Science" className="bg-dark">Computer Science</option>
                <option value="Information Technology" className="bg-dark">Information Technology</option>
                <option value="Electronics" className="bg-dark">Electronics</option>
                <option value="Electrical" className="bg-dark">Electrical</option>
                <option value="Mechanical" className="bg-dark">Mechanical</option>
                <option value="Civil" className="bg-dark">Civil</option>
                <option value="Other" className="bg-dark">Other</option>
              </select>
              {errors.branch && (
                <p className="text-red-400 text-xs mt-1">{errors.branch}</p>
              )}
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.rollNo}
                onChange={(e) => handleChange('rollNo', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all ${
                  errors.rollNo ? 'border-red-500' : ''
                }`}
                placeholder="Enter roll number"
              />
              {errors.rollNo && (
                <p className="text-red-400 text-xs mt-1">{errors.rollNo}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNo}
                onChange={(e) => handleChange('phoneNo', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all ${
                  errors.phoneNo ? 'border-red-500' : ''
                }`}
                placeholder="10-digit phone number"
                maxLength={10}
              />
              {errors.phoneNo && (
                <p className="text-red-400 text-xs mt-1">{errors.phoneNo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Coding Platforms Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Code className="w-5 h-5 mr-2 text-primary" />
            Coding Platform IDs
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            Add at least one platform ID <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LeetCode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                LeetCode ID
              </label>
              <input
                type="text"
                value={formData.leetcodeId}
                onChange={(e) => handleChange('leetcodeId', e.target.value)}
                className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Your LeetCode username"
              />
            </div>

            {/* CodeChef */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                CodeChef ID
              </label>
              <input
                type="text"
                value={formData.codechefId}
                onChange={(e) => handleChange('codechefId', e.target.value)}
                className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Your CodeChef username"
              />
            </div>

            {/* Codeforces */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Codeforces ID
              </label>
              <input
                type="text"
                value={formData.codeforcesId}
                onChange={(e) => handleChange('codeforcesId', e.target.value)}
                className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Your Codeforces handle"
              />
            </div>

            {/* GeeksforGeeks */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                GeeksforGeeks ID
              </label>
              <input
                type="text"
                value={formData.gfgId}
                onChange={(e) => handleChange('gfgId', e.target.value)}
                className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Your GFG username"
              />
            </div>
          </div>
          {errors.platforms && (
            <p className="text-red-400 text-sm mt-2">{errors.platforms}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Add to Leaderboard'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(10, 132, 255, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(10, 132, 255, 0.7);
        }
      `}</style>
    </div>
  );
}
