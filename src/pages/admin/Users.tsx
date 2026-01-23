//********************************************************************
//
// AdminUsers Page
//
// User management page for searching users, viewing details,
// and granting tokens/subscriptions.
//
//*******************************************************************

import { useState, FormEvent } from 'react';
import { adminApi, AdminUser, GrantDto, Review, UserProfile, UserFlags } from '../../services/adminApi';
import './Users.css';
import './shared.css';

interface UserWithRating extends AdminUser {
  rating?: number | null;
  sex?: string | null;
  displayName?: string | null;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithRating[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [grantLoading, setGrantLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [impersonationToken, setImpersonationToken] = useState<string | null>(null);
  const [grantForm, setGrantForm] = useState<GrantDto>({
    userUid: '',
    searchTokens: undefined,
    messageTokens: undefined,
    undoTokens: undefined,
    isSubscribed: undefined,
    subscriptionExpiresAt: undefined,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [strikeCount, setStrikeCount] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
  const [sentReviews, setSentReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [userFlags, setUserFlags] = useState<UserFlags | null>(null);
  const [userFlagsLoading, setUserFlagsLoading] = useState(false);
  const [userFlagsSaving, setUserFlagsSaving] = useState(false);

  const getDisplayName = (user: AdminUser | null) => {
    if (!user) return 'N/A';
    const candidate = user.name && user.name !== user.uid ? user.name : null;
    const email = user.email || null;
    return candidate || email || 'N/A';
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let results: AdminUser[];
      // Note: This assumes a search endpoint exists
      // For now, try to get user by UID if it looks like a UID
      if (searchQuery.length > 20) {
        const user = await adminApi.getUser(searchQuery);
        results = [user];
      } else {
        // Try search endpoint
        results = await adminApi.searchUsers(searchQuery);
      }

      // Fetch ratings and profiles for all users
      const usersWithRatings = await Promise.all(
        results.map(async (user) => {
          const [rating, profile] = await Promise.all([
            adminApi.getUserRating(user.uid),
            adminApi.getUserProfile(user.uid).catch(() => null), // Profile might not exist
          ]);
          return { 
            ...user, 
            rating, 
            sex: profile?.sex || null,
            name: profile?.name ?? user.name ?? null,
            displayName: profile?.name ?? user.name ?? user.email ?? null,
          };
        })
      );

      setUsers(usersWithRatings);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Search failed');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user: AdminUser) => {
    // Always fetch fresh user data to avoid stale subscription state
    try {
      const freshUser = await adminApi.getUser(user.uid);
      setSelectedUser({
        ...freshUser,
        name: (user as any).displayName ?? freshUser.name ?? user.name ?? null,
      });
      if ((user as any).rating !== undefined) {
        setUserRating((user as any).rating ?? null);
      }
      setGrantForm({
        userUid: freshUser.uid,
        searchTokens: undefined,
        messageTokens: undefined,
        undoTokens: undefined,
        isSubscribed: freshUser.isSubscribed,
        subscriptionExpiresAt: freshUser.subscriptionExpiresAt
          ? new Date(freshUser.subscriptionExpiresAt).toISOString().split('T')[0]
          : undefined,
      });
      setMessage(null);
      loadUserReviews(freshUser.uid);
      loadUserFlags(freshUser.uid);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Fallback to using the user from the list if fetch fails
      setSelectedUser(user);
      if ((user as any).rating !== undefined) {
        setUserRating((user as any).rating ?? null);
      }
      setGrantForm({
        userUid: user.uid,
        searchTokens: undefined,
        messageTokens: undefined,
        undoTokens: undefined,
        isSubscribed: user.isSubscribed,
        subscriptionExpiresAt: user.subscriptionExpiresAt
          ? new Date(user.subscriptionExpiresAt).toISOString().split('T')[0]
          : undefined,
      });
      setMessage(null);
      loadUserReviews(user.uid);
      loadUserFlags(user.uid);
    }
  };

  const loadUserReviews = async (uid: string) => {
    setReviewsLoading(true);
    try {
      const [strikes, rating, profile, received, sent] = await Promise.all([
        adminApi.getUserStrikes(uid),
        adminApi.getUserRating(uid),
        adminApi.getUserProfile(uid).catch(() => null), // Profile might not exist, so catch error
        adminApi.getReceivedReviews(uid),
        adminApi.getSentReviews(uid),
      ]);
      setStrikeCount(strikes);
      setUserRating(rating);
      setUserProfile(profile);
      // Use profileImageUrl from the profile response
      const imageUrl = profile?.profileImageUrl || null;
      console.log('Profile data:', profile);
      console.log('Profile image URL:', imageUrl);
      setUserPhoto(imageUrl);
      setReceivedReviews(received);
      setSentReviews(sent);
    } catch (error) {
      console.error('Failed to load user reviews:', error);
      setStrikeCount(null);
      // Preserve any rating we already have (e.g., from search list)
      setUserRating((prev) => prev ?? (selectedUser as any)?.rating ?? null);
      setUserPhoto(null);
      setUserProfile(null);
      setReceivedReviews([]);
      setSentReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadUserFlags = async (uid: string) => {
    setUserFlagsLoading(true);
    try {
      const flags = await adminApi.getUserFlags(uid);
      setUserFlags(flags);
    } catch (error) {
      console.error('Failed to load user flags:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to load user flags');
      setUserFlags(null);
    } finally {
      setUserFlagsLoading(false);
    }
  };

  const handleGrant = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setGrantLoading(true);
    setMessage(null);

    try {
      const dto: GrantDto = {
        userUid: selectedUser.uid,
      };

      if (grantForm.searchTokens !== undefined) {
        dto.searchTokens = grantForm.searchTokens;
      }
      if (grantForm.messageTokens !== undefined) {
        dto.messageTokens = grantForm.messageTokens;
      }
      if (grantForm.undoTokens !== undefined) {
        dto.undoTokens = grantForm.undoTokens;
      }
      if (grantForm.isSubscribed !== undefined) {
        dto.isSubscribed = grantForm.isSubscribed;
      }
      if (grantForm.subscriptionExpiresAt !== undefined) {
        dto.subscriptionExpiresAt = grantForm.subscriptionExpiresAt || null;
      }

      console.log('Granting tokens/subscription:', dto);
      const updated = await adminApi.grant(dto);
      console.log('Grant response:', updated);
      
      setSelectedUser(updated);
      
      // Update the user in the search results list if they're there
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === updated.uid ? updated : user
        )
      );
      
      setMessage('Grant successful');
      
      // Reset form but preserve subscription state from the updated user
      setGrantForm({
        userUid: updated.uid,
        searchTokens: undefined,
        messageTokens: undefined,
        undoTokens: undefined,
        isSubscribed: updated.isSubscribed,
        subscriptionExpiresAt: updated.subscriptionExpiresAt
          ? new Date(updated.subscriptionExpiresAt).toISOString().split('T')[0]
          : undefined,
      });
    } catch (error) {
      console.error('Grant error:', error);
      setMessage(error instanceof Error ? error.message : 'Grant failed');
    } finally {
      setGrantLoading(false);
    }
  };

  const handleSaveUserFlags = async () => {
    if (!selectedUser || !userFlags) return;
    setUserFlagsSaving(true);
    setMessage(null);
    try {
      const updated = await adminApi.updateUserFlags(selectedUser.uid, userFlags);
      setUserFlags(updated);
      setMessage('User flags updated successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update user flags');
    } finally {
      setUserFlagsSaving(false);
    }
  };

  const handleImpersonate = async () => {
    if (!selectedUser) return;
    setActionLoading('impersonate');
    try {
      const result = await adminApi.impersonateUser(selectedUser.uid);
      setImpersonationToken(result.token);
      setMessage(`Impersonation token generated. Expires: ${new Date(result.expiresAt).toLocaleString()}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to generate impersonation token');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePause = async () => {
    if (!selectedUser) return;
    setActionLoading('pause');
    try {
      await adminApi.pauseUser(selectedUser.uid);
      setMessage('User paused successfully');
      const updated = await adminApi.getUser(selectedUser.uid);
      setSelectedUser(updated);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to pause user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpause = async () => {
    if (!selectedUser) return;
    setActionLoading('unpause');
    try {
      await adminApi.unpauseUser(selectedUser.uid);
      setMessage('User unpaused successfully');
      const updated = await adminApi.getUser(selectedUser.uid);
      setSelectedUser(updated);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to unpause user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading('delete');
    try {
      await adminApi.deleteUser(selectedUser.uid);
      setMessage('User deleted successfully');
      setSelectedUser(null);
      setShowDeleteConfirm(false);
      await handleSearch({ preventDefault: () => {} } as FormEvent);
    } catch (error) {
      console.error('Delete user error:', error);
      let errorMessage = 'Failed to delete user';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check if it's a 500 error
        if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
          errorMessage = 'Server error while deleting user. The user may have associated data that needs to be handled first.';
        }
      }
      setMessage(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetReviewTimeout = async () => {
    if (!selectedUser) return;
    setActionLoading('reset-timeout');
    try {
      await adminApi.resetReviewTimeout(selectedUser.uid);
      setMessage('Review timeout reset successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to reset review timeout');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetStrikes = async () => {
    if (!selectedUser) return;
    setActionLoading('reset-strikes');
    try {
      await adminApi.resetStrikes(selectedUser.uid);
      setMessage('Strikes reset successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to reset strikes');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSessions = async () => {
    if (!selectedUser) return;
    setActionLoading('revoke');
    try {
      await adminApi.revokeSessions(selectedUser.uid);
      setMessage('All user sessions revoked successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to revoke sessions');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async () => {
    if (!selectedUser) return;
    setActionLoading('ban');
    try {
      await adminApi.banUser(selectedUser.uid, banReason || null);
      // Refresh user data to get updated ban status
      const updated = await adminApi.getUser(selectedUser.uid);
      setSelectedUser(updated);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === updated.uid ? updated : user
        )
      );
      setMessage('User banned successfully');
      setShowBanConfirm(false);
      setBanReason('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to ban user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async () => {
    if (!selectedUser) return;
    setActionLoading('unban');
    try {
      await adminApi.unbanUser(selectedUser.uid);
      // Refresh user data to get updated ban status
      const updated = await adminApi.getUser(selectedUser.uid);
      setSelectedUser(updated);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === updated.uid ? updated : user
        )
      );
      setMessage('User unbanned successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to unban user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendVerification = async () => {
    if (!selectedUser) return;
    setActionLoading('verify');
    try {
      await adminApi.resendVerification(selectedUser.uid);
      setMessage('Verification email sent successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to resend verification');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users-search">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by UID or name..."
            className="admin-search-input"
          />
          <button type="submit" disabled={loading} className="admin-search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-users-layout">
        <div className="admin-users-list">
          <h3>Search Results</h3>
          {users.length === 0 ? (
            <div className="admin-empty-state">No users found</div>
          ) : (
            <div className="admin-users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>UID</th>
                    <th>Sex</th>
                    <th>Subscribed</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={selectedUser?.id === user.id ? 'selected' : ''}
                    >
                      <td>{getDisplayName(user)}</td>
                      <td className="admin-uid-cell">{user.uid}</td>
                      <td>{user.sex ? user.sex.charAt(0).toUpperCase() + user.sex.slice(1).toLowerCase() : 'N/A'}</td>
                      <td>{user.isSubscribed ? 'Yes' : 'No'}</td>
                      <td>{user.rating !== null && user.rating !== undefined ? user.rating.toFixed(1) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="admin-user-details">
            <h3>User Details</h3>
            <div className="admin-user-details-content">
              <div className="admin-user-info">
              <div className="admin-info-row">
                <span className="admin-info-label">Name:</span>
                <span className="admin-info-value">
                  {userProfile?.name || getDisplayName(selectedUser)}
                </span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">UID:</span>
                <span className="admin-info-value admin-uid-value">{selectedUser.uid}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Sex:</span>
                <span className="admin-info-value">
                  {reviewsLoading ? 'Loading...' : userProfile?.sex 
                    ? userProfile.sex.charAt(0).toUpperCase() + userProfile.sex.slice(1).toLowerCase()
                    : 'N/A'}
                </span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Subscribed:</span>
                <span className="admin-info-value">
                  {selectedUser.isSubscribed ? 'Yes' : 'No'}
                </span>
              </div>
              {selectedUser.subscriptionExpiresAt && (
                <div className="admin-info-row">
                  <span className="admin-info-label">Expires:</span>
                  <span className="admin-info-value">
                    {new Date(selectedUser.subscriptionExpiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="admin-info-row">
                <span className="admin-info-label">Rating:</span>
                <span className="admin-info-value">
                  {reviewsLoading ? 'Loading...' : userRating !== null && userRating !== undefined ? userRating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Strikes:</span>
                <span className="admin-info-value">
                  {reviewsLoading ? 'Loading...' : strikeCount !== null ? strikeCount : 'N/A'}
                </span>
              </div>
              {selectedUser.banned && (
                <>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Status:</span>
                    <span className="admin-info-value admin-banned-badge">BANNED</span>
                  </div>
                  {selectedUser.bannedAt && (
                    <div className="admin-info-row">
                      <span className="admin-info-label">Banned At:</span>
                      <span className="admin-info-value">
                        {new Date(selectedUser.bannedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedUser.banReason && (
                    <div className="admin-info-row">
                      <span className="admin-info-label">Ban Reason:</span>
                      <span className="admin-info-value">{selectedUser.banReason}</span>
                    </div>
                  )}
                </>
              )}
              </div>
              <div className="admin-user-photo-preview">
                {reviewsLoading ? (
                  <div className="admin-photo-loading">Loading photo...</div>
                ) : userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={`${getDisplayName(selectedUser) || 'User'} profile`}
                    className="admin-user-photo"
                    onError={(e) => {
                      console.error('Failed to load photo:', userPhoto);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Photo loaded successfully:', userPhoto);
                    }}
                  />
                ) : (
                  <div className="admin-photo-placeholder">No photo available</div>
                )}
              </div>
            </div>

            <div className="admin-user-reviews">
              <h4>Reviews</h4>
              {reviewsLoading ? (
                <div className="admin-loading">Loading reviews...</div>
              ) : (
                <>
                  <div className="admin-reviews-section">
                    <h5>Received Reviews ({receivedReviews.length})</h5>
                    {receivedReviews.length === 0 ? (
                      <div className="admin-empty-state">No reviews received</div>
                    ) : (
                      <div className="admin-reviews-list">
                        {receivedReviews.map((review) => (
                          <div key={review.id} className="admin-review-item">
                            <div className="admin-review-header">
                              <span className="admin-review-rating">Rating: {review.rating}/10</span>
                              <span className="admin-review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <div className="admin-review-comment">{review.comment}</div>
                            )}
                            <div className="admin-review-meta">
                              {review.strikeIssued && (
                                <span className="admin-review-strike">Strike Issued</span>
                              )}
                              {review.approved ? (
                                <span className="admin-review-approved">Approved</span>
                              ) : (
                                <>
                                  <span className="admin-review-pending">Pending</span>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await adminApi.updateReview(review.id, true);
                                        await loadUserReviews(selectedUser.uid);
                                        setMessage('Review approved');
                                      } catch (error) {
                                        setMessage(error instanceof Error ? error.message : 'Failed to approve review');
                                      }
                                    }}
                                    className="admin-review-action-button approve"
                                    title="Approve this review"
                                  >
                                    Approve
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-reviews-section">
                    <h5>Sent Reviews ({sentReviews.length})</h5>
                    {sentReviews.length === 0 ? (
                      <div className="admin-empty-state">No reviews sent</div>
                    ) : (
                      <div className="admin-reviews-list">
                        {sentReviews.map((review) => (
                          <div key={review.id} className="admin-review-item">
                            <div className="admin-review-header">
                              <span className="admin-review-rating">Rating: {review.rating}/10</span>
                              <span className="admin-review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <div className="admin-review-comment">{review.comment}</div>
                            )}
                            <div className="admin-review-meta">
                              {review.strikeIssued && (
                                <span className="admin-review-strike">Strike Issued</span>
                              )}
                              {review.approved ? (
                                <span className="admin-review-approved">Approved</span>
                              ) : (
                                <>
                                  <span className="admin-review-pending">Pending</span>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await adminApi.updateReview(review.id, true);
                                        await loadUserReviews(selectedUser.uid);
                                        setMessage('Review approved');
                                      } catch (error) {
                                        setMessage(error instanceof Error ? error.message : 'Failed to approve review');
                                      }
                                    }}
                                    className="admin-review-action-button approve"
                                    title="Approve this review"
                                  >
                                    Approve
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="admin-user-flags">
              <h4>Token Overrides</h4>
              {userFlagsLoading ? (
                <div className="admin-loading">Loading flags...</div>
              ) : (
                <>
                  <div className="admin-toggle-grid">
                    <label className="admin-toggle-row">
                      <input
                        type="checkbox"
                        checked={userFlags?.unlimitedSearch ?? false}
                        onChange={(e) =>
                          setUserFlags((prev) => ({
                            ...(prev ?? { unlimitedSearch: false, unlimitedUndo: false, unlimitedMessageReq: false }),
                            unlimitedSearch: e.target.checked,
                          }))
                        }
                      />
                      Unlimited Search
                    </label>
                    <label className="admin-toggle-row">
                      <input
                        type="checkbox"
                        checked={userFlags?.unlimitedUndo ?? false}
                        onChange={(e) =>
                          setUserFlags((prev) => ({
                            ...(prev ?? { unlimitedSearch: false, unlimitedUndo: false, unlimitedMessageReq: false }),
                            unlimitedUndo: e.target.checked,
                          }))
                        }
                      />
                      Unlimited Undo
                    </label>
                    <label className="admin-toggle-row">
                      <input
                        type="checkbox"
                        checked={userFlags?.unlimitedMessageReq ?? false}
                        onChange={(e) =>
                          setUserFlags((prev) => ({
                            ...(prev ?? { unlimitedSearch: false, unlimitedUndo: false, unlimitedMessageReq: false }),
                            unlimitedMessageReq: e.target.checked,
                          }))
                        }
                      />
                      Unlimited Message Requests
                    </label>
                  </div>
                  <div className="admin-user-flag-actions">
                    <button
                      onClick={handleSaveUserFlags}
                      disabled={userFlagsSaving || !selectedUser}
                      className="admin-grant-button"
                    >
                      {userFlagsSaving ? 'Saving...' : 'Save Overrides'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="admin-user-actions">
              <h4>Account Actions</h4>
              <div className="admin-action-buttons">
                <button
                  onClick={handleImpersonate}
                  disabled={actionLoading === 'impersonate'}
                  className="admin-action-button impersonate"
                >
                  {actionLoading === 'impersonate' ? 'Generating...' : 'Impersonate User'}
                </button>
                <button
                  onClick={handlePause}
                  disabled={actionLoading === 'pause'}
                  className="admin-action-button pause"
                >
                  {actionLoading === 'pause' ? 'Pausing...' : 'Pause User'}
                </button>
                <button
                  onClick={handleUnpause}
                  disabled={actionLoading === 'unpause'}
                  className="admin-action-button unpause"
                >
                  {actionLoading === 'unpause' ? 'Unpausing...' : 'Unpause User'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={actionLoading === 'delete'}
                  className="admin-action-button delete"
                >
                  Delete User
                </button>
                <button
                  onClick={handleResetReviewTimeout}
                  disabled={actionLoading === 'reset-timeout'}
                  className="admin-action-button reset"
                >
                  Reset Review Timeout
                </button>
                <button
                  onClick={handleResetStrikes}
                  disabled={actionLoading === 'reset-strikes'}
                  className="admin-action-button reset"
                >
                  Reset Strikes
                </button>
                <button
                  onClick={handleRevokeSessions}
                  disabled={actionLoading === 'revoke'}
                  className="admin-action-button revoke"
                >
                  Force Logout
                </button>
                {selectedUser.banned ? (
                  <button
                    onClick={handleUnban}
                    disabled={actionLoading === 'unban'}
                    className="admin-action-button unban"
                  >
                    {actionLoading === 'unban' ? 'Unbanning...' : 'Unban User'}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBanConfirm(true)}
                    disabled={actionLoading === 'ban'}
                    className="admin-action-button ban"
                  >
                    Ban User
                  </button>
                )}
                <button
                  onClick={handleResendVerification}
                  disabled={actionLoading === 'verify'}
                  className="admin-action-button verify"
                >
                  Resend Verification
                </button>
              </div>
              {impersonationToken && (
                <div className="admin-impersonation-token">
                  <label>Impersonation Token:</label>
                  <textarea
                    readOnly
                    value={impersonationToken}
                    className="admin-token-display"
                    rows={3}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(impersonationToken);
                      setMessage('Token copied to clipboard');
                    }}
                    className="admin-copy-button"
                  >
                    Copy Token
                  </button>
                </div>
              )}
            </div>

            {showDeleteConfirm && (
              <div className="admin-delete-confirm">
                <p>Are you sure you want to permanently delete this user? This action cannot be undone.</p>
                <div className="admin-delete-actions">
                  <button
                    onClick={() => handleDelete()}
                    disabled={actionLoading === 'delete'}
                    className="admin-action-button delete"
                  >
                    {actionLoading === 'delete' ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="admin-action-button cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showBanConfirm && (
              <div className="admin-delete-confirm">
                <p>Are you sure you want to ban this user? They will be logged out immediately and unable to access the app.</p>
                <div className="admin-grant-field" style={{ marginTop: '1rem' }}>
                  <label>Ban Reason (optional)</label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter reason for banning this user..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div className="admin-delete-actions">
                  <button
                    onClick={handleBan}
                    disabled={actionLoading === 'ban'}
                    className="admin-action-button ban"
                  >
                    {actionLoading === 'ban' ? 'Banning...' : 'Confirm Ban'}
                  </button>
                  <button
                    onClick={() => {
                      setShowBanConfirm(false);
                      setBanReason('');
                    }}
                    className="admin-action-button cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleGrant} className="admin-grant-form">
              <h4>Grant Tokens/Subscription</h4>
              
              <div className="admin-grant-fields">
                <div className="admin-grant-field">
                  <label>Search Tokens</label>
                  <input
                    type="number"
                    min="0"
                    value={grantForm.searchTokens || ''}
                    onChange={(e) =>
                      setGrantForm({
                        ...grantForm,
                        searchTokens: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                
                <div className="admin-grant-field">
                  <label>Message Tokens</label>
                  <input
                    type="number"
                    min="0"
                    value={grantForm.messageTokens || ''}
                    onChange={(e) =>
                      setGrantForm({
                        ...grantForm,
                        messageTokens: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                
                <div className="admin-grant-field">
                  <label>Undo Tokens</label>
                  <input
                    type="number"
                    min="0"
                    value={grantForm.undoTokens || ''}
                    onChange={(e) =>
                      setGrantForm({
                        ...grantForm,
                        undoTokens: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                
                <div className="admin-grant-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={grantForm.isSubscribed || false}
                      onChange={(e) =>
                        setGrantForm({
                          ...grantForm,
                          isSubscribed: e.target.checked ? true : undefined,
                        })
                      }
                    />
                    Subscribed
                  </label>
                </div>
                
                <div className="admin-grant-field">
                  <label>Subscription Expires</label>
                  <input
                    type="date"
                    value={grantForm.subscriptionExpiresAt || ''}
                    onChange={(e) =>
                      setGrantForm({
                        ...grantForm,
                        subscriptionExpiresAt: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>
              
              <button type="submit" disabled={grantLoading} className="admin-grant-button">
                {grantLoading ? 'Granting...' : 'Grant'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

