import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';
import Loader, { SkeletonCard } from '../components/Loader';
import { toast } from 'react-toastify';

export default function Media() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/getallmedia');
      setMediaItems(response.data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media gallery');
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full glass-effect border-2 border-primary/50">
              <ImageIcon className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Media Gallery</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Capturing moments from our events, workshops, and community gatherings
          </p>
        </motion.div>

        {/* Media Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : mediaItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {mediaItems.map((media, index) => (
              <MediaCard key={media._id || index} media={media} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="glass-effect rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Media Found</h3>
            <p className="text-gray-400">
              Gallery will be updated with photos and videos from our events.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
