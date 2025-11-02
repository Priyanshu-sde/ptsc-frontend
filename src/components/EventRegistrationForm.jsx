import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Hash, Users, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function EventRegistrationForm({ event, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  
  // Default fields
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    rollNo: '',
    contactNo: '',
  });

  // Dynamic fields from event
  const [dynamicFields, setDynamicFields] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDynamicChange = (field, value) => {
    setDynamicFields(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Validate default fields
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.gender) {
      toast.error('Gender is required');
      return false;
    }
    if (!formData.rollNo.trim()) {
      toast.error('Roll Number is required');
      return false;
    }
    if (!formData.contactNo.trim()) {
      toast.error('Contact Number is required');
      return false;
    }
    
    // Validate contact number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNo)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate dynamic fields if they have required property
    if (event.registrationFields) {
      for (const field of event.registrationFields) {
        if (field.required && !dynamicFields[field.name]?.trim()) {
          toast.error(`${field.label} is required`);
          return false;
        }
        
        // Custom validation for dynamic fields
        if (field.validation && dynamicFields[field.name]) {
          const regex = new RegExp(field.validation);
          if (!regex.test(dynamicFields[field.name])) {
            toast.error(`Invalid ${field.label}`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const registrationData = {
        eventId: event._id,
        ...formData,
        ...dynamicFields,
      };

      const { data } = await api.post('/v1/registerEvent', registrationData);
      toast.success('Registration successful!');
      setWhatsappLink(data?.whatsappGroupLink || event.whatsappGroupLink || '');
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center px-4 py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Form submitted successfully</h3>
        <p className="text-gray-400 mb-6">Thank you for registering for {event.title}. We’ll share updates soon.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Join WhatsApp Group
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gradient font-display">
          Register for Event
        </h2>
        <p className="text-gray-400 mt-1">{event.title}</p>
      </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Default Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name *</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Gender *</span>
              </div>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Roll Number *</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.rollNo}
              onChange={(e) => handleChange('rollNo', e.target.value)}
              placeholder="Enter your roll number"
              className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Contact Number *</span>
              </div>
            </label>
            <input
              type="tel"
              value={formData.contactNo}
              onChange={(e) => handleChange('contactNo', e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>

          {/* Dynamic Fields */}
          {event.registrationFields && event.registrationFields.length > 0 && (
            <>
              <div className="border-t border-white/10 pt-4 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
              </div>
              {event.registrationFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={dynamicFields[field.name] || ''}
                      onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
                      required={field.required}
                    >
                      <option value="" disabled>Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={dynamicFields[field.name] || ''}
                      onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      rows={4}
                      className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={dynamicFields[field.name] || ''}
                      onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                      required={field.required}
                    />
                  )}
                  {field.description && (
                    <p className="text-xs text-gray-400 mt-1">{field.description}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Submit Button */}
          <div className="pt-6 flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
    </form>
  </div>
  );
}
