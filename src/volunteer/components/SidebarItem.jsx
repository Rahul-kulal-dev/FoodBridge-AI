import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * SidebarItem component for Volunteer Navigation
 */
const SidebarItem = ({ icon: Icon, label, route, isCollapsed = false, badge, onClick }) => {
  return (
    <NavLink
      to={route}
      end={route === '/volunteer'}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) => `
        group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out select-none
        ${isCollapsed ? 'justify-center px-2 py-2.5' : ''}
        ${
          isActive
            ? 'bg-emerald-500/10 text-emerald-600 font-semibold shadow-xs border border-emerald-500/20'
            : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#f7f8fb] border border-transparent'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator bar */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full shadow-xs" />
          )}

          {/* Icon */}
          {Icon && (
            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-emerald-600'
                    : 'text-[#64748B] group-hover:text-emerald-600'
                }`}
              />
            </div>
          )}

          {/* Label */}
          {!isCollapsed && (
            <span className="truncate tracking-tight flex-1 transition-transform duration-200 group-hover:translate-x-0.5">
              {label}
            </span>
          )}

          {/* Badge */}
          {badge !== undefined && badge !== null && (
            <span
              className={`
                text-[11px] font-semibold transition-colors
                ${
                  isCollapsed
                    ? typeof badge === 'number'
                      ? 'absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[9px] bg-emerald-500 text-white font-bold shadow-xs'
                      : 'hidden'
                    : 'px-2 py-0.5 rounded-full ' +
                      (isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-[#64748B] group-hover:bg-emerald-50 group-hover:text-emerald-600')
                }
              `}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
