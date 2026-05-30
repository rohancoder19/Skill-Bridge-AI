import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  Sparkles
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

export default function JobSearch() {
  const { 
    jobs, 
    applications, 
    user, 
    resume,
    queryJobs, 
    applyJob, 
    bookmarkJob 
  } = useApp();

  const routerLocation = useLocation();

  // Filters State
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('All');
  
  // Active selected job details
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(false);

  // Load URL query params if any
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const kw = params.get('keyword');
    if (kw) {
      setKeyword(kw);
      handleFilterSearch(kw, location, experience, jobType);
    } else {
      handleFilterSearch(keyword, location, experience, jobType);
    }
  }, [routerLocation.search]);

  // Query jobs from API
  const handleFilterSearch = async (kwVal, locVal, expVal, typeVal) => {
    await queryJobs({
      keyword: kwVal,
      location: locVal,
      experience: expVal,
      jobType: typeVal
    });
  };

  // Trigger search on filter changes
  useEffect(() => {
    handleFilterSearch(keyword, location, experience, jobType);
  }, [location, experience, jobType]);

  // Set default selected job
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs]);

  // Fetch job details when selectedJobId changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedJobId) return;
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/jobs/${selectedJobId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSelectedJobDetails(data);
          
          // Check if already applied
          const isApplied = applications.some(app => app.job?._id === selectedJobId);
          setAppliedStatus(isApplied);
        }
      } catch (err) {
        console.error('Error fetching job details', err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedJobId, applications]);

  const handleApply = async () => {
    if (!selectedJobId) return;
    const success = await applyJob(selectedJobId);
    if (success) {
      setAppliedStatus(true);
      const atsScore = resume?.atsScore || user?.profileStrength || 75;
      alert(`Applied successfully! You have applied with an ATS score of ${atsScore}/100. Application status updated on your dashboard.`);
    }
  };

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setExperience('');
    setJobType('All');
    queryJobs({});
  };

  return (
    <div style={styles.container}>
      {/* Title Header */}
      <div>
        <h1 style={styles.title}>Job Search</h1>
        <p style={styles.subtitle}>Find the right opportunities and take the next step in your career.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={styles.filterCard}>
        <div style={styles.filterGrid}>
          {/* Keyword input */}
          <div style={styles.inputWrapper}>
            <Search size={16} style={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Keywords (e.g. Product Designer)" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSearch(keyword, location, experience, jobType)}
              style={styles.filterInput}
            />
            {keyword && <button onClick={() => setKeyword('')} style={styles.clearTagBtn}><X size={12} /></button>}
          </div>

          {/* Location input */}
          <div style={styles.inputWrapper}>
            <MapPin size={16} style={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Location (e.g. Bengaluru, India)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSearch(keyword, location, experience, jobType)}
              style={styles.filterInput}
            />
            {location && <button onClick={() => setLocation('')} style={styles.clearTagBtn}><X size={12} /></button>}
          </div>

          {/* Experience Select */}
          <select 
            value={experience} 
            onChange={(e) => setExperience(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Select Experience</option>
            <option value="Entry-level">Entry-level</option>
            <option value="2-5 Years">2-5 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="4-6 Years">4-6 Years</option>
          </select>

          {/* Job Type Select */}
          <select 
            value={jobType} 
            onChange={(e) => setJobType(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Buttons */}
          <button style={styles.btnMoreFilters}>
            <SlidersHorizontal size={14} /> More Filters
          </button>

          <button onClick={clearAllFilters} style={styles.btnClearAll}>Clear All</button>
        </div>
      </div>

      {/* Main double-pane results */}
      <div style={styles.panesGrid}>
        {/* Left Pane: Jobs list */}
        <div style={styles.leftPane}>
          <div style={styles.resultsHeader}>
            <span>{jobs.length} jobs found</span>
            <span style={{ color: 'var(--text-dim)' }}>Sort by: <strong>Most Relevant</strong></span>
          </div>

          <div style={styles.jobsListScroll}>
            {jobs.length > 0 ? (
              jobs.map((job) => {
                const isSelected = job._id === selectedJobId;
                const isSaved = user?.savedJobs && user.savedJobs.includes(job._id);
                return (
                  <div 
                    key={job._id} 
                    onClick={() => setSelectedJobId(job._id)}
                    style={{
                      ...styles.jobCard,
                      ...(isSelected ? styles.jobCardSelected : {})
                    }}
                  >
                    <div style={styles.jobCardHeader}>
                      <div style={styles.jobLogoCol}>
                        <div style={styles.companyLogo}>
                          {job.company.substring(0, 1)}
                        </div>
                        <div>
                          <h4 style={styles.jobCardTitle}>{job.title}</h4>
                          <p style={styles.jobCardCompany}>{job.company}</p>
                        </div>
                      </div>
                      <span className="badge-match">{job.matchPercentage}% Match</span>
                    </div>

                    <p style={styles.jobLocationRow}>
                      <MapPin size={12} /> {job.location} • {job.jobType}
                    </p>
                    
                    <div style={styles.jobCardFooter}>
                      <span style={styles.jobSalary}>{job.salary}</span>
                      <span style={styles.jobCardExp}>{job.experience}</span>
                      <span style={styles.jobDate}>{formatRelativeTime(job.postedAt)}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); bookmarkJob(job._id); }} 
                        style={styles.cardBookmarkBtn}
                      >
                        <Bookmark size={14} fill={isSaved ? "var(--primary)" : "none"} color={isSaved ? "var(--primary)" : "var(--text-muted)"} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, textAlign: 'center', marginTop: '40px', letterSpacing: '0.5px' }}>
                no job is avalable
              </p>
            )}
          </div>

          {/* Pagination */}
          <div style={styles.paginationRow}>
            <button style={styles.pageBtn}><ChevronLeft size={16} /></button>
            <button style={{ ...styles.pageBtn, ...styles.pageBtnActive }}>1</button>
            <button style={styles.pageBtn}>2</button>
            <button style={styles.pageBtn}>3</button>
            <span>...</span>
            <button style={styles.pageBtn}>42</button>
            <button style={styles.pageBtn}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Right Pane: Selected Job Details */}
        <div className="glass-card" style={styles.rightPane}>
          {loadingDetails ? (
            <div style={styles.detailsLoader}>
              <div style={styles.spinner} />
              <span>Fetching job matches and checklists...</span>
            </div>
          ) : selectedJobDetails ? (
            <div style={styles.detailsContent}>
              {/* Header Title */}
              <div style={styles.detailsHeader}>
                <div style={styles.detailsLogoArea}>
                  <div style={styles.detailsLogoBig}>
                    {selectedJobDetails.job.company.substring(0, 1)}
                  </div>
                  <div>
                    <h2 style={styles.detailsTitle}>{selectedJobDetails.job.title}</h2>
                    <p style={styles.detailsCompanyRow}>
                      <strong>{selectedJobDetails.job.company}</strong> • {selectedJobDetails.job.location} • {selectedJobDetails.job.jobType}
                    </p>
                  </div>
                </div>

                <div style={styles.detailsActions}>
                  <button 
                    onClick={() => bookmarkJob(selectedJobDetails.job._id)} 
                    style={styles.detailsBookmark}
                  >
                    <Bookmark size={16} fill={user?.savedJobs?.includes(selectedJobDetails.job._id) ? "var(--primary)" : "none"} />
                  </button>
                  <button 
                    onClick={handleApply} 
                    disabled={appliedStatus}
                    style={appliedStatus ? styles.btnApplied : styles.btnApply}
                  >
                    {appliedStatus ? 'Applied ✓' : 'Apply Now ↗'}
                  </button>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div style={styles.quickInfoGrid}>
                <div style={styles.quickInfoBox}>
                  <span>Experience</span>
                  <strong>{selectedJobDetails.job.experience}</strong>
                </div>
                <div style={styles.quickInfoBox}>
                  <span>Salary</span>
                  <strong>{selectedJobDetails.job.salary}</strong>
                </div>
                <div style={styles.quickInfoBox}>
                  <span>Job Type</span>
                  <strong>{selectedJobDetails.job.jobType}</strong>
                </div>
                <div style={styles.quickInfoBox}>
                  <span>Posted</span>
                  <strong>{formatRelativeTime(selectedJobDetails.job.postedAt)}</strong>
                </div>
              </div>

              {/* Description body */}
              <div style={styles.descriptionBody}>
                <h4 style={styles.detailsSubheading}>Overview</h4>
                <p style={styles.detailsOverviewText}>{selectedJobDetails.job.overview}</p>
                
                <h4 style={styles.detailsSubheading}>Requirements</h4>
                <ul style={styles.detailsList}>
                  {selectedJobDetails.job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>

                <h4 style={styles.detailsSubheading}>Skills required</h4>
                <div style={styles.detailsSkillsRow}>
                  {selectedJobDetails.skillChecks.map((check, idx) => (
                    <span 
                      key={idx} 
                      className={
                        check.status === 'Match' ? 'badge-match' :
                        check.status === 'Partial' ? 'badge-warning' : 'badge-danger'
                      }
                      style={{ fontSize: '11px' }}
                    >
                      {check.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Matching statistics card */}
              <div style={styles.matchScoreCard}>
                <div style={styles.matchScoreGauge}>
                  <GaugeChart score={selectedJobDetails.matchPercentage} size={90} strokeWidth={8} showDetails={false} />
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>Your Match Score</h4>
                    <span style={{ color: 'var(--success)', fontSize: '11px', fontWeight: 600 }}>Excellent Match</span>
                  </div>
                </div>

                <div style={styles.fitSection}>
                  <h5 style={{ color: '#fff', fontSize: '12px', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={12} color="var(--primary)" /> Why you're a good fit
                  </h5>
                  <ul style={styles.fitList}>
                    {selectedJobDetails.whyFit.map((fit, idx) => (
                      <li key={idx} style={styles.fitItem}>
                        <CheckCircle size={12} color="var(--success)" fill="var(--success-glow)" />
                        <span>{fit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.detailsLoader}>
              <Briefcase size={36} color="var(--text-dim)" />
              <span>Select a job to view match specifics and requirements details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
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
  filterCard: {
    padding: '16px 20px',
  },
  filterGrid: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    flex: 1,
    minWidth: '200px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    height: '42px',
    gap: '8px',
  },
  inputIcon: {
    color: 'var(--text-dim)',
  },
  filterInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  },
  clearTagBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-dim)',
    cursor: 'pointer',
  },
  filterSelect: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    color: '#fff',
    borderRadius: '8px',
    height: '42px',
    padding: '0 12px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '150px',
  },
  btnMoreFilters: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    height: '42px',
    padding: '0 16px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnClearAll: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-dim)',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  panesGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '24px',
    alignItems: 'start',
  },
  leftPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  jobsListScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '620px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  jobCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--border-hover)',
      background: 'rgba(17, 24, 39, 0.85)',
    }
  },
  jobCardSelected: {
    borderColor: 'var(--primary)',
    boxShadow: '0 0 12px var(--primary-glow)',
  },
  jobCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobLogoCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  companyLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: 'var(--primary)',
    fontSize: '16px',
  },
  jobCardTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
  },
  jobCardCompany: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  jobLocationRow: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  jobCardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255,255,255,0.02)',
  },
  jobSalary: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    flex: 1,
  },
  jobCardExp: {
    fontSize: '11px',
    background: 'rgba(255,255,255,0.03)',
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'var(--text-muted)',
  },
  jobDate: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
  cardBookmarkBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
  },
  pageBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnActive: {
    background: 'var(--primary)',
    color: '#fff',
    borderColor: 'var(--primary)',
  },
  rightPane: {
    padding: '24px',
    position: 'sticky',
    top: '100px',
  },
  detailsLoader: {
    height: '350px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '14px',
    color: 'var(--text-dim)',
    fontSize: '13px',
    textAlign: 'center',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(99,102,241,0.2)',
    borderTopColor: 'var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  detailsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '20px',
  },
  detailsLogoArea: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  detailsLogoBig: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 800,
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
  },
  detailsTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
  },
  detailsCompanyRow: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  detailsActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  detailsBookmark: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnApply: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0 20px',
    height: '40px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
    transition: 'transform 0.2s ease',
  },
  btnApplied: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--success)',
    borderRadius: '8px',
    padding: '0 20px',
    height: '40px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  quickInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  quickInfoBox: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '12px 6px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    span: {
      fontSize: '10px',
      color: 'var(--text-dim)',
    },
    strong: {
      fontSize: '12px',
      color: '#fff',
    }
  },
  descriptionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '260px',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  detailsSubheading: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#fff',
    marginTop: '10px',
  },
  detailsOverviewText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  detailsList: {
    paddingLeft: '18px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailsSkillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '6px',
  },
  matchScoreCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'center',
  },
  matchScoreGauge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  fitSection: {
    borderLeft: '1px solid var(--border-light)',
    paddingLeft: '20px',
  },
  fitList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fitItem: {
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start',
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.3',
  }
};
