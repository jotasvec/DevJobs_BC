import React from 'react'
import { NavLink } from '../router/Link.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { ROUTES, ROLES } from '../constants.js'
import Avatar from './Avatar.jsx'
import {
  FileText,
  Bookmark,
  UserCircle,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Code,
  LayoutDashboard,
} from 'lucide-react'

const menuItems = {
  [ROLES.SEEKER]: [
    { to: ROUTES.MY_APPLICATIONS, label: 'My Applications', icon: FileText },
    { to: ROUTES.SAVED_JOBS, label: 'Saved Jobs', icon: Bookmark },
    { to: ROUTES.PROFILE, label: 'My Profile', icon: UserCircle },
  ],
  [ROLES.RECRUITER]: [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { to: ROUTES.MY_JOBS, label: 'Job Postings', icon: Briefcase },
    { to: ROUTES.CREATE_JOB, label: 'Post a Job', icon: FileText },
    { to: ROUTES.COMPANY_PROFILE, label: 'Company Profile', icon: Building2 },
  ],
}

const Sidebar = ({ isOpen, onToggle, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth()
  const role = user?.role || ROLES.SEEKER
  const items = menuItems[role] || menuItems[ROLES.SEEKER]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={onToggle}
      />

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Header with logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {!collapsed && (
                <div className='flex'>
                    <Code size={20} />
                    <span className="sidebar-logo-text">DevJobs</span>
                </div>
            )}
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">
            {!collapsed && 'Navigation'}
          </div>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                href={item.to === ROUTES.PROFILE ? `${ROUTES.PROFILE}/${user.id}` : item.to}
                className="sidebar-link"
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer with user info and logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <Avatar username={user?.email?.split('@')[0] || 'user'} />
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || 'User'}</span>
                <span className="sidebar-user-role">{role}</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={18} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
