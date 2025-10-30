import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

export default function LeaderboardTable({ data }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gray-500/10 border-gray-500/30';
      case 3:
        return 'bg-amber-600/10 border-amber-600/30';
      default:
        return 'hover:bg-white/5';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Branch</th>
            <th className="px-4 py-4 text-center text-sm font-semibold text-gray-400">Score</th>
            <th className="px-4 py-4 text-center text-sm font-semibold text-gray-400">LeetCode</th>
            <th className="px-4 py-4 text-center text-sm font-semibold text-gray-400">CodeChef</th>
            <th className="px-4 py-4 text-center text-sm font-semibold text-gray-400">Codeforces</th>
            <th className="px-4 py-4 text-center text-sm font-semibold text-gray-400">GFG</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <motion.tr
              key={entry._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b border-white/5 transition-colors ${getRankBgColor(index + 1)}`}
            >
              <td className="px-4 py-4">
                <div className="flex items-center justify-center w-10">
                  {getRankIcon(index + 1)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <p className="font-semibold text-white">
                    {entry.firstName} {entry.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{entry.rollNo}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-300">{entry.branch}</td>
              <td className="px-4 py-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-bold">
                  {entry.totalScore || 0}
                </span>
              </td>
              <td className="px-4 py-4 text-center text-gray-300">
                {entry.leetcodeRating || '-'}
              </td>
              <td className="px-4 py-4 text-center text-gray-300">
                {entry.codechefRating || '-'}
              </td>
              <td className="px-4 py-4 text-center text-gray-300">
                {entry.codeforcesRating || '-'}
              </td>
              <td className="px-4 py-4 text-center text-gray-300">
                {entry.gfgScore || '-'}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
