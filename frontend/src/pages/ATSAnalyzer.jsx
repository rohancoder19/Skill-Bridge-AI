import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  History,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GaugeChart from '../components/GaugeChart';
import RadarChart from '../components/RadarChart';

export default function ATSAnalyzer() {
  const navigate = useNavigate();
  const { uploadResume, resume, user } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Product Designer');
  const [activeTab, setActiveTab] = useState('ats'); // ats, breakdown, skills, tips
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Default initial analysis from seeded resume
  const activeAnalysis = analysisResult || (resume ? {
    atsScore: resume.atsScore || 85,
    scoreMetrics: resume.scoreMetrics || {
      contentQuality: 92,
      keywordOptimization: 80,
      formatStructure: 85,
      relevance: 82
    },
    strengths: resume.strengths || [
      'Well-structured and easy to read',
      'Good use of keywords related to the job',
      'Professional summary is strong',
      'Relevant work experience is included'
    ],
    improvements: resume.improvements || [
      'Add more quantifiable achievements',
      'Include more relevant keywords',
      'Consider adding certifications',
      'Improve skills section'
    ],
    // Keywords matching Product Designer
    keywordStatus: [
      { keyword: 'Product Designer', status: 'Match' },
      { keyword: 'UI/UX Design', status: 'Match' },
      { keyword: 'Figma', status: 'Match' },
      { keyword: 'User Research', status: 'Partial' },
      { keyword: 'Wireframing', status: 'Partial' },
      { keyword: 'Prototyping', status: 'Match' },
      { keyword: 'Design System', status: 'Missing' },
      { keyword: 'Agile Workflow', status: 'Missing' }
    ]
  } : null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setSelectedFile(file);
    setUploading(true);
    try {
      const data = await uploadResume(file, targetRole);
      setAnalysisResult(data.parsedData);
    } catch (err) {
      alert('Error parsing resume. Using simulated fallback data.');
      // Simulating analysis based on role
      simulateAnalysis(file.name);
    } finally {
      setUploading(false);
    }
  };

  const simulateAnalysis = (fileName) => {
    // Generate slight variations based on targetRole
    const isDev = targetRole.toLowerCase().includes('developer') || targetRole.toLowerCase().includes('engineer');
    
    setTimeout(() => {
      setAnalysisResult({
        atsScore: isDev ? 76 : 89,
        scoreMetrics: {
          contentQuality: 88,
          keywordOptimization: isDev ? 65 : 90,
          formatStructure: 80,
          relevance: isDev ? 70 : 95
        },
        strengths: [
          'Excellent structural clarity and layout format',
          isDev ? 'Contains good development languages' : 'Highlights strong visual mockups and prototypes',
          'Professional credentials are well organized'
        ],
        improvements: [
          isDev ? 'Add React/Node keywords to match modern dev requirements' : 'Include design systems experience',
          'Quantify past team project sizes',
          'Add certificate titles under education'
        ],
        keywordStatus: isDev ? [
          { keyword: 'React', status: 'Match' },
          { keyword: 'Node.js', status: 'Missing' },
          { keyword: 'MongoDB', status: 'Missing' },
          { keyword: 'JavaScript', status: 'Match' },
          { keyword: 'CSS', status: 'Match' },
          { keyword: 'Git', status: 'Match' }
        ] : [
          { keyword: 'Product Designer', status: 'Match' },
          { keyword: 'UI/UX Design', status: 'Match' },
          { keyword: 'Figma', status: 'Match' },
          { keyword: 'User Research', status: 'Match' },
          { keyword: 'Design System', status: 'Missing' },
          { keyword: 'Agile Workflow', status: 'Match' }
        ]
      });
    }, 1500);
  };

  // Convert metrics object to list for Radar Chart
  const radarData = activeAnalysis ? [
    { label: 'Content', value: activeAnalysis.scoreMetrics.contentQuality },
    { label: 'Keywords', value: activeAnalysis.scoreMetrics.keywordOptimization },
    { label: 'Format', value: activeAnalysis.scoreMetrics.formatStructure },
    { label: 'Relevance', value: activeAnalysis.scoreMetrics.relevance },
  ] : [];

  return (
    <div style={styles.container}>
      {/* Title Header */}
      <div className="page-header" style={styles.header}>
        <div>
          <h1 style={styles.title}>Analyze Resume</h1>
          <p style={styles.subtitle}>Get your resume analyzed and improve your ATS score instantly.</p>
        </div>
        <div style={styles.headerButtons}>
          <button style={styles.btnHistory}><History size={16} /> History</button>
        </div>
      </div>

      {/* Main Upload Pane */}
      <div 
        className="glass-card" 
        style={{
          ...styles.uploadCard,
          borderColor: dragActive ? 'var(--primary)' : 'var(--border-light)',
          background: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-card)'
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-split" style={styles.uploadSplit}>
          <div style={styles.uploadLeft}>
            <div style={styles.uploadIconContainer}>
              <Upload size={32} color="var(--primary)" />
            </div>
            <h3>Upload Your Resume</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Drag & drop your resume here or
            </p>
            <label style={styles.fileInputLabel}>
              Browse File
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
            </label>
            <span style={styles.formats}>Supported formats: PDF, DOCX (Max 5MB)</span>
          </div>

          <div style={styles.uploadRight}>
            <div style={styles.roleSelectorBox}>
              <label style={styles.roleLabel}>Target Job Role</label>
              <input 
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={styles.roleSelect}
                list="role-suggestions"
                placeholder="Type or select target role..."
              />
              <datalist id="role-suggestions">
                <option value="Product Designer" />
                <option value="UX Designer" />
                <option value="Full Stack Developer" />
                <option value="Software Engineer" />
                <option value="Data Scientist" />
                <option value="Product Manager" />
              </datalist>
            </div>

            {/* File status */}
            {selectedFile ? (
              <div style={styles.fileStatus}>
                <FileText size={20} color="var(--primary)" />
                <div style={styles.fileDetails}>
                  <strong>{selectedFile.name}</strong>
                  <span>PDF • {Math.round(selectedFile.size / 1024)} KB</span>
                </div>
                <span style={styles.uploadSuccess}>✓ Uploaded successfully</span>
              </div>
            ) : (
              <div style={styles.fileStatusPlaceholder}>
                <FileCheck size={20} color="var(--text-dim)" />
                <span>No file uploaded yet. Analyze your resume now.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploading && (
        <div style={styles.loaderBanner}>
          <div style={styles.spinner} />
          <span>Analyzing resume keyword indices against {targetRole} standards...</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {activeAnalysis && !uploading && (
        <div className="ats-results-grid" style={styles.resultsGrid}>
          {/* Main Left Details */}
          <div style={styles.resultsLeft}>
            {/* Tabs */}
            <div style={styles.tabsRow}>
              <button 
                onClick={() => setActiveTab('ats')}
                style={activeTab === 'ats' ? styles.tabActive : styles.tab}
              >
                ATS Score
              </button>
              <button 
                onClick={() => setActiveTab('breakdown')}
                style={activeTab === 'breakdown' ? styles.tabActive : styles.tab}
              >
                Resume Breakdown
              </button>
              <button 
                onClick={() => setActiveTab('skills')}
                style={activeTab === 'skills' ? styles.tabActive : styles.tab}
              >
                Skills Analysis
              </button>
              <button 
                onClick={() => setActiveTab('tips')}
                style={activeTab === 'tips' ? styles.tabActive : styles.tab}
              >
                Improvement Tips
              </button>
            </div>

            {/* Tab Contents: ATS Score View */}
            <div className="glass-card" style={styles.tabContentCard}>
              {activeTab === 'ats' && (
                <div style={styles.atsTabContent}>
                  {/* Gauge & Metrics */}
                  <div className="ats-overview-row" style={styles.atsOverviewRow}>
                    <div style={styles.atsGaugeCol}>
                      <GaugeChart score={activeAnalysis.atsScore} size={150} strokeWidth={12} showDetails={true} />
                      <span style={styles.atsRatingBadge}>Great Score! 🎉</span>
                    </div>

                    <div style={styles.atsBarsCol}>
                      {/* Bar 1 */}
                      <div style={styles.progressBarWrapper}>
                        <div style={styles.barHeader}>
                          <span>Content Quality</span>
                          <strong>{activeAnalysis.scoreMetrics.contentQuality}/100</strong>
                        </div>
                        <div style={styles.barTrack}>
                          <div style={{ ...styles.barFill, width: `${activeAnalysis.scoreMetrics.contentQuality}%`, background: 'var(--success)' }} />
                        </div>
                      </div>
                      {/* Bar 2 */}
                      <div style={styles.progressBarWrapper}>
                        <div style={styles.barHeader}>
                          <span>Keyword Optimization</span>
                          <strong>{activeAnalysis.scoreMetrics.keywordOptimization}/100</strong>
                        </div>
                        <div style={styles.barTrack}>
                          <div style={{ ...styles.barFill, width: `${activeAnalysis.scoreMetrics.keywordOptimization}%`, background: 'var(--success)' }} />
                        </div>
                      </div>
                      {/* Bar 3 */}
                      <div style={styles.progressBarWrapper}>
                        <div style={styles.barHeader}>
                          <span>Format & Structure</span>
                          <strong>{activeAnalysis.scoreMetrics.formatStructure}/100</strong>
                        </div>
                        <div style={styles.barTrack}>
                          <div style={{ ...styles.barFill, width: `${activeAnalysis.scoreMetrics.formatStructure}%`, background: 'var(--primary)' }} />
                        </div>
                      </div>
                      {/* Bar 4 */}
                      <div style={styles.progressBarWrapper}>
                        <div style={styles.barHeader}>
                          <span>Relevance</span>
                          <strong>{activeAnalysis.scoreMetrics.relevance}/100</strong>
                        </div>
                        <div style={styles.barTrack}>
                          <div style={{ ...styles.barFill, width: `${activeAnalysis.scoreMetrics.relevance}%`, background: 'var(--primary)' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr style={styles.divider} />

                  {/* Strengths & Weaknesses checklists */}
                  <div className="ats-lists-grid" style={styles.listsGrid}>
                    <div>
                      <h4 style={styles.listTitle}>Resume Strengths</h4>
                      <ul style={styles.checkList}>
                        {activeAnalysis.strengths.map((str, idx) => (
                          <li key={idx} style={styles.listItem}>
                            <CheckCircle size={14} color="var(--success)" fill="var(--success-glow)" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 style={styles.listTitle}>Areas to Improve</h4>
                      <ul style={styles.checkList}>
                        {activeAnalysis.improvements.map((imp, idx) => (
                          <li key={idx} style={styles.listItem}>
                            <AlertTriangle size={14} color="var(--warning)" fill="var(--warning-glow)" />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'breakdown' && (
                <div style={styles.textTabContent}>
                  <h3>Structure & Design Report</h3>
                  <p>Our analyzer scanned 12 segments of your document. Contact details, headings hierarchy, and sections organization are highly formatted.</p>
                  <div style={styles.reportCard}>
                    <strong>Readability Rating: Good</strong>
                    <p>Standard fonts (Inter) are highly parsed by search indexing tools. Average line spacing matches the 1.15-1.3 ATS benchmark.</p>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div style={styles.textTabContent}>
                  <h3>Missing Critical Credentials</h3>
                  <p>To reach a 95%+ match index for a <strong>{targetRole}</strong> role, consider adding these tools to your skills array:</p>
                  <div style={styles.skillsTagRow}>
                    {activeAnalysis.keywordStatus.filter(k => k.status === 'Missing').map((k, idx) => (
                      <span key={idx} className="badge-danger">{k.keyword}</span>
                    ))}
                    {activeAnalysis.keywordStatus.filter(k => k.status === 'Partial').map((k, idx) => (
                      <span key={idx} className="badge-warning">{k.keyword} (Partial)</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div style={styles.textTabContent}>
                  <h3>AI Suggested Optimizations</h3>
                  <ul style={styles.numberedList}>
                    <li><strong>Action-Verbs</strong>: Start your work experience bullets with active terms like "Orchestrated", "Formulated", "Redesigned".</li>
                    <li><strong>Quantifiable Success</strong>: Rewrite task lines to include project scope (e.g., "Led design systems revamp across 4 application modules").</li>
                    <li><strong>ATS Friendly Anchors</strong>: Avoid storing contact information in graphic banners or text images.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Call to Action */}
            <div style={styles.ctaBox}>
              <div style={styles.ctaIcon}>✨</div>
              <div style={styles.ctaDetails}>
                <h4>Want to improve your score?</h4>
                <p>Use our AI Resume Builder to optimize your resume and boost your score.</p>
              </div>
              <button style={styles.ctaBtn} onClick={() => navigate('/resume-builder')}>Improve Resume <ArrowRight size={14} /></button>
            </div>
          </div>

          {/* Right Sidebar Charts */}
          <div style={styles.resultsRight}>
            {/* Score Summary Spider Chart */}
            <div className="glass-card" style={styles.radarCard}>
              <span style={styles.cardHeader}>Score Summary</span>
              <RadarChart data={radarData} size={200} />
            </div>

            {/* Keyword Matches Widget */}
            <div className="glass-card" style={styles.keywordsCard}>
              <span style={styles.cardHeader}>Top Matched Keywords</span>
              <div style={styles.keywordList}>
                {activeAnalysis.keywordStatus.map((kw, idx) => (
                  <div key={idx} style={styles.keywordRow}>
                    <span style={styles.kwName}>{kw.keyword}</span>
                    <span 
                      className={
                        kw.status === 'Match' ? 'badge-match' :
                        kw.status === 'Partial' ? 'badge-warning' : 'badge-danger'
                      }
                    >
                      {kw.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
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
  btnHistory: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  uploadCard: {
    borderStyle: 'dashed',
    borderWidth: '2px',
    padding: '30px',
  },
  uploadSplit: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'center',
  },
  uploadLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRight: '1px solid var(--border-light)',
    paddingRight: '40px',
    gap: '12px',
  },
  uploadIconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInputLabel: {
    background: 'var(--primary)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-block',
    boxShadow: '0 4px 10px rgba(99,102,241,0.2)',
  },
  formats: {
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  uploadRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  roleSelectorBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  roleLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  roleSelect: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'text',
  },
  fileStatus: {
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  fileDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    strong: {
      fontSize: '13px',
      color: '#fff',
    },
    span: {
      fontSize: '11px',
      color: 'var(--text-dim)',
    }
  },
  uploadSuccess: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--success)',
  },
  fileStatusPlaceholder: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px dashed var(--border-light)',
    padding: '16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'var(--text-dim)',
    fontSize: '12px',
  },
  loaderBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(99,102,241,0.05)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '10px',
    fontSize: '13px',
    color: 'var(--primary)',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(99,102,241,0.2)',
    borderTopColor: 'var(--primary)',
    borderRadius: '50%',
    animation: 'pulseGlow 1s linear infinite, spin 0.8s linear infinite',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '24px',
  },
  resultsLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tabsRow: {
    display: 'flex',
    gap: '10px',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '4px',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  tabActive: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    padding: '8px 16px',
    cursor: 'pointer',
    borderBottom: '2px solid var(--primary)',
  },
  tabContentCard: {
    padding: '30px',
  },
  atsOverviewRow: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.2fr',
    gap: '30px',
    alignItems: 'center',
  },
  atsGaugeCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  atsRatingBadge: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--success)',
  },
  atsBarsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  progressBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  barHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    span: {
      color: 'var(--text-muted)',
    },
    strong: {
      color: '#fff',
    }
  },
  barTrack: {
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.8s ease-in-out',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border-light)',
    margin: '24px 0',
  },
  listsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  listTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '12px',
  },
  checkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
  },
  textTabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    h3: {
      fontSize: '16px',
      color: '#fff',
    },
    p: {
      fontSize: '13px',
      color: 'var(--text-muted)',
      lineHeight: '1.5',
    }
  },
  reportCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12px',
  },
  skillsTagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  numberedList: {
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  ctaBox: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(59,130,246,0.02) 100%)',
    border: '1px dashed rgba(99,102,241,0.25)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  ctaIcon: {
    fontSize: '24px',
  },
  ctaDetails: {
    flex: 1,
    h4: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#fff',
      marginBottom: '4px',
    },
    p: {
      fontSize: '11px',
      color: 'var(--text-muted)',
    }
  },
  ctaBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  resultsRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  cardHeader: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '15px',
  },
  radarCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  keywordsCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  keywordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  keywordRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
  },
  kwName: {
    fontSize: '12px',
    color: '#fff',
    fontWeight: 500,
  }
};
