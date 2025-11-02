import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Link as LinkIcon, BookOpen } from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
  const res = await api.get(`/v1/events/${id}`);
  const found = res?.data?.event;
  if (!found) {
          toast.error('Event not found');
          navigate('/events', { replace: true });
          return;
        }
        setEvent(found);
      } catch (err) {
        console.error('Load event error:', err);
        toast.error('Failed to load event');
        navigate('/events', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const isDeadlineOver = useMemo(() => {
    if (!event?.date) return false;
    const deadline = new Date(event.date);
    return new Date() > deadline;
  }, [event]);

  if (loading) return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <Loader />
    </div>
  );

  if (!event) return null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold font-display mb-2">
            <span className="text-gradient">{event.title}</span>
          </h1>
          <p className="text-gray-400 max-w-3xl">{event.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-lg p-6 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center"><Calendar className="w-4 h-4 text-primary mr-2" /> {new Date(event.date).toLocaleString()}</div>
                {event.time && (
                  <div className="flex items-center"><Clock className="w-4 h-4 text-primary mr-2" /> {event.time}</div>
                )}
                {event.status && (
                  <span className="px-2 py-1 rounded bg-white/10 text-xs">Status: {event.status}</span>
                )}
              </div>
            </div>

            {/* Resources placeholder */}
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Resources to Practice</h2>
              </div>
              <p className="text-gray-400 text-sm">Coming soon: curated problems, tutorials, and links to prepare for this event.</p>
            </div>
          </div>

          {/* Sidebar actions */}
          <div className="space-y-4">
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Registration</h3>
              {isDeadlineOver ? (
                <div className="text-gray-400 text-sm">Registration is closed.</div>
              ) : (
                <Link to={`/events/${event._id}/register`} className="btn-primary w-full block text-center">Register Now</Link>
              )}

              {event.googleFormLink && (
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <LinkIcon className="w-3 h-3 mr-1" /> External Google Form
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
