import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* 404 Text */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-9xl md:text-[200px] font-bold font-display mb-4"
          >
            <span className="text-gradient">404</span>
          </motion.h1>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="btn-primary flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 relative">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -left-20 top-0 w-20 h-20 border-2 border-primary/30 rounded-lg"
            ></motion.div>
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute -right-20 top-0 w-32 h-32 border-2 border-accent/30 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
