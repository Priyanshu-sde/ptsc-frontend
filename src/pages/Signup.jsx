import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, Phone, User } from 'lucide-react';
import api, { BASE_URL } from '../utils/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.userName.trim()) return 'Username is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Valid email is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter a valid 10-digit mobile number';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/v1/SignUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.userName,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Signup successful');
        navigate('/login');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full glass-effect border-2 border-primary/50">
                <UserPlus className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold font-display mb-2">
              <span className="text-gradient">Create Account</span>
            </h1>
            <p className="text-gray-400">Join PTSC to participate in events</p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="john_doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="9876543210"
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
                <UserPlus className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light">Sign In</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
