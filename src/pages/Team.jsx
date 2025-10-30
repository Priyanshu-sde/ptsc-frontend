import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import api from '../utils/api';
import MemberCard from '../components/MemberCard';
import Loader, { SkeletonCard } from '../components/Loader';
import { toast } from 'react-toastify';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/fetchMembers');
      // Normalize various possible API shapes to an array
      const payload = response?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.members)
        ? payload.members
        : [];
      setMembers(normalized);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load team members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Categorize members
  const safeMembers = Array.isArray(members) ? members : [];
  const facultyAdvisors = safeMembers.filter((m) => 
    m.role?.toLowerCase().includes('faculty') || m.role?.toLowerCase().includes('advisor')
  );
  const coreTeam = safeMembers.filter((m) => 
    m.role?.toLowerCase().includes('president') || 
    m.role?.toLowerCase().includes('vice') ||
    m.role?.toLowerCase().includes('secretary') ||
    m.role?.toLowerCase().includes('head')
  );
  const teamMembers = safeMembers.filter((m) => 
    !facultyAdvisors.includes(m) && !coreTeam.includes(m)
  );

  const MemberSection = ({ title, members = [], delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold font-display text-center mb-8">
        <span className="text-gradient">{title}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(members) && members.map((member, index) => (
          <MemberCard key={member._id || index} member={member} index={index} />
        ))}
      </div>
    </motion.div>
  );

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
              <Users className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Our Team</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the passionate individuals driving innovation and excellence at PTSC
          </p>
        </motion.div>

        {/* Members */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : members.length > 0 ? (
          <>
            {facultyAdvisors.length > 0 && (
              <MemberSection title="Faculty Advisors" members={facultyAdvisors} delay={0.1} />
            )}
            {coreTeam.length > 0 && (
              <MemberSection title="Core Team" members={coreTeam} delay={0.2} />
            )}
            {teamMembers.length > 0 && (
              <MemberSection title="Team Members" members={teamMembers} delay={0.3} />
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="glass-effect rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Team Members Found</h3>
            <p className="text-gray-400">Team information will be available soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
