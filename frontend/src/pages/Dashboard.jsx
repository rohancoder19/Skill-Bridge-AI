import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FileCheck, 
  Search, 
  ArrowRight, 
  Edit3, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Bookmark,
  Plus,
  Briefcase,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GaugeChart from '../components/GaugeChart';

function formatRelativeTime(dateString) {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  if (diffMs < 0) return 'Just now';
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function calculateMatchScore(candidateSkills, jobSkills, candidateTitle, jobTitle) {
  const userSkills = (candidateSkills || []).map(s => s.toLowerCase());
  const reqSkills = (jobSkills || []).map(s => s.toLowerCase());
  
  let matchCount = 0;
  reqSkills.forEach(skill => {
    if (userSkills.includes(skill) || userSkills.some(us => us.includes(skill) || skill.includes(us))) {
      matchCount++;
    }
  });
  
  let score = 0;
  if (reqSkills.length > 0) {
    score = Math.round((matchCount / reqSkills.length) * 90);
  } else {
    score = 50;
  }
  
  const cTitle = (candidateTitle || '').toLowerCase();
  const jTitle = (jobTitle || '').toLowerCase();
  const titleMatch = jTitle.includes(cTitle) || cTitle.split(' ').some(w => jTitle.includes(w));
  if (titleMatch) {
    score = Math.min(100, score + 10);
  }
  
  return Math.min(100, score);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    user, 
    resume, 
    jobs, 
    applications, 
    bookmarkJob, 
    updateUserProfileStrength,
    recruiterJobs,
    recruiterApplications,
    updateApplicationStatus
  } = useApp();

  const [selectedRecruiterJobId, setSelectedRecruiterJobId] = React.useState('');
  
  React.useEffect(() => {
    if (user?.role === 'recruiter' && recruiterJobs && recruiterJobs.length > 0 && !selectedRecruiterJobId) {
      setSelectedRecruiterJobId(recruiterJobs[0]._id);
    }
  }, [recruiterJobs, user, selectedRecruiterJobId]);

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  // Recruiter Dashboard View
  if (user.role === 'recruiter') {
    const activeJob = recruiterJobs.find(j => j._id === selectedRecruiterJobId);
    const activeJobApps = recruiterApplications
      .filter(app => app.job?._id === selectedRecruiterJobId)
      .map(app => {
        const matchScore = activeJob
          ? calculateMatchScore(
              app.user?.skills,
              activeJob.skills,
              app.user?.targetTitle,
              activeJob.title
            )
          : 0;
        return { ...app, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
    const needsReviewCount = recruiterApplications.filter(a => a.status === 'Applied').length;
    
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.welcomeRow}>
          <h1 style={styles.title}>Recruiter Command Center 🚀</h1>
          <p style={styles.subtitle}>Welcome back, {user.name}. Manage postings and track applicants.</p>
        </div>

        {/* Stats Grid */}
        <div style={styles.actionsGrid}>
          <div style={{ ...styles.actionCard, cursor: 'default', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.03) 100%)' }}>
            <div style={{ ...styles.actionIconContainer, background: 'rgba(99, 102, 241, 0.2)' }}>
              <Briefcase size={22} color="var(--primary)" />
            </div>
            <div style={styles.actionDetails}>
              <h3>Active Job Postings</h3>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>{recruiterJobs.length}</p>
            </div>
          </div>

          <div style={{ ...styles.actionCard, cursor: 'default', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.03) 100%)' }}>
            <div style={{ ...styles.actionIconContainer, background: 'rgba(16, 185, 129, 0.2)' }}>
              <UserPlus size={22} color="var(--success)" />
            </div>
            <div style={styles.actionDetails}>
              <h3>Total Applications</h3>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>{recruiterApplications.length}</p>
            </div>
          </div>

          <div style={{ ...styles.actionCard, cursor: 'default', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.03) 100%)' }}>
            <div style={{ ...styles.actionIconContainer, background: 'rgba(245, 158, 11, 0.2)' }}>
              <Clock size={22} color="var(--warning)" />
            </div>
            <div style={styles.actionDetails}>
              <h3>Needs Review</h3>
              <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)', marginTop: '8px' }}>{needsReviewCount}</p>
            </div>
          </div>
        </div>

        {/* Panes Grid */}
        <div style={styles.middleGrid}>
          {/* Left Pane: Job list */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Your Postings</h2>
              <button onClick={() => navigate('/post-job')} style={styles.recruiterAddBtn}>
                <Plus size={14} /> Post Job
              </button>
            </div>

            <div style={styles.recruiterScrollList}>
              {recruiterJobs.length > 0 ? (
                recruiterJobs.map((job) => {
                  const isActive = job._id === selectedRecruiterJobId;
                  const appCount = recruiterApplications.filter(a => a.job?._id === job._id).length;
                  return (
                    <div 
                      key={job._id}
                      onClick={() => setSelectedRecruiterJobId(job._id)}
                      style={{
                        ...styles.recruiterJobCard,
                        ...(isActive ? styles.recruiterJobCardActive : {})
                      }}
                    >
                      <div style={styles.recruiterJobCardHeader}>
                        <h4 style={styles.recruiterJobCardTitle}>{job.title}</h4>
                        <span style={styles.recruiterAppBadge}>{appCount} Applied</span>
                      </div>
                      <p style={styles.recruiterJobMeta}>
                        {job.location} • {job.jobType} • {job.salary}
                      </p>
                      <div style={styles.recruiterJobCardFooter}>
                        <span style={styles.recruiterTime}>{formatRelativeTime(job.postedAt)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
                  no job is avalable
                </p>
              )}
            </div>
          </div>

          {/* Right Pane: Candidates details list */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeJob ? (
              <>
                <div>
                  <h2 style={{ ...styles.sectionTitle, marginBottom: '6px' }}>Applicants for {activeJob.title}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {activeJob.company} • {activeJob.location} • {activeJob.jobType} • {activeJob.salary}
                  </p>
                </div>

                <div style={styles.recruiterScrollList}>
                  {activeJobApps.length > 0 ? (
                    activeJobApps.map((app) => {
                      const matchScore = app.matchScore;
                      
                      return (
                        <div key={app._id} style={styles.recruiterApplicantCard}>
                          <div style={styles.recruiterAppCardHeader}>
                            <div>
                              <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{app.user?.name}</h4>
                              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{app.user?.email}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span className="badge-match" style={{ fontSize: '11px' }}>{matchScore}% Match</span>
                            </div>
                          </div>

                          <div style={{ marginTop: '12px' }}>
                            <p style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                              Target Role: <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{app.user?.targetTitle || 'N/A'}</span>
                            </p>
                            
                            {app.user?.skills && app.user.skills.length > 0 && (
                              <div style={styles.recruiterAppSkills}>
                                {app.user.skills.slice(0, 5).map(skill => (
                                  <span key={skill} style={styles.recruiterAppSkillBadge}>{skill}</span>
                                ))}
                                {app.user.skills.length > 5 && <span>+{app.user.skills.length - 5}</span>}
                              </div>
                            )}
                          </div>

                          <div style={styles.recruiterAppCardFooter}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status:</span>
                              <select 
                                value={app.status}
                                onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                style={styles.recruiterStatusSelect}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Interview">Interview</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                              Applied {formatRelativeTime(app.appliedAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-dim)' }}>
                      <UserPlus size={32} style={{ marginBottom: '12px' }} />
                      <p style={{ fontSize: '13px' }}>No candidates have applied to this job posting yet.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-dim)' }}>
                <Briefcase size={36} style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '13px' }}>Select a job posting to view candidates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  // Calculate matching jobs
  const topMatches = jobs.slice(0, 4);

  // Profile Checklist items (state checks)
  const checklist = [
    { text: 'Add your skills', completed: user.skills && user.skills.length >= 5 },
    { text: 'Complete your experience', completed: resume && resume.workExperience && resume.workExperience.length >= 2 },
    { text: 'Add a professional summary', completed: !!user.summary },
    { text: 'Upload a profile picture', completed: !!user.profilePicture },
  ];

  // Calculate profile strength dynamically
  const completedCount = checklist.filter(c => c.completed).length;
  const targetStrength = Math.round((completedCount / checklist.length) * 100);

  const handleUpdateProfileStrength = () => {
    // Simulate updating profile by adding profile picture and completing experience
    updateUserProfileStrength(100);
  };

  const handleDownloadResume = () => {
    alert("Downloading Alex_Johnson_Resume.pdf...");
  };

  return (
    <div style={styles.container}>
      {/* Welcome Header */}
      <div style={styles.welcomeRow}>
        <h1 style={styles.title}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p style={styles.subtitle}>Let's take the next step toward your dream career.</p>
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={styles.actionsGrid}>
        {/* Action 1 */}
        <div 
          onClick={() => navigate('/resume-builder')} 
          style={{ ...styles.actionCard, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' }}
        >
          <div style={{ ...styles.actionIconContainer, background: 'rgba(99, 102, 241, 0.2)' }}>
            <FileText size={24} color="var(--primary)" />
          </div>
          <div style={styles.actionDetails}>
            <h3>Generate Resume <span style={styles.aiTag}>AI Powered</span></h3>
            <p>Create a professional, ATS-friendly resume in minutes with AI.</p>
          </div>
          <button style={styles.actionBtn}>Generate Resume <ArrowRight size={14} /></button>
        </div>

        {/* Action 2 */}
        <div 
          onClick={() => navigate('/ats-analyzer')}
          style={{ ...styles.actionCard, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.03) 100%)' }}
        >
          <div style={{ ...styles.actionIconContainer, background: 'rgba(16, 185, 129, 0.2)' }}>
            <FileCheck size={24} color="var(--success)" />
          </div>
          <div style={styles.actionDetails}>
            <h3>Analyze Resume <span style={styles.atsTag}>ATS Score</span></h3>
            <p>Get your resume analyzed and improve your ATS score instantly.</p>
          </div>
          <button style={styles.actionBtn}>Analyze Resume <ArrowRight size={14} /></button>
        </div>

        {/* Action 3 */}
        <div 
          onClick={() => navigate('/job-search')}
          style={{ ...styles.actionCard, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.03) 100%)' }}
        >
          <div style={{ ...styles.actionIconContainer, background: 'rgba(59, 130, 246, 0.2)' }}>
            <Search size={24} color="var(--secondary)" />
          </div>
          <div style={styles.actionDetails}>
            <h3>Job Search</h3>
            <p>Find the right job matches based on your skills and preferences.</p>
          </div>
          <button style={styles.actionBtn}>Search Jobs <ArrowRight size={14} /></button>
        </div>
      </div>

      {/* Middle Grid: Resume Overview & Top Matches */}
      <div style={styles.middleGrid}>
        {/* Left Card: Resume Overview */}
        <div className="glass-card" style={styles.resumeOverviewCard}>
          <h2 style={styles.sectionTitle}>Your Resume Overview</h2>
          <div style={styles.resumeSplitGrid}>
            {/* Resume Sheet Preview */}
            <div style={styles.resumeSheet}>
              {resume ? (
                <>
                  <h4 style={styles.resumeSheetName}>{resume.personalInfo.fullName || user.name}</h4>
                  <p style={styles.resumeSheetTitle}>{resume.personalInfo.title || user.targetTitle}</p>
                  
                  <div style={styles.resumeSheetSection}>
                    <h5>SUMMARY</h5>
                    <p>{resume.personalInfo.summary || user.summary}</p>
                  </div>
                  
                  {resume.workExperience && resume.workExperience.length > 0 && (
                    <div style={styles.resumeSheetSection}>
                      <h5>EXPERIENCE</h5>
                      <div>
                        <strong>{resume.workExperience[0].role}</strong> - {resume.workExperience[0].company}
                        <p style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{resume.workExperience[0].duration}</p>
                      </div>
                    </div>
                  )}

                  {resume.skills && resume.skills.length > 0 && (
                    <div style={styles.resumeSheetSection}>
                      <h5>SKILLS</h5>
                      <div style={styles.resumeSheetSkillsList}>
                        {resume.skills.slice(0, 5).map(s => (
                          <span key={s.name || s} style={styles.resumeSheetSkillBadge}>{s.name || s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>No active resume data.</p>
              )}
            </div>

            {/* ATS Score details */}
            <div style={styles.atsDetailsPane}>
              <div style={styles.atsHeaderRow}>
                <span style={styles.atsScoreText}>ATS Score</span>
                <span style={styles.atsTagBadge}>{resume?.atsScore || 0} / 100</span>
              </div>

              <div style={styles.gaugeContainer}>
                <GaugeChart score={resume?.atsScore || 0} size={110} strokeWidth={9} showDetails={true} />
              </div>

              <p style={styles.atsRatingComment}>
                <strong>Great!</strong> Your resume is well-optimized. But there's always room for improvement.
              </p>

              <div style={styles.atsQuickStats}>
                <div style={styles.quickStatBox}>
                  <span>Readability</span>
                  <strong style={{ color: 'var(--success)' }}>Good</strong>
                </div>
                <div style={styles.quickStatBox}>
                  <span>Sections</span>
                  <strong>12/12</strong>
                </div>
                <div style={styles.quickStatBox}>
                  <span>Keywords</span>
                  <strong>95%</strong>
                </div>
              </div>

              <div style={styles.atsActions}>
                <button onClick={() => navigate('/resume-builder')} style={styles.atsImproveBtn}>
                  Improve Resume
                </button>
                <div style={styles.atsRowButtons}>
                  <button onClick={() => navigate('/resume-builder')} style={styles.atsSmallBtn}>
                    <Edit3 size={12} /> Edit
                  </button>
                  <button onClick={handleDownloadResume} style={styles.atsSmallBtn}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Top Job Matches */}
        <div className="glass-card" style={styles.matchesCard}>
          <div style={styles.matchesHeader}>
            <h2 style={styles.sectionTitle}>Top Job Matches</h2>
            <button onClick={() => navigate('/job-search')} style={styles.viewAllBtn}>View all</button>
          </div>

          <div style={styles.jobsList}>
            {topMatches.length > 0 ? (
              topMatches.map((job) => {
                const isSaved = user.savedJobs && user.savedJobs.includes(job._id);
                return (
                  <div key={job._id} style={styles.jobItem}>
                    <div style={styles.jobInfo}>
                      <div style={styles.jobLogo}>
                        {job.company.substring(0, 1)}
                      </div>
                      <div>
                        <h4 style={styles.jobTitle}>{job.title}</h4>
                        <p style={styles.jobCompany}>{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div style={styles.jobMeta}>
                      <span className="badge-match">{job.matchPercentage}% Match</span>
                      <span style={styles.jobPosted}>{formatRelativeTime(job.postedAt)}</span>
                      <button 
                        onClick={() => bookmarkJob(job._id)} 
                        style={styles.bookmarkBtn}
                        title={isSaved ? "Saved" : "Save Job"}
                      >
                        <Bookmark size={14} fill={isSaved ? "var(--primary)" : "none"} color={isSaved ? "var(--primary)" : "var(--text-muted)"} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>
                no job is avalable
              </p>
            )}
          </div>

          <button onClick={() => navigate('/job-search')} style={styles.browseJobsBtn}>
            Browse More Jobs <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Applications & Improve Profile */}
      <div style={styles.bottomGrid}>
        {/* Left Section: Recent Applications */}
        <div className="glass-card" style={styles.applicationsCard}>
          <div style={styles.matchesHeader}>
            <h2 style={styles.sectionTitle}>Recent Applications</h2>
            <button onClick={() => navigate('/applications')} style={styles.viewAllBtn}>View all</button>
          </div>

          <div style={styles.appsList}>
            {applications.length > 0 ? (
              applications.slice(0, 3).map((app) => (
                <div key={app._id} style={styles.appItem}>
                  <div style={styles.appJobInfo}>
                    <div style={styles.jobLogo}>
                      {app.job?.company ? app.job.company.substring(0, 1) : 'J'}
                    </div>
                    <div>
                      <h4 style={styles.appJobTitle}>{app.job?.title || 'Job Title'}</h4>
                      <p style={styles.appJobCompany}>{app.job?.company || 'Company'} • {app.job?.location || 'Location'}</p>
                    </div>
                  </div>
                  <div style={styles.appMeta}>
                    <span 
                      style={{
                        ...styles.statusBadge,
                        ...(app.status === 'Interview' ? styles.statusInterview : {}),
                        ...(app.status === 'Under Review' ? styles.statusReview : {}),
                      }}
                    >
                      {app.status}
                    </span>
                    <span style={styles.appDate}>
                      Applied On {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No recent job applications. Go to Job Search to apply!</p>
            )}
          </div>
        </div>

        {/* Right Section: Improve Profile Checklist */}
        <div className="glass-card" style={styles.profileCard}>
          <h2 style={styles.sectionTitle}>Improve Your Profile</h2>
          
          <div style={styles.profileSplit}>
            <div style={styles.profileStrengthCol}>
              <div style={styles.profileProgress}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    fill="none" 
                    stroke="var(--success)" 
                    strokeWidth="6" 
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - user.profileStrength / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div style={styles.profileProgressText}>
                  <strong style={{ fontSize: '18px', fontWeight: 800 }}>{user.profileStrength}%</strong>
                </div>
              </div>
              <span style={styles.profileStrengthLabel}>Profile Strength</span>
            </div>

            <div style={styles.checklistCol}>
              <ul style={styles.checklistList}>
                {checklist.map((item, idx) => (
                  <li key={idx} style={styles.checkItem}>
                    <CheckCircle2 
                      size={14} 
                      color={item.completed ? "var(--success)" : "var(--text-dim)"} 
                      fill={item.completed ? "rgba(16,185,129,0.1)" : "none"} 
                    />
                    <span style={item.completed ? styles.checkItemTextDone : styles.checkItemText}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              {user.profileStrength < 100 && (
                <button onClick={handleUpdateProfileStrength} style={styles.updateProfileBtn}>
                  Update Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '16px',
    color: 'var(--text-muted)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  welcomeRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  actionCard: {
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-2px)',
      borderColor: 'var(--border-hover)',
    }
  },
  actionIconContainer: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    h3: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    p: {
      fontSize: '12px',
      color: 'var(--text-muted)',
      lineHeight: '1.5',
    }
  },
  aiTag: {
    fontSize: '9px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 600,
  },
  atsTag: {
    fontSize: '9px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 600,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  middleGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '24px',
  },
  sectionTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
  },
  resumeOverviewCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  resumeSplitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    flex: 1,
  },
  resumeSheet: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    color: '#1f2937',
    fontSize: '11px',
    height: '350px',
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },
  resumeSheetName: {
    fontSize: '15px',
    fontWeight: 800,
    color: '#111827',
  },
  resumeSheetTitle: {
    color: 'var(--primary)',
    fontWeight: 600,
    marginBottom: '15px',
  },
  resumeSheetSection: {
    marginBottom: '12px',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '8px',
    h5: {
      fontSize: '9px',
      fontWeight: 700,
      color: '#9ca3af',
      marginBottom: '4px',
    },
    p: {
      lineHeight: '1.4',
      color: '#4b5563',
    }
  },
  resumeSheetSkillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px',
  },
  resumeSheetSkillBadge: {
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: 500,
  },
  atsDetailsPane: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px 0',
  },
  atsHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  atsScoreText: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  atsTagBadge: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#fff',
    background: 'rgba(99, 102, 241, 0.1)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  gaugeContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '15px 0',
  },
  atsRatingComment: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    textAlign: 'center',
    marginBottom: '15px',
  },
  atsQuickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  quickStatBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '10px 6px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    span: {
      fontSize: '9px',
      color: 'var(--text-dim)',
    },
    strong: {
      fontSize: '12px',
      color: '#fff',
    }
  },
  atsActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  atsImproveBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'pointer',
  },
  atsRowButtons: {
    display: 'flex',
    gap: '10px',
  },
  atsSmallBtn: {
    flex: 1,
    padding: '8px',
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: '6px',
    color: 'var(--text-muted)',
    fontSize: '11px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    ':hover': {
      borderColor: 'var(--border-hover)',
      color: '#fff',
    }
  },
  matchesCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  matchesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  jobItem: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--border-hover)',
    }
  },
  jobInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  jobLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--primary)',
  },
  jobTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
  },
  jobCompany: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  jobMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  jobPosted: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
  bookmarkBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  browseJobsBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ':hover': {
      background: 'rgba(255,255,255,0.02)',
    }
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  applicationsCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  appsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  appItem: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appJobInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  appJobTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
  },
  appJobCompany: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  appMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  statusBadge: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
  },
  statusInterview: {
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
  },
  statusReview: {
    background: 'rgba(245, 158, 11, 0.15)',
    color: 'var(--warning)',
  },
  appDate: {
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileSplit: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flex: 1,
  },
  profileStrengthCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    paddingRight: '24px',
    borderRight: '1px solid var(--border-light)',
  },
  profileProgress: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileProgressText: {
    position: 'absolute',
    textAlign: 'center',
    color: '#fff',
  },
  profileStrengthLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  checklistCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  checklistList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkItemText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  checkItemTextDone: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    textDecoration: 'line-through',
  },
  updateProfileBtn: {
    alignSelf: 'flex-start',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--success)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(16, 185, 129, 0.25)',
    }
  },
  recruiterAddBtn: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
  },
  recruiterScrollList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  recruiterJobCard: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '14px 16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  recruiterJobCardActive: {
    borderColor: 'var(--primary)',
    background: 'rgba(99, 102, 241, 0.05)',
    boxShadow: '0 0 10px var(--primary-glow)',
  },
  recruiterJobCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recruiterJobCardTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#fff',
    flex: 1,
    paddingRight: '8px',
  },
  recruiterAppBadge: {
    fontSize: '10px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 600,
  },
  recruiterJobMeta: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  recruiterJobCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.02)',
    paddingTop: '6px',
    marginTop: '4px',
  },
  recruiterTime: {
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  recruiterApplicantCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  recruiterAppCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recruiterAppSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
    fontSize: '10px',
    color: 'var(--text-dim)',
    alignItems: 'center',
  },
  recruiterAppSkillBadge: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '4px',
    padding: '2px 6px',
    color: 'var(--text-muted)',
    fontSize: '10px',
  },
  recruiterAppCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    paddingTop: '10px',
    marginTop: '4px',
  },
  recruiterStatusSelect: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    color: '#fff',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '11px',
    outline: 'none',
    cursor: 'pointer',
  }
};
