import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import EventRegistrationForm from '../components/EventRegistrationForm';
import { toast } from 'react-toastify';

export default function EventRegister() {
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
    return new Date() > new Date(event.date);
  }, [event]);

  if (loading) return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <Loader />
    </div>
  );

  if (!event) return null;

  if (isDeadlineOver) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 text-center">
            <div className="flex justify-center mb-4"><AlertTriangle className="w-10 h-10 text-yellow-400" /></div>
            <h1 className="text-2xl font-bold mb-2">Registration Closed</h1>
            <p className="text-gray-400">The registration deadline for "{event.title}" has passed.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display">
            <span className="text-gradient">Register: {event.title}</span>
          </h1>
          <p className="text-gray-400">Fill the form below to register.</p>
        </motion.div>
        <div className="card max-w-2xl mx-auto">
          <EventRegistrationForm event={event} onClose={() => navigate(`/events/${event._id}`)} onSuccess={() => navigate(`/events/${event._id}`)} />
        </div>
      </div>
    </div>
  );
}
