//********************************************************************
//
// AdminReports Page
//
// Content reports management page for viewing and resolving
// user reports of inappropriate content or behavior.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi, ContentReport } from '../../services/adminApi';
import './Reports.css';
import './shared.css';

export default function AdminReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'open';
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'warn' | 'suspend' | 'delete'>('warn');
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getReports(statusFilter as 'open' | 'triaged' | 'closed');
      setReports(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = async (reportId: string) => {
    try {
      const report = await adminApi.getReport(reportId);
      setSelectedReport(report);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load report details');
    }
  };

  const handleAssign = async (reportId: string, assignedTo: string) => {
    setProcessing(reportId);
    try {
      await adminApi.updateReport(reportId, { assignedTo });
      setMessage('Report assigned successfully');
      await loadReports();
      if (selectedReport?.id === reportId) {
        const updated = await adminApi.getReport(reportId);
        setSelectedReport(updated);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to assign report');
    } finally {
      setProcessing(null);
    }
  };

  const handleResolve = async (reportId: string) => {
    if (!resolutionNotes.trim()) {
      setMessage('Please provide resolution notes');
      return;
    }

    setProcessing(reportId);
    try {
      await adminApi.resolveReport(reportId, resolutionAction, resolutionNotes);
      setMessage('Report resolved successfully');
      setResolutionNotes('');
      await loadReports();
      setSelectedReport(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to resolve report');
    } finally {
      setProcessing(null);
    }
  };

  const statusFilters = [
    { value: 'open', label: 'Open' },
    { value: 'triaged', label: 'Triaged' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="admin-reports">
      <div className="admin-reports-header">
        <div className="admin-reports-filters">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSearchParams({ status: filter.value })}
              className={`admin-filter-button ${
                statusFilter === filter.value ? 'active' : ''
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button onClick={loadReports} className="admin-refresh-button">
          Refresh
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-reports-layout">
        <div className="admin-reports-list">
          <h3>Reports</h3>
          {loading ? (
            <div className="admin-loading">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="admin-empty-state">No reports found</div>
          ) : (
            <div className="admin-reports-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Target</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => handleSelectReport(report.id)}
                      className={selectedReport?.id === report.id ? 'selected' : ''}
                    >
                      <td className="admin-report-id">{report.id.substring(0, 8)}...</td>
                      <td>{report.type}</td>
                      <td>
                        <span className={`admin-report-status ${report.status}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="admin-uid-cell">{report.reporterUid.substring(0, 8)}...</td>
                      <td className="admin-uid-cell">{report.targetUid.substring(0, 8)}...</td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedReport && (
          <div className="admin-report-details">
            <h3>Report Details</h3>
            <div className="admin-report-info">
              <div className="admin-info-row">
                <span className="admin-info-label">ID:</span>
                <span className="admin-info-value">{selectedReport.id}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Type:</span>
                <span className="admin-info-value">{selectedReport.type}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Status:</span>
                <span className="admin-info-value">{selectedReport.status}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Reporter:</span>
                <span className="admin-info-value admin-uid-value">{selectedReport.reporterUid}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Target:</span>
                <span className="admin-info-value admin-uid-value">{selectedReport.targetUid}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Created:</span>
                <span className="admin-info-value">
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </span>
              </div>
              {selectedReport.assignedTo && (
                <div className="admin-info-row">
                  <span className="admin-info-label">Assigned To:</span>
                  <span className="admin-info-value">{selectedReport.assignedTo}</span>
                </div>
              )}
              {selectedReport.notes && (
                <div className="admin-info-row">
                  <span className="admin-info-label">Notes:</span>
                  <span className="admin-info-value">{selectedReport.notes}</span>
                </div>
              )}
            </div>

            {selectedReport.status !== 'closed' && (
              <div className="admin-report-actions">
                <div className="admin-grant-field">
                  <label>Assign To (Admin ID)</label>
                  <input
                    type="text"
                    placeholder="Admin ID"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAssign(selectedReport.id, e.currentTarget.value);
                      }
                    }}
                  />
                </div>

                <div className="admin-grant-field">
                  <label>Resolution Action</label>
                  <select
                    value={resolutionAction}
                    onChange={(e) => setResolutionAction(e.target.value as 'warn' | 'suspend' | 'delete')}
                  >
                    <option value="warn">Warn</option>
                    <option value="suspend">Suspend</option>
                    <option value="delete">Delete</option>
                  </select>
                </div>

                <div className="admin-grant-field">
                  <label>Resolution Notes</label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution notes..."
                    rows={4}
                  />
                </div>

                <button
                  onClick={() => handleResolve(selectedReport.id)}
                  disabled={processing === selectedReport.id || !resolutionNotes.trim()}
                  className="admin-grant-button"
                >
                  {processing === selectedReport.id ? 'Resolving...' : 'Resolve Report'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

