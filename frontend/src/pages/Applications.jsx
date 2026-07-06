import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const { applications, user, token } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [localApps, setLocalApps] = useState(null);

  // Sync and allow local simulation of withdrawal
  const displayApps = localApps !== null ? localApps : applications;

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      const res = await fetch(`/api/jobs/applications/${appId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        }
      });
      if (res.ok) {
        // Filter out locally
        const updated = displayApps.filter(app => app._id !== appId);
        setLocalApps(updated);
      } else {
        alert('Failed to withdraw application');
      }
    } catch (err) {
      console.error(err);
      // Fallback local simulation if endpoint doesn't support DELETE
      const updated = displayApps.filter(app => app._id !== appId);
      setLocalApps(updated);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview':
        return <span className="badge-match" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.2)' }}>Interview Stage</span>;
      case 'Under Review':
        return <span className="badge-warning">Under Review</span>;
      case 'Rejected':
        return <span className="badge-danger">Rejected</span>;
      case 'Applied':
      default:
        return <span className="badge-info">Applied</span>;
    }
  };

  const getTimelineSteps = (status) => {
    const steps = [
      { label: 'Applied', key: 'Applied' },
      { label: 'Reviewing', key: 'Under Review' },
      { label: 'Interview', key: 'Interview' },
      { label: 'Result', key: 'Result' }
    ];

    let activeIndex = 0;
    if (status === 'Under Review') activeIndex = 1;
    if (status === 'Interview') activeIndex = 2;
    if (status === 'Rejected') activeIndex = 3;

    return (
      <div style={styles.timeline}>
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isRejected = status === 'Rejected' && idx === 3;
          
          return (
            <React.Fragment key={step.label}>
              <div style={styles.timelineNodeContainer}>
                <div style={{
                  ...styles.timelineNode,
                  ...(isCompleted ? styles.nodeCompleted : {}),
                  ...(isActive ? styles.nodeActive : {}),
                  ...(isRejected ? styles.nodeRejected : {})
                }}>
                  {isRejected ? (
                    <XCircle size={14} />
                  ) : isCompleted ? (
                    <CheckCircle2 size={14} />
                  ) : isActive ? (
                    <Clock size={14} />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span style={{
                  ...styles.timelineLabel,
                  ...(isActive ? styles.labelActive : {}),
                  ...(isRejected ? styles.labelRejected : {})
                }}>{isRejected ? 'Rejected' : step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div style={{
                  ...styles.timelineLine,
                  ...(idx < activeIndex ? styles.lineCompleted : {})
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const filteredApps = displayApps.filter(app => {
    if (!app.job) return false;
    const matchesSearch = 
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.container}>
      <header className="page-header" style={styles.header}>
          <div>
            <h1 style={styles.title}>Track Applications</h1>
            <p style={styles.subtitle}>Monitor the real-time status of your active job applications.</p>
          </div>
          
          <div style={styles.statsSummary}>
            <div className="glass-card" style={styles.miniStat}>
              <span style={styles.miniStatVal}>{displayApps.length}</span>
              <span style={styles.miniStatLabel}>Total Applications</span>
            </div>
            <div className="glass-card" style={styles.miniStat}>
              <span style={styles.miniStatVal} className="text-success">
                {displayApps.filter(a => a.status === 'Interview').length}
              </span>
              <span style={styles.miniStatLabel}>Interviews</span>
            </div>
          </div>
        </header>

        {/* Filter Toolbar */}
        <div className="glass-card toolbar-row" style={styles.toolbar}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterWrapper}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Application Cards List */}
        <div style={styles.list}>
          {filteredApps.length === 0 ? (
            <div className="glass-card" style={styles.empty}>
              <Briefcase size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
              <h3>No Applications Found</h3>
              <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>
                You haven't applied to any jobs that match your filter criteria. Explore the job board to find open roles.
              </p>
              <button className="btn-primary" onClick={() => navigate('/job-search')}>
                Explore Jobs
              </button>
            </div>
          ) : (
            filteredApps.map((app) => {
              const job = app.job;
              const dateStr = new Date(app.appliedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              // Simple skills comparison for rendering match percentage
              const userSkills = (user?.skills || []).map(s => s.toLowerCase());
              const jobSkills = (job.skills || []).map(s => s.toLowerCase());
              const matchedCount = jobSkills.filter(s => userSkills.includes(s) || userSkills.some(us => us.includes(s) || s.includes(us))).length;
              
              let matchPercent = 0;
              if (jobSkills.length > 0) {
                matchPercent = Math.round((matchedCount / jobSkills.length) * 90);
              } else {
                matchPercent = 50;
              }
              
              const userTitle = (user?.targetTitle || '').toLowerCase();
              const jobTitle = (job.title || '').toLowerCase();
              const titleMatch = jobTitle.includes(userTitle) || userTitle.split(' ').some(w => jobTitle.includes(w));
              if (titleMatch) {
                matchPercent = Math.min(100, matchPercent + 10);
              }

              return (
                <div key={app._id} className="glass-card" style={styles.card}>
                  <div className="card-main-grid" style={styles.cardMain}>
                    {/* Header Details */}
                    <div style={styles.detailsCol}>
                      <div style={styles.headerRow}>
                        <h2 style={styles.jobTitle}>{job.title}</h2>
                        {getStatusBadge(app.status)}
                      </div>
                      
                      <div style={styles.companyRow}>
                        <span style={styles.companyName}>{job.company}</span>
                        <span style={styles.dot}>•</span>
                        <span style={styles.jobType}>{job.jobType}</span>
                      </div>

                      <div style={styles.metaGrid}>
                        <div style={styles.metaItem}>
                          <MapPin size={14} style={styles.metaIcon} />
                          <span>{job.location}</span>
                        </div>
                        <div style={styles.metaItem}>
                          <DollarSign size={14} style={styles.metaIcon} />
                          <span>{job.salary}</span>
                        </div>
                        <div style={styles.metaItem}>
                          <Calendar size={14} style={styles.metaIcon} />
                          <span>Applied on {dateStr}</span>
                        </div>
                      </div>

                      {/* Matching Skills */}
                      <div style={styles.skillsWrapper}>
                        <span style={styles.skillsHeading}>Key Skills Required:</span>
                        <div style={styles.skillsList}>
                          {job.skills.map((skill) => {
                            const isMatch = userSkills.includes(skill.toLowerCase());
                            return (
                              <span
                                key={skill}
                                style={{
                                  ...styles.skillTag,
                                  ...(isMatch ? styles.skillMatch : styles.skillMissing)
                                }}
                              >
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Actions Column */}
                    <div className="timeline-col-responsive" style={styles.timelineCol}>
                      <div style={styles.rightHeader}>
                        <div style={styles.matchScoreBlock}>
                          <span style={styles.matchScoreVal}>{app.atsScore || user?.profileStrength || 75}</span>
                          <span style={styles.matchScoreLabel}>ATS Score</span>
                        </div>
                        <div style={{ ...styles.matchScoreBlock, marginLeft: '16px' }}>
                          <span style={{ ...styles.matchScoreVal, color: 'var(--primary)' }}>{matchPercent}%</span>
                          <span style={styles.matchScoreLabel}>Match Fit</span>
                        </div>
                      </div>

                      {getTimelineSteps(app.status)}

                      <div style={styles.actionsRow}>
                        <button 
                          className="btn-secondary" 
                          style={styles.actionBtn}
                          onClick={() => navigate('/job-search', { state: { selectedJobId: job._id } })}
                        >
                          <ExternalLink size={14} />
                          <span>View Listing</span>
                        </button>
                        <button 
                          style={{ ...styles.actionBtn, ...styles.withdrawBtn }}
                          onClick={() => handleWithdraw(app._id)}
                        >
                          <Trash2 size={14} />
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
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
  statsSummary: {
    display: 'flex',
    gap: '16px',
  },
  miniStat: {
    padding: '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '130px',
    textAlign: 'center',
  },
  miniStatVal: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#fff',
  },
  miniStatLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    padding: '16px 24px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-dim)',
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px 10px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  filterWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterSelect: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  empty: {
    padding: '60px 40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    padding: '24px',
  },
  cardMain: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  jobTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
  },
  companyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  companyName: {
    color: 'var(--primary)',
    fontWeight: 600,
  },
  dot: {
    color: 'var(--text-dim)',
  },
  jobType: {
    color: 'var(--text-muted)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  metaGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaIcon: {
    color: 'var(--text-dim)',
  },
  skillsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  skillsHeading: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillTag: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: 500,
  },
  skillMatch: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
  },
  skillMissing: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-light)',
  },
  timelineCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeft: '1px solid var(--border-light)',
    paddingLeft: '30px',
    gap: '24px',
    '@media (max-width: 900px)': {
      borderLeft: 'none',
      paddingLeft: 0,
      borderTop: '1px solid var(--border-light)',
      paddingTop: '24px',
    }
  },
  rightHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  matchScoreBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  matchScoreVal: {
    fontSize: '24px',
    fontWeight: 800,
    color: 'var(--accent-cyan)',
  },
  matchScoreLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 0',
  },
  timelineNodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  timelineNode: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-dark)',
    border: '2px solid var(--border-light)',
    color: 'var(--text-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  nodeCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'var(--success)',
    color: 'var(--success)',
  },
  nodeActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'var(--primary)',
    color: 'var(--primary)',
    boxShadow: '0 0 12px var(--primary-glow)',
  },
  nodeRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'var(--danger)',
    color: 'var(--danger)',
  },
  timelineLabel: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    marginTop: '6px',
    fontWeight: 500,
  },
  labelActive: {
    color: '#fff',
    fontWeight: 600,
  },
  labelRejected: {
    color: 'var(--danger)',
    fontWeight: 600,
  },
  timelineLine: {
    flex: 1,
    height: '2px',
    backgroundColor: 'var(--border-light)',
    margin: '0 -10px',
    position: 'relative',
    top: '-9px',
    zIndex: 1,
    transition: 'background-color 0.3s ease',
  },
  lineCompleted: {
    backgroundColor: 'var(--success)',
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    padding: '8px 16px',
    fontSize: '12px',
    borderRadius: '6px',
  },
  withdrawBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--danger)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
};
