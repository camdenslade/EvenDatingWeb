//********************************************************************
//
// AdminQueue Page
//
// Queue & discovery debug page for inspecting swipe queues
// and rebuilding them for users.
//
//*******************************************************************

import { useState } from 'react';
import { adminApi, QueueInfo } from '../../services/adminApi';
import './Queue.css';
import './shared.css';

export default function AdminQueue() {
  const [userUid, setUserUid] = useState('');
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLoadQueue = async () => {
    if (!userUid.trim()) {
      setMessage('Please enter a user UID');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const result = await adminApi.getQueue(userUid);
      setQueueInfo(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load queue');
      setQueueInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildQueue = async () => {
    if (!userUid.trim()) {
      setMessage('Please enter a user UID');
      return;
    }

    setProcessing(true);
    setMessage(null);
    try {
      const result = await adminApi.rebuildQueue(userUid);
      setQueueInfo(result);
      setMessage('Queue rebuilt successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to rebuild queue');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="admin-queue">
      <div className="admin-queue-header">
        <h2>Queue & Discovery Debug</h2>
      </div>

      <div className="admin-queue-search">
        <div className="admin-search-form">
          <input
            type="text"
            value={userUid}
            onChange={(e) => setUserUid(e.target.value)}
            placeholder="Enter User UID to inspect queue..."
            className="admin-search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadQueue();
            }}
          />
          <button onClick={handleLoadQueue} disabled={loading} className="admin-search-button">
            {loading ? 'Loading...' : 'Load Queue'}
          </button>
          <button
            onClick={handleRebuildQueue}
            disabled={processing || !userUid.trim()}
            className="admin-search-button rebuild"
          >
            {processing ? 'Rebuilding...' : 'Rebuild Queue'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {queueInfo && (
        <div className="admin-queue-info">
          <div className="admin-queue-details">
            <h3>Queue Information</h3>
            <div className="admin-info-row">
              <span className="admin-info-label">User UID:</span>
              <span className="admin-info-value admin-uid-value">{queueInfo.uid}</span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Candidates:</span>
              <span className="admin-info-value">{queueInfo.candidates?.length || 0}</span>
            </div>
          </div>

          {queueInfo.filters != null && (
            <div className="admin-queue-filters">
              <h3>Filter Information</h3>
              <pre className="admin-queue-filter-data">
                {JSON.stringify(queueInfo.filters as Record<string, unknown>, null, 2)}
              </pre>
            </div>
          )}

          {queueInfo.candidates && queueInfo.candidates.length > 0 && (
            <div className="admin-queue-candidates">
              <h3>Candidates ({queueInfo.candidates.length})</h3>
              <div className="admin-candidates-list">
                {queueInfo.candidates.map((candidate: any, index: number) => (
                  <div key={index} className="admin-candidate-item">
                    <pre>{JSON.stringify(candidate, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!queueInfo && !loading && (
        <div className="admin-empty-state">
          Enter a user UID and click "Load Queue" to inspect their swipe queue
        </div>
      )}
    </div>
  );
}

