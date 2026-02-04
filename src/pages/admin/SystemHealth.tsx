//********************************************************************
//
// AdminSystemHealth Page
//
// System health monitoring page for viewing system status,
// logs, and job status.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { adminApi, SystemHealth, LogEntry } from '../../services/adminApi';
import './SystemHealth.css';
import './shared.css';

export default function AdminSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [jobs, setJobs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [logLevel, setLogLevel] = useState<'error' | 'warn' | 'info' | ''>('error');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHealth();
    loadLogs();
    loadJobs();
  }, [logLevel]);

  const loadHealth = async () => {
    try {
      const result = await adminApi.getSystemHealth();
      setHealth(result);
      setMessage(null);
    } catch (error) {
      console.error('Failed to load health:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to load system health');
    }
  };

  const loadLogs = async () => {
    try {
      const result = await adminApi.getLogs(logLevel || undefined, 100);
      setLogs(result);
      setMessage(null);
    } catch (error) {
      console.error('Failed to load logs:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to load logs');
    }
  };

  const loadJobs = async () => {
    try {
      const result = await adminApi.getJobs();
      setJobs(result);
      setMessage(null);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([loadHealth(), loadLogs(), loadJobs()]);
    setLoading(false);
  };

  return (
    <div className="admin-system-health">
      <div className="admin-health-header">
        <h2>System Health</h2>
        <button onClick={refreshAll} disabled={loading} className="admin-refresh-button">
          {loading ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {health && (
        <div className="admin-health-status">
          <div className={`admin-health-card ${health.status}`}>
            <h3>Overall Status</h3>
            <div className="admin-health-value">{health.status.toUpperCase()}</div>
          </div>
          <div className={`admin-health-card ${health.redis ? 'healthy' : 'unhealthy'}`}>
            <h3>Redis</h3>
            <div className="admin-health-value">{health.redis ? 'Connected' : 'Disconnected'}</div>
          </div>
          <div className={`admin-health-card ${health.s3 ? 'healthy' : 'unhealthy'}`}>
            <h3>S3</h3>
            <div className="admin-health-value">{health.s3 ? 'Connected' : 'Disconnected'}</div>
          </div>
          <div className="admin-health-card">
            <h3>Jobs</h3>
            <div className="admin-health-value">
              Running: {health.jobs.running} | Failed: {health.jobs.failed}
            </div>
          </div>
        </div>
      )}

      <div className="admin-health-section">
        <div className="admin-health-section-header">
          <h3>Recent Logs</h3>
          <select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value as 'error' | 'warn' | 'info' | '')}
            className="admin-log-filter"
          >
            <option value="">All Levels</option>
            <option value="error">Errors Only</option>
            <option value="warn">Warnings Only</option>
            <option value="info">Info Only</option>
          </select>
        </div>
        <div className="admin-logs-container">
          {logs.length === 0 ? (
            <div className="admin-empty-state">No logs found</div>
          ) : (
            <div className="admin-logs-list">
              {logs.map((log) => (
                <div key={log.id} className={`admin-log-entry ${log.level}`}>
                  <div className="admin-log-header">
                    <span className="admin-log-level">{log.level.toUpperCase()}</span>
                    <span className="admin-log-timestamp">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="admin-log-message">{log.message}</div>
                  {log.metadata && (
                    <pre className="admin-log-metadata">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-health-section">
        <h3>Job Status</h3>
        <div className="admin-jobs-container">
          {jobs.length === 0 ? (
            <div className="admin-empty-state">No jobs found</div>
          ) : (
            <div className="admin-jobs-list">
              {jobs.map((job: any, index) => (
                <div key={index} className="admin-job-entry">
                  <pre>{JSON.stringify(job, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

