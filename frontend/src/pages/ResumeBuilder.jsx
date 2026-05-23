import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Save, 
  Eye, 
  Download, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Check,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GaugeChart from '../components/GaugeChart';

export default function ResumeBuilder() {
  const { resume, saveResume, user } = useApp();

  // Active section track
  const [activeSection, setActiveSection] = useState('personal'); // personal, education, experience, projects, achievements, certificates, skills
  const [editMode, setEditMode] = useState('edit'); // edit, preview

  // Resume form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    title: '',
    summary: '',
  });

  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState({ languages: '', interests: '' });
  
  // Style customizer
  const [templateId, setTemplateId] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(10);
  
  // ATS Score estimator
  const [atsScore, setAtsScore] = useState(85);

  // Sync state from API resume data once loaded
  useEffect(() => {
    if (resume) {
      setPersonalInfo(resume.personalInfo || {});
      setEducation(resume.education || []);
      setWorkExperience(resume.workExperience || []);
      setProjects(resume.projects || []);
      setAchievements(resume.achievements || []);
      setCertificates(resume.certificates || []);
      setSkills(resume.skills || []);
      setAdditionalInfo(resume.additionalInfo || { languages: '', interests: '' });
      setAtsScore(resume.atsScore || 85);
      
      if (resume.templateStyle) {
        setTemplateId(resume.templateStyle.templateId || 'modern');
        setPrimaryColor(resume.templateStyle.primaryColor || '#6366f1');
        setFontFamily(resume.templateStyle.fontFamily || 'Inter');
        setFontSize(resume.templateStyle.fontSize || 10);
      }
    }
  }, [resume]);

  // Handle Form Inputs
  const handlePersonalChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  // Section List for left navigation
  const sections = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'education', name: 'Education' },
    { id: 'experience', name: 'Work Experience' },
    { id: 'projects', name: 'Projects' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'skills', name: 'Skills' },
    { id: 'additional', name: 'Additional Info' }
  ];

  // List Management Helpers
  const addListField = (type) => {
    if (type === 'education') {
      setEducation([...education, { degree: '', school: '', year: '', grade: '' }]);
    } else if (type === 'experience') {
      setWorkExperience([...workExperience, { role: '', company: '', location: '', duration: '', description: '' }]);
    } else if (type === 'projects') {
      setProjects([...projects, { title: '', technologies: '', description: '', link: '' }]);
    } else if (type === 'achievements') {
      setAchievements([...achievements, { title: '', description: '' }]);
    } else if (type === 'certificates') {
      setCertificates([...certificates, { title: '', issuer: '', date: '' }]);
    } else if (type === 'skills') {
      setSkills([...skills, { name: '', level: 80 }]);
    }
  };

  const removeListField = (type, index) => {
    if (type === 'education') {
      setEducation(education.filter((_, i) => i !== index));
    } else if (type === 'experience') {
      setWorkExperience(workExperience.filter((_, i) => i !== index));
    } else if (type === 'projects') {
      setProjects(projects.filter((_, i) => i !== index));
    } else if (type === 'achievements') {
      setAchievements(achievements.filter((_, i) => i !== index));
    } else if (type === 'certificates') {
      setCertificates(certificates.filter((_, i) => i !== index));
    } else if (type === 'skills') {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const updateListField = (type, index, field, value) => {
    if (type === 'education') {
      const updated = [...education];
      updated[index][field] = value;
      setEducation(updated);
    } else if (type === 'experience') {
      const updated = [...workExperience];
      updated[index][field] = value;
      setWorkExperience(updated);
    } else if (type === 'projects') {
      const updated = [...projects];
      updated[index][field] = value;
      setProjects(updated);
    } else if (type === 'achievements') {
      const updated = [...achievements];
      updated[index][field] = value;
      setAchievements(updated);
    } else if (type === 'certificates') {
      const updated = [...certificates];
      updated[index][field] = value;
      setCertificates(updated);
    } else if (type === 'skills') {
      const updated = [...skills];
      updated[index][field] = value;
      setSkills(updated);
    }
  };

  // API Call to Save Resume
  const handleSave = async () => {
    const payload = {
      personalInfo,
      education,
      workExperience,
      projects,
      achievements,
      certificates,
      skills,
      additionalInfo,
      templateStyle: {
        templateId,
        primaryColor,
        fontFamily,
        fontSize
      }
    };
    
    const updated = await saveResume(payload);
    if (updated) {
      setAtsScore(updated.atsScore);
      alert('Resume saved and ATS analyzed successfully!');
    }
  };

  // Simulated AI Wording Optimization
  const handleAIOptimize = () => {
    // 1. Optimize Personal Summary
    setPersonalInfo(prev => ({
      ...prev,
      summary: 'Motivated Full Stack Developer & Product Designer with 4+ years of experience spearheading responsive web applications. Expert at optimizing client conversion paths, yielding 30% performance load reductions and boosting ATS compliance across teams.'
    }));

    // 2. Optimize work experience bullets with active action verbs & metrics
    if (workExperience.length > 0) {
      const updated = [...workExperience];
      updated[0].description = 'Engineered and scaled visual interfaces using React, Node.js, and MongoDB, increasing client retention by 15%. Orchestrated cross-functional UI alignments and constructed standard design systems modules. Quantified performance parameters, accelerating asset loading by 30% in production.';
      setWorkExperience(updated);
    }

    // 3. Elevate Estimated score
    setAtsScore(92);
    alert('AI Optimization Applied! Action verbs integrated and metrics quantified. Score boosted to 92/100.');
  };

  const renderModern = () => {
    return (
      <>
        {/* Header info */}
        <div style={{ ...styles.paperHeader, borderBottom: `2px solid ${primaryColor}` }}>
          <h1 style={{ fontSize: '18pt', color: '#111827', fontWeight: 800 }}>
            {personalInfo.fullName || 'Alex Johnson'}
          </h1>
          <p style={{ color: primaryColor, fontWeight: 600, fontSize: '11pt', marginTop: '4px' }}>
            {personalInfo.title || 'Product Designer'}
          </p>
          
          <div style={styles.paperContactRow}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div style={styles.paperContactRow}>
            {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
            {personalInfo.portfolio && <span>Website: {personalInfo.portfolio}</span>}
          </div>
        </div>

        {/* Profile summary */}
        {personalInfo.summary && (
          <div style={styles.paperSection}>
            <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>PROFESSIONAL SUMMARY</h4>
            <p style={{ marginTop: '4px', lineHeight: '1.4', color: '#374151' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Work history */}
        {workExperience.length > 0 && (
          <div style={styles.paperSection}>
            <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>WORK EXPERIENCE</h4>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937' }}>
                  <span>{exp.role}</span>
                  <span>{exp.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '9pt', fontStyle: 'italic', marginBottom: '4px' }}>
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <p style={{ lineHeight: '1.4', color: '#4b5563', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={styles.paperSection}>
            <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>PROJECTS</h4>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937' }}>
                  <span>{proj.title}</span>
                  {proj.link && <span style={{ fontSize: '8pt', color: primaryColor }}>{proj.link}</span>}
                </div>
                <p style={{ color: '#6b7280', fontSize: '8.5pt', fontStyle: 'italic', marginBottom: '2px' }}>Technologies: {proj.technologies}</p>
                <p style={{ lineHeight: '1.4', color: '#4b5563' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grid layout for remaining items */}
        <div style={styles.paperBottomGrid}>
          {/* Left Column */}
          <div>
            {education.length > 0 && (
              <div style={styles.paperSection}>
                <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>EDUCATION</h4>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginTop: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{edu.degree}</div>
                    <div style={{ color: '#4b5563' }}>{edu.school}</div>
                    <div style={{ fontSize: '8.5pt', color: '#6b7280' }}>{edu.year} • {edu.grade}</div>
                  </div>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div style={styles.paperSection}>
                <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>SKILLS</h4>
                <div style={styles.paperSkillsList}>
                  {skills.map((s, idx) => (
                    <div key={idx} style={styles.paperSkillRow}>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                      <div style={styles.skillBarTrack}>
                        <div style={{ ...styles.skillBarFill, width: `${s.level}%`, background: primaryColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {achievements.length > 0 && (
              <div style={styles.paperSection}>
                <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>ACHIEVEMENTS</h4>
                {achievements.map((ach, idx) => (
                  <div key={idx} style={{ marginTop: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{ach.title}</div>
                    <p style={{ color: '#4b5563' }}>{ach.description}</p>
                  </div>
                ))}
              </div>
            )}

            {certificates.length > 0 && (
              <div style={styles.paperSection}>
                <h4 style={{ color: primaryColor, fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.5px', paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '6px' }}>CERTIFICATIONS</h4>
                {certificates.map((cert, idx) => (
                  <div key={idx} style={{ marginTop: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{cert.title}</div>
                    <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderClassic = () => {
    return (
      <div style={{ textAlign: 'left' }}>
        {/* Left aligned header */}
        <div style={{ paddingBottom: '16px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '20px' }}>
          <h1 style={{ fontSize: '20pt', color: '#111827', fontWeight: 700, margin: 0 }}>
            {personalInfo.fullName || 'Alex Johnson'}
          </h1>
          <p style={{ color: primaryColor, fontWeight: 600, fontSize: '12pt', marginTop: '4px', marginBottom: '8px' }}>
            {personalInfo.title || 'Product Designer'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '9pt', color: '#4b5563' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• GitHub: {personalInfo.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>SUMMARY</h4>
            <p style={{ marginTop: '6px', lineHeight: '1.4', color: '#374151' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>EXPERIENCE</h4>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937' }}>
                  <span>{exp.role} - {exp.company}</span>
                  <span>{exp.duration}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '8.5pt', marginBottom: '4px' }}>{exp.location}</div>
                <p style={{ lineHeight: '1.4', color: '#4b5563', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>PROJECTS</h4>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937' }}>
                  <span>{proj.title}</span>
                  {proj.link && <span style={{ fontSize: '8pt', color: primaryColor }}>{proj.link}</span>}
                </div>
                <div style={{ color: '#6b7280', fontSize: '8pt', fontStyle: 'italic', margin: '2px 0' }}>Technologies: {proj.technologies}</div>
                <p style={{ lineHeight: '1.4', color: '#4b5563' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>EDUCATION</h4>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#1f2937' }}>{edu.school}</span>
                  <span style={{ color: '#4b5563' }}> — {edu.degree}</span>
                </div>
                <span style={{ fontSize: '8.5pt', color: '#6b7280' }}>{edu.year} ({edu.grade})</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>SKILLS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {skills.map((s, idx) => (
                <span key={idx} style={{ padding: '4px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '8.5pt', color: '#374151', border: '1px solid #e5e7eb' }}>
                  {s.name} ({s.level}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements & Certifications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {achievements.length > 0 && (
            <div>
              <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>ACHIEVEMENTS</h4>
              {achievements.map((ach, idx) => (
                <div key={idx} style={{ marginTop: '6px', fontSize: '9pt' }}>
                  <div style={{ fontWeight: 700, color: '#1f2937' }}>{ach.title}</div>
                  <div style={{ color: '#4b5563' }}>{ach.description}</div>
                </div>
              ))}
            </div>
          )}
          {certificates.length > 0 && (
            <div>
              <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, borderBottom: `1px solid #e5e7eb`, paddingBottom: '4px', marginBottom: '6px', letterSpacing: '0.5px' }}>CERTIFICATIONS</h4>
              {certificates.map((cert, idx) => (
                <div key={idx} style={{ marginTop: '6px', fontSize: '9pt' }}>
                  <div style={{ fontWeight: 700, color: '#1f2937' }}>{cert.title}</div>
                  <div style={{ color: '#6b7280' }}>{cert.issuer} • {cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCreative = () => {
    return (
      <div style={{ display: 'flex', margin: '-40px', minHeight: '830px', textAlign: 'left' }}>
        {/* Left Column (Sidebar) */}
        <div style={{ width: '32%', backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar Initials */}
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, margin: '0 auto 10px auto' }}>
            {personalInfo.fullName ? personalInfo.fullName.split(' ').map(n=>n[0]).join('') : 'AJ'}
          </div>

          {/* Contact Details */}
          <div>
            <h5 style={{ color: primaryColor, fontSize: '9pt', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>CONTACT</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8pt', color: '#4b5563', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
              {personalInfo.email && <div>✉ {personalInfo.email}</div>}
              {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
              {personalInfo.location && <div>📍 {personalInfo.location}</div>}
              {personalInfo.linkedin && <div style={{ fontSize: '7.5pt' }}>🔗 {personalInfo.linkedin}</div>}
              {personalInfo.github && <div style={{ fontSize: '7.5pt' }}>🐙 {personalInfo.github}</div>}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h5 style={{ color: primaryColor, fontSize: '9pt', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>EDUCATION</h5>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '8px', fontSize: '8pt', color: '#374151' }}>
                  <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ color: '#4b5563' }}>{edu.school}</div>
                  <div style={{ color: '#6b7280', fontSize: '7.5pt' }}>{edu.year}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h5 style={{ color: primaryColor, fontSize: '9pt', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>SKILLS</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {skills.map((s, idx) => (
                  <div key={idx} style={{ fontSize: '8pt', color: '#374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>{s.name}</span>
                      <span style={{ fontWeight: 600 }}>{s.level}%</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', backgroundColor: '#e5e7eb', borderRadius: '1.5px' }}>
                      <div style={{ width: `${s.level}%`, height: '100%', backgroundColor: primaryColor, borderRadius: '1.5px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Main content) */}
        <div style={{ width: '68%', padding: '30px 25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header name */}
          <div>
            <h1 style={{ fontSize: '22pt', color: '#111827', fontWeight: 800, margin: 0 }}>
              {personalInfo.fullName || 'Alex Johnson'}
            </h1>
            <p style={{ color: primaryColor, fontWeight: 600, fontSize: '12pt', marginTop: '4px', letterSpacing: '0.5px' }}>
              {personalInfo.title || 'Product Designer'}
            </p>
          </div>

          {/* Profile summary */}
          {personalInfo.summary && (
            <div>
              <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>PROFILE</h4>
              <p style={{ marginTop: '6px', lineHeight: '1.4', color: '#374151', fontSize: '9pt' }}>{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div>
              <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>EXPERIENCE</h4>
              {workExperience.map((exp, idx) => (
                <div key={idx} style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '9pt' }}>
                    <span>{exp.role}</span>
                    <span>{exp.duration}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '8pt', marginBottom: '4px' }}>{exp.company} • {exp.location}</div>
                  <p style={{ lineHeight: '1.4', color: '#4b5563', fontSize: '8.5pt', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h4 style={{ color: primaryColor, fontSize: '10pt', fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>PROJECTS</h4>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '9pt' }}>
                    <span>{proj.title}</span>
                    {proj.link && <span style={{ fontSize: '7.5pt', color: primaryColor }}>{proj.link}</span>}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '7.5pt', fontStyle: 'italic' }}>Tech: {proj.technologies}</div>
                  <p style={{ lineHeight: '1.4', color: '#4b5563', fontSize: '8.5pt', marginTop: '2px' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Achievements & Certs split in two column sidebar block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {achievements.length > 0 && (
              <div>
                <h4 style={{ color: primaryColor, fontSize: '9pt', fontWeight: 700, borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>KEY ACHIEVEMENTS</h4>
                {achievements.map((ach, idx) => (
                  <div key={idx} style={{ marginTop: '4px', fontSize: '8pt' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{ach.title}</div>
                    <div style={{ color: '#4b5563' }}>{ach.description}</div>
                  </div>
                ))}
              </div>
            )}
            {certificates.length > 0 && (
              <div>
                <h4 style={{ color: primaryColor, fontSize: '9pt', fontWeight: 700, borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>CERTIFICATIONS</h4>
                {certificates.map((cert, idx) => (
                  <div key={idx} style={{ marginTop: '4px', fontSize: '8pt' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{cert.title}</div>
                    <div style={{ color: '#6b7280' }}>{cert.issuer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMinimalist = () => {
    return (
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        {/* Centered Name */}
        <h1 style={{ fontSize: '20pt', color: '#111827', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
          {personalInfo.fullName || 'Alex Johnson'}
        </h1>
        <p style={{ color: '#4b5563', fontSize: '9.5pt', fontWeight: 500, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {personalInfo.title || 'Product Designer'}
        </p>

        {/* Contact list in single line */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '8pt', color: '#6b7280', marginTop: '6px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>| {personalInfo.github}</span>}
        </div>

        <div style={{ borderTop: '1px solid #9ca3af', margin: '12px 0' }} />

        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Summary</h4>
            <p style={{ lineHeight: '1.4', color: '#4b5563', fontSize: '8.5pt' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px' }}>Experience</h4>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '8.5pt' }}>
                  <span>{exp.role} — {exp.company}</span>
                  <span>{exp.duration}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '7.5pt', fontStyle: 'italic', marginBottom: '2px' }}>{exp.location}</div>
                <p style={{ lineHeight: '1.35', color: '#4b5563', fontSize: '8.5pt', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px' }}>Projects</h4>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '8.5pt' }}>
                  <span>{proj.title}</span>
                  <span>{proj.link}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '7.5pt', margin: '1px 0' }}>Technologies: {proj.technologies}</p>
                <p style={{ lineHeight: '1.35', color: '#4b5563', fontSize: '8.5pt' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px' }}>Education</h4>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '8.5pt' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#1f2937' }}>{edu.school}</span>
                  <span style={{ color: '#4b5563' }}> — {edu.degree}</span>
                </div>
                <span style={{ color: '#6b7280' }}>{edu.year} • {edu.grade}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '4px' }}>Skills</h4>
            <p style={{ fontSize: '8.5pt', color: '#4b5563', lineHeight: '1.4' }}>
              {skills.map(s => `${s.name}`).join(', ')}
            </p>
          </div>
        )}

        {/* Certs and Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
          {achievements.length > 0 && (
            <div>
              <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '4px' }}>Achievements</h4>
              {achievements.map((ach, idx) => (
                <div key={idx} style={{ marginTop: '4px', fontSize: '8pt', color: '#4b5563' }}>
                  <strong style={{ color: '#1f2937' }}>{ach.title}</strong>: {ach.description}
                </div>
              ))}
            </div>
          )}
          {certificates.length > 0 && (
            <div>
              <h4 style={{ color: '#111827', fontSize: '9pt', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '4px' }}>Certifications</h4>
              {certificates.map((cert, idx) => (
                <div key={idx} style={{ marginTop: '4px', fontSize: '8pt', color: '#4b5563' }}>
                  <strong style={{ color: '#1f2937' }}>{cert.title}</strong> — {cert.issuer} ({cert.date})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderExecutive = () => {
    return (
      <div style={{ textAlign: 'left' }}>
        {/* Executive Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `3px double ${primaryColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '20pt', color: '#111827', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
              {personalInfo.fullName || 'Alex Johnson'}
            </h1>
            <p style={{ color: primaryColor, fontWeight: 700, fontSize: '11pt', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              {personalInfo.title || 'Product Designer'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontSize: '8.5pt', color: '#4b5563', textAlign: 'right' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Executive Profile</h4>
            <p style={{ fontSize: '8.5pt', lineHeight: '1.4', color: '#374151', margin: 0 }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Executive Split Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '20px' }}>
          {/* Main Column */}
          <div>
            {/* Experience */}
            {workExperience.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Professional Experience</h4>
                {workExperience.map((exp, idx) => (
                  <div key={idx} style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '8.5pt' }}>
                      <span>{exp.role}</span>
                      <span>{exp.duration}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '8pt', fontStyle: 'italic', marginBottom: '3px' }}>
                      <span>{exp.company}</span>
                      <span>{exp.location}</span>
                    </div>
                    <p style={{ fontSize: '8pt', lineHeight: '1.35', color: '#4b5563', whiteSpace: 'pre-line', margin: 0 }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Key Projects</h4>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '8.5pt' }}>
                      <span>{proj.title}</span>
                      {proj.link && <span style={{ fontSize: '7.5pt', color: primaryColor }}>{proj.link}</span>}
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '7.5pt', fontStyle: 'italic', margin: '2px 0' }}>Technologies: {proj.technologies}</p>
                    <p style={{ fontSize: '8pt', lineHeight: '1.35', color: '#4b5563', margin: 0 }}>{proj.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div>
            {/* Education */}
            {education.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Education</h4>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginTop: '6px', fontSize: '8pt' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{edu.degree}</div>
                    <div style={{ color: '#4b5563' }}>{edu.school}</div>
                    <div style={{ color: '#6b7280', fontSize: '7.5pt' }}>{edu.year} • {edu.grade}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Core Expertise</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {skills.map((s, idx) => (
                    <span key={idx} style={{ padding: '3px 6px', background: '#f3f4f6', borderRadius: '4px', fontSize: '7.5pt', color: '#1f2937', border: '1px solid #e5e7eb' }}>
                      {s.name} ({s.level}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Achievements</h4>
                {achievements.map((ach, idx) => (
                  <div key={idx} style={{ marginTop: '6px', fontSize: '7.5pt' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{ach.title}</div>
                    <div style={{ color: '#4b5563' }}>{ach.description}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certificates.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #d1d5db', paddingBottom: '3px', marginBottom: '6px' }}>Certifications</h4>
                {certificates.map((cert, idx) => (
                  <div key={idx} style={{ marginTop: '6px', fontSize: '7.5pt' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{cert.title}</div>
                    <div style={{ color: '#6b7280' }}>{cert.issuer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTech = () => {
    return (
      <div style={{ textAlign: 'left' }}>
        {/* Tech Header */}
        <div style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: '12px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '20pt', color: '#111827', fontWeight: 800, margin: 0 }}>
            {personalInfo.fullName || 'Alex Johnson'}
          </h1>
          <p style={{ color: primaryColor, fontWeight: 700, fontSize: '11pt', marginTop: '2px', margin: 0 }}>
            {personalInfo.title || 'Full Stack Developer'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '8.5pt', color: '#4b5563', marginTop: '6px' }}>
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.github && <span>🐙 {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '8.5pt', lineHeight: '1.4', color: '#374151', margin: 0 }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Technical Stack Section at the top! */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px' }}>
            <h4 style={{ color: primaryColor, fontSize: '8.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 0, marginBottom: '6px' }}>Technical Skill Matrix</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((s, idx) => (
                <span key={idx} style={{ padding: '3px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '7.5pt', color: '#334155', fontWeight: 500 }}>
                  {s.name} <span style={{ color: primaryColor, fontWeight: 700 }}>•</span> {s.level}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '6px' }}>Professional Experience</h4>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '8.5pt' }}>
                  <span>{exp.role} <span style={{ fontWeight: 400, color: '#64748b' }}>at</span> {exp.company}</span>
                  <span style={{ fontSize: '8pt', color: '#64748b' }}>{exp.duration}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '8pt', marginBottom: '3px' }}>{exp.location}</div>
                <p style={{ fontSize: '8pt', lineHeight: '1.35', color: '#475569', whiteSpace: 'pre-line', margin: 0 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '6px' }}>Projects & Open Source</h4>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1f2937', fontSize: '8.5pt' }}>
                  <span>{proj.title}</span>
                  {proj.link && <span style={{ fontSize: '7.5pt', color: primaryColor }}>{proj.link}</span>}
                </div>
                <div style={{ color: '#64748b', fontSize: '7.5pt', margin: '2px 0' }}>
                  <span style={{ fontWeight: 600 }}>Stack:</span> {proj.technologies}
                </div>
                <p style={{ fontSize: '8pt', lineHeight: '1.35', color: '#475569', margin: 0 }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education & Certs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {education.length > 0 && (
            <div>
              <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '6px' }}>Education</h4>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginTop: '4px', fontSize: '8pt' }}>
                  <div style={{ fontWeight: 700, color: '#1f2937' }}>{edu.degree}</div>
                  <div style={{ color: '#475569' }}>{edu.school} • {edu.year}</div>
                  <div style={{ fontSize: '7.5pt', color: '#64748b' }}>Grade: {edu.grade}</div>
                </div>
              ))}
            </div>
          )}

          {(certificates.length > 0 || achievements.length > 0) && (
            <div>
              <h4 style={{ color: '#111827', fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '6px' }}>Certifications & Honors</h4>
              {certificates.slice(0, 2).map((cert, idx) => (
                <div key={idx} style={{ marginTop: '4px', fontSize: '7.5pt', color: '#475569' }}>
                  🏆 <strong style={{ color: '#1f2937' }}>{cert.title}</strong> — {cert.issuer}
                </div>
              ))}
              {achievements.slice(0, 2).map((ach, idx) => (
                <div key={idx} style={{ marginTop: '4px', fontSize: '7.5pt', color: '#475569' }}>
                  ⭐️ <strong style={{ color: '#1f2937' }}>{ach.title}</strong>: {ach.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderITSector = () => {
    const renderBullets = (text) => {
      if (!text) return null;
      return (
        <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0', listStyleType: 'disc' }}>
          {text.split('\n').map((line, idx) => {
            const trimmed = line.trim().replace(/^[•\-\*]\s*/, '');
            if (!trimmed) return null;
            return (
              <li key={idx} style={{ fontSize: '11pt', color: '#000', lineHeight: '1.4', marginBottom: '3px' }}>
                {trimmed}
              </li>
            );
          })}
        </ul>
      );
    };

    const renderSkillItem = (s) => {
      if (!s.name) return null;
      const parts = s.name.split(':');
      if (parts.length > 1) {
        return (
          <li style={{ fontSize: '11pt', color: '#000', lineHeight: '1.4', marginBottom: '4px' }}>
            <strong style={{ color: '#000' }}>{parts[0].trim()}</strong>: {parts.slice(1).join(':').trim()}
          </li>
        );
      }
      return (
        <li style={{ fontSize: '11pt', color: '#000', lineHeight: '1.4', marginBottom: '4px' }}>
          <strong style={{ color: '#000' }}>{s.name}</strong> (Proficiency: {s.level}%)
        </li>
      );
    };

    return (
      <div style={{ textAlign: 'left', fontFamily: 'Arial, Helvetica, sans-serif', color: '#000', padding: '20px 10px', backgroundColor: '#fff' }}>
        {/* Centered Header Section */}
        <div style={{ textAlign: 'center', paddingBottom: '10px', borderBottom: '1px solid #000', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '24pt', color: '#000', fontWeight: 'bold', margin: '0 0 5px 0' }}>
            {personalInfo.fullName || 'Rajesh Kumar'}
          </h1>
          <p style={{ fontSize: '11pt', color: '#000', margin: '0 0 5px 0' }}>
            {personalInfo.location || '123, Main Street, New Delhi, India'}
          </p>
          <p style={{ fontSize: '11pt', color: '#000', margin: 0 }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {(personalInfo.email && personalInfo.phone) && <span> | </span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.linkedin && (personalInfo.email || personalInfo.phone)) && <span> | </span>}
            {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
          </p>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid #000', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', margin: '0 0 8px 0' }}>Professional Summary</h3>
            <p style={{ fontSize: '11pt', lineHeight: '1.5', color: '#000', margin: 0 }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid #000', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', margin: '0 0 8px 0' }}>Education</h3>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: idx < education.length - 1 ? '10px' : '0' }}>
                <div style={{ fontSize: '11pt', color: '#000' }}>{edu.degree}</div>
                <div style={{ fontSize: '11pt', color: '#000', marginTop: '2px' }}>
                  {edu.school} {edu.year ? `| Graduated: ${edu.year}` : ''}
                </div>
                {edu.grade && (
                  <div style={{ fontSize: '11pt', color: '#000', marginTop: '2px' }}>
                    Scored {edu.grade}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid #000', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', margin: '0 0 8px 0' }}>Skills</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
              {skills.map((s, idx) => (
                <React.Fragment key={idx}>
                  {renderSkillItem(s)}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid #000', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', margin: '0 0 8px 0' }}>Experience</h3>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: idx < workExperience.length - 1 ? '15px' : '0' }}>
                <div style={{ fontWeight: 'normal', fontSize: '11pt', color: '#000' }}>
                  {exp.role}{exp.company ? `, ${exp.company}` : ''}{exp.location ? `, ${exp.location}` : ''}
                </div>
                <div style={{ fontSize: '11pt', color: '#000', marginTop: '2px', marginBottom: '6px' }}>
                  {exp.duration}
                </div>
                {exp.description && renderBullets(exp.description)}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', margin: '0 0 8px 0' }}>Projects</h3>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: idx < projects.length - 1 ? '15px' : '0' }}>
                <div style={{ fontWeight: 'normal', fontSize: '11pt', color: '#000' }}>
                  {proj.title}{proj.technologies ? `, ${proj.technologies}` : ''}
                </div>
                {proj.description && renderBullets(proj.description)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderModernSidebar = () => {
    const sidebarBg = '#2A323C';
    const sidebarColor = '#ffffff';

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>
        {/* Sidebar */}
        <div style={{ backgroundColor: sidebarBg, color: sidebarColor, padding: '30px 20px' }}>
          
          {/* Contact */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#fff', fontSize: '14pt', borderBottom: '2px solid #fff', paddingBottom: '4px', marginBottom: '10px' }}>Contact</h3>
            
            {personalInfo.location && (
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '9pt', display: 'block', marginBottom: '2px' }}>Address</strong>
                <span style={{ fontSize: '8.5pt', opacity: 0.9 }}>{personalInfo.location}</span>
              </div>
            )}
            
            {personalInfo.phone && (
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '9pt', display: 'block', marginBottom: '2px' }}>Phone</strong>
                <span style={{ fontSize: '8.5pt', opacity: 0.9 }}>{personalInfo.phone}</span>
              </div>
            )}
            
            {personalInfo.email && (
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '9pt', display: 'block', marginBottom: '2px' }}>Email</strong>
                <span style={{ fontSize: '8.5pt', opacity: 0.9 }}>{personalInfo.email}</span>
              </div>
            )}

            {personalInfo.linkedin && (
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '9pt', display: 'block', marginBottom: '2px' }}>LinkedIn</strong>
                <span style={{ fontSize: '8.5pt', opacity: 0.9 }}>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#fff', fontSize: '14pt', borderBottom: '2px solid #fff', paddingBottom: '4px', marginBottom: '10px' }}>Skills</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: 0 }}>
                {skills.map((s, idx) => (
                  <li key={idx} style={{ fontSize: '9pt', marginBottom: '4px', opacity: 0.9 }}>{s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Info (Languages / Hobbies) */}
          {additionalInfo.languages && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#fff', fontSize: '14pt', borderBottom: '2px solid #fff', paddingBottom: '4px', marginBottom: '10px' }}>Languages</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: 0 }}>
                {additionalInfo.languages.split(',').map((l, idx) => (
                  <li key={idx} style={{ fontSize: '9pt', marginBottom: '4px', opacity: 0.9 }}>{l.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {additionalInfo.interests && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#fff', fontSize: '14pt', borderBottom: '2px solid #fff', paddingBottom: '4px', marginBottom: '10px' }}>Hobbies</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: 0 }}>
                {additionalInfo.interests.split(',').map((i, idx) => (
                  <li key={idx} style={{ fontSize: '9pt', marginBottom: '4px', opacity: 0.9 }}>{i.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ padding: '30px 25px', backgroundColor: '#fff', color: '#1a202c' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '25px' }}>
            <h1 style={{ fontSize: '28pt', fontWeight: 800, color: '#1a202c', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {personalInfo.fullName || 'MAX JOHNSON'}
            </h1>
            <h2 style={{ fontSize: '14pt', fontWeight: 500, color: '#4a5568', margin: 0 }}>
              {personalInfo.title || 'UX Designer'}
            </h2>
          </div>

          {/* Profile */}
          {personalInfo.summary && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '14pt', fontWeight: 700, borderBottom: '2px solid #1a202c', paddingBottom: '4px', marginBottom: '10px', display: 'inline-block' }}>Profile</h3>
              <p style={{ fontSize: '9.5pt', lineHeight: '1.5', color: '#2d3748', margin: 0 }}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '14pt', fontWeight: 700, borderBottom: '2px solid #1a202c', paddingBottom: '4px', marginBottom: '15px', display: 'inline-block' }}>Work Experience</h3>
              {workExperience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 700, fontSize: '10.5pt', color: '#1a202c', marginBottom: '2px' }}>{exp.role}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: '#4a5568', marginBottom: '6px' }}>
                    <span>{exp.company}{exp.location ? ` – ${exp.location}` : ''}</span>
                    <span>{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: 0 }}>
                      {exp.description.split('\n').map((line, lIdx) => {
                        const trimmed = line.trim().replace(/^[•\-\*]\s*/, '');
                        if (!trimmed) return null;
                        return <li key={lIdx} style={{ fontSize: '9pt', color: '#2d3748', lineHeight: '1.4', marginBottom: '4px' }}>{trimmed}</li>;
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '14pt', fontWeight: 700, borderBottom: '2px solid #1a202c', paddingBottom: '4px', marginBottom: '15px', display: 'inline-block' }}>Education</h3>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '10.5pt', color: '#1a202c', marginBottom: '2px' }}>{edu.degree}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: '#4a5568' }}>
                    <span>{edu.school}</span>
                    <span>{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    );
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      {/* Top Header Deck */}
      <div className="no-print" style={styles.header}>
        <div>
          <h1 style={styles.title}>Generate Resume</h1>
          <p style={styles.subtitle}>Create a professional resume that gets you noticed.</p>
        </div>
        <div style={styles.actionBtnRow}>
          <button onClick={handleAIOptimize} style={styles.btnAIAssist}><Sparkles size={14} /> AI Assistant</button>
          <button onClick={handleSave} style={styles.btnSave}><Save size={14} /> Save</button>
          <button onClick={() => setEditMode(editMode === 'edit' ? 'preview' : 'edit')} style={styles.btnPreview}>
            <Eye size={14} /> {editMode === 'edit' ? 'Preview' : 'Edit Mode'}
          </button>
          <button onClick={handleDownload} style={styles.btnDownload}><Download size={14} /> Download</button>
        </div>
      </div>

      {/* Main Workspace grid */}
      <div className="resume-workspace-grid" style={styles.workspaceGrid}>
        {/* Left Side: Form Sections */}
        <div className="glass-card no-print" style={styles.formContainer}>
          {/* Mode Tabs */}
          <div style={styles.formModeHeader}>
            <div style={styles.sectionsNav}>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={activeSection === s.id ? styles.sectionBtnActive : styles.sectionBtn}
                >
                  <span style={activeSection === s.id ? styles.sectionDotActive : styles.sectionDot} />
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '16px 0' }} />

          {/* Form details based on section */}
          <div style={styles.formBody}>
            {activeSection === 'personal' && (
              <div style={styles.formSectionGroup}>
                <h3 style={styles.sectionHeader}>Personal Details</h3>
                <div style={styles.inputsGrid}>
                  <div style={styles.fieldBox}><label>Full Name</label><input type="text" name="fullName" value={personalInfo.fullName} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>Email Address</label><input type="email" name="email" value={personalInfo.email} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>Phone Number</label><input type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>Location</label><input type="text" name="location" value={personalInfo.location} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>LinkedIn Profile</label><input type="text" name="linkedin" value={personalInfo.linkedin} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>GitHub Profile</label><input type="text" name="github" value={personalInfo.github} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>Portfolio/Website</label><input type="text" name="portfolio" value={personalInfo.portfolio} onChange={handlePersonalChange} style={styles.input} /></div>
                  <div style={styles.fieldBox}><label>Job Title</label><input type="text" name="title" value={personalInfo.title} onChange={handlePersonalChange} style={styles.input} /></div>
                </div>
                <div style={{ ...styles.fieldBox, marginTop: '12px' }}>
                  <label>Professional Summary</label>
                  <textarea name="summary" value={personalInfo.summary} onChange={handlePersonalChange} style={styles.textarea} />
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div style={styles.formSectionGroup}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Education History</h3>
                  <button onClick={() => addListField('education')} style={styles.addBtn}><Plus size={14} /> Add</button>
                </div>
                {education.map((edu, idx) => (
                  <div key={idx} style={styles.listItemBox}>
                    <div style={styles.listItemHeader}>
                      <span>School #{idx+1}</span>
                      <button onClick={() => removeListField('education', idx)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div>
                    <div style={styles.inputsGrid}>
                      <div style={styles.fieldBox}><label>Degree</label><input type="text" value={edu.degree} onChange={(e) => updateListField('education', idx, 'degree', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>School</label><input type="text" value={edu.school} onChange={(e) => updateListField('education', idx, 'school', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Year/Duration</label><input type="text" value={edu.year} onChange={(e) => updateListField('education', idx, 'year', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Grade/CGPA</label><input type="text" value={edu.grade} onChange={(e) => updateListField('education', idx, 'grade', e.target.value)} style={styles.input} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'experience' && (
              <div style={styles.formSectionGroup}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Work Experience</h3>
                  <button onClick={() => addListField('experience')} style={styles.addBtn}><Plus size={14} /> Add</button>
                </div>
                {workExperience.map((exp, idx) => (
                  <div key={idx} style={styles.listItemBox}>
                    <div style={styles.listItemHeader}>
                      <span>Role #{idx+1}</span>
                      <button onClick={() => removeListField('experience', idx)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div>
                    <div style={styles.inputsGrid}>
                      <div style={styles.fieldBox}><label>Job Title/Role</label><input type="text" value={exp.role} onChange={(e) => updateListField('experience', idx, 'role', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Company</label><input type="text" value={exp.company} onChange={(e) => updateListField('experience', idx, 'company', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Location</label><input type="text" value={exp.location} onChange={(e) => updateListField('experience', idx, 'location', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Duration</label><input type="text" value={exp.duration} onChange={(e) => updateListField('experience', idx, 'duration', e.target.value)} style={styles.input} /></div>
                    </div>
                    <div style={{ ...styles.fieldBox, marginTop: '10px' }}>
                      <label>Job Description</label>
                      <textarea value={exp.description} onChange={(e) => updateListField('experience', idx, 'description', e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'projects' && (
              <div style={styles.formSectionGroup}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Projects</h3>
                  <button onClick={() => addListField('projects')} style={styles.addBtn}><Plus size={14} /> Add</button>
                </div>
                {projects.map((proj, idx) => (
                  <div key={idx} style={styles.listItemBox}>
                    <div style={styles.listItemHeader}>
                      <span>Project #{idx+1}</span>
                      <button onClick={() => removeListField('projects', idx)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div>
                    <div style={styles.inputsGrid}>
                      <div style={styles.fieldBox}><label>Title</label><input type="text" value={proj.title} onChange={(e) => updateListField('projects', idx, 'title', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Technologies Used</label><input type="text" value={proj.technologies} onChange={(e) => updateListField('projects', idx, 'technologies', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Project Link</label><input type="text" value={proj.link} onChange={(e) => updateListField('projects', idx, 'link', e.target.value)} style={styles.input} /></div>
                    </div>
                    <div style={{ ...styles.fieldBox, marginTop: '10px' }}>
                      <label>Description</label>
                      <textarea value={proj.description} onChange={(e) => updateListField('projects', idx, 'description', e.target.value)} style={styles.textarea} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'achievements' && (
              <div style={styles.formSectionGroup}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Achievements</h3>
                  <button onClick={() => addListField('achievements')} style={styles.addBtn}><Plus size={14} /> Add</button>
                </div>
                {achievements.map((ach, idx) => (
                  <div key={idx} style={styles.listItemBox}>
                    <div style={styles.listItemHeader}>
                      <span>Item #{idx+1}</span>
                      <button onClick={() => removeListField('achievements', idx)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div>
                    <div style={styles.fieldBox}><label>Achievement Title</label><input type="text" value={ach.title} onChange={(e) => updateListField('achievements', idx, 'title', e.target.value)} style={styles.input} /></div>
                    <div style={{ ...styles.fieldBox, marginTop: '10px' }}><label>Description</label><textarea value={ach.description} onChange={(e) => updateListField('achievements', idx, 'description', e.target.value)} style={styles.textarea} /></div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'certificates' && (
              <div style={styles.formSectionGroup}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Certificates</h3>
                  <button onClick={() => addListField('certificates')} style={styles.addBtn}><Plus size={14} /> Add</button>
                </div>
                {certificates.map((cert, idx) => (
                  <div key={idx} style={styles.listItemBox}>
                    <div style={styles.listItemHeader}>
                      <span>Certificate #{idx+1}</span>
                      <button onClick={() => removeListField('certificates', idx)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div>
                    <div style={styles.inputsGrid}>
                      <div style={styles.fieldBox}><label>Title</label><input type="text" value={cert.title} onChange={(e) => updateListField('certificates', idx, 'title', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Issuer</label><input type="text" value={cert.issuer} onChange={(e) => updateListField('certificates', idx, 'issuer', e.target.value)} style={styles.input} /></div>
                      <div style={styles.fieldBox}><label>Date</label><input type="text" value={cert.date} onChange={(e) => updateListField('certificates', idx, 'date', e.target.value)} style={styles.input} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'skills' && (
              <div style={styles.formSectionGroup}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Skills</h3>
                  <button onClick={() => addListField('skills')} style={styles.addBtn}><Plus size={14} /> Add</button>
                </div>
                <div style={styles.inputsGrid}>
                  {skills.map((s, idx) => (
                    <div key={idx} style={styles.skillInputItem}>
                      <input 
                        type="text" 
                        value={s.name} 
                        placeholder="Skill e.g. React" 
                        onChange={(e) => updateListField('skills', idx, 'name', e.target.value)} 
                        style={{ ...styles.input, flex: 2 }}
                      />
                      <input 
                        type="number" 
                        value={s.level} 
                        min="1" 
                        max="100" 
                        onChange={(e) => updateListField('skills', idx, 'level', parseInt(e.target.value) || 80)} 
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <button onClick={() => removeListField('skills', idx)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'additional' && (
              <div style={styles.formSectionGroup}>
                <h3 style={styles.sectionHeader}>Additional Information</h3>
                <div style={styles.fieldBox}>
                  <label>Languages (comma separated)</label>
                  <input type="text" value={additionalInfo.languages} onChange={(e) => setAdditionalInfo({ ...additionalInfo, languages: e.target.value })} style={styles.input} />
                </div>
                <div style={{ ...styles.fieldBox, marginTop: '12px' }}>
                  <label>Interests (comma separated)</label>
                  <input type="text" value={additionalInfo.interests} onChange={(e) => setAdditionalInfo({ ...additionalInfo, interests: e.target.value })} style={styles.input} />
                </div>
              </div>
            )}
          </div>

          <div style={styles.formFooter}>
            <button 
              onClick={() => {
                const currentIdx = sections.findIndex(s => s.id === activeSection);
                if (currentIdx < sections.length - 1) {
                  setActiveSection(sections[currentIdx + 1].id);
                } else {
                  handleSave();
                }
              }} 
              style={styles.btnNext}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Center Side: Live Render Sheet */}
        <div style={styles.previewContainer}>
          {/* Header tabs inside sheet area */}
          <div className="no-print" style={styles.modeTabs}>
            <button onClick={() => setEditMode('edit')} style={editMode === 'edit' ? styles.modeTabActive : styles.modeTab}>Edit Mode</button>
            <button onClick={() => setEditMode('preview')} style={editMode === 'preview' ? styles.modeTabActive : styles.modeTab}>Preview Mode</button>
          </div>

          <div 
            className="resume-print-target"
            style={{
              ...styles.resumePaper,
              fontFamily: fontFamily === 'Outfit' ? 'Outfit, sans-serif' : 'Inter, sans-serif',
              fontSize: `${fontSize}pt`
            }}
          >
            {templateId === 'classic' ? renderClassic() :
             templateId === 'creative' ? renderCreative() :
             templateId === 'minimalist' ? renderMinimalist() :
             templateId === 'executive' ? renderExecutive() :
             templateId === 'tech' ? renderTech() :
             templateId === 'it_sector' ? renderITSector() :
             templateId === 'modern_sidebar' ? renderModernSidebar() :
             renderModern()}
          </div>
        </div>

        {/* Right Side: Templates & Styles & ATS Estimator */}
        <div className="no-print" style={styles.rightPane}>
          {/* Template Styles customizer */}
          <div className="glass-card" style={styles.styleCustomizerCard}>
            <span style={styles.paneSectionTitle}>Template Styles</span>
            
            {/* Template Selection */}
            <div style={styles.styleOption}>
              <label style={styles.styleLabel}>Template Layout</label>
              <select 
                value={templateId} 
                onChange={(e) => setTemplateId(e.target.value)} 
                style={styles.customizerSelect}
              >
                <option value="modern">Modern Professional</option>
                <option value="classic">Classic Elegant</option>
                <option value="creative">Creative Sidebar</option>
                <option value="minimalist">Minimalist Clean</option>
                <option value="executive">Executive Corporate</option>
                <option value="tech">Developer / Technical</option>
                <option value="it_sector">IT Sector (ATS Clean)</option>
                <option value="modern_sidebar">Modern Two Column</option>
              </select>
            </div>

            {/* Theme colors */}
            <div style={styles.styleOption}>
              <label style={styles.styleLabel}>Template Style Color</label>
              <div style={styles.colorPalette}>
                {['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#1f2937'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setPrimaryColor(c)}
                    style={{
                      ...styles.colorDot,
                      backgroundColor: c,
                      border: primaryColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div style={styles.styleOption}>
              <label style={styles.styleLabel}>Font Style</label>
              <select 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)} 
                style={styles.customizerSelect}
              >
                <option value="Inter">Inter</option>
                <option value="Outfit">Outfit</option>
              </select>
            </div>

            {/* Font Size */}
            <div style={styles.styleOption}>
              <div style={styles.fontSizeHeader}>
                <label style={styles.styleLabel}>Font Size</label>
                <span>{fontSize}pt</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="14" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))} 
                style={styles.slider}
              />
            </div>
          </div>

          {/* AI Suggestions widget */}
          <div className="glass-card" style={styles.suggestionsCard}>
            <span style={styles.paneSectionTitle}>AI Suggestions</span>
            <ul style={styles.suggestionsList}>
              <li style={styles.suggestionItem}>
                <span style={styles.suggestBullet}>✨</span>
                <span>Add more achievements to showcase career wins.</span>
              </li>
              <li style={styles.suggestionItem}>
                <span style={styles.suggestBullet}>📈</span>
                <span>Quantify your work experience details with percentages.</span>
              </li>
              <li style={styles.suggestionItem}>
                <span style={styles.suggestBullet}>🎯</span>
                <span>Include relevant skills corresponding to target role.</span>
              </li>
            </ul>
            <button onClick={handleAIOptimize} style={styles.btnOptimizeNow}>
              ✨ Optimize with AI
            </button>
          </div>

          {/* ATS Score estimator */}
          <div className="glass-card" style={styles.estimatorCard}>
            <span style={styles.paneSectionTitle}>ATS Score Estimator</span>
            <div style={styles.estimatorSplit}>
              <GaugeChart score={atsScore} size={90} strokeWidth={8} showDetails={false} />
              <div>
                <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                  {atsScore} / 100
                </h4>
                <p style={{ color: 'var(--success)', fontSize: '11px', fontWeight: 600, marginTop: '2px' }}>
                  {atsScore >= 90 ? 'Excellent ATS compatibility' : 'Good ATS compatibility'}
                </p>
              </div>
            </div>
            <ul style={styles.estimatorChecklist}>
              <li style={styles.estCheckItem}><Check size={12} color="var(--success)" /> Good use of keywords</li>
              <li style={styles.estCheckItem}><Check size={12} color="var(--success)" /> Well-structured content</li>
              <li style={styles.estCheckItem}><Check size={12} color="var(--success)" /> Proper section organization</li>
            </ul>
          </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtnRow: {
    display: 'flex',
    gap: '10px',
  },
  btnAIAssist: {
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnSave: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnPreview: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '10px 16px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnDownload: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  workspaceGrid: {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.3fr 0.8fr',
    gap: '20px',
    alignItems: 'start',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '750px',
    overflowY: 'auto',
  },
  formModeHeader: {
    display: 'flex',
  },
  sectionsNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  sectionBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: 500,
    textAlign: 'left',
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
  },
  sectionBtnActive: {
    background: 'rgba(255,255,255,0.03)',
    border: 'none',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'left',
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--text-dim)',
  },
  sectionDotActive: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--primary)',
  },
  formBody: {
    flex: 1,
    marginTop: '10px',
  },
  formSectionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  sectionHeader: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '4px',
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    padding: '4px 10px',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  inputsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    label: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      fontWeight: 500,
    }
  },
  input: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '12px',
    outline: 'none',
    ':focus': { borderColor: 'var(--primary)' }
  },
  textarea: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '12px',
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical',
    ':focus': { borderColor: 'var(--primary)' }
  },
  listItemBox: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '10px',
  },
  listItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--text-dim)',
    marginBottom: '10px',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
  },
  skillInputItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  formFooter: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btnNext: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modeTabs: {
    display: 'flex',
    alignSelf: 'center',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-light)',
    padding: '4px',
    borderRadius: '20px',
  },
  modeTab: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: 600,
    padding: '6px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
  },
  modeTabActive: {
    background: 'var(--primary)',
    border: 'none',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    padding: '6px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
  },
  resumePaper: {
    background: '#fff',
    color: '#1f2937',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    minHeight: '750px',
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
  },
  paperHeader: {
    textAlign: 'center',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  paperContactRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '8.5pt',
    color: '#4b5563',
    marginTop: '6px',
  },
  paperSection: {
    marginBottom: '18px',
    h4: {
      fontSize: '9.5pt',
      fontWeight: 700,
      letterSpacing: '0.5px',
      paddingBottom: '4px',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '6px',
    }
  },
  paperBottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '24px',
  },
  paperSkillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  paperSkillRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '8.5pt',
    color: '#374151',
  },
  skillBarTrack: {
    width: '80px',
    height: '4px',
    background: '#e5e7eb',
    borderRadius: '2px',
  },
  skillBarFill: {
    height: '100%',
    borderRadius: '2px',
  },
  rightPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  paneSectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '16px',
  },
  styleCustomizerCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  styleOption: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  styleLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  colorPalette: {
    display: 'flex',
    gap: '8px',
  },
  colorDot: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  customizerSelect: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-light)',
    color: '#fff',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '12px',
    outline: 'none',
    cursor: 'pointer',
  },
  fontSizeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    span: {
      fontSize: '11px',
      color: '#fff',
      fontWeight: 600,
    }
  },
  slider: {
    width: '100%',
    accentColor: 'var(--primary)',
    cursor: 'pointer',
  },
  suggestionsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  suggestionsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  suggestionItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
  },
  suggestBullet: {
    fontSize: '12px',
  },
  btnOptimizeNow: {
    width: '100%',
    padding: '10px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': { background: 'rgba(99,102,241,0.25)' }
  },
  estimatorCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  estimatorSplit: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  estimatorChecklist: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-light)',
  },
  estCheckItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-muted)',
  }
};
