//********************************************************************
//
// AdminTokens Page
//
// Token management page for viewing token statistics and
// managing token grants (redirects to Users page for actual grants).
//
//*******************************************************************

import { Link } from 'react-router-dom';
import './Tokens.css';

export default function AdminTokens() {
  return (
    <div className="admin-tokens">
      <div className="admin-tokens-header">
        <h2>Token Management</h2>
        <p className="admin-tokens-description">
          Manage user tokens and subscriptions. Use the Users page to grant tokens to specific users.
        </p>
      </div>

      <div className="admin-tokens-info">
        <div className="admin-token-type-card">
          <h3>Search Tokens</h3>
          <p>Allow users to search for other users by name within 25 miles.</p>
        </div>
        
        <div className="admin-token-type-card">
          <h3>Message Request Tokens</h3>
          <p>Allow users to send message requests to users they haven't matched with.</p>
        </div>
        
        <div className="admin-token-type-card">
          <h3>Undo Tokens</h3>
          <p>Allow users to undo their last swipe action. Users receive 5 baseline tokens per month.</p>
        </div>
      </div>

      <div className="admin-tokens-actions">
        <Link to="/admin/users" className="admin-tokens-action-button">
          Go to User Management
        </Link>
      </div>
    </div>
  );
}

