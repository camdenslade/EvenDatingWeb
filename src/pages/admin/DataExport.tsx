//********************************************************************
//
// AdminDataExport Page
//
// Data export (DSAR-lite) page for exporting user data bundles
// and checking export job status.
//
//*******************************************************************

import { useState } from 'react';
import { adminApi } from '../../services/adminApi';
import './DataExport.css';
import './shared.css';

export default function AdminDataExport() {
  const [userUid, setUserUid] = useState('');
  const [jobId, setJobId] = useState('');
  const [exportStatus, setExportStatus] = useState<{
    status: 'pending' | 'completed' | 'failed';
    downloadUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = async () => {
    if (!userUid.trim()) {
      setMessage('Please enter a user UID');
      return;
    }

    setProcessing(true);
    setMessage(null);
    try {
      const result = await adminApi.exportUserData(userUid);
      setJobId(result.jobId);
      setMessage('Export job started. Check status below.');
      setExportStatus({ status: 'pending' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to start export');
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!userUid.trim() || !jobId.trim()) {
      setMessage('Please enter both user UID and job ID');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const status = await adminApi.getExportStatus(userUid, jobId);
      setExportStatus(status);
      if (status.status === 'completed' && status.downloadUrl) {
        setMessage('Export completed! Download link available.');
      } else if (status.status === 'failed') {
        setMessage('Export job failed');
      } else {
        setMessage('Export is still processing...');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to check export status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-data-export">
      <div className="admin-data-export-header">
        <h2>Data Export (DSAR-lite)</h2>
        <p className="admin-data-export-description">
          Export user data bundles for data subject access requests (DSAR).
        </p>
      </div>

      <div className="admin-data-export-actions">
        <div className="admin-export-form">
          <div className="admin-grant-field">
            <label>User UID</label>
            <input
              type="text"
              value={userUid}
              onChange={(e) => setUserUid(e.target.value)}
              placeholder="Enter user UID"
              className="admin-search-input"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={processing || !userUid.trim()}
            className="admin-grant-button"
          >
            {processing ? 'Starting Export...' : 'Start Export'}
          </button>
        </div>

        <div className="admin-export-status-form">
          <div className="admin-grant-field">
            <label>User UID</label>
            <input
              type="text"
              value={userUid}
              onChange={(e) => setUserUid(e.target.value)}
              placeholder="Enter user UID"
              className="admin-search-input"
            />
          </div>
          <div className="admin-grant-field">
            <label>Job ID</label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter job ID"
              className="admin-search-input"
            />
          </div>
          <button
            onClick={handleCheckStatus}
            disabled={loading || !userUid.trim() || !jobId.trim()}
            className="admin-grant-button"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') || message.includes('completed') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {exportStatus && (
        <div className="admin-export-status">
          <h3>Export Status</h3>
          <div className="admin-export-status-info">
            <div className="admin-info-row">
              <span className="admin-info-label">Status:</span>
              <span className={`admin-export-status-badge ${exportStatus.status}`}>
                {exportStatus.status.toUpperCase()}
              </span>
            </div>
            {exportStatus.downloadUrl && (
              <div className="admin-info-row">
                <span className="admin-info-label">Download:</span>
                <a
                  href={exportStatus.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-export-download-link"
                >
                  Download Data Bundle
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

