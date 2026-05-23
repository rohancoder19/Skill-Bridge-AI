import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon,
  Bell, 
  Lock, 
  Eye, 
  Palette, 
  Shield, 
  Check, 
  Save 
} from 'lucide-react';

export default function Settings() {
  const { user } = useApp();

  // Settings State Simulation
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [shareAts, setShareAts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [themeGlow, setThemeGlow] = useState('indigo'); // indigo, cyan, emerald
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate save duration
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="main-content" style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Account Settings</h1>
            <p style={styles.subtitle}>Configure preferences, notifications, security, and theme settings.</p>
          </div>
        </header>

        <form onSubmit={handleSaveSettings} style={styles.settingsGrid}>
          {/* Left Column: Preferences */}
          <div style={styles.leftCol}>
            {/* Notification settings */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardHeading}>
                <Bell size={18} style={styles.iconHeading} />
                <span>Notification Preferences</span>
              </h3>
              
              <div style={styles.settingRow}>
                <div>
                  <span style={styles.settingLabel}>Email Job Matches</span>
                  <p style={styles.settingDesc}>Get instant notifications when new jobs score above an 80% ATS compatibility check.</p>
                </div>
                <label style={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts} 
                    onChange={() => setEmailAlerts(!emailAlerts)} 
                    style={styles.switchInput}
                  />
                  <span style={styles.slider} />
                </label>
              </div>

              <div style={styles.divider} />

              <div style={styles.settingRow}>
                <div>
                  <span style={styles.settingLabel}>Weekly Career Digest</span>
                  <p style={styles.settingDesc}>Receive tailored articles on optimizing your resume keywords and dashboard stats.</p>
                </div>
                <label style={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={weeklyDigest} 
                    onChange={() => setWeeklyDigest(!weeklyDigest)} 
                    style={styles.switchInput}
                  />
                  <span style={styles.slider} />
                </label>
              </div>
            </div>

            {/* Profile Visibility */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardHeading}>
                <Eye size={18} style={styles.iconHeading} />
                <span>Profile Visibility</span>
              </h3>

              <div style={styles.settingRow}>
                <div>
                  <span style={styles.settingLabel}>Visible to Headhunters</span>
                  <p style={styles.settingDesc}>Allow recruiters to view your parsed resumes and contact details in search results.</p>
                </div>
                <label style={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={isPublic} 
                    onChange={() => setIsPublic(!isPublic)} 
                    style={styles.switchInput}
                  />
                  <span style={styles.slider} />
                </label>
              </div>

              <div style={styles.divider} />

              <div style={styles.settingRow}>
                <div>
                  <span style={styles.settingLabel}>Share ATS Match Scores</span>
                  <p style={styles.settingDesc}>Automatically attach your ATS compatibility reports to applications submitted on platform.</p>
                </div>
                <label style={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={shareAts} 
                    onChange={() => setShareAts(!shareAts)} 
                    style={styles.switchInput}
                  />
                  <span style={styles.slider} />
                </label>
              </div>
            </div>

            {/* Aesthetics / Theme */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardHeading}>
                <Palette size={18} style={styles.iconHeading} />
                <span>Theme Glow Variations</span>
              </h3>
              <p style={{ ...styles.settingDesc, marginBottom: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Select an accent glow color theme for your premium MERN dashboard components.
              </p>
              
              <div style={styles.themeSelectorGrid}>
                <button
                  type="button"
                  onClick={() => setThemeGlow('indigo')}
                  style={{
                    ...styles.themeChip,
                    borderColor: themeGlow === 'indigo' ? 'var(--primary)' : 'var(--border-light)',
                    backgroundColor: themeGlow === 'indigo' ? 'rgba(99, 102, 241, 0.08)' : 'transparent'
                  }}
                >
                  <div style={{ ...styles.themeColorDot, backgroundColor: '#6366f1' }} />
                  <span>Indigo Cyber</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeGlow('cyan')}
                  style={{
                    ...styles.themeChip,
                    borderColor: themeGlow === 'cyan' ? 'var(--accent-cyan)' : 'var(--border-light)',
                    backgroundColor: themeGlow === 'cyan' ? 'rgba(6, 182, 212, 0.08)' : 'transparent'
                  }}
                >
                  <div style={{ ...styles.themeColorDot, backgroundColor: '#06b6d4' }} />
                  <span>Neon Cyan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeGlow('emerald')}
                  style={{
                    ...styles.themeChip,
                    borderColor: themeGlow === 'emerald' ? 'var(--success)' : 'var(--border-light)',
                    backgroundColor: themeGlow === 'emerald' ? 'rgba(16, 185, 129, 0.08)' : 'transparent'
                  }}
                >
                  <div style={{ ...styles.themeColorDot, backgroundColor: '#10b981' }} />
                  <span>Matrix Emerald</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Security */}
          <div style={styles.rightCol}>
            {/* Password security */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardHeading}>
                <Lock size={18} style={styles.iconHeading} />
                <span>Change Password</span>
              </h3>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Advanced Shield Settings */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardHeading}>
                <Shield size={18} style={styles.iconHeading} />
                <span>Security & Identity</span>
              </h3>

              <div style={styles.settingRow}>
                <div>
                  <span style={styles.settingLabel}>Two-Factor Authentication</span>
                  <p style={styles.settingDesc}>Enforce additional authorization code step on login routes.</p>
                </div>
                <label style={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={twoFactor} 
                    onChange={() => setTwoFactor(!twoFactor)} 
                    style={styles.switchInput}
                  />
                  <span style={styles.slider} />
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div style={styles.actionsBlock}>
              <button
                type="submit"
                className="btn-primary"
                style={styles.saveBtn}
                disabled={isSaving}
              >
                {isSaving ? (
                  'Applying preferences...'
                ) : saveSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Preferences Saved</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    padding: '24px',
  },
  cardHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
  },
  iconHeading: {
    color: 'var(--primary)',
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
  },
  settingLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  settingDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-light)',
    margin: '16px 0',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '42px',
    height: '24px',
    flexShrink: 0,
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    transition: '.3s',
    border: '1px solid var(--border-light)',
    ':before': {
      position: 'absolute',
      content: '""',
      height: '16px',
      width: '16px',
      left: '3px',
      bottom: '3px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      transition: '.3s',
    },
    'input:checked + &': {
      backgroundColor: 'var(--primary)',
      borderColor: 'rgba(99, 102, 241, 0.4)',
    },
    'input:checked + &:before': {
      transform: 'translateX(18px)',
      backgroundColor: '#fff',
    }
  },
  themeSelectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
  },
  themeChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  themeColorDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  actionsBlock: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  saveBtn: {
    width: '100%',
    justifyContent: 'center',
  }
};
