//********************************************************************
//
// AdminAdmins Page
//
// Admin management page for viewing, adding, and removing admins.
//
//*******************************************************************

import { useEffect, useState, FormEvent } from 'react';
import { adminApi, Admin } from '../../services/adminApi';
import './Admins.css';
import './shared.css';

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    uid: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getAdmins();
      setAdmins(result);
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.uid) {
      setMessage('Email and UID are required');
      return;
    }

    setAdding(true);
    setMessage(null);
    try {
      await adminApi.createAdmin(formData.email, formData.uid);
      setMessage('Admin added successfully');
      setFormData({ email: '', uid: '' });
      setShowAddForm(false);
      await loadAdmins();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to add admin');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) {
      return;
    }

    setDeleting(uid);
    setMessage(null);
    try {
      await adminApi.deleteAdmin(uid);
      setMessage('Admin removed successfully');
      await loadAdmins();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to remove admin');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="admin-admins">
      <div className="admin-admins-header">
        <h2>Admin Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="admin-add-button"
        >
          {showAddForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="admin-add-form-container">
          <form onSubmit={handleSubmit} className="admin-add-form">
            <div className="admin-grant-field">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="admin@example.com"
              />
            </div>
            <div className="admin-grant-field">
              <label>Cognito Sub</label>
              <input
                type="text"
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                required
                placeholder="Cognito user sub"
              />
            </div>
            <div className="admin-add-form-actions">
              <button
                type="submit"
                disabled={adding}
                className="admin-grant-button"
              >
                {adding ? 'Adding...' : 'Add Admin'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ email: '', uid: '' });
                }}
                className="admin-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading admins...</div>
      ) : admins.length === 0 ? (
        <div className="admin-empty-state">No admins found</div>
      ) : (
        <div className="admin-admins-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>UID</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.email}</td>
                  <td className="admin-uid-cell">{admin.uid}</td>
                  <td>{new Date(admin.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(admin.uid)}
                      disabled={deleting === admin.uid}
                      className="admin-delete-button"
                    >
                      {deleting === admin.uid ? 'Removing...' : 'Remove'}
                    </button>
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

