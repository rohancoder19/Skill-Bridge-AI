import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, LogIn, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GaugeChart from '../components/GaugeChart';
import RadarChart from '../components/RadarChart';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, register, user, error, loading } = useApp();
  // Auth states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('candidate');
  const [authError, setAuthError] = useState('');

  // Handle modal submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (isRegister) {
      if (!authForm.name || !authForm.email || !authForm.password) {
        setAuthError('All fields are required');
        return;
      }
      const success = await register(authForm.name, authForm.email, authForm.password, role);
      if (success) {
        setShowAuthModal(false);
        navigate('/dashboard');
      } else {
        setAuthError(error || 'Registration failed');
      }
    } else {
      if (!authForm.email || !authForm.password) {
        setAuthError('Email and Password are required');
        return;
      }
      const success = await login(authForm.email, authForm.password);
      if (success) {
        setShowAuthModal(false);
        navigate('/dashboard');
      } else {
        setAuthError(error || 'Invalid credentials');
      }
    }
  };

  // Quick Demo Auto-login
  const handleDemoLogin = async () => {
    const success = await login('alex@example.com', 'password123');
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRecruiterDemoLogin = async () => {
    const success = await login('recruiter@example.com', 'password123');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <header className="landing-navbar" style={styles.navbar}>
        <div style={styles.logo}>
          <div style={styles.logoDot} />
          <span>Skill-Bridge AI</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.linkBtn}>English</button>
          <button style={styles.linkBtn}>Explore Features</button>
          {user ? (
            <button onClick={() => navigate('/dashboard')} style={styles.navActionBtn}>
              Dashboard <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={() => { setIsRegister(false); setShowAuthModal(true); }} style={styles.navActionBtn}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Hero Grid */}
      <main className="hero-grid" style={styles.heroGrid}>
        {/* Left Side: Headline */}
        <div style={styles.heroText}>
          <div style={styles.tagline}>
            <span style={styles.taglineDot} /> Al-Powered Career Platform
          </div>
          <h1 style={styles.headline}>
            AI that builds <br/>
            your <span style={styles.highlightPurple}>skills</span>, perfects <br/>
            your <span style={styles.highlightPurple}>resume</span> and <br/>
            brings you closer <br/>
            to your <span style={styles.highlightBlue}>dream job.</span>
          </h1>
          <p style={styles.description}>
            From creating ATS-friendly resumes to finding the right jobs and analyzing your skills—Skill-Bridge AI is your all-in-one career companion.
          </p>
          
          <div style={styles.buttonGroup}>
            {user ? (
              <button onClick={() => navigate('/dashboard')} style={styles.signUpBtn}>
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button onClick={() => { setIsRegister(true); setShowAuthModal(true); }} style={styles.signUpBtn}>
                  Sign Up <ArrowRight size={16} />
                </button>
                <button onClick={() => { setIsRegister(false); setShowAuthModal(true); }} style={styles.signInBtn}>
                  Sign In
                </button>
              </>
            )}
          </div>

          <div style={styles.socialProof}>
            <div style={styles.avatarsDeck}>
              <div style={{ ...styles.miniAvatar, background: '#a5b4fc' }}>AJ</div>
              <div style={{ ...styles.miniAvatar, background: '#93c5fd', marginLeft: '-8px' }}>MD</div>
              <div style={{ ...styles.miniAvatar, background: '#c084fc', marginLeft: '-8px' }}>SK</div>
            </div>
            <span style={styles.socialText}>Loved by <strong style={{ color: '#fff' }}>50,000+</strong> job seekers worldwide</span>
          </div>
        </div>

        {/* Right Side: Interactive Bridge & Floating widgets */}
        <div className="hero-visuals" style={styles.heroVisuals}>
          {/* Glowing central bridge background */}
          <div style={styles.bridgeGlow} />

          {/* Floating Widget 1: Resume Score dial */}
          <div style={{ ...styles.floatingCard, top: '5%', right: '5%', width: '180px' }}>
            <span style={styles.cardHeader}>Resume Score</span>
            <div style={{ margin: '15px 0' }}>
              <GaugeChart score={92} size={90} strokeWidth={8} showDetails={false} />
            </div>
            <div style={styles.metricsList}>
              <div style={styles.metricRow}><span>Content</span><span style={{ color: 'var(--success)' }}>Excellent</span></div>
              <div style={styles.metricRow}><span>Skills</span><span style={{ color: 'var(--success)' }}>Excellent</span></div>
            </div>
          </div>

          {/* Floating Widget 2: Resume editor simulation */}
          <div style={{ ...styles.floatingCard, top: '28%', left: '0%', width: '210px' }}>
            <div style={styles.editorSimHeader}>
              <span style={styles.editorDot} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Resume Builder</span>
            </div>
            <div style={styles.editorUserCard}>
              <div style={styles.editorAvatar} />
              <div>
                <div style={{ height: '10px', width: '70px', background: '#fff', borderRadius: '2px', marginBottom: '4px' }} />
                <div style={{ height: '6px', width: '90px', background: 'var(--text-dim)', borderRadius: '2px' }} />
              </div>
            </div>
            <div style={styles.editorRows}>
              <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
              <div style={{ height: '6px', width: '85%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
              <div style={{ height: '6px', width: '50%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
            </div>
            <button style={styles.editorBtn}>✨ Optimize with AI</button>
          </div>

          {/* Floating Widget 3: Skill radar chart */}
          <div style={{ ...styles.floatingCard, bottom: '5%', right: '5%', width: '220px' }}>
            <span style={styles.cardHeader}>Skill Analysis</span>
            <RadarChart 
              size={130} 
              data={[
                { label: 'Comm', value: 85 },
                { label: 'Tech', value: 92 },
                { label: 'Prob', value: 88 },
                { label: 'Lead', value: 75 },
                { label: 'Creat', value: 80 }
              ]} 
            />
          </div>

          {/* Floating Widget 4: Job Matches list */}
          <div style={{ ...styles.floatingCard, top: '40%', right: '0%', width: '170px' }}>
            <span style={styles.cardHeader}>Job Matches</span>
            <div style={styles.jobsHeadline}>
              <span style={styles.jobsVal}>24</span>
              <span style={styles.jobsTrend}>+12%</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>New matches</span>
            <div style={styles.jobsGraph}>
              <div style={{ ...styles.graphBar, height: '10px' }} />
              <div style={{ ...styles.graphBar, height: '18px' }} />
              <div style={{ ...styles.graphBar, height: '24px', background: 'var(--primary)' }} />
              <div style={{ ...styles.graphBar, height: '12px' }} />
              <div style={{ ...styles.graphBar, height: '35px', background: 'var(--secondary)' }} />
            </div>
          </div>
        </div>
      </main>

      {/* Sponsoring Companies Deck */}
      <section style={styles.sponsorsSection}>
        <p style={styles.sponsorsTitle}>Trusted by professionals from</p>
        <div style={styles.sponsorsGrid}>
          <span>Google</span>
          <span>Microsoft</span>
          <span>Amazon</span>
          <span>LinkedIn</span>
          <span>Spotify</span>
          <span>Airbnb</span>
        </div>
      </section>

      {/* Bottom Features Deck */}
      <section className="features-section" style={styles.featuresSection}>
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(99, 102, 241, 0.1)' }}>📄</div>
          <h3>AI Resume Builder</h3>
          <p>Create ATS-friendly resumes that get you noticed.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(6, 182, 212, 0.1)' }}>🔍</div>
          <h3>Resume Analyzer</h3>
          <p>Get AI-powered feedback to improve your resume score.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(59, 130, 246, 0.1)' }}>💼</div>
          <h3>Smart Job Search</h3>
          <p>Find the right jobs that match your skills and goals.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(245, 158, 11, 0.1)' }}>📈</div>
          <h3>Skill Assessment</h3>
          <p>Analyze and showcase your skills with confidence.</p>
        </div>
      </section>

      {/* Auth Modal overlay */}
      {showAuthModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card auth-modal-content" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowAuthModal(false)}>×</button>
            </div>
            
            {authError && (
              <div style={styles.errorBanner}>
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={styles.authForm}>
              {isRegister && (
                <>
                  <div style={styles.inputGroup}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      placeholder="Enter your name"
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label>Account Type</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="role"
                          value="candidate"
                          checked={role === 'candidate'}
                          onChange={() => setRole('candidate')}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        Job Seeker
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="role"
                          value="recruiter"
                          checked={role === 'recruiter'}
                          onChange={() => setRole('recruiter')}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        Recruiter
                      </label>
                    </div>
                  </div>
                </>
              )}
              <div style={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="alex.johnson@example.com"
                  style={styles.formInput}
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••"
                  style={styles.formInput}
                />
              </div>

              <button type="submit" disabled={loading} style={styles.modalSubmitBtn}>
                {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
              </button>
            </form>

            <div style={styles.modalFooter}>
              <span>
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button 
                style={styles.toggleAuthBtn}
                onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
            
            {!isRegister && (
              <div style={styles.quickFill}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Quick login for testing:</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={handleDemoLogin} style={styles.demoFillBtn}>
                    Candidate (Alex)
                  </button>
                  <button onClick={handleRecruiterDemoLogin} style={{ ...styles.demoFillBtn, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                    Recruiter (Sarah)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 5vw',
  },
  navbar: {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    boxShadow: '0 0 10px var(--primary)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  linkBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    ':hover': { color: '#fff' }
  },
  navActionBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-light)',
    padding: '8px 16px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '40px',
    padding: '60px 0',
    flex: 1,
    alignItems: 'center',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
  },
  tagline: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--primary)',
    marginBottom: '28px',
  },
  taglineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
  },
  headline: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '52px',
    fontWeight: 800,
    lineHeight: '1.15',
    color: '#fff',
    marginBottom: '24px',
  },
  highlightPurple: {
    color: 'transparent',
    background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)',
    WebkitBackgroundClip: 'text',
  },
  highlightBlue: {
    color: 'transparent',
    background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
  },
  description: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    maxWidth: '520px',
    marginBottom: '36px',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '40px',
  },
  signUpBtn: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
    transition: 'transform 0.2s ease',
  },
  signInBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#fff',
    border: '1px solid var(--border-light)',
    borderRadius: '24px',
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  demoBtn: {
    background: 'transparent',
    color: 'var(--accent-cyan)',
    border: '1px dashed var(--accent-cyan)',
    borderRadius: '24px',
    padding: '14px 24px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  socialProof: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarsDeck: {
    display: 'flex',
    alignItems: 'center',
  },
  miniAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: '2px solid var(--bg-darker)',
    fontSize: '8px',
    fontWeight: 700,
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: '12px',
    color: 'var(--text-dim)',
  },
  heroVisuals: {
    position: 'relative',
    height: '480px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgeGlow: {
    position: 'absolute',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
    filter: 'blur(30px)',
  },
  floatingCard: {
    position: 'absolute',
    background: 'rgba(17, 24, 39, 0.75)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '16px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)',
  },
  cardHeader: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  editorSimHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  editorDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
  },
  editorUserCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.02)',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  editorAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
  },
  editorRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '15px',
  },
  editorBtn: {
    width: '100%',
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  jobsHeadline: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginTop: '10px',
  },
  jobsVal: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#fff',
  },
  jobsTrend: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--success)',
  },
  jobsGraph: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    height: '40px',
    marginTop: '12px',
  },
  graphBar: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '2px 2px 0 0',
  },
  sponsorsSection: {
    textAlign: 'center',
    padding: '40px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  sponsorsTitle: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '24px',
  },
  sponsorsGrid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '5vw',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dim)',
  },
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    padding: '60px 0',
  },
  featureCard: {
    background: 'rgba(17, 24, 39, 0.4)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'left',
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    marginBottom: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(3, 5, 10, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modalContent: {
    width: '420px',
    padding: '30px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '24px',
    cursor: 'pointer',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--danger-glow)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '10px 14px',
    borderRadius: '8px',
    color: 'var(--danger)',
    fontSize: '12px',
    marginBottom: '16px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formInput: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    padding: '10px 14px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    ':focus': { borderColor: 'var(--primary)' }
  },
  modalSubmitBtn: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
  modalFooter: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  toggleAuthBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 600,
    marginLeft: '6px',
    cursor: 'pointer',
  },
  quickFill: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px dashed var(--border-light)',
    textAlign: 'center',
  },
  demoFillBtn: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  }
};
