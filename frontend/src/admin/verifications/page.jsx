import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Building2,
  Utensils,
  Search,
  X,
  Loader2
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';
import FileViewerModal from '../../components/FileViewerModal';

/**
 * Admin Pending Verifications Page (/admin/verifications)
 * Connected directly to MongoDB Atlas database.
 * On Approve / Reject: updates user in MongoDB Atlas database, sends notifications.
 */
const AdminVerificationsPage = () => {
  const { token, user: loggedInUser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [rejectModalUser, setRejectModalUser] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/users'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok && data.users) {
        // Show non-admin users who have verification documents uploaded or explicitly have a verification status
        const verifiableUsers = data.users.filter((u) => {
          const userRole = u.user_role || u.role;
          if (userRole === 'admin' || u.role === 'admin') return false;

          return (
            (u.verificationDocs && u.verificationDocs.length > 0) ||
            u.verificationStatus === 'pending' ||
            u.verificationStatus === 'approved' ||
            u.verificationStatus === 'rejected'
          );
        });
        setUsers(verifiableUsers);
      } else {

        setUsers([]);
      }
    } catch (err) {
      console.warn('Error fetching verification users from MongoDB Atlas:', err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await fetch(getApiUrl(`/api/admin/users/${userId}/approve`), {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, verificationStatus: 'approved', rejectionReason: '' } : u))
        );
        // Also update AuthContext if approving current logged in user
        if (loggedInUser && loggedInUser._id === userId) {
          updateUser({ ...loggedInUser, verificationStatus: 'approved', rejectionReason: '' });
        }
      }
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenRejectModal = (userItem) => {
    setRejectModalUser(userItem);
    setRejectionReasonText('Document incomplete or illegible. Please re-upload clear government-issued document.');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalUser) return;
    const userId = rejectModalUser._id;
    setActionLoading(userId);

    try {
      const res = await fetch(getApiUrl(`/api/admin/users/${userId}/reject`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rejectionReason: rejectionReasonText }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, verificationStatus: 'rejected', rejectionReason: rejectionReasonText } : u))
        );
        // Update AuthContext if rejecting current logged in user
        if (loggedInUser && loggedInUser._id === userId) {
          updateUser({ ...loggedInUser, verificationStatus: 'rejected', rejectionReason: rejectionReasonText });
        }
      }
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setActionLoading(null);
      setRejectModalUser(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesTab = (u.verificationStatus || 'pending') === activeTab;
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Admin Verification Approvals
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Real-time verification approval queue.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F7F8FB] rounded-2xl border border-[#E7EAF0] text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'pending'
              ? 'bg-white text-emerald-700 shadow-xs border border-[#E7EAF0]'
              : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
          >
            Pending Review ({users.filter((u) => (u.verificationStatus || 'pending') === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'approved'
              ? 'bg-white text-emerald-700 shadow-xs border border-[#E7EAF0]'
              : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
          >
            Approved ({users.filter((u) => u.verificationStatus === 'approved').length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'rejected'
              ? 'bg-white text-rose-700 shadow-xs border border-[#E7EAF0]'
              : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
          >
            Rejected ({users.filter((u) => u.verificationStatus === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by organization name, email, or contact person..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm text-[#0F172A] focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Verification Queue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading real verification data...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No requests in this queue</h3>
            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
              There are currently no verification submissions matching your selected filter.
            </p>
          </div>
        ) : (
          filteredUsers.map((item) => {
            const role = item.user_role || item.role || 'donor';
            return (
              <div
                key={item._id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card hover:border-emerald-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-2xl shrink-0 ${
                    role === 'ngo' ? 'bg-amber-50 border border-amber-100' :
                    role === 'volunteer' ? 'bg-blue-50 border border-blue-100' :
                    'bg-emerald-50 border border-emerald-100'
                  }`}>
                    <img
                      src={role === 'ngo' ? '/imgs/ngo.png' : role === 'volunteer' ? '/imgs/volunteer.png' : '/imgs/donor.png'}
                      alt={role}
                      className="w-7 h-7 object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-[#0F172A] text-base sm:text-lg">
                        {item.organizationName || item.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        role === 'ngo' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        role === 'volunteer' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        <img
                          src={role === 'ngo' ? '/imgs/ngo.png' : role === 'volunteer' ? '/imgs/volunteer.png' : '/imgs/donor.png'}
                          alt={role}
                          className="w-3.5 h-3.5 object-contain"
                        />
                        <span>{role === 'ngo' ? 'NGO Hub' : role === 'volunteer' ? 'Volunteer' : 'Food Donor'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Contact: <strong className="text-[#0F172A]">{item.name}</strong> • {item.email} • {item.phone || 'No phone'}
                    </p>

                    {item.verificationStatus === 'rejected' && item.rejectionReason && (
                      <p className="text-xs text-rose-600 font-medium pt-1">
                        <strong>Rejection Reason:</strong> {item.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Document Actions & Decision Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveDocModal(item)}
                    className="px-4 py-2.5 rounded-xl border border-[#E7EAF0] hover:bg-slate-50 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>View Uploaded Docs ({item.verificationDocs ? item.verificationDocs.length : 0})</span>
                  </button>

                  {item.verificationStatus === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionLoading === item._id}
                        onClick={() => handleApprove(item._id)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === item._id}
                        onClick={() => handleOpenRejectModal(item)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {item.verificationStatus === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified & Approved</span>
                    </span>
                  )}

                  {item.verificationStatus === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Rejected</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectModalUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E7EAF0] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Reject Verification Request
                </h3>
              </div>
              <button
                onClick={() => setRejectModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Provide a reason for rejecting <strong className="text-slate-900">{rejectModalUser.organizationName || rejectModalUser.name}</strong>. The donor will see this reason and be allowed to re-upload revised documents.
              </p>

              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  placeholder="e.g. Document illegible or expired. Please upload clear FSSAI Certificate."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalUser(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Preview Modal */}
      <FileViewerModal
        isOpen={!!activeDocModal}
        onClose={() => setActiveDocModal(null)}
        docs={activeDocModal?.verificationDocs || []}
        doc={activeDocModal}
        title={`Verification Documents - ${activeDocModal?.organizationName || activeDocModal?.name || ''}`}
        showPreview={true}
      />
    </div>
  );
};

export default AdminVerificationsPage;

