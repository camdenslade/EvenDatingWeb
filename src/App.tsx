import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import Suggestions from './pages/Suggestions'
import Support from './pages/Support'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAdmins from './pages/admin/Admins'
import AdminUsers from './pages/admin/Users'
import AdminPhotos from './pages/admin/Photos'
import AdminReports from './pages/admin/Reports'
import AdminReviews from './pages/admin/Reviews'
import AdminMatches from './pages/admin/Matches'
import AdminRateLimit from './pages/admin/RateLimit'
import AdminQueue from './pages/admin/Queue'
import AdminAudit from './pages/admin/Audit'
import AdminTokens from './pages/admin/Tokens'
import AdminConfigFlags from './pages/admin/ConfigFlags'
import AdminDataExport from './pages/admin/DataExport'
import AdminSystemHealth from './pages/admin/SystemHealth'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import './App.css'

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAdmins />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/photos"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminPhotos />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminReviews />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matches"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminMatches />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rate-limit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminRateLimit />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/queue"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminQueue />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAudit />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tokens"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminTokens />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/config-flags"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminConfigFlags />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/data-export"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDataExport />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/health"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSystemHealth />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  )
}

export default App

