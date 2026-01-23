//********************************************************************
//
// AdminPhotos Page
//
// Photo moderation queue page for reviewing and approving/rejecting
// user profile photos.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoTrashOutline } from 'react-icons/io5';
import { adminApi, ProfilePhoto } from '../../services/adminApi';
import './Photos.css';
import './shared.css';

export default function AdminPhotos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'pending';
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showRequeueModal, setShowRequeueModal] = useState<string | null>(null);
  const [requeueTarget, setRequeueTarget] = useState<'vision' | 'human'>('human');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [statusFilter]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const validStatus = ['pending', 'flagged', 'rejected', 'approved'].includes(statusFilter)
        ? (statusFilter as 'pending' | 'flagged' | 'rejected' | 'approved')
        : undefined;
      const result = await adminApi.getPhotos(validStatus);
      setPhotos(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, reasonInput: HTMLInputElement | null, confidenceInput: HTMLInputElement | null) => {
    setProcessing(id);
    setMessage(null);
    try {
      const reason = reasonInput?.value.trim() || undefined;
      const confidence = confidenceInput?.value ? parseInt(confidenceInput.value) || 100 : undefined;
      await adminApi.approvePhoto(id, reason, confidence);
      setMessage('Photo approved');
      if (reasonInput) reasonInput.value = '';
      if (confidenceInput) confidenceInput.value = '';
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to approve photo');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string, reasonInput: HTMLInputElement | null, confidenceInput: HTMLInputElement | null) => {
    setProcessing(id);
    setMessage(null);
    try {
      const reason = reasonInput?.value.trim() || undefined;
      const confidence = confidenceInput?.value ? parseInt(confidenceInput.value) || 100 : undefined;
      await adminApi.rejectPhoto(id, reason, confidence);
      setMessage('Photo rejected');
      if (reasonInput) reasonInput.value = '';
      if (confidenceInput) confidenceInput.value = '';
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to reject photo');
    } finally {
      setProcessing(null);
    }
  };

  const handleRequeue = async (id: string) => {
    if (!showRequeueModal) return;
    setProcessing(id);
    try {
      await adminApi.requeuePhoto(id, requeueTarget);
      setMessage(`Photo requeued to ${requeueTarget}`);
      setShowRequeueModal(null);
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to requeue photo');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!showDeleteModal) return;
    setProcessing(id);
    setMessage(null);
    try {
      await adminApi.deletePhoto(id);
      setMessage('Photo deleted successfully');
      setShowDeleteModal(null);
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete photo');
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedPhotos.size === 0) {
      setMessage('Please select at least one photo');
      return;
    }

    setProcessing('bulk');
    try {
      await adminApi.bulkPhotoAction(Array.from(selectedPhotos), action);
      setMessage(`Bulk ${action} completed for ${selectedPhotos.size} photos`);
      setSelectedPhotos(new Set());
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to perform bulk action');
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) {
      setMessage('Please select at least one photo');
      return;
    }

    setProcessing('bulk-delete');
    setMessage(null);
    try {
      await adminApi.bulkDeletePhotos(Array.from(selectedPhotos));
      setMessage(`Successfully deleted ${selectedPhotos.size} photos`);
      setSelectedPhotos(new Set());
      setShowBulkDeleteModal(false);
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete photos');
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id)));
    }
  };

  const statusFilters = [
    { value: 'pending', label: 'Pending' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="admin-photos">
      <div className="admin-photos-header">
        <div className="admin-photos-filters">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('status', filter.value);
                setSearchParams(newParams);
              }}
              className={`admin-filter-button ${
                statusFilter === filter.value ? 'active' : ''
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="admin-photos-header-actions">
          {selectedPhotos.size > 0 && (
            <div className="admin-bulk-actions">
              <span className="admin-selected-count">{selectedPhotos.size} selected</span>
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={processing === 'bulk' || processing === 'bulk-delete'}
                className="admin-bulk-button approve"
              >
                Bulk Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={processing === 'bulk' || processing === 'bulk-delete'}
                className="admin-bulk-button reject"
              >
                Bulk Reject
              </button>
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                disabled={processing === 'bulk' || processing === 'bulk-delete'}
                className="admin-bulk-button delete"
              >
                Bulk Delete
              </button>
            </div>
          )}
          <button onClick={loadPhotos} className="admin-refresh-button">
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') || message.includes('approved') || message.includes('rejected') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading photos...</div>
      ) : photos.length === 0 ? (
        <div className="admin-empty-state">No photos found</div>
      ) : (
        <>
          <div className="admin-photos-controls">
            <button onClick={handleSelectAll} className="admin-select-all-button">
              {selectedPhotos.size === photos.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="admin-photos-grid">
            {photos.map((photo) => (
              <div key={photo.id} className={`admin-photo-card ${selectedPhotos.has(photo.id) ? 'selected' : ''}`}>
                <div className="admin-photo-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.has(photo.id)}
                    onChange={() => handleToggleSelect(photo.id)}
                  />
                </div>
                <div className="admin-photo-image-container">
                  <img
                    src={photo.url}
                    alt={`Photo ${photo.id}`}
                    className="admin-photo-image"
                    onError={(e) => {
                      // Use a transparent 1x1 pixel as fallback if image fails to load
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="admin-photo-info">
                  <div className="admin-photo-meta">
                    <div className="admin-photo-id">ID: {photo.id.substring(0, 8)}...</div>
                    <div className="admin-photo-status">{photo.status}</div>
                  </div>
                  {photo.reason && (
                    <div className="admin-photo-reason">Reason: {photo.reason}</div>
                  )}
                  <div className="admin-photo-date">
                    {new Date(photo.createdAt).toLocaleString()}
                  </div>
                  {photo.status === 'pending' || photo.status === 'flagged' ? (
                    <div className="admin-photo-actions">
                      <div className="admin-photo-action-group">
                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          className="admin-photo-reason-input"
                          data-photo-id={photo.id}
                          data-input-type="approve-reason"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Confidence %"
                          defaultValue="100"
                          className="admin-photo-confidence-input"
                          data-photo-id={photo.id}
                          data-input-type="confidence"
                        />
                        <button
                          onClick={(e) => {
                            const card = e.currentTarget.closest('.admin-photo-card');
                            const reasonInput = card?.querySelector('[data-input-type="approve-reason"]') as HTMLInputElement;
                            const confidenceInput = card?.querySelector('[data-input-type="confidence"]') as HTMLInputElement;
                            handleApprove(photo.id, reasonInput, confidenceInput);
                          }}
                          disabled={processing === photo.id}
                          className="admin-photo-button approve"
                        >
                          {processing === photo.id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                      <div className="admin-photo-action-group">
                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          className="admin-photo-reason-input"
                          data-photo-id={photo.id}
                          data-input-type="reject-reason"
                        />
                        <button
                          onClick={(e) => {
                            const card = e.currentTarget.closest('.admin-photo-card');
                            const reasonInput = card?.querySelector('[data-input-type="reject-reason"]') as HTMLInputElement;
                            const confidenceInput = card?.querySelector('[data-input-type="confidence"]') as HTMLInputElement;
                            handleReject(photo.id, reasonInput, confidenceInput);
                          }}
                          disabled={processing === photo.id}
                          className="admin-photo-button reject"
                        >
                          {processing === photo.id ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                      <button
                        onClick={() => setShowRequeueModal(photo.id)}
                        disabled={processing === photo.id}
                        className="admin-photo-button requeue"
                      >
                        Requeue
                      </button>
                    </div>
                  ) : (
                    <div className="admin-photo-actions">
                      <button
                        onClick={() => setShowRequeueModal(photo.id)}
                        disabled={processing === photo.id}
                        className="admin-photo-button requeue"
                      >
                        Requeue
                      </button>
                      {photo.status === 'rejected' && (
                        <button
                          onClick={() => setShowDeleteModal(photo.id)}
                          disabled={processing === photo.id}
                          className="admin-photo-button delete"
                        >
                          <IoTrashOutline /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {showRequeueModal && (
        <div className="admin-requeue-modal">
          <div className="admin-requeue-modal-content">
            <h3>Requeue Photo</h3>
            <div className="admin-grant-field">
              <label>Queue Target</label>
              <select
                value={requeueTarget}
                onChange={(e) => setRequeueTarget(e.target.value as 'vision' | 'human')}
              >
                <option value="vision">Vision API</option>
                <option value="human">Human Review</option>
              </select>
            </div>
            <div className="admin-requeue-modal-actions">
              <button
                onClick={() => handleRequeue(showRequeueModal)}
                disabled={processing === showRequeueModal}
                className="admin-grant-button"
              >
                {processing === showRequeueModal ? 'Requeuing...' : 'Requeue'}
              </button>
              <button
                onClick={() => {
                  setShowRequeueModal(null);
                  setRequeueTarget('human');
                }}
                className="admin-flag-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-requeue-modal">
          <div className="admin-requeue-modal-content">
            <h3>Delete Photo</h3>
            <p>Are you sure you want to permanently delete this photo? This action cannot be undone.</p>
            <div className="admin-requeue-modal-actions">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={processing === showDeleteModal}
                className="admin-photo-button delete"
              >
                {processing === showDeleteModal ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(null);
                }}
                className="admin-flag-cancel-button"
                disabled={processing === showDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteModal && (
        <div className="admin-requeue-modal">
          <div className="admin-requeue-modal-content">
            <h3>Bulk Delete Photos</h3>
            <p>
              Are you sure you want to permanently delete {selectedPhotos.size} selected photo(s)? 
              This action cannot be undone.
            </p>
            <div className="admin-requeue-modal-actions">
              <button
                onClick={handleBulkDelete}
                disabled={processing === 'bulk-delete'}
                className="admin-photo-button delete"
              >
                {processing === 'bulk-delete' ? 'Deleting...' : `Delete ${selectedPhotos.size} Photos`}
              </button>
              <button
                onClick={() => {
                  setShowBulkDeleteModal(false);
                }}
                className="admin-flag-cancel-button"
                disabled={processing === 'bulk-delete'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

