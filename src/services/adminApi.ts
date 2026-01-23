//********************************************************************
//
// Admin API Service
//
// Service for making authenticated admin API calls to the backend.
// Handles Cognito token authentication and error handling.
//
//*******************************************************************

import { getApiBaseUrl, joinApiUrl } from '../utils/apiUrl';

const API_BASE_URL = getApiBaseUrl();

export interface AdminUser {
  id: string;
  uid: string;
  email: string | null;
  name?: string | null;
  isSubscribed: boolean;
  subscriptionExpiresAt: string | null;
  searchTokens?: number;
  messageTokens?: number;
  undoTokens?: number;
  createdAt?: string;
  banned?: boolean;
  bannedAt?: string | null;
  banReason?: string | null;
  userFlags?: UserFlags;
}

export interface UserProfile {
  uid: string;
  name?: string | null;
  sex?: string | null;
  sexPreference?: string | null;
  profileImageUrl?: string | null;
  photos?: Array<{ url: string; [key: string]: unknown }>;
  // Add other profile fields as needed
}

export interface Admin {
  id: number;
  uid: string;
  email: string;
  createdAt: Date;
  createdByUid: string | null;
}

export interface ProfilePhoto {
  id: string;
  userId: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reason: string | null;
  createdAt: Date;
}

export interface AuditEvent {
  id: string;
  event: string;
  payload: Record<string, unknown> | null;
  createdAt: Date;
  adminId?: string;
  action?: string;
}

export interface GrantDto {
  userUid: string;
  searchTokens?: number;
  messageTokens?: number;
  undoTokens?: number;
  isSubscribed?: boolean;
  subscriptionExpiresAt?: string | null;
}

export interface UserSearchParams {
  name?: string;
}

export interface ContentReport {
  id: string;
  reporterUid: string;
  targetUid: string;
  type: string;
  status: 'open' | 'triaged' | 'closed';
  evidence?: {
    messages?: unknown[];
    profile?: unknown;
    photos?: unknown[];
  };
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Review {
  id: string;
  reviewerUid: string;
  targetUid: string;
  rating: number;
  approved: boolean;
  strikeIssued: boolean;
  comment?: string | null;
  createdAt: Date;
}

export interface Match {
  id: string;
  user1Uid: string;
  user2Uid: string;
  createdAt: Date;
  unmatchedAt?: Date;
}

export interface RateLimitBucket {
  key: string;
  type: 'ip' | 'user';
  count: number;
  limit: number;
  resetAt: Date;
}

export interface QueueInfo {
  uid: string;
  candidates: unknown[];
  filters: unknown;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  redis: boolean;
  s3: boolean;
  jobs: {
    running: number;
    failed: number;
  };
}

export interface LogEntry {
  id: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercent?: number;
}

export interface PaymentFlags {
  enablePayments: boolean;
  enableSearchTokens: boolean;
  enableUndoTokens: boolean;
  enableMessageReqTokens: boolean;
}

export interface UserFlags {
  unlimitedSearch: boolean;
  unlimitedUndo: boolean;
  unlimitedMessageReq: boolean;
}

function getAuthToken(): string {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    throw new Error('Not authenticated');
  }
  return token;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  // Validate endpoint doesn't contain tokens
  if (endpoint.includes('Bearer ') || endpoint.includes('token=') || endpoint.includes('auth=')) {
    throw new Error('Invalid endpoint: credentials should not be in the URL path');
  }
  
  const url = joinApiUrl(API_BASE_URL, endpoint);
  
  // Validate final URL doesn't contain tokens
  if (url.includes('Bearer ') || url.includes('token=') || url.includes('auth=')) {
    console.error('Error: Final URL contains credentials:', url.replace(/Bearer\s+[\w.-]+/g, '[TOKEN_REDACTED]'));
    throw new Error('Invalid URL: credentials should not be in the URL path');
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      window.location.href = '/admin/login';
      throw new Error('Authentication expired. Please log in again.');
    }
    
