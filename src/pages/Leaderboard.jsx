import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import LeaderboardTable from '../components/LeaderboardTable';
import Loader, { TableSkeleton } from '../components/Loader';
import { toast } from 'react-toastify';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/leaderboard?page=${currentPage}&limit=${limit}`);
      
      if (response.status === 204 || !response.data) {
        setLeaderboardData([]);
        setTotalPages(1);
      } else {
        // Normalize the API response - it returns array with {name, rank, score}
        const payload = response.data;
        const normalized = Array.isArray(payload)
          ? payload.map(entry => ({
              firstName: entry.name?.split(' ')[0] || entry.name || '',
              lastName: entry.name?.split(' ').slice(1).join(' ') || '',
              rollNo: entry.rollNo || 'N/A',
              totalScore: entry.score || 0,
              leetcodeRating: entry.leetcode || 0,
              codechefRating: entry.codechef || 0,
              codeforcesRating: entry.codeforces || 0,
            }))
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        setLeaderboardData(normalized);
        setTotalPages(payload?.totalPages || Math.ceil(normalized.length / limit) || 1);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = leaderboardData.filter((entry) => {
    const fullName = `${entry.firstName} ${entry.lastName}`.toLowerCase();
    const rollNo = entry.rollNo?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || rollNo.includes(query);
  });

  // Prepare data for chart (top 10)
  const chartData = filteredData.slice(0, 10).map((entry, index) => ({
    name: `${entry.firstName} ${entry.lastName}`,
    score: entry.totalScore || 0,
    leetcode: entry.leetcodeRating || 0,
    codechef: entry.codechefRating || 0,
    codeforces: entry.codeforcesRating || 0,
  }));

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
              <Trophy className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Top performers across multiple competitive programming platforms
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-effect rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </motion.div>

        {/* Chart Section */}
        {!loading && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Top 10 Performance</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 46, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="#0A84FF" name="Total Score" />
                <Bar dataKey="leetcode" fill="#FFA116" name="LeetCode" />
                <Bar dataKey="codechef" fill="#5B4638" name="CodeChef" />
                <Bar dataKey="codeforces" fill="#1F8ACB" name="Codeforces" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          {loading ? (
            <TableSkeleton rows={10} cols={8} />
          ) : filteredData.length > 0 ? (
            <>
              <LeaderboardTable data={filteredData} />
              
              {/* Pagination */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg glass-effect hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg glass-effect hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Leaderboard data will appear here once available'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
