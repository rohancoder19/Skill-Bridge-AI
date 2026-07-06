import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Briefcase, 
  FileText, 
  Plus, 
  X, 
  Check, 
  Award,
  Bookmark,
  Send,
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const { user, token, saveResume, login } = useApp();
  
  // Local states
  const [name, setName] = useState('');
  const [targetTitle, setTargetTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stats derived from Context
  const { jobs, applications } = useApp();
  const bookmarkedCount = user?.savedJobs?.length || 0;
  const appliedCount = applications?.length || 0;

  // Initialize
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTargetTitle(user.targetTitle || '');
      setSummary(user.summary || '');
      setSkills(user.skills || []);
    }
  }, [user]);

  // Skill recommendation pool
  const recommendedPool = {
    'product designer': ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'User Research', 'Wireframing', 'Design System', 'Interaction Design', 'Usability Testing', 'Agile Workflow'],
    'ui/ux designer': ['Figma', 'UI Design', 'UX Design', 'Interaction Design', 'Usability Testing', 'Design System', 'Adobe XD', 'Sketch', 'Wireframing'],
    'full stack developer': ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'HTML/CSS', 'RESTful APIs', 'Git', 'Next.js', 'AWS']
  };

  const getRecommendations = () => {
    const titleKey = (targetTitle || '').toLowerCase().trim();
    if (recommendedPool[titleKey]) {
      return recommendedPool[titleKey].filter(skill => !skills.map(s => s.toLowerCase()).includes(skill.toLowerCase()));
    }
    // Default general tech suggestions
    return ['Figma', 'React.js', 'Node.js', 'JavaScript', 'TypeScript', 'UI Design', 'Project Management']
      .filter(skill => !skills.map(s => s.toLowerCase()).includes(skill.toLowerCase()));
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Profile strength calculator
  const calculateStrength = () => {
    let score = 10; // base register score
    if (name.trim()) score += 20;
    if (targetTitle.trim()) score += 20;
    if (summary.trim()) score += 20;
    if (skills.length >= 3) score += 15;
    if (skills.length >= 7) score += 15;
    return Math.min(100, score);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const newStrength = calculateStrength();
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name,
          targetTitle,
          summary,
          skills,
          profileStrength: newStrength
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // Since login or contextual token updates are handled globally,
        // we can force updating context by updating localStorage or refreshing page data.
        // We'll update the user object locally by mimicking what AppContext does.
        // Let's reload profile data or update user token storage.
        
        // Quick visual success
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // Reload page to re-bootstrap state
        window.location.reload();
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const strength = calculateStrength();

  return (
    <div style={styles.container}>
      <header className="page-header" style={styles.header}>
          <div>
            <h1 style={styles.title}>My Career Profile</h1>
            <p style={styles.subtitle}>Manage your professional identity, skills, and target career direction.</p>
          </div>
        </header>

        <div className="profile-layout" style={styles.profileLayout}>
          {/* Left Column: Visual summary cards */}
          <div style={styles.summaryCol}>
            {/* User Profile Card */}
            <div className="glass-card" style={styles.profileCard}>
              <div style={styles.avatarWrapper}>
                <div style={styles.avatar}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 style={styles.userName}>{name || 'Your Name'}</h2>
                <p style={styles.userRole}>{targetTitle || 'Add Target Role'}</p>
              </div>

              <div style={styles.divider} />

              <div style={styles.detailsList}>
                <div style={styles.detailItem}>
                  <Mail size={16} style={{ color: 'var(--text-dim)' }} />
                  <span style={styles.detailText}>{user?.email || 'email@example.com'}</span>
                </div>
                <div style={styles.detailItem}>
                  <Briefcase size={16} style={{ color: 'var(--text-dim)' }} />
                  <span style={styles.detailText}>{targetTitle || 'Not configured'}</span>
                </div>
              </div>
            </div>

            {/* Profile Strength Card */}
            <div className="glass-card" style={styles.strengthCard}>
              <h3 style={styles.cardHeading}>Profile Strength</h3>
              
              <div style={styles.gaugeContainer}>
                {/* SVG Progress Circle */}
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#strengthGradient)"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - strength / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                  <defs>
                    <linearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                  </defs>
                  <text
                    x="60"
                    y="65"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="22"
                    fontWeight="800"
                  >
                    {strength}%
                  </text>
                </svg>
              </div>

              <p style={styles.strengthText}>
                {strength < 50 
                  ? 'Complete your profile details to unlock accurate job matching scores.' 
                  : strength < 80 
                    ? 'Good progress! Add more skills to increase match accuracy.' 
                    : 'Excellent! Your profile is complete and optimized for AI scoring.'}
              </p>
            </div>

            {/* Platform Stats Card */}
            <div className="glass-card" style={styles.statsCard}>
              <h3 style={styles.cardHeading}>Quick Activity</h3>
              <div className="stats-grid" style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <Bookmark size={20} style={{ color: 'var(--primary)' }} />
                  <span style={styles.statVal}>{bookmarkedCount}</span>
                  <span style={styles.statLabel}>Saved Jobs</span>
                </div>
                <div style={styles.statBox}>
                  <Send size={20} style={{ color: 'var(--success)' }} />
                  <span style={styles.statVal}>{appliedCount}</span>
                  <span style={styles.statLabel}>Applications</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form fields & Skills setup */}
          <div style={styles.formCol}>
            <form onSubmit={handleSave} className="glass-card" style={styles.formCard}>
              <h3 style={styles.sectionHeading}>Basic Information</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Target Job Title</label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="Product Designer"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Professional Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe your career goals, key specialties, and achievements..."
                  rows={4}
                  style={{ ...styles.input, resize: 'vertical' }}
                />
              </div>

              <div style={styles.divider} />

              <h3 style={styles.sectionHeading}>Skill Tag Database</h3>
              <p style={styles.subText}>
                Define the skills you possess. Our job search engine cross-references these tags with potential roles to display your compatibility percentage.
              </p>

              {/* Skills Tags List */}
              <div style={styles.tagsContainer}>
                {skills.length === 0 ? (
                  <span style={styles.noSkills}>No skills added yet. Add skills below.</span>
                ) : (
                  skills.map((skill) => (
                    <span key={skill} style={styles.tag}>
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        style={styles.removeTagBtn}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Skill Field */}
              <div style={styles.addSkillRow}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkill);
                    }
                  }}
                  placeholder="Type a skill (e.g. Figma, React, Python)..."
                  style={{ ...styles.input, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkill)}
                  className="btn-secondary"
                  style={styles.addSkillBtn}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              {/* Recommended Chips */}
              {getRecommendations().length > 0 && (
                <div style={styles.recsWrapper}>
                  <span style={styles.recsHeading}>
                    <Sparkles size={12} style={{ color: 'var(--warning)', marginRight: '4px' }} />
                    Suggested for "{targetTitle || 'Your Role'}":
                  </span>
                  <div style={styles.recsList}>
                    {getRecommendations().slice(0, 6).map((rec) => (
                      <button
                        key={rec}
                        type="button"
                        onClick={() => handleAddSkill(rec)}
                        style={styles.recChip}
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.actions}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={styles.submitBtn}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    'Saving changes...'
                  ) : saveSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Changes Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Award size={16} />
                      <span>Save Career Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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
  profileLayout: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '30px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  summaryCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '30px 24px',
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '16px',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  userName: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '4px',
  },
  userRole: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--border-light)',
    margin: '16px 0',
  },
  detailsList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: 'var(--text-main)',
  },
  detailText: {
    wordBreak: 'break-all',
  },
  strengthCard: {
    padding: '24px',
    textAlign: 'center',
  },
  cardHeading: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '20px',
  },
  gaugeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  strengthText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  statsCard: {
    padding: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '16px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  statVal: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
  formCol: {
    flex: 1,
  },
  formCard: {
    padding: '30px',
  },
  sectionHeading: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
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
    ':focus': {
      borderColor: 'var(--primary)',
    }
  },
  subText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px dashed var(--border-light)',
    borderRadius: '8px',
    marginBottom: '16px',
    minHeight: '60px',
    alignItems: 'center',
  },
  noSkills: {
    fontSize: '13px',
    color: 'var(--text-dim)',
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    color: 'var(--primary)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  },
  removeTagBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    opacity: 0.7,
    ':hover': {
      opacity: 1,
    }
  },
  addSkillRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  addSkillBtn: {
    padding: '0 20px',
    fontSize: '13px',
  },
  recsWrapper: {
    marginBottom: '30px',
  },
  recsHeading: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  recsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  recChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '20px',
    padding: '4px 12px',
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      color: '#fff',
      borderColor: 'var(--primary)',
    }
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '24px',
  },
  submitBtn: {
    minWidth: '220px',
    justifyContent: 'center',
  }
};
