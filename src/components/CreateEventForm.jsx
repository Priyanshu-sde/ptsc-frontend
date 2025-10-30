import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function CreateEventForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    googleFormLink: '',
    useCustomForm: false,
  });

  const [registrationFields, setRegistrationFields] = useState([]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRegistrationField = () => {
    setRegistrationFields([
      ...registrationFields,
      {
        name: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        description: '',
        validation: '',
        options: [],
      },
    ]);
  };

  const removeRegistrationField = (index) => {
    setRegistrationFields(registrationFields.filter((_, i) => i !== index));
  };

  const updateRegistrationField = (index, field, value) => {
    const updated = [...registrationFields];
    updated[index] = { ...updated[index], [field]: value };
    setRegistrationFields(updated);
  };

  const addFieldOption = (fieldIndex) => {
    const updated = [...registrationFields];
    if (!updated[fieldIndex].options) {
      updated[fieldIndex].options = [];
    }
    updated[fieldIndex].options.push('');
    setRegistrationFields(updated);
  };

  const updateFieldOption = (fieldIndex, optionIndex, value) => {
    const updated = [...registrationFields];
    updated[fieldIndex].options[optionIndex] = value;
    setRegistrationFields(updated);
  };

  const removeFieldOption = (fieldIndex, optionIndex) => {
    const updated = [...registrationFields];
    updated[fieldIndex].options.splice(optionIndex, 1);
    setRegistrationFields(updated);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return false;
    }
    if (!formData.date) {
      toast.error('Event date is required');
      return false;
    }
    if (formData.useCustomForm) {
      for (const field of registrationFields) {
        if (!field.name || !field.label) {
          toast.error('All registration fields must have a name and label');
          return false;
        }
        if (field.type === 'select' && (!field.options || field.options.length === 0)) {
          toast.error(`Select field "${field.label}" must have at least one option`);
          return false;
        }
      }
    } else if (!formData.googleFormLink) {
      toast.error('Either enable custom form or provide Google Form link');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const eventData = {
        ...formData,
        registrationFields: formData.useCustomForm ? registrationFields : [],
      };

      await api.post('/v1/createEvent', eventData);
      toast.success('Event created successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gradient font-display">
              Create New Event
            </h2>
            <p className="text-gray-400 mt-1">Fill in the event details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter event title"
                className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter event description"
                rows={4}
                className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Event Date *</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Event Time</span>
                  </div>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Registration Settings */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Registration Settings</h3>
            
            <div className="mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useCustomForm}
                  onChange={(e) => handleChange('useCustomForm', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-500 bg-dark text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-white">Use custom registration form</span>
              </label>
              <p className="text-xs text-gray-400 mt-1 ml-8">
                Enable this to create a custom form with additional fields
              </p>
            </div>

            {!formData.useCustomForm && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <span>Google Form Link *</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={formData.googleFormLink}
                  onChange={(e) => handleChange('googleFormLink', e.target.value)}
                  placeholder="https://forms.google.com/..."
                  className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            )}

            {formData.useCustomForm && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Add custom fields (name, gender, roll no, contact are included by default)
                  </p>
                  <button
                    type="button"
                    onClick={addRegistrationField}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Field</span>
                  </button>
                </div>

                {registrationFields.map((field, index) => (
                  <div key={index} className="glass-effect rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-white">Field {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRegistrationField(index)}
                        className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Field Name *</label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateRegistrationField(index, 'name', e.target.value)}
                          placeholder="e.g., teamName"
                          className="w-full px-3 py-2 bg-dark/50 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 border border-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Field Label *</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateRegistrationField(index, 'label', e.target.value)}
                          placeholder="e.g., Team Name"
                          className="w-full px-3 py-2 bg-dark/50 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 border border-white/10"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateRegistrationField(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 bg-dark/50 rounded text-white text-sm focus:outline-none focus:border-primary/50 border border-white/10"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) => updateRegistrationField(index, 'placeholder', e.target.value)}
                          placeholder="Placeholder text"
                          className="w-full px-3 py-2 bg-dark/50 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 border border-white/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Description</label>
                      <input
                        type="text"
                        value={field.description}
                        onChange={(e) => updateRegistrationField(index, 'description', e.target.value)}
                        placeholder="Helper text for this field"
                        className="w-full px-3 py-2 bg-dark/50 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Validation Regex (optional)</label>
                      <input
                        type="text"
                        value={field.validation}
                        onChange={(e) => updateRegistrationField(index, 'validation', e.target.value)}
                        placeholder="e.g., ^[A-Za-z]+$"
                        className="w-full px-3 py-2 bg-dark/50 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 border border-white/10"
                      />
                    </div>

                    {field.type === 'select' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs text-gray-400">Options</label>
                          <button
                            type="button"
                            onClick={() => addFieldOption(index)}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {field.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateFieldOption(index, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1 px-3 py-2 bg-dark/50 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 border border-white/10"
                              />
                              <button
                                type="button"
                                onClick={() => removeFieldOption(index, optIndex)}
                                className="p-2 rounded hover:bg-red-500/20 text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateRegistrationField(index, 'required', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-500 bg-dark text-primary"
                      />
                      <span className="text-sm text-white">Required field</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-white/10">
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
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
