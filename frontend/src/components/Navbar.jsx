import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      {/* Search Bar */}
      <div style={styles.searchBar}>
        <Search size={16} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search for jobs, skills, companies..."
          style={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/job-search?keyword=${encodeURIComponent(e.target.value)}`);
            }
          }}
        />
      </div>

      {/* Right Side Info */}
      <div style={styles.rightSide}>
        {/* Notifications */}
        <button style={styles.iconButton} title="Notifications">
          <Bell size={18} />
          <div style={styles.notificationBadge} />
        </button>

        {/* User Card */}
        {user && (
          <div style={styles.userCard} onClick={() => navigate('/profile')}>
            <div style={styles.avatar}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>{user.name}</span>
              <span style={styles.userPlan}>Premium Plan</span>
            </div>
            <ChevronDown size={14} style={styles.chevron} />
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    borderBottom: '1px solid var(--border-light)',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(6, 9, 19, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 90,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(17, 24, 39, 0.6)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '0 16px',
    width: '400px',
    height: '40px',
    gap: '10px',
    transition: 'all 0.2s ease',
    ':focus-within': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 10px var(--primary-glow)',
    }
  },
  searchIcon: {
    color: 'var(--text-dim)',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    '::placeholder': {
      color: 'var(--text-dim)',
    }
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid var(--border-light)',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#fff',
      borderColor: 'var(--border-hover)',
    }
  },
  notificationBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--danger)',
    border: '2px solid var(--bg-darker)',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 12px 4px 6px',
    borderRadius: '24px',
    border: '1px solid var(--border-light)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--border-hover)',
      background: 'rgba(255,255,255,0.02)',
    }
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '12px',
    color: '#fff',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
  },
  userPlan: {
    fontSize: '9px',
    color: 'var(--text-muted)',
  },
  chevron: {
    color: 'var(--text-dim)',
  }
};
