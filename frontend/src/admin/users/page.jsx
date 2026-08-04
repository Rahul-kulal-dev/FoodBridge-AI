import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Utensils,
  Truck,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Admin Manage Users Page (/admin/users)
 * Displays real user data from MongoDB Atlas backend with zero dummy data fallback.
 */
const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/users'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.warn('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const assignedRole = u.user_role || u.role;
    const matchesRole = roleFilter === 'all' || assignedRole === roleFilter;
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Manage System Users
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Filter and manage all registered Donors, NGOs, Volunteers, and Admins.
            </p>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F7F8FB] rounded-2xl border border-[#E7EAF0] text-xs font-bold shrink-0">
          {['all', 'donor', 'ngo', 'volunteer'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl transition-all capitalize cursor-pointer ${
                roleFilter === r
                  ? 'bg-white text-emerald-700 shadow-xs border border-[#E7EAF0]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search user by name, organization, or email address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm text-[#0F172A] focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading users database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No users found</h3>
            <p className="text-xs text-slate-400 font-medium">There are no registered users matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#64748B] text-[11px] font-bold uppercase tracking-wider border-b border-[#E7EAF0]">
                <tr>
                  <th className="px-6 py-4">USER / ORGANIZATION</th>
                  <th className="px-6 py-4">ROLE</th>
                  <th className="px-6 py-4">VERIFICATION STATUS</th>
                  <th className="px-6 py-4">CONTACT & ADDRESS</th>
                  <th className="px-6 py-4 text-right">JOINED DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EAF0]">
                {filteredUsers.map((u) => {
                  const assignedRole = u.user_role || u.role;
                  let roleBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  let RoleIcon = Utensils;
                  if (assignedRole === 'ngo') {
                    roleBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                    RoleIcon = Building2;
                  } else if (assignedRole === 'volunteer') {
                    roleBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                    RoleIcon = Truck;
                  } else if (assignedRole === 'admin') {
                    roleBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                    RoleIcon = ShieldAlert;
                  }

                  return (
                    <tr key={u._id} className="hover:bg-[#f8fafc]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-[#0F172A] text-sm">
                          {u.organizationName || u.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] font-medium">{u.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleBadge} capitalize`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          <span>{assignedRole}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.verificationStatus === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : u.verificationStatus === 'rejected' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {u.verificationStatus === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {u.verificationStatus === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {u.verificationStatus === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          <span className="capitalize">{u.verificationStatus || 'pending'}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-[#334155]">
                        <div>{u.phone || 'N/A'}</div>
                        <div className="text-[11px] text-[#64748B]">{u.address || 'Standard Location'}</div>
                      </td>

                      <td className="px-6 py-4 text-right text-[#64748B] font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
