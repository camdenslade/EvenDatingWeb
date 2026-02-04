//********************************************************************
//
// AdminConfigFlags Page
//
// Config flags management page for toggling feature flags
// and managing rollout percentages.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { adminApi, FeatureFlag, PaymentFlags } from '../../services/adminApi';
import './ConfigFlags.css';
import './shared.css';

export default function AdminConfigFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [rolloutPercent, setRolloutPercent] = useState(0);
  const [paymentFlags, setPaymentFlags] = useState<PaymentFlags>({
    enablePayments: true,
    enableSearchTokens: true,
    enableUndoTokens: true,
    enableMessageReqTokens: true,
  });
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentSaving, setPaymentSaving] = useState(false);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    setLoading(true);
    setPaymentLoading(true);
    try {
      const result = await adminApi.getFeatureFlags();
      const payments = await adminApi.getPaymentFlags();
      setFlags(result);
      setPaymentFlags(payments);
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load feature flags');
    } finally {
      setLoading(false);
      setPaymentLoading(false);
    }
  };

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setEnabled(flag.enabled);
    setRolloutPercent(flag.rolloutPercent || 0);
  };

  const handleSave = async () => {
    if (!editingFlag) return;

    setProcessing(editingFlag.key);
    try {
      await adminApi.updateFeatureFlag(
        editingFlag.key,
        enabled,
        rolloutPercent > 0 ? rolloutPercent : undefined
      );
      setMessage('Feature flag updated successfully');
      await loadFlags();
      setEditingFlag(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update feature flag');
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = () => {
    setEditingFlag(null);
    setEnabled(false);
    setRolloutPercent(0);
  };

  const handleSavePayments = async () => {
    setPaymentSaving(true);
    setMessage(null);
    try {
      await adminApi.updatePaymentFlags(paymentFlags);
      setMessage('Payment flags updated successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update payment flags');
    } finally {
      setPaymentSaving(false);
    }
  };

  return (
    <div className="admin-config-flags">
      <div className="admin-config-flags-header">
        <h2>Feature Flags</h2>
        <button onClick={loadFlags} disabled={loading} className="admin-refresh-button">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-flag-card">
        <div className="admin-flag-header">
          <h3>Payments (global)</h3>
          <span className={`admin-flag-status ${paymentFlags.enablePayments ? 'enabled' : 'disabled'}`}>
            {paymentFlags.enablePayments ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        {paymentLoading ? (
          <div className="admin-loading">Loading payments...</div>
        ) : (
          <>
            <div className="admin-payments-grid">
              <label className="admin-toggle-row">
                <input
                  type="checkbox"
                  checked={paymentFlags.enablePayments}
                  onChange={(e) => setPaymentFlags({ ...paymentFlags, enablePayments: e.target.checked })}
                />
                Enable Payments (master switch)
              </label>
              <label className="admin-toggle-row">
                <input
                  type="checkbox"
                  checked={paymentFlags.enableSearchTokens}
                  onChange={(e) => setPaymentFlags({ ...paymentFlags, enableSearchTokens: e.target.checked })}
                />
                Enforce Search Tokens
              </label>
              <label className="admin-toggle-row">
                <input
                  type="checkbox"
                  checked={paymentFlags.enableUndoTokens}
                  onChange={(e) => setPaymentFlags({ ...paymentFlags, enableUndoTokens: e.target.checked })}
                />
                Enforce Undo Tokens
              </label>
              <label className="admin-toggle-row">
                <input
                  type="checkbox"
                  checked={paymentFlags.enableMessageReqTokens}
                  onChange={(e) => setPaymentFlags({ ...paymentFlags, enableMessageReqTokens: e.target.checked })}
                />
                Enforce Message Request Tokens
              </label>
            </div>
            <div className="admin-flag-modal-actions">
              <button
                onClick={handleSavePayments}
                disabled={paymentSaving || paymentLoading}
                className="admin-grant-button"
              >
                {paymentSaving ? 'Saving...' : 'Save Payments'}
              </button>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="admin-loading">Loading feature flags...</div>
      ) : flags.length === 0 ? (
        <div className="admin-empty-state">No feature flags found</div>
      ) : (
        <div className="admin-flags-grid">
          {flags.map((flag) => (
            <div key={flag.key} className="admin-flag-card">
              <div className="admin-flag-header">
                <h3>{flag.key}</h3>
                <span className={`admin-flag-status ${flag.enabled ? 'enabled' : 'disabled'}`}>
                  {flag.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {flag.rolloutPercent !== undefined && (
                <div className="admin-flag-rollout">
                  Rollout: {flag.rolloutPercent}%
                </div>
              )}
              <button
                onClick={() => handleEdit(flag)}
                className="admin-flag-edit-button"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {editingFlag && (
        <div className="admin-flag-modal">
          <div className="admin-flag-modal-content">
            <h3>Edit Feature Flag: {editingFlag.key}</h3>
            <div className="admin-flag-edit-form">
              <div className="admin-grant-field">
                <label>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  Enabled
                </label>
              </div>
              <div className="admin-grant-field">
                <label>Rollout Percentage (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rolloutPercent}
                  onChange={(e) => setRolloutPercent(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="admin-flag-modal-actions">
                <button
                  onClick={handleSave}
                  disabled={processing === editingFlag.key}
                  className="admin-grant-button"
                >
                  {processing === editingFlag.key ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={processing === editingFlag.key}
                  className="admin-flag-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

