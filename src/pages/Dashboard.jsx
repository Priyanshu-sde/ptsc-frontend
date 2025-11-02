import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Image, 
  RefreshCw, 
  Check, 
  X, 
  Upload,
  Trash2,
  Edit,
  Plus,
  Clock
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import CreateEventForm from '../components/CreateEventForm';
import { useAuth } from '../context/AuthContext';
import MemberAdminForm from '../components/MemberAdminForm';
import EventEditForm from '../components/EventEditForm';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const [activeTab, setActiveTab] = useState('users');
  const [pendingUsers, setPendingUsers] = useState([]); // deprecated but kept for badge logic removal later
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [users, setUsers] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (activeTab === 'users') {
      if (isAdmin) {
        fetchUsers();
      } else {
        setActiveTab('events');
      }
    } else if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'members') {
      if (isAdmin) fetchMembers();
    } else if (activeTab === 'registrations') {
      if (isAdmin) fetchRegistrations(selectedEventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAdmin]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/fetchEvents');
      const payload = response?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.events)
        ? payload.events
        : [];
      setEvents(normalized);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId = '') => {
    try {
      setLoading(true);
      const res = await api.get('/v1/registrations', { params: eventId ? { eventId } : {} });
      const data = Array.isArray(res?.data?.registrations) ? res.data.registrations : [];
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/fetchMembers');
      const payload = response?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.members)
        ? payload.members
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setMembers(normalized);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/v1/getAllUsers');
      const payload = res?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.users)
        ? payload.users
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setUsers(normalized);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.patch(`/v1/approveUser/${userId}`);
      toast.success('User approved successfully');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    }
  };

  const handleDeny = async (userId) => {
    try {
      await api.delete(`/v1/deniedUser/${userId}`);
      toast.success('User denied');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error denying user:', error);
      toast.error('Failed to deny user');
    }
  };

  const handleRefreshLeaderboard = async () => {
    try {
      setRefreshing(true);
      await api.post('/leaderboard/refresh');
      toast.success('Leaderboard refreshed successfully');
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
      toast.error('Failed to refresh leaderboard');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateLeaderboard = async () => {
    try {
      setRefreshing(true);
      await api.post('/leaderboard/update');
      toast.success('Leaderboard updated successfully');
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      toast.error('Failed to update leaderboard');
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'members', label: 'Manage Members', icon: Users },
    { id: 'registrations', label: 'Registrations', icon: Calendar },
    { id: 'media', label: 'Manage Media', icon: Image },
    { id: 'leaderboard', label: 'Leaderboard', icon: RefreshCw },
  ];
  const visibleTabs = isAdmin ? tabs : tabs.filter(t => !['users','members','registrations'].includes(t.id));

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-display mb-2">
            <span className="text-gradient">Admin Dashboard</span>
          </h1>
          <p className="text-gray-400">Manage club content and user registrations</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'glass-effect text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="flex items-center space-x-2">
                  <span>{tab.label}</span>
                  {/* No badge for users tab */}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Users Tab */}
          {activeTab === 'users' && isAdmin && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Manage Users</h2>
                <button
                  onClick={fetchUsers}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {loading ? (
                <Loader />
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Mobile</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Role</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-4 text-white">{u.firstName} {u.lastName}</td>
                          <td className="px-4 py-4 text-gray-400">{u.email}</td>
                          <td className="px-4 py-4 text-gray-400">{u.username}</td>
                          <td className="px-4 py-4 text-gray-400">{u.mobile || '-'}</td>
                          <td className="px-4 py-4 text-gray-400 capitalize">{u.status}</td>
                          <td className="px-4 py-4">
                            <select
                              className="px-3 py-2 bg-dark/50 rounded text-white text-sm focus:outline-none focus:border-primary/50 border border-white/10"
                              value={u.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
                              }}
                            >
                              <option value="normal">normal</option>
                              <option value="member">member</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center">
                              <button
                                disabled={updatingUserId === u._id}
                                onClick={async () => {
                                  try {
                                    setUpdatingUserId(u._id);
                                    await api.patch(`/v1/updateUser/${u._id}`, { role: u.role });
                                    toast.success('Role updated');
                                    fetchUsers();
                                  } catch (error) {
                                    console.error('Update role error:', error);
                                    toast.error(error.response?.data?.message || 'Failed to update role');
                                  } finally {
                                    setUpdatingUserId(null);
                                  }
                                }}
                                className="btn-secondary text-sm"
                              >
                                {updatingUserId === u._id ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={async () => {
                                  if (!window.confirm('Delete this user? This action cannot be undone.')) return;
                                  try {
                                    await api.delete(`/v1/deleteUser/${u._id}`);
                                    toast.success('User deleted');
                                    fetchUsers();
                                  } catch (error) {
                                    console.error('Delete user error:', error);
                                    toast.error(error.response?.data?.message || 'Failed to delete user');
                                  }
                                }}
                                className="ml-2 btn-secondary text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No users found.</p>
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Manage Events</h2>
                <button 
                  onClick={() => setShowCreateEvent(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
              
              {loading ? (
                <Loader />
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event._id} className="glass-effect rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center text-gray-400">
                              <Calendar className="w-4 h-4 mr-2 text-primary" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            {event.time && (
                              <div className="flex items-center text-gray-400">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                {event.time}
                              </div>
                            )}
                            {event.useCustomForm && (
                              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                                Custom Form
                              </span>
                            )}
                          </div>
                          {event.registrationFields && event.registrationFields.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500 mb-1">Additional Fields:</p>
                              <div className="flex flex-wrap gap-2">
                                {event.registrationFields.map((field, idx) => (
                                  <span key={idx} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
                                    {field.label} {field.required && '*'}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all"
                            onClick={() => { setEditingEvent(event); setShowEditEvent(true); }}
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all"
                            onClick={async () => {
                              if (!window.confirm('Delete this event?')) return;
                              try {
                                await api.delete(`/v1/deleteEvent/${event._id}`);
                                toast.success('Event deleted');
                                fetchEvents();
                              } catch (error) {
                                console.error('Delete event error:', error);
                                toast.error(error.response?.data?.message || 'Failed to delete event');
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No events found. Create your first event!</p>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && isAdmin && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Manage Members</h2>
                <button
                  onClick={() => { setEditingMember(null); setShowMemberForm(true); }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {loading ? (
                <Loader />
              ) : members.length > 0 ? (
                <div className="space-y-4">
                  {members.map((m) => (
                    <div key={m._id} className="glass-effect rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-white font-semibold">{m.name}</p>
                          <p className="text-gray-400 text-sm">{m.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all"
                          onClick={() => { setEditingMember(m); setShowMemberForm(true); }}
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all"
                          onClick={async () => {
                            try {
                              await api.delete(`/v1/deleteMember/${m._id}`);
                              toast.success('Member deleted');
                              fetchMembers();
                            } catch (error) {
                              console.error('Delete member error:', error);
                              toast.error('Failed to delete member');
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No members found. Add the first member.</p>
                </div>
              )}
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && isAdmin && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="text-2xl font-bold text-white">Event Registrations</h2>
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 bg-dark/50 rounded text-white text-sm focus:outline-none focus:border-primary/50 border border-white/10"
                    value={selectedEventId}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedEventId(v);
                      fetchRegistrations(v);
                    }}
                  >
                    <option value="">All Events</option>
                    {events.map(ev => (
                      <option key={ev._id} value={ev._id}>{ev.title}</option>
                    ))}
                  </select>
                  <button onClick={() => fetchRegistrations(selectedEventId)} className="btn-secondary flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <Loader />
              ) : registrations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Gender</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Roll No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Contact</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Event</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((r) => (
                        <tr key={r._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-white">{r.name}</td>
                          <td className="px-4 py-3 text-gray-400">{r.gender}</td>
                          <td className="px-4 py-3 text-gray-400">{r.rollNo}</td>
                          <td className="px-4 py-3 text-gray-400">{r.contactNo}</td>
                          <td className="px-4 py-3 text-gray-400">{r.eventId}</td>
                          <td className="px-4 py-3 text-gray-400">{new Date(r.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No registrations found.</p>
                </div>
              )}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Manage Media</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Media</span>
                </button>
              </div>
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Media management interface coming soon</p>
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Leaderboard Management</h2>
              <div className="space-y-4">
                <div className="glass-effect rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Refresh Leaderboard</h3>
                  <p className="text-gray-400 mb-4">
                    Fetch latest ratings from all platforms and update the leaderboard
                  </p>
                  <button
                    onClick={handleRefreshLeaderboard}
                    disabled={refreshing}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh Now'}</span>
                  </button>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Update Leaderboard</h3>
                  <p className="text-gray-400 mb-4">
                    Recalculate scores and update rankings
                  </p>
                  <button
                    onClick={handleUpdateLeaderboard}
                    disabled={refreshing}
                    className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Updating...' : 'Update Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <CreateEventForm
          onClose={() => setShowCreateEvent(false)}
          onSuccess={() => {
            setShowCreateEvent(false);
            fetchEvents();
          }}
        />
      )}

      {showEditEvent && editingEvent && (
        <EventEditForm
          event={editingEvent}
          onClose={() => setShowEditEvent(false)}
          onSuccess={() => {
            setShowEditEvent(false);
            fetchEvents();
          }}
        />
      )}

      {/* Member Form Modal */}
      {showMemberForm && isAdmin && (
        <MemberAdminForm
          member={editingMember}
          onClose={() => setShowMemberForm(false)}
          onSuccess={() => {
            setShowMemberForm(false);
            fetchMembers();
          }}
        />
      )}
    </div>
  );
}
