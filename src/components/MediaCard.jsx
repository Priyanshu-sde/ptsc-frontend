import { motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function MediaCard({ media, index }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden rounded-lg cursor-pointer group"
      >
        {/* Image */}
        <div className="aspect-square">
          <img
            src={media.url}
            alt={media.description || 'Event media'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {media.description && (
              <p className="text-white text-sm font-medium line-clamp-2">
                {media.description}
              </p>
            )}
            {media.date && (
              <div className="flex items-center space-x-2 text-gray-300 text-xs mt-2">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(media.date)}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full glass-effect rounded-xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-dark/80 hover:bg-dark transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={media.url}
              alt={media.description || 'Event media'}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Info */}
            {(media.description || media.date) && (
              <div className="p-6 space-y-2">
                {media.description && (
                  <p className="text-white text-lg">{media.description}</p>
                )}
                {media.date && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(media.date)}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
