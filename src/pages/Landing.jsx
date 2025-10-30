import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Users, Trophy, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import CountdownTimer from '../components/CountdownTimer';

export default function Landing() {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Programming and Tech Skills Club';
  const [upcomingEvent, setUpcomingEvent] = useState(null);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUpcomingEvent();
  }, []);

  const fetchUpcomingEvent = async () => {
    try {
      const response = await api.get('/v1/fetchEvents');
      const payload = response?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.events)
        ? payload.events
        : [];
      
      // Find the next upcoming event
      const now = new Date();
      const upcoming = normalized
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (upcoming.length > 0) {
        setUpcomingEvent(upcoming[0]);
      }
    } catch (error) {
      console.error('Error fetching upcoming event:', error);
    }
  };

  const stats = [
    { icon: Users, value: '500+', label: 'Active Members' },
    { icon: Trophy, value: '50+', label: 'Competitions' },
    { icon: Calendar, value: '100+', label: 'Events Hosted' },
    { icon: Code2, value: '1000+', label: 'Problems Solved' },
  ];

  const features = [
    {
      title: 'Competitive Programming',
      description: 'Master algorithms and data structures through regular contests and practice sessions.',
      icon: Trophy,
    },
    {
      title: 'Tech Workshops',
      description: 'Learn cutting-edge technologies from industry experts and experienced seniors.',
      icon: Sparkles,
    },
    {
      title: 'Collaborative Learning',
      description: 'Join a community of passionate programmers and grow together.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark to-dark"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(10, 132, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(10, 132, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}></div>
          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/30 rounded-lg"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-32 h-32 border-2 border-accent/30 rounded-full"
          ></motion.div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="p-6 rounded-full glass-effect border-2 border-primary/50">
                <Code2 className="w-16 h-16 text-primary" />
              </div>
            </motion.div>

            {/* Title with Typewriter Effect */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display">
                <span className="text-gradient">{typedText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-primary"
                >
                  |
                </motion.span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                KNIT Sultanpur
              </p>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                Empowering students with cutting-edge programming skills and fostering innovation
                through collaborative learning and competitive coding.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/events" className="btn-primary flex items-center space-x-2">
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/leaderboard" className="btn-secondary">
                View Leaderboard
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Upcoming Event Section */}
      {upcomingEvent && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card border-2 border-primary/30 max-w-4xl mx-auto"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full glass-effect border-2 border-primary/50 mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
                  <span className="text-gradient">Next Event</span>
                </h2>
                <h3 className="text-xl md:text-2xl text-white mb-2">{upcomingEvent.title}</h3>
                <p className="text-gray-400">{upcomingEvent.description}</p>
              </div>
              
              <CountdownTimer targetDate={upcomingEvent.date} />
              
              <div className="mt-6 text-center">
                <Link to="/events" className="btn-primary inline-flex items-center space-x-2">
                  <span>View All Events</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              <span className="text-gradient">What We Offer</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join us to enhance your programming skills and be part of an amazing tech community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card text-center"
              >
                <div className="inline-block p-4 rounded-full glass-effect border-2 border-primary/50 mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-12 text-center border-2 border-primary/30"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              <span className="text-gradient">Ready to Join Us?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Be part of the most active programming community at KNIT Sultanpur. Register for
              upcoming events and start your coding journey with us!
            </p>
            <Link to="/events" className="btn-primary inline-flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
