import React from 'react';
import { LogOut, BadgeCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * SidebarProfile component for the bottom section of the NGO Sidebar
 * Connects directly to AuthContext & MongoDB user profile.
 */
const SidebarProfile = ({ isCollapsed = false, onLogout }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/');
    }
  };

  const displayName = user?.organizationName || user?.name || 'NGO Partner';
  const email = user?.email || '';
  const isVerified = user?.verificationStatus === 'approved';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className={`mt-auto border-t border-[#E7EAF0] pt-3.5 pb-3 transition-all duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
      {isCollapsed ? (
        /* Collapsed Profile View */
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate('/ngo/profile')}
            title={`${displayName} (${email}) - ${isVerified ? 'Verified' : 'Pending'}`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-500/30">
              {avatarLetter}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                isVerified ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>

          <button
            onClick={handleLogoutClick}
            title="Sign Out"
            className="p-2 rounded-xl text-[#64748B] hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>
      ) : (
        /* Expanded Profile View */
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f7f8fb] border border-[#E7EAF0]">
            {/* User Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black text-base flex items-center justify-center ring-2 ring-emerald-500/20">
                {avatarLetter}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  isVerified ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[#0F172A] truncate">
                  {displayName}
                </h4>
              </div>
              <p className="text-[11px] text-[#64748B] truncate">
                {email}
              </p>

              {/* Verification Badge */}
              <div className="mt-1">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <BadgeCheck className="w-3 h-3 text-emerald-600" />
                    Verified NGO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Pending Verification
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200/60 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#64748B] group-hover:text-emerald-600" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarProfile;
