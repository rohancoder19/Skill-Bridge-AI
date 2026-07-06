import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SavedJobs() {
  const navigate = useNavigate();
  const { user, jobs, bookmarkJob } = useApp();

  const savedList = jobs.filter(job => user?.savedJobs && user.savedJobs.includes(job._id));

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 style={styles.title}>Saved Jobs</h1>
        <p style={styles.subtitle}>Your bookmarked jobs and career opportunities.</p>
      </div>

      <div className="saved-jobs-grid" style={styles.grid}>
        {savedList.length > 0 ? (
          savedList.map((job) => (
            <div key={job._id} className="glass-card" style={styles.card}>
              <div style={styles.header}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobCompany}>{job.company}</p>
                </div>
                <button 
                  onClick={() => bookmarkJob(job._id)} 
                  style={styles.bookmarkBtn}
                >
                  <Bookmark size={16} fill="var(--primary)" color="var(--primary)" />
                </button>
              </div>

              <div style={styles.details}>
                <span style={styles.detailItem}><MapPin size={12} /> {job.location}</span>
                <span style={styles.detailItem}><Briefcase size={12} /> {job.jobType}</span>
              </div>

              <div style={styles.footer}>
                <span style={styles.salary}>{job.salary}</span>
                <button 
                  onClick={() => navigate(`/job-search?keyword=${encodeURIComponent(job.title)}`)}
                  style={styles.applyBtn}
                >
                  View Details <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <Bookmark size={36} color="var(--text-dim)" />
            <p>You haven't saved any jobs yet.</p>
            <button onClick={() => navigate('/job-search')} style={styles.exploreBtn}>
              Explore Opportunities
            </button>
          </div>
        )}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#fff',
  },
  jobCompany: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  bookmarkBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailItem: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-light)',
  },
  salary: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
  },
  applyBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-dim)',
    fontSize: '14px',
  },
  exploreBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  }
};
