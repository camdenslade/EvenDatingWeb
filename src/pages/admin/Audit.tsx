//********************************************************************
//
// AdminAudit Page
//
// Audit logs viewer page for viewing system audit events and
// admin actions.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { adminApi, AuditEvent } from '../../services/adminApi';
import './Audit.css';
import './shared.css';

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getAuditLogs(100, page * 100);
      if (result.length === 0) {
        setHasMore(false);
      } else {
        if (page === 0) {
          setLogs(result);
        } else {
          setLogs((prev) => [...prev, ...result]);
        }
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="admin-audit">
      <div className="admin-audit-header">
        <h2>Audit Logs</h2>
        <button onClick={() => { setPage(0); loadLogs(); }} className="admin-refresh-button">
          Refresh
        </button>
      </div>

      {loading && logs.length === 0 ? (
        <div className="admin-loading">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="admin-empty-state">No audit logs found</div>
      ) : (
        <>
          <div className="admin-audit-table-container">
            <table className="admin-audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event</th>
                  <th>Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="admin-audit-timestamp">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="admin-audit-event">{log.event}</td>
                    <td className="admin-audit-payload">
                      <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hasMore && (
            <div className="admin-audit-load-more">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="admin-load-more-button"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

