//********************************************************************
//
// AdminDashboard Page
//
// Main dashboard page showing analytics and overview metrics.
// Displays key statistics and recent activity.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import UsersPerHourGraph from '../../components/admin/UsersPerHourGraph';
import './Dashboard.css';
import './shared.css';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingPhotos: number;
  flaggedPhotos: number;
  recentAudits: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [userStats, photos, auditLogs] = await Promise.all([
        adminApi.getUserStats(),
        adminApi.getPhotos('pending'),
        adminApi.getAuditLogs(10, 0),
      ]);

      setStats({
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        pendingPhotos: photos.length,
        flaggedPhotos: photos.filter((p) => p.status === 'flagged').length,
        recentAudits: auditLogs.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      // If it's an auth error, it will redirect automatically
      if (error instanceof Error && error.message.includes('Authentication expired')) {
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{stats?.totalUsers || 0}</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-label">Active Users (24h)</div>
          <div className="admin-stat-value">{stats?.activeUsers || 0}</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pending Photos</div>
          <div className="admin-stat-value">{stats?.pendingPhotos || 0}</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-label">Flagged Photos</div>
          <div className="admin-stat-value">{stats?.flaggedPhotos || 0}</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-label">Recent Audit Events</div>
          <div className="admin-stat-value">{stats?.recentAudits || 0}</div>
        </div>
      </div>

      <div className="admin-dashboard-section">
        <UsersPerHourGraph />
      </div>

      <div className="admin-dashboard-section">
        <h2>Quick Actions</h2>
        <div className="admin-quick-actions">
          <a href="/admin/photos?status=pending" className="admin-action-card">
            <span className="admin-action-label">Review Photos</span>
          </a>
          <a href="/admin/users" className="admin-action-card">
            <span className="admin-action-label">Manage Users</span>
          </a>
          <a href="/admin/audit" className="admin-action-card">
            <span className="admin-action-label">View Audit Logs</span>
          </a>
        </div>
      </div>
    </div>
  );
}

