import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="card group"
    >
      <div className="space-y-4">
        {/* Member Image */}
        <div className="relative overflow-hidden rounded-lg aspect-square">
          <img
            src={member.image || `https://ui-avatars.com/api/?name=${member.name}&size=400&background=0A84FF&color=fff`}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Member Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-all duration-300">
            {member.name}
          </h3>
          <p className="text-primary font-medium">{member.role}</p>
          {member.branch && (
            <p className="text-gray-400 text-sm">{member.branch}</p>
          )}
        </div>

        {/* Social Links */}
        {(member.github || member.linkedin || member.email) && (
          <div className="flex justify-center space-x-3 pt-2">
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass-effect hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass-effect hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg glass-effect hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
