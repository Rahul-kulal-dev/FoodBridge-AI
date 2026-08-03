import React from 'react';
import { LogOut, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * SidebarProfile component for Volunteer Module
 */
const SidebarProfile = ({
  isCollapsed = false,
  user = {
    name: 'Alex Johnson',
    email: 'alex.j@foodbridge.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    verificationStatus: 'Verified Courier',
  },
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  return (
    <div className={`mt-auto border-t border-[#E7EAF0] pt-3.5 pb-3 transition-all duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
      {isCollapsed ? (
        /* Collapsed Profile View */
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate('/volunteer/profile')}
            title={`${user.name} (${user.email}) - ${user.verificationStatus}`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
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
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#0F172A] truncate">
                {user.name}
              </h4>
              <p className="text-[11px] text-[#64748B] truncate">
                {user.email}
              </p>

              <div className="mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                  Verified Courier
                </span>
              </div>
            </div>
          </div>

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
