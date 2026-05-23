import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  FileCheck, 
  Briefcase, 
  Bookmark, 
  Send, 
  User, 
  Settings, 
  Crown,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();

  const menuItems = user?.role === 'recruiter'
    ? [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Post a Job', icon: Briefcase, path: '/post-job' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Settings', icon: Settings, path: '/settings' },
      ]
    : [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Generate Resume', icon: FileText, path: '/resume-builder' },
        { name: 'ATS Analyzer', icon: FileCheck, path: '/ats-analyzer' },
        { name: 'Job Search', icon: Briefcase, path: '/job-search' },
        { name: 'Saved Jobs', icon: Bookmark, path: '/saved-jobs' },
        { name: 'Applications', icon: Send, path: '/applications' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Settings', icon: Settings, path: '/settings' },
      ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo Section */}
      <div style={styles.logoSection} onClick={() => navigate('/')}>
        <div style={styles.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 style={styles.logoText}>Skill-Bridge AI</h1>
          <p style={styles.logoSubtext}>AI-Powered Career Platform</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              style={{
                ...styles.navButton,
                ...(isActive ? styles.navButtonActive : {})
              }}
            >
              <Icon size={18} style={isActive ? styles.iconActive : styles.icon} />
              <span style={isActive ? styles.labelActive : styles.label}>{item.name}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Upgrade to Pro Card */}
      <div style={styles.proCard}>
        <div style={styles.proCrown}>
          <Crown size={16} color="#f59e0b" fill="#f59e0b" />
          <span style={styles.proTitle}>Upgrade to Pro</span>
        </div>
        <p style={styles.proText}>Unlock premium features and boost your career journey.</p>
        <button style={styles.proButton}>Upgrade Now</button>
      </div>

      {/* User Session Info / Logout */}
      {user && (
        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            {user.name.charAt(0)}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user.name}</span>
            <span style={styles.userPlan}>{user.role === 'recruiter' ? 'Recruiter Account' : 'Premium Plan'}</span>
          </div>
          <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    zIndex: 100,
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    cursor: 'pointer',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '-0.3px',
    background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoSubtext: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  navButtonActive: {
    background: 'rgba(99, 102, 241, 0.08)',
  },
  icon: {
    color: 'var(--text-muted)',
    transition: 'color 0.2s ease',
  },
  iconActive: {
    color: 'var(--primary)',
  },
  label: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'color 0.2s ease',
  },
  labelActive: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: '3px',
    backgroundColor: 'var(--primary)',
    borderRadius: '0 4px 4px 0',
  },
  proCard: {
    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
  },
  proCrown: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  proTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#fff',
  },
  proText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  proButton: {
    width: '100%',
    padding: '8px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
    transition: 'transform 0.2s ease',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-light)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    color: '#fff',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  userName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userPlan: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
};
