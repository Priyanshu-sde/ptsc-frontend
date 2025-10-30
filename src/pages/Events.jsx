import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import Loader, { SkeletonCard } from '../components/Loader';
import { toast } from 'react-toastify';

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/fetchEvents');
      const payload = response?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.events)
        ? payload.events
        : [];
      setEvents(normalized);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

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
              <Calendar className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Events</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Participate in exciting coding competitions, workshops, and tech talks
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass-effect rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming Events
              {upcomingEvents.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/20">
                  {upcomingEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Past Events
              {pastEvents.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/20">
                  {pastEvents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayEvents.map((event, index) => (
              <EventCard
                key={event._id || index}
                event={event}
                isPast={activeTab === 'past'}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="glass-effect rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
            <p className="text-gray-400">
              {activeTab === 'upcoming'
                ? 'Stay tuned for upcoming events!'
                : 'Check back later for past event records.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
