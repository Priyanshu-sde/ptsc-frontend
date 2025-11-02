import { motion } from 'framer-motion';
import { Calendar, Clock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, isPast = false }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="space-y-4">
        {/* Event Title */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-all duration-300">
            {event.title}
          </h3>
          {isPast && (
            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400">
              Past Event
            </span>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">{event.time}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-400 text-sm line-clamp-3">{event.description}</p>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 btn-secondary text-center"
          >
            View Details
          </Link>
          {!isPast && (
            <Link
              to={`/events/${event._id}/register`}
              className="flex-1 btn-primary text-center"
            >
              Register Now
            </Link>
          )}
          {isPast && event.resultLink && (
            <a
              href={event.resultLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-secondary text-center flex items-center justify-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>View Results</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
