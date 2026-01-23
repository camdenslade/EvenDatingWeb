//********************************************************************
//
// AdminLayout Component
//
// AWS-style dashboard layout with sidebar navigation. Provides
// consistent layout for all admin pages.
//
//*******************************************************************

import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import GlobalBackground from '../GlobalBackground';
import {
  IoGridOutline,
  IoPeopleOutline,
  IoShieldOutline,
  IoImageOutline,
  IoWarningOutline,
  IoStarOutline,
  IoChatbubblesOutline,
  IoFlashOutline,
  IoSearchOutline,
  IoDocumentTextOutline,
  IoWalletOutline,
  IoFlagOutline,
  IoDownloadOutline,
  IoCheckmarkCircleOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState<'dark' | 'light'>('dark');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: IoGridOutline },
    { path: '/admin/admins', label: 'Admins', icon: IoShieldOutline },
    { path: '/admin/users', label: 'Users', icon: IoPeopleOutline },
    { path: '/admin/photos', label: 'Photo Moderation', icon: IoImageOutline },
    { path: '/admin/reports', label: 'Content Reports', icon: IoWarningOutline },
    { path: '/admin/reviews', label: 'Reviews & Strikes', icon: IoStarOutline },
    { path: '/admin/matches', label: 'Matches & Chats', icon: IoChatbubblesOutline },
    { path: '/admin/rate-limit', label: 'Rate Limits', icon: IoFlashOutline, hidden: true },
    { path: '/admin/queue', label: 'Queue Debug', icon: IoSearchOutline },
    { path: '/admin/audit', label: 'Audit Logs', icon: IoDocumentTextOutline },
    { path: '/admin/tokens', label: 'Token Management', icon: IoWalletOutline },
    { path: '/admin/config-flags', label: 'Config Flags', icon: IoFlagOutline, hidden: true },
    { path: '/admin/data-export', label: 'Data Export', icon: IoDownloadOutline, hidden: true },
    { path: '/admin/health', label: 'System Health', icon: IoCheckmarkCircleOutline, hidden: true },
  ];

  return (
    <div className={`admin-layout ${backgroundMode === 'light' ? 'light-mode' : ''}`}>
      <GlobalBackground mode={backgroundMode} />
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Console</h2>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <IoChevronBackOutline size={16} /> : <IoChevronForwardOutline size={16} />}
          </button>
        </div>
        
        <nav className="admin-sidebar-nav">
          {navItems.filter((item) => !item.hidden).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="admin-nav-icon">
                <item.icon size={20} />
              </span>
              {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            {sidebarOpen && (
              <>
                <div className="admin-user-email">{user?.email}</div>
                <button onClick={handleLogout} className="admin-logout-button">
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
      
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-page-title">
            {navItems.find((item) => item.path === location.pathname)?.label || 'Admin'}
          </h1>
          <div className="admin-header-actions">
            <button
              className="admin-theme-toggle"
              onClick={() => setBackgroundMode(backgroundMode === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${backgroundMode === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${backgroundMode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {backgroundMode === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
            </button>
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

