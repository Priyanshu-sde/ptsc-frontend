import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false }) {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-dark z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t border-white/10">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="p-4">
                  <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
