import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function MemberAdminForm({ onClose, onSuccess, member }) {
  const isEdit = Boolean(member?._id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', imageUrl: '' });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        imageUrl: member.imageUrl || '',
      });
    }
  }, [isEdit, member]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.imageUrl.trim()) {
      toast.error('Name, Role and Image URL are required');
      return;
    }
    try {
      setLoading(true);
      if (isEdit) {
        await api.patch(`/v1/editMember/${member._id}`, formData);
        toast.success('Member updated');
      } else {
        await api.post('/v1/createMember', formData);
        toast.success('Member created');
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Member save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

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
        className="card max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gradient font-display">
              {isEdit ? 'Edit Member' : 'Create Member'}
            </h2>
            <p className="text-gray-400 mt-1">Provide member details</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="Member name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="e.g., President, Coordinator"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Member')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
