//********************************************************************
//
// AdminMatches Page
//
// Matches & chats oversight page for viewing user matches,
// unmatching, viewing conversations, and muting users.
//
//*******************************************************************

import { useState } from 'react';
import { adminApi, Match } from '../../services/adminApi';
import './Matches.css';
import './shared.css';

export default function AdminMatches() {
  const [userUid, setUserUid] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [muteDuration, setMuteDuration] = useState(24);

  const handleSearch = async () => {
    if (!userUid.trim()) return;
    setLoading(true);
    try {
      const result = await adminApi.getUserMatches(userUid);
      setMatches(result);
      setSelectedMatch(null);
      setMessages([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = async (match: Match) => {
    setSelectedMatch(match);
    try {
      const result = await adminApi.getMatchMessages(match.id);
      setMessages(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load messages');
    }
  };

  const handleUnmatch = async (matchId: string) => {
    setProcessing(matchId);
    try {
      await adminApi.unmatch(matchId);
      setMessage('Users unmatched successfully');
      await handleSearch();
      setSelectedMatch(null);
      setMessages([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to unmatch users');
    } finally {
      setProcessing(null);
    }
  };

  const handleMuteUser = async (uid: string) => {
    setProcessing(uid);
    try {
      await adminApi.muteUserChat(uid, muteDuration);
      setMessage(`User muted for ${muteDuration} hours`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to mute user');
    } finally {
      setProcessing(null);
    }
  };

  const handleClearMessageTokens = async (uid: string) => {
    setProcessing(uid);
    try {
      await adminApi.clearMessageRequestTokens(uid);
      setMessage('Message request tokens cleared');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to clear tokens');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="admin-matches">
      <div className="admin-matches-search">
        <div className="admin-search-form">
          <input
            type="text"
            value={userUid}
            onChange={(e) => setUserUid(e.target.value)}
            placeholder="Enter User UID to view matches..."
            className="admin-search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={handleSearch} disabled={loading} className="admin-search-button">
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-matches-layout">
        <div className="admin-matches-list">
          <h3>Matches</h3>
          {matches.length === 0 ? (
            <div className="admin-empty-state">
              {userUid ? 'No matches found for this user' : 'Enter a user UID to view matches'}
            </div>
          ) : (
            <div className="admin-matches-table">
              <table>
                <thead>
                  <tr>
                    <th>Match ID</th>
                    <th>User 1</th>
                    <th>User 2</th>
                    <th>Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr
                      key={match.id}
                      onClick={() => handleSelectMatch(match)}
                      className={selectedMatch?.id === match.id ? 'selected' : ''}
                    >
                      <td className="admin-match-id">{match.id.substring(0, 8)}...</td>
                      <td className="admin-uid-cell">{match.user1Uid.substring(0, 8)}...</td>
                      <td className="admin-uid-cell">{match.user2Uid.substring(0, 8)}...</td>
                      <td>{new Date(match.createdAt).toLocaleDateString()}</td>
                      <td>{match.unmatchedAt ? 'Unmatched' : 'Active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedMatch && (
          <div className="admin-match-details">
            <h3>Match Details</h3>
            <div className="admin-match-info">
              <div className="admin-info-row">
                <span className="admin-info-label">Match ID:</span>
                <span className="admin-info-value admin-uid-value">{selectedMatch.id}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">User 1:</span>
                <span className="admin-info-value admin-uid-value">{selectedMatch.user1Uid}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">User 2:</span>
                <span className="admin-info-value admin-uid-value">{selectedMatch.user2Uid}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Created:</span>
                <span className="admin-info-value">
                  {new Date(selectedMatch.createdAt).toLocaleString()}
                </span>
              </div>
              {selectedMatch.unmatchedAt && (
                <div className="admin-info-row">
                  <span className="admin-info-label">Unmatched:</span>
                  <span className="admin-info-value">
                    {new Date(selectedMatch.unmatchedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="admin-match-actions">
              {!selectedMatch.unmatchedAt && (
                <button
                  onClick={() => handleUnmatch(selectedMatch.id)}
                  disabled={processing === selectedMatch.id}
                  className="admin-match-button unmatch"
                >
                  {processing === selectedMatch.id ? 'Unmatching...' : 'Unmatch Users'}
                </button>
              )}

              <div className="admin-match-user-actions">
                <h4>User Actions</h4>
                <div className="admin-grant-field">
                  <label>Mute Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={muteDuration}
                    onChange={(e) => setMuteDuration(parseInt(e.target.value) || 24)}
                  />
                </div>
                <div className="admin-match-user-buttons">
                  <button
                    onClick={() => handleMuteUser(selectedMatch.user1Uid)}
                    disabled={processing === selectedMatch.user1Uid}
                    className="admin-match-button mute"
                  >
                    Mute User 1
                  </button>
                  <button
                    onClick={() => handleMuteUser(selectedMatch.user2Uid)}
                    disabled={processing === selectedMatch.user2Uid}
                    className="admin-match-button mute"
                  >
                    Mute User 2
                  </button>
                </div>
                <div className="admin-match-user-buttons">
                  <button
                    onClick={() => handleClearMessageTokens(selectedMatch.user1Uid)}
                    disabled={processing === selectedMatch.user1Uid}
                    className="admin-match-button clear"
                  >
                    Clear User 1 Tokens
                  </button>
                  <button
                    onClick={() => handleClearMessageTokens(selectedMatch.user2Uid)}
                    disabled={processing === selectedMatch.user2Uid}
                    className="admin-match-button clear"
                  >
                    Clear User 2 Tokens
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-match-messages">
              <h4>Messages ({messages.length})</h4>
              {messages.length === 0 ? (
                <div className="admin-empty-state">No messages found</div>
              ) : (
                <div className="admin-messages-list">
                  {messages.map((msg: any, index) => (
                    <div key={index} className="admin-message-item">
                      <div className="admin-message-header">
                        <span className="admin-message-sender">{msg.senderUid?.substring(0, 8)}...</span>
                        <span className="admin-message-time">
                          {new Date(msg.createdAt || msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="admin-message-content">{msg.content || msg.text || JSON.stringify(msg)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

