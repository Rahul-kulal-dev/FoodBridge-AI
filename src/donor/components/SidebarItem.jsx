import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * SidebarItem component for rendering navigation options
 * Pure White & Emerald Green Theme matching Landing Page:
 * Background: #ffffff, Active Wash: bg-emerald-500/10, Active Text: text-emerald-600, Border: #E7EAF0
 */
const SidebarItem = ({ icon: Icon, label, route, isCollapsed = false, badge, onClick }) => {
  return (
    <NavLink
      to={route}
      end={route === '/donor'}
      onClick={onClick}
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
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-500 rounded-r-full shadow-xs" />
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
                text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors
                ${
                  isCollapsed
                    ? 'absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]'
                    : ''
                }
                ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-[#64748B] group-hover:bg-emerald-50 group-hover:text-emerald-600'
                }
              `}
            >
              {badge}
            </span>
          )}

          {/* Collapsed White Tooltip */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-white text-[#0F172A] text-xs font-bold rounded-lg border border-[#E7EAF0] shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap">
              {label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white border-l border-b border-[#E7EAF0] rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
