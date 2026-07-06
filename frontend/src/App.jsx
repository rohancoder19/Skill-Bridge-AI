import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Menu } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSAnalyzer from './pages/ATSAnalyzer';
import JobSearch from './pages/JobSearch';
import SavedJobs from './pages/SavedJobs';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PostJob from './pages/PostJob';

// Components
import Sidebar from './components/Sidebar';

function AppContent() {
  const { user, loading, token } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // If loading session profile on startup, show loading layout
  if (loading && token) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Syncing secure session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing page (No sidebar) */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

      {/* Protected Routes (Wrapper Layout with Sidebar) */}
      <Route
        path="/*"
        element={
          user ? (
            <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              
              {/* Backdrop overlay for mobile sidebar */}
              {isSidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
              )}
              
              {/* Top bar for mobile only */}
              <header className="mobile-header">
                <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
                  <Menu size={24} />
                </button>
                <div className="mobile-logo" onClick={() => { setIsSidebarOpen(false); navigate('/'); }}>
                  <div className="mobile-logo-dot" />
                  <span>Skill-Bridge AI</span>
                </div>
                {user && (
                  <div className="mobile-avatar" onClick={() => { setIsSidebarOpen(false); navigate('/profile'); }}>
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </header>
              
              <main className="main-content">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  <Route path="/ats-analyzer" element={<ATSAnalyzer />} />
                  <Route path="/job-search" element={<JobSearch />} />
                  <Route path="/saved-jobs" element={<SavedJobs />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  {user?.role === 'recruiter' && (
                    <Route path="/post-job" element={<PostJob />} />
                  )}
                  {/* Catch-all redirects to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#060913',
    fontFamily: 'Inter, sans-serif',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(99, 102, 241, 0.1)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

// Add standard keyframe spin styles inline or in css
const spinStyle = document.createElement('style');
spinStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinStyle);
