//********************************************************************
//
// AdminReviews Page
//
// Reviews & strikes management page for viewing and managing
// user reviews and strike issuance.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import { adminApi, Review } from '../../services/adminApi';
import './Reviews.css';
import './shared.css';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [targetUid, setTargetUid] = useState('');
  const [reviewerUid, setReviewerUid] = useState('');

  useEffect(() => {
    loadReviews();
  }, [targetUid, reviewerUid]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getReviews(
        targetUid || undefined,
        reviewerUid || undefined
      );
      setReviews(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id: string, currentApproved: boolean) => {
    setProcessing(id);
    try {
      await adminApi.updateReview(id, !currentApproved);
      setMessage('Review updated successfully');
      await loadReviews();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update review');
    } finally {
      setProcessing(null);
    }
  };

  const handleIssueStrike = async (id: string) => {
    setProcessing(id);
    try {
      await adminApi.issueStrike(id);
      setMessage('Strike issued successfully');
      await loadReviews();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to issue strike');
    } finally {
      setProcessing(null);
    }
  };

  const handleRemoveStrike = async (id: string) => {
    setProcessing(id);
    try {
      await adminApi.removeStrike(id);
      setMessage('Strike removed successfully');
      await loadReviews();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to remove strike');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="admin-reviews">
      <div className="admin-reviews-header">
        <div className="admin-reviews-filters">
          <input
            type="text"
            placeholder="Filter by Target UID"
            value={targetUid}
            onChange={(e) => setTargetUid(e.target.value)}
            className="admin-search-input"
          />
          <input
            type="text"
            placeholder="Filter by Reviewer UID"
            value={reviewerUid}
            onChange={(e) => setReviewerUid(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <button onClick={loadReviews} className="admin-refresh-button">
          Refresh
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty-state">No reviews found</div>
      ) : (
        <div className="admin-reviews-table-container">
          <table className="admin-reviews-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reviewer</th>
                <th>Target</th>
                <th>Rating</th>
                <th>Approved</th>
                <th>Strike</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="admin-review-id">{review.id.substring(0, 8)}...</td>
                  <td className="admin-uid-cell">{review.reviewerUid.substring(0, 8)}...</td>
                  <td className="admin-uid-cell">{review.targetUid.substring(0, 8)}...</td>
                  <td>{review.rating}/10</td>
                  <td>{review.approved ? 'Yes' : 'No'}</td>
                  <td>{review.strikeIssued ? 'Yes' : 'No'}</td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-review-actions">
                      <button
                        onClick={() => handleToggleApprove(review.id, review.approved)}
                        disabled={processing === review.id}
                        className="admin-review-button toggle"
                      >
                        {review.approved ? 'Reject' : 'Approve'}
                      </button>
                      {review.strikeIssued ? (
                        <button
                          onClick={() => handleRemoveStrike(review.id)}
                          disabled={processing === review.id}
                          className="admin-review-button remove"
                        >
                          Remove Strike
                        </button>
                      ) : (
                        <button
                          onClick={() => handleIssueStrike(review.id)}
                          disabled={processing === review.id}
                          className="admin-review-button issue"
                        >
                          Issue Strike
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