    // Handle 404 Not Found - endpoint doesn't exist
    if (response.status === 404) {
      const error = await response.json().catch(() => ({ message: 'Endpoint not found' }));
      throw new Error(error.message || `Endpoint not implemented: ${endpoint}`);
    }
    
    // Handle 500 Internal Server Error
    if (response.status === 500) {
      const error = await response.json().catch(() => ({ message: 'Internal server error' }));
      throw new Error(error.message || `Server error (500): ${error.error || 'An unexpected error occurred on the server'}`);
    }
    
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const adminApi = {
  // Auth & Roles
  async login(email: string, password: string): Promise<{ token: string; refreshToken: string }> {
    return apiCall<{ token: string; refreshToken: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // User Directory & Impersonation
  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number }> {
    return apiCall<{ totalUsers: number; activeUsers: number }>('/admin/users/stats');
  },

  async getUsers(params?: UserSearchParams): Promise<AdminUser[]> {
    const query = new URLSearchParams();
    if (params?.name) {
      query.append('name', params.name);
    }
    const queryString = query.toString();
    const results = await apiCall<Array<{ uid: string; email?: string | null; name?: string | null }>>(
      `/admin/users${queryString ? `?${queryString}` : ''}`,
    );

    // Hydrate each result with full user details to match expected shape
    const hydrated = await Promise.all(
      results.map(async (row) => {
        try {
          const details = await this.getUser(row.uid);
          return {
            ...details,
            name: row.name ?? details.name ?? null,
            email: row.email ?? details.email ?? null,
          };
        } catch {
          return {
            id: row.uid,
            uid: row.uid,
            email: row.email ?? null,
            name: row.name ?? null,
            isSubscribed: false,
            subscriptionExpiresAt: null,
          };
        }
      }),
    );

    return hydrated;
  },

  async getUser(uid: string): Promise<AdminUser> {
    const user = await apiCall<
      AdminUser & {
        subscriptionExpiresAt: string | null;
        createdAt?: string;
      }
    >(`/admin/users/${uid}`);
    return {
      ...user,
      subscriptionExpiresAt: user.subscriptionExpiresAt ?? null,
      createdAt: user.createdAt,
    };
  },

  async getUserFlags(uid: string): Promise<UserFlags> {
    return apiCall<UserFlags>(`/admin/users/${uid}/flags`);
  },

  async updateUserFlags(uid: string, flags: Partial<UserFlags>): Promise<UserFlags> {
    return apiCall<UserFlags>(`/admin/users/${uid}/flags`, {
      method: 'PATCH',
      body: JSON.stringify(flags),
    });
  },

  async getUserProfile(uid: string): Promise<UserProfile> {
    return apiCall<UserProfile>(`/admin/profiles/${uid}`);
  },

  async impersonateUser(uid: string): Promise<{ token: string; expiresAt: Date }> {
    return apiCall<{ token: string; expiresAt: Date }>(`/admin/users/${uid}/impersonate`, {
      method: 'POST',
    });
  },

  // Account Actions
  async pauseUser(uid: string): Promise<AdminUser> {
    return apiCall<AdminUser>(`/admin/users/${uid}/pause`, {
      method: 'PATCH',
    });
  },

  async unpauseUser(uid: string): Promise<AdminUser> {
    return apiCall<AdminUser>(`/admin/users/${uid}/unpause`, {
      method: 'PATCH',
    });
  },

  async deleteUser(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}`, {
      method: 'DELETE',
    });
  },

  async resetReviewTimeout(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/reset-review-timeout`, {
      method: 'POST',
    });
  },

