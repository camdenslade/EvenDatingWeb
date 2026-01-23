//********************************************************************
//
// AdminRateLimit Page
//
// Rate limit & abuse controls page for managing rate limit
// buckets, IP whitelisting/blacklisting, and abuse prevention.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { adminApi, RateLimitBucket } from '../../services/adminApi';
import './RateLimit.css';
import './shared.css';

export default function AdminRateLimit() {
  const [buckets, setBuckets] = useState<RateLimitBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState('');
  const [actionType, setActionType] = useState<'whitelist' | 'blacklist'>('whitelist');

  useEffect(() => {
    loadBuckets();
  }, []);

  const loadBuckets = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getRateLimitBuckets();
      setBuckets(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load rate limit buckets');
    } finally {
      setLoading(false);
    }
  };

  const handleClearBucket = async (key: string) => {
    setProcessing(key);
    try {
      await adminApi.clearRateLimitBucket(key);
      setMessage('Bucket cleared successfully');
      await loadBuckets();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to clear bucket');
    } finally {
      setProcessing(null);
    }
  };

  const handleIPAction = async () => {
    if (!ipAddress.trim()) {
      setMessage('Please enter an IP address');
      return;
    }

    setProcessing(ipAddress);
    try {
      if (actionType === 'whitelist') {
        await adminApi.whitelistIP(ipAddress);
        setMessage('IP whitelisted successfully');
      } else {
        await adminApi.blacklistIP(ipAddress);
        setMessage('IP blacklisted successfully');
      }
      setIpAddress('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to process IP action');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="admin-rate-limit">
      <div className="admin-rate-limit-header">
        <h2>Rate Limit & Abuse Controls</h2>
        <button onClick={loadBuckets} disabled={loading} className="admin-refresh-button">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-rate-limit-ip-controls">
        <h3>IP Management</h3>
        <div className="admin-ip-action-form">
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Enter IP address"
            className="admin-search-input"
          />
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value as 'whitelist' | 'blacklist')}
            className="admin-ip-action-select"
          >
            <option value="whitelist">Whitelist</option>
            <option value="blacklist">Blacklist</option>
          </select>
          <button
            onClick={handleIPAction}
            disabled={processing === ipAddress || !ipAddress.trim()}
            className="admin-search-button"
          >
            {processing === ipAddress ? 'Processing...' : 'Apply'}
          </button>
        </div>
      </div>

      <div className="admin-rate-limit-buckets">
        <h3>Rate Limit Buckets</h3>
        {loading ? (
          <div className="admin-loading">Loading buckets...</div>
        ) : buckets.length === 0 ? (
          <div className="admin-empty-state">No rate limit buckets found</div>
        ) : (
          <div className="admin-buckets-table-container">
            <table className="admin-buckets-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Type</th>
                  <th>Count</th>
                  <th>Limit</th>
                  <th>Reset At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buckets.map((bucket) => (
                  <tr key={bucket.key}>
                    <td className="admin-bucket-key">{bucket.key}</td>
                    <td>
                      <span className={`admin-bucket-type ${bucket.type}`}>
                        {bucket.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{bucket.count}</td>
                    <td>{bucket.limit}</td>
                    <td>{new Date(bucket.resetAt).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleClearBucket(bucket.key)}
                        disabled={processing === bucket.key}
                        className="admin-bucket-button"
                      >
                        {processing === bucket.key ? 'Clearing...' : 'Clear'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

