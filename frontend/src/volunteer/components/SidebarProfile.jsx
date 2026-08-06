import React from 'react';
import { LogOut, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * SidebarProfile component for Volunteer Module
 * Reads real MongoDB profile from AuthContext.
 */
const SidebarProfile = ({ isCollapsed = false, onLogout }) => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const user = authUser || { name: 'Volunteer Courier', email: '' };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/');
    }
  };

  const displayName = user.name || 'Volunteer Courier';
  const email = user.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className={`mt-auto border-t border-[#E7EAF0] pt-3.5 pb-3 transition-all duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
      {isCollapsed ? (
        /* Collapsed Profile View */
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleLogoutClick}
            title="Sign Out"
            className="w-9 h-9 rounded-xl text-white bg-rose-600 hover:bg-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div
            className="relative group cursor-pointer"
            onClick={() => navigate('/volunteer/profile')}
            title={`${displayName} (${email})`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-500/30">
              {avatarLetter}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        </div>
      ) : (
        /* Expanded Profile View */
        <div className="flex flex-col gap-3">
          {/* Sign Out Button with Red Background at Top */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f7f8fb] border border-[#E7EAF0]">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-500/20 shadow-xs">
                {avatarLetter}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#0F172A] truncate">
                {displayName}
              </h4>
              <p className="text-[11px] text-[#64748B] truncate">
                {email}
              </p>

              <div className="mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                  Verified Courier
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarProfile;