  async resetStrikes(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/reset-strikes`, {
      method: 'POST',
    });
  },

  async revokeSessions(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/revoke-sessions`, {
      method: 'POST',
    });
  },

  async updateUserRole(uid: string, role: string): Promise<AdminUser> {
    return apiCall<AdminUser>(`/admin/users/${uid}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async banUser(uid: string, reason?: string | null): Promise<{ success: boolean; message: string }> {
    return apiCall<{ success: boolean; message: string }>(`/admin/users/${uid}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason || null }),
    });
  },

  async unbanUser(uid: string): Promise<{ success: boolean; message: string }> {
    return apiCall<{ success: boolean; message: string }>(`/admin/users/${uid}/unban`, {
      method: 'POST',
    });
  },

  async resendVerification(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/resend-verification`, {
      method: 'POST',
    });
  },

  // Photo Moderation
  async getPhotos(status?: 'pending' | 'flagged' | 'rejected' | 'approved'): Promise<ProfilePhoto[]> {
    const query = status ? `?status=${status}` : '';
    return apiCall<ProfilePhoto[]>(`/admin/photos${query}`);
  },

  async getUserPhotos(uid: string): Promise<ProfilePhoto[]> {
    // Get all approved photos for the user
    const allPhotos = await this.getPhotos('approved');
    return allPhotos.filter(photo => photo.userId === uid);
  },

  async getPhoto(photoId: string): Promise<ProfilePhoto> {
    const allPhotos = await this.getPhotos();
    const found = allPhotos.find((p) => p.id === photoId);
    if (!found) {
      throw new Error('Photo not found');
    }
    return found;
  },

  async approvePhoto(photoId: string, reason?: string, confidence?: number): Promise<ProfilePhoto> {
    return apiCall<ProfilePhoto>(`/admin/photos/${photoId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ reason, confidence }),
    });
  },

  async rejectPhoto(photoId: string, reason?: string, confidence?: number): Promise<ProfilePhoto> {
    return apiCall<ProfilePhoto>(`/admin/photos/${photoId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason, confidence }),
    });
  },

  async requeuePhoto(photoId: string, queue: 'vision' | 'human'): Promise<ProfilePhoto> {
    return apiCall<ProfilePhoto>(`/admin/photos/${photoId}/requeue`, {
      method: 'POST',
      body: JSON.stringify({ queue }),
    });
  },

  async bulkPhotoAction(photoIds: string[], action: 'approve' | 'reject'): Promise<void> {
    return apiCall<void>('/admin/photos/bulk', {
      method: 'POST',
      body: JSON.stringify({ photoIds, action }),
    });
  },

  async bulkDeletePhotos(photoIds: string[]): Promise<void> {
    await Promise.all(photoIds.map((id) => this.deletePhoto(id)));
  },

  async deletePhoto(photoId: string): Promise<void> {
    return apiCall<void>(`/admin/photos/${photoId}`, {
      method: 'DELETE',
    });
  },

  // Content Reports
  async getReports(status?: 'open' | 'triaged' | 'closed'): Promise<ContentReport[]> {
    const query = status ? `?status=${status}` : '';
    return apiCall<ContentReport[]>(`/admin/reports${query}`);
  },

  async getReport(id: string): Promise<ContentReport> {
    return apiCall<ContentReport>(`/admin/reports/${id}`);
  },

  async updateReport(id: string, updates: Partial<ContentReport>): Promise<ContentReport> {
    return apiCall<ContentReport>(`/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async resolveReport(id: string, action: 'warn' | 'suspend' | 'delete', notes?: string): Promise<ContentReport> {
    return apiCall<ContentReport>(`/admin/reports/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  },

  // Reviews & Strikes
  async getReviews(targetUid?: string, reviewerUid?: string): Promise<Review[]> {
    const params = new URLSearchParams();
    if (targetUid) params.append('targetUid', targetUid);
    if (reviewerUid) params.append('reviewerUid', reviewerUid);
    const query = params.toString();
    return apiCall<Review[]>(`/admin/reviews${query ? `?${query}` : ''}`);
  },

  async updateReview(id: string, approved: boolean): Promise<Review> {
    return apiCall<Review>(`/admin/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ approved }),
    });
  },

  async issueStrike(reviewId: string): Promise<Review> {
    return apiCall<Review>(`/admin/reviews/${reviewId}/strike`, {
      method: 'POST',
    });
  },

  async removeStrike(reviewId: string): Promise<Review> {
    return apiCall<Review>(`/admin/reviews/${reviewId}/strike`, {
      method: 'DELETE',
    });
  },

  async unblockReviewTimeout(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/unblock-review-timeout`, {
      method: 'POST',
    });
  },

  // Matches & Chats Oversight
  async getUserMatches(uid: string): Promise<Match[]> {
    return apiCall<Match[]>(`/admin/users/${uid}/matches`);
  },

  async unmatch(matchId: string): Promise<void> {
    return apiCall<void>(`/admin/matches/${matchId}/unmatch`, {
      method: 'POST',
    });
  },

  async getMatchMessages(matchId: string): Promise<unknown[]> {
    return apiCall<unknown[]>(`/admin/matches/${matchId}/messages`);
  },

  async muteUserChat(uid: string, durationHours: number): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/mute-chat`, {
      method: 'POST',
      body: JSON.stringify({ durationHours }),
    });
  },

  async clearMessageRequestTokens(uid: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/clear-message-tokens`, {
      method: 'POST',
    });
  },

  // Rate Limit & Abuse Controls
  async getRateLimitBuckets(): Promise<RateLimitBucket[]> {
    const data = await apiCall<{ buckets?: string[] }>(
      '/admin/rate-limit/buckets',
    );
    const now = new Date();
    return (data.buckets ?? []).map((key) => ({
      key,
      type: key.includes('user') ? 'user' : 'ip',
      count: 0,
      limit: 0,
      resetAt: now,
    }));
  },

  async clearRateLimitBucket(key: string): Promise<void> {
    return apiCall<void>(`/admin/rate-limit/buckets/${key}`, {
      method: 'DELETE',
    });
  },

  async whitelistIP(ip: string): Promise<void> {
    return apiCall<void>('/admin/rate-limit/whitelist', {
      method: 'POST',
      body: JSON.stringify({ ip }),
    });
  },

  async blacklistIP(ip: string): Promise<void> {
    return apiCall<void>('/admin/rate-limit/blacklist', {
      method: 'POST',
      body: JSON.stringify({ ip }),
    });
  },

  // Queues & Discovery Debug
  async getQueue(uid: string): Promise<QueueInfo> {
    const data = await apiCall<{ uid?: string; cached?: unknown }>(
      `/admin/queue/${uid}`,
    );
    const cached = (data as { cached?: unknown }).cached;
    const candidates = Array.isArray(cached) ? cached : [];
    return { uid: data.uid ?? uid, candidates, filters: null };
  },

  async rebuildQueue(uid: string): Promise<QueueInfo> {
    await apiCall(`/admin/queue/${uid}/rebuild`, { method: 'POST' });
    return { uid, candidates: [], filters: null };
  },

  // Tokens & Entitlements
  async getUserTokens(uid: string): Promise<{ searchTokens: number; messageTokens: number; undoTokens: number }> {
    return apiCall<{ searchTokens: number; messageTokens: number; undoTokens: number }>(`/admin/users/${uid}/tokens`);
  },

  async grantTokens(uid: string, tokens: { searchTokens?: number; messageTokens?: number; undoTokens?: number }): Promise<void> {
    console.log(`Granting tokens to ${uid}:`, tokens);
    try {
      await apiCall<void>(`/admin/users/${uid}/tokens/grant`, {
        method: 'POST',
        body: JSON.stringify({
          search: tokens.searchTokens,
          message: tokens.messageTokens,
          undo: tokens.undoTokens,
        }),
      });
      console.log(`Tokens granted successfully to ${uid}`);
    } catch (error) {
      console.error(`Failed to grant tokens to ${uid}:`, error);
      throw error;
    }
  },

  async revokeTokens(uid: string, tokens: { searchTokens?: number; messageTokens?: number; undoTokens?: number }): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/tokens/revoke`, {
      method: 'POST',
      body: JSON.stringify({
        search: tokens.searchTokens,
        message: tokens.messageTokens,
        undo: tokens.undoTokens,
      }),
    });
  },

  async updateSubscription(uid: string, isSubscribed: boolean, expiresAt?: string | null): Promise<AdminUser> {
    return apiCall<AdminUser>(`/admin/users/${uid}/subscription`, {
      method: 'PATCH',
      body: JSON.stringify({
        isSubscribed,
        subscriptionExpiresAt: expiresAt ?? null,
      }),
    });
  },

  // Legacy grant method (kept for backward compatibility)
  async grant(dto: GrantDto): Promise<AdminUser> {
    const { userUid, ...tokens } = dto;
    // Check if any token fields are explicitly provided (including 0)
    if (tokens.searchTokens !== undefined || tokens.messageTokens !== undefined || tokens.undoTokens !== undefined) {
      await this.grantTokens(userUid, {
        searchTokens: tokens.searchTokens,
        messageTokens: tokens.messageTokens,
        undoTokens: tokens.undoTokens,
      });
    }
    if (tokens.isSubscribed !== undefined || tokens.subscriptionExpiresAt !== undefined) {
      await this.updateSubscription(userUid, tokens.isSubscribed || false, tokens.subscriptionExpiresAt || null);
    }
    // Always refresh user data to get the latest state (including tokens if they were updated)
    return this.getUser(userUid);
  },

  // System Health & Logs
  async getSystemHealth(): Promise<SystemHealth> {
    const health = await apiCall<{ status: string; redis: boolean }>(
      '/admin/health',
    );
    return {
      status: health.status === 'ok' ? 'healthy' : 'degraded',
      redis: Boolean(health.redis),
      s3: true,
      jobs: { running: 0, failed: 0 },
    };
  },

  async getLogs(level?: 'error' | 'warn' | 'info', limit = 100): Promise<LogEntry[]> {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    params.append('limit', limit.toString());
    const result = await apiCall<{ logs?: LogEntry[] } | LogEntry[]>(
      `/admin/logs?${params.toString()}`,
    );
    return Array.isArray(result) ? result : result.logs ?? [];
  },

  async getJobs(): Promise<unknown[]> {
    const result = await apiCall<{ jobs?: unknown[] } | unknown[]>(
      '/admin/jobs',
    );
    return Array.isArray(result) ? result : result.jobs ?? [];
  },

  // Push & Email Tools
  async sendTestPush(uid: string, title: string, body: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/test-push`, {
      method: 'POST',
      body: JSON.stringify({ title, body }),
    });
  },

  async sendTestEmail(uid: string, subject: string, body: string): Promise<void> {
    return apiCall<void>(`/admin/users/${uid}/test-email`, {
      method: 'POST',
      body: JSON.stringify({ subject, body }),
    });
  },

  async getPushLog(uid: string): Promise<unknown[]> {
    return apiCall<unknown[]>(`/admin/users/${uid}/push-log`);
  },

  // Config Flags
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    const rawFlags = await apiCall<Record<string, unknown>>('/admin/flags');
    return Object.entries(rawFlags).map(([key, value]) => {
      if (value && typeof value === 'object') {
        const val = value as { enabled?: unknown; rolloutPercent?: unknown };
        return {
          key,
          enabled: Boolean(val.enabled ?? false),
          rolloutPercent:
            typeof val.rolloutPercent === 'number'
              ? val.rolloutPercent
              : undefined,
        };
      }
      if (typeof value === 'number') {
        return { key, enabled: value > 0, rolloutPercent: value };
      }
      if (typeof value === 'string') {
        const num = Number(value);
        return {
          key,
          enabled: value === 'true',
          rolloutPercent: Number.isFinite(num) ? num : undefined,
        };
      }
      return { key, enabled: Boolean(value) };
    });
  },

  async updateFeatureFlag(key: string, enabled: boolean, rolloutPercent?: number): Promise<FeatureFlag> {
    const value =
      rolloutPercent !== undefined ? { enabled, rolloutPercent } : enabled;
    await apiCall<Record<string, unknown>>(`/admin/flags/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
    const updatedFlags = await this.getFeatureFlags();
    return updatedFlags.find((flag) => flag.key === key) ?? {
      key,
      enabled,
      rolloutPercent,
    };
  },

  async getPaymentFlags(): Promise<PaymentFlags> {
    const flags = await this.getFeatureFlags();
    const lookup = Object.fromEntries(flags.map((f) => [f.key, f.enabled]));
    return {
      enablePayments: Boolean(lookup.enablePayments ?? true),
      enableSearchTokens: Boolean(lookup.enableSearchTokens ?? true),
      enableUndoTokens: Boolean(lookup.enableUndoTokens ?? true),
      enableMessageReqTokens: Boolean(lookup.enableMessageReqTokens ?? true),
    };
  },

  async updatePaymentFlags(flags: PaymentFlags): Promise<PaymentFlags> {
    const entries: Array<[keyof PaymentFlags, boolean]> = [
      ['enablePayments', flags.enablePayments],
      ['enableSearchTokens', flags.enableSearchTokens],
      ['enableUndoTokens', flags.enableUndoTokens],
      ['enableMessageReqTokens', flags.enableMessageReqTokens],
    ];
    for (const [key, value] of entries) {
      await this.updateFeatureFlag(key, value);
    }
    return flags;
  },

  // Data Export (DSAR-lite)
  async exportUserData(uid: string): Promise<{ jobId: string }> {
    return apiCall<{ jobId: string }>(`/admin/users/${uid}/export`, {
      method: 'POST',
    });
  },

  async getExportStatus(uid: string, jobId: string): Promise<{ status: 'pending' | 'completed' | 'failed'; downloadUrl?: string }> {
    return apiCall<{ status: 'pending' | 'completed' | 'failed'; downloadUrl?: string }>(`/admin/users/${uid}/export/${jobId}`);
  },

  // Audit Trail
  async getAuditLogs(limit = 100, offset = 0, adminId?: string, action?: string, since?: string): Promise<AuditEvent[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    if (adminId) params.append('adminId', adminId);
    if (action) params.append('action', action);
    if (since) params.append('since', since);
    return apiCall<AuditEvent[]>(`/admin/audit?${params.toString()}`);
  },

  // Legacy searchUsers method (kept for backward compatibility)
  async searchUsers(query: string): Promise<AdminUser[]> {
    // Backend only supports name search plus direct UID lookup
    if (query.length > 20) {
      try {
        return [await this.getUser(query)];
      } catch {
        // Fall through to name search
      }
    }
    return this.getUsers({ name: query });
  },

  // Get user rating average
  async getUserRating(uid: string): Promise<number | null> {
    try {
      const data = await apiCall<{ average?: number; rating?: number }>(`/admin/reviews/user/${uid}/average`);
      return data.average || data.rating || null;
    } catch {
      return null;
    }
  },

  // Get user strikes count
  async getUserStrikes(uid: string): Promise<number> {
    return apiCall<{ strikeCount: number }>(`/admin/users/${uid}/strikes`).then(
      (data) => data.strikeCount
    );
  },

  // Get reviews received by user
  async getReceivedReviews(uid: string): Promise<Review[]> {
    try {
      return await apiCall<Review[]>(`/admin/reviews/user/${uid}`);
    } catch {
      return [];
    }
  },

  // Get reviews sent by user
  async getSentReviews(uid: string): Promise<Review[]> {
    try {
      return await apiCall<Review[]>(`/admin/reviews/sent/${uid}`);
    } catch {
      return [];
    }
  },

  // Admin Management
  async getAdmins(): Promise<Admin[]> {
    return apiCall<Admin[]>('/admin/admins');
  },

  async createAdmin(email: string, uid: string): Promise<Admin> {
    return apiCall<Admin>('/admin/admins', {
      method: 'POST',
      body: JSON.stringify({ email, uid }),
    });
  },

  async deleteAdmin(uid: string): Promise<void> {
    return apiCall<void>(`/admin/admins/${uid}`, {
      method: 'DELETE',
    });
  },
};
