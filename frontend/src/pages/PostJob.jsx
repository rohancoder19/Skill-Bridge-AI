import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Award, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PostJob() {
  const { postJob } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    experience: '',
    salary: '',
    jobType: 'Full-time',
    overview: '',
    requirements: '',
    skills: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (
      !formData.title.trim() || 
      !formData.company.trim() || 
      !formData.location.trim() || 
      !formData.experience.trim() || 
      !formData.salary.trim() || 
      !formData.overview.trim()
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      await postJob({
        ...formData,
        // Convert comma-separated strings to arrays
        requirements: formData.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(Boolean),
        skills: formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Title Header */}
      <div className="page-header" style={styles.header}>
        <div>
          <h1 style={styles.title}>Post a New Job</h1>
          <p style={styles.subtitle}>Create a job listing to search and match with top candidate profiles.</p>
        </div>
      </div>

      <div className="glass-card" style={styles.formCard}>
        {success && (
          <div style={styles.successBanner}>
            <CheckCircle2 size={20} />
            <span>Job created successfully! Redirecting to dashboard...</span>
          </div>
        )}

        {error && (
          <div style={styles.errorBanner}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="post-job-grid" style={styles.formGrid}>
            {/* Title */}
            <div style={styles.inputBox}>
              <label style={styles.label}>Job Title *</label>
              <div style={styles.inputWrapper}>
                <Briefcase size={16} color="var(--text-muted)" style={styles.inputIcon} />
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Product Designer"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div style={styles.inputBox}>
              <label style={styles.label}>Company Name *</label>
              <div style={styles.inputWrapper}>
                <Award size={16} color="var(--text-muted)" style={styles.inputIcon} />
                <input 
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div style={styles.inputBox}>
              <label style={styles.label}>Location *</label>
              <div style={styles.inputWrapper}>
                <MapPin size={16} color="var(--text-muted)" style={styles.inputIcon} />
                <input 
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, India"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Experience */}
            <div style={styles.inputBox}>
              <label style={styles.label}>Experience Level *</label>
              <div style={styles.inputWrapper}>
                <Clock size={16} color="var(--text-muted)" style={styles.inputIcon} />
                <input 
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2-5 Years"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Salary */}
            <div style={styles.inputBox}>
              <label style={styles.label}>Salary Range *</label>
              <div style={styles.inputWrapper}>
                <DollarSign size={16} color="var(--text-muted)" style={styles.inputIcon} />
                <input 
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 18 - 28 LPA"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Job Type */}
            <div style={styles.inputBox}>
              <label style={styles.label}>Job Type *</label>
              <select 
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Overview */}
          <div style={styles.inputBoxFull}>
            <label style={styles.label}>Job Description / Overview *</label>
            <textarea 
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              placeholder="Provide a detailed overview of the role, team, and expectations..."
              style={styles.textarea}
              rows={4}
              required
            />
          </div>

          {/* Skills */}
          <div style={styles.inputBoxFull}>
            <label style={styles.label}>Required Skills (Comma separated) *</label>
            <input 
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Figma, UI Design, UX Design, Prototyping"
              style={styles.inputFull}
              required
            />
          </div>

          {/* Requirements */}
          <div style={styles.inputBoxFull}>
            <label style={styles.label}>Role Requirements (One per line)</label>
            <textarea 
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g. Bachelor's degree in Design or related field&#10;3+ years of professional UX experience&#10;Excellent communication skills"
              style={styles.textarea}
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div style={styles.actions}>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              style={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Job Opening'} <PlusCircle size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '850px',
    margin: '0 auto',
    padding: '20px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  formCard: {
    padding: '36px',
    background: 'rgba(17, 24, 39, 0.45)',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    padding: '16px',
    borderRadius: '10px',
    color: 'var(--success)',
    fontSize: '14px',
    marginBottom: '24px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    padding: '16px',
    borderRadius: '10px',
    color: 'var(--danger)',
    fontSize: '14px',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px 24px',
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  inputBoxFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '0 14px',
    transition: 'border-color 0.2s ease',
  },
  inputIcon: {
    flexShrink: 0,
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '12px 10px',
    fontSize: '13px',
    outline: 'none',
  },
  inputFull: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: '#fff',
    padding: '12px 14px',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    color: '#fff',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    transition: 'transform 0.2s ease',
  }
};
