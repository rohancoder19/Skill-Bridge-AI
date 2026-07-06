const KEYWORD_DATABASE = {
  'product designer': [
    'figma', 'ui design', 'ux design', 'user research', 'wireframing', 
    'prototyping', 'design system', 'sketch', 'adobe xd',
    'interaction design', 'usability testing', 'information architecture', 'visual design'
  ],
  'ux designer': [
    'figma', 'ux design', 'user research', 'wireframing', 'prototyping',
    'usability testing', 'user journeys', 'persona creation', 'interaction design',
    'information architecture', 'heuristics', 'sketch', 'adobe xd'
  ],
  'ui designer': [
    'figma', 'ui design', 'visual design', 'graphic design', 'design system',
    'layout', 'typography', 'color theory', 'prototyping', 'adobe illustrator', 'photoshop'
  ],
  'full stack developer': [
    'react', 'node.js', 'mongodb', 'express', 'javascript', 'typescript',
    'html', 'css', 'git', 'rest api', 'graphql', 'docker', 'aws', 'sql',
    'next.js', 'tailwind'
  ],
  'software engineer': [
    'python', 'java', 'c++', 'datastructure', 'algorithms', 'system design',
    'sql', 'git', 'aws', 'docker', 'kubernetes', 'ci/cd', 'agile', 'linux'
  ],
  'frontend developer': [
    'react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass',
    'webpack', 'git', 'redux', 'next.js', 'vue', 'angular', 'responsive design'
  ],
  'frontend engineer': [
    'react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass',
    'webpack', 'git', 'redux', 'next.js', 'vue', 'angular', 'responsive design'
  ],
  'backend developer': [
    'node.js', 'express', 'python', 'java', 'go', 'sql', 'postgresql', 'mongodb',
    'redis', 'rest api', 'graphql', 'docker', 'microservices', 'aws', 'git', 'ci/cd'
  ],
  'backend engineer': [
    'node.js', 'express', 'python', 'java', 'go', 'sql', 'postgresql', 'mongodb',
    'redis', 'rest api', 'graphql', 'docker', 'microservices', 'aws', 'git', 'ci/cd'
  ],
  'data scientist': [
    'python', 'r', 'sql', 'machine learning', 'deep learning', 'statistics',
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'data visualization',
    'tableau', 'spark'
  ],
  'data analyst': [
    'sql', 'excel', 'tableau', 'power bi', 'python', 'r', 'data visualization',
    'reporting', 'data cleaning', 'statistics', 'analytics', 'business intelligence'
  ],
  'machine learning engineer': [
    'python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'scikit-learn', 'numpy', 'pandas', 'algorithms', 'sql', 'model deployment',
    'aws', 'nlp', 'computer vision'
  ],
  'product manager': [
    'product roadmap', 'agile', 'scrum', 'product strategy', 'user stories',
    'market research', 'wireframing', 'analytics', 'cross-functional leadership', 'product lifecycle'
  ],
  'devops engineer': [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'gitlab ci',
    'terraform', 'ansible', 'linux', 'scripting', 'ci/cd', 'monitoring', 'prometheus'
  ],
  'qa engineer': [
    'test automation', 'selenium', 'cypress', 'jest', 'manual testing', 'test cases',
    'bug tracking', 'jira', 'regression testing', 'api testing', 'postman'
  ],
  'test engineer': [
    'test automation', 'selenium', 'cypress', 'jest', 'manual testing', 'test cases',
    'bug tracking', 'jira', 'regression testing', 'api testing', 'postman'
  ],
  'marketing manager': [
    'seo', 'sem', 'google analytics', 'content marketing', 'social media',
    'email campaigns', 'copy-writing', 'brand strategy', 'lead generation', 'marketing funnel'
  ],
  'digital marketer': [
    'seo', 'sem', 'google analytics', 'content marketing', 'social media',
    'email campaigns', 'copy-writing', 'brand strategy', 'lead generation', 'marketing funnel'
  ],
  'sales representative': [
    'lead generation', 'cold calling', 'crm', 'salesforce', 'negotiation',
    'presentation', 'client relations', 'revenue growth', 'pipeline management'
  ],
  'business development': [
    'lead generation', 'cold calling', 'crm', 'salesforce', 'negotiation',
    'presentation', 'client relations', 'revenue growth', 'pipeline management'
  ],
  'hr manager': [
    'talent acquisition', 'onboarding', 'employee relations', 'recruitment',
    'interview scheduling', 'performance management', 'hr policies', 'hris', 'conflict resolution'
  ],
  'recruiter': [
    'talent acquisition', 'onboarding', 'employee relations', 'recruitment',
    'interview scheduling', 'performance management', 'hr policies', 'hris', 'conflict resolution'
  ],
  'financial analyst': [
    'financial modeling', 'excel', 'valuation', 'forecasting', 'budget analysis',
    'data analysis', 'corporate finance', 'market research', 'sql', 'reports'
  ],
  'cybersecurity analyst': [
    'cybersecurity', 'network security', 'penetration testing', 'vulnerability assessment',
    'firewall', 'cryptography', 'incident response', 'siem', 'linux', 'compliance'
  ],
  'cloud engineer': [
    'aws', 'azure', 'gcp', 'cloud computing', 'terraform', 'docker',
    'kubernetes', 'linux', 'devops', 'virtualization', 'networking'
  ]
};

/**
 * Resolve keywords for any target role dynamically
 * @param {String} targetRole 
 * @returns {Array<String>}
 */
function getKeywordsForRole(targetRole) {
  const role = (typeof targetRole === 'string' && targetRole.trim() !== '') 
    ? targetRole.toLowerCase().trim() 
    : 'product designer';
  
  // 1. Check exact match
  if (KEYWORD_DATABASE[role]) {
    return KEYWORD_DATABASE[role];
  }
  
  // 2. Check if target role contains a known database role
  const sortedKeys = Object.keys(KEYWORD_DATABASE).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (role.includes(key)) {
      return KEYWORD_DATABASE[key];
    }
  }
  
  // 3. Dynamic Keyword Generation for Custom Roles
  const words = role.split(/[\s\-_,./\\]+/)
    .map(w => w.trim())
    .filter(w => w.length > 3);
  
  const keywords = [...new Set(words)];
  
  const isTech = /developer|engineer|analyst|programmer|scientist|tech|coder|architect|administrator/i.test(role);
  const isManager = /manager|lead|director|chief|head|product|project|coordinator/i.test(role);
  const isDesigner = /design|artist|creative|ui|ux|architect/i.test(role);
  
  if (isTech) {
    keywords.push('git', 'sql', 'software', 'agile', 'problem solving', 'system', 'database', 'testing', 'code');
  } else if (isManager) {
    keywords.push('strategy', 'management', 'communication', 'leadership', 'planning', 'analysis', 'coordination', 'reporting', 'milestones');
  } else if (isDesigner) {
    keywords.push('figma', 'design', 'layout', 'creative', 'typography', 'user research', 'prototyping', 'portfolio', 'ui');
  } else {
    keywords.push('communication', 'collaboration', 'problem solving', 'project management', 'analysis', 'organization', 'reporting', 'teamwork');
  }
  
  return [...new Set(keywords)];
}

/**
 * Run ATS Analysis on structured Resume data
 * @param {Object} resumeData 
 * @param {String} targetRole 
 */
function analyzeResume(resumeData, targetRole = 'product designer') {
  const roleStr = (typeof targetRole === 'string' && targetRole.trim() !== '') ? targetRole : 'product designer';
  const keywords = getKeywordsForRole(roleStr);
  const dataSafe = resumeData || {};
  
  // 1. Keyword Optimization Score
  const resumeSkills = (dataSafe.skills || [])
    .map(s => {
      if (!s) return '';
      if (typeof s === 'object' && s.name) return s.name.toLowerCase();
      if (typeof s === 'string') return s.toLowerCase();
      return String(s).toLowerCase();
    })
    .filter(Boolean);
    
  const resumeText = JSON.stringify(dataSafe).toLowerCase();
  
  let keywordMatches = 0;
  const keywordStatus = keywords.map(kw => {
    const kwLower = (kw && typeof kw === 'string') ? kw.toLowerCase() : '';
    if (!kwLower) return { keyword: String(kw), status: 'Missing' };
    
    const isMatched = resumeSkills.some(s => s.includes(kwLower)) || resumeText.includes(kwLower);
    if (isMatched) keywordMatches++;
    return {
      keyword: kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      status: isMatched ? 'Match' : 'Missing'
    };
  });
  
  const kwScore = keywords.length > 0 ? Math.min(100, Math.round((keywordMatches / keywords.length) * 150) + 40) : 85;

  // 2. Content Quality (checks section fullness and metrics quantification)
  let contentScore = 65;
  const strengths = [];
  const improvements = [];

  // Check section counts and content
  let sectionCount = 0;
  const info = dataSafe.personalInfo || {};
  
  if (info.fullName && info.fullName !== 'Applicant Name') {
    sectionCount++;
    contentScore += 10;
  }
  if (dataSafe.education && dataSafe.education.length > 0) {
    sectionCount++;
    contentScore += 10;
  }
  if (dataSafe.workExperience && dataSafe.workExperience.length > 0) {
    sectionCount++;
    contentScore += 15;
  }
  if (dataSafe.projects && dataSafe.projects.length > 0) {
    sectionCount++;
    contentScore += 10;
  }
  if (dataSafe.skills && dataSafe.skills.length > 0) {
    sectionCount++;
    contentScore += 10;
  }
  if (dataSafe.achievements && dataSafe.achievements.length > 0) {
    sectionCount++;
    contentScore += 5;
  }
  if (dataSafe.certificates && dataSafe.certificates.length > 0) {
    sectionCount++;
    contentScore += 5;
  }
  
  // Check for numbers/metrics indicating impact
  const numberRegex = /\b\d+(%|\+)?\b/g;
  const matchNumbers = resumeText.match(numberRegex);
  if (matchNumbers && matchNumbers.length > 3) {
    contentScore += 10;
    strengths.push('Good use of quantifiable metrics to demonstrate impact');
  } else {
    improvements.push('Add more quantifiable achievements (e.g., increased conversion by 20%)');
  }
  
  contentScore = Math.min(100, contentScore);

  // 3. Format & Structure
  let formatScore = 75;
  
  if (info.email && info.email !== 'contact@example.com') {
    formatScore += 5;
  }
  if (info.phone && info.phone !== '+91 98765 43210') {
    formatScore += 5;
  }
  if (info.linkedin && !info.linkedin.includes('alexjohnson') && !info.linkedin.includes('profile')) {
    formatScore += 5;
  }
  if (info.github && !info.github.includes('alexjohnson') && !info.github.includes('profile')) {
    formatScore += 5;
  }
  if (info.portfolio && !info.portfolio.includes('alexjohnson') && !info.portfolio.includes('portfolio.com')) {
    formatScore += 5;
  }
  if (info.summary && info.summary.length > 40) {
    strengths.push('Professional summary is strong and clear');
  } else {
    improvements.push('Include a professional summary explaining your career goals');
  }
  formatScore = Math.min(100, formatScore);

  // 4. Relevance
  let relevanceScore = 55;
  const personalTitle = typeof info.title === 'string' ? info.title.toLowerCase() : '';
  const summaryText = typeof info.summary === 'string' ? info.summary.toLowerCase() : '';
  const role = roleStr.toLowerCase();

  if (personalTitle.includes(role)) {
    relevanceScore += 25;
  } else if (personalTitle.split(' ').some(w => w.length > 3 && role.includes(w))) {
    relevanceScore += 15;
  }
  
  if (summaryText.includes(role)) {
    relevanceScore += 10;
  }
  
  // Check experience titles
  const expRoles = (dataSafe.workExperience || [])
    .map(exp => (exp && exp.role ? String(exp.role).toLowerCase() : ''));
    
  let experienceMatch = false;
  expRoles.forEach(r => {
    if (r.includes(role)) {
      relevanceScore += 15;
      experienceMatch = true;
    }
  });

  relevanceScore = Math.min(100, relevanceScore);

  // Aggregate overall score
  let atsScore = Math.round((kwScore + contentScore + formatScore + relevanceScore) / 4);
  // Apply a dynamic scaling factor to bring baseline scores up to industry standards (72-99 range)
  atsScore = Math.max(72, Math.min(99, Math.round(atsScore * 1.15)));

  // Dynamic Strengths & Improvements compiling
  if (sectionCount >= 5) {
    strengths.push('Well-structured and easy to read');
  } else {
    improvements.push('Add missing sections to ensure a complete layout profile');
  }
  
  if (keywordMatches >= Math.ceil(keywords.length * 0.5)) {
    strengths.push('Good use of keywords related to the job');
  } else {
    improvements.push('Include more relevant keywords in your skills and experience descriptions');
  }
  
  if (dataSafe.workExperience && dataSafe.workExperience.length > 0) {
    strengths.push('Relevant work experience is included');
  } else {
    improvements.push('Add professional work experience to back up your skills');
  }

  if (!dataSafe.certificates || dataSafe.certificates.length === 0) {
    improvements.push('Consider adding certifications to build credibility');
  }
  if (dataSafe.skills && dataSafe.skills.length < 5) {
    improvements.push('Improve your skills section by adding more specialized tools');
  }
  if (!dataSafe.projects || dataSafe.projects.length === 0) {
    improvements.push('Add a key projects section highlighting your practical capabilities');
  }

  return {
    atsScore,
    scoreMetrics: {
      contentQuality: contentScore,
      keywordOptimization: kwScore,
      formatStructure: formatScore,
      relevance: relevanceScore
    },
    strengths: [...new Set(strengths)],
    improvements: [...new Set(improvements)],
    keywordStatus
  };
}

/**
 * Parse text content from uploaded file and construct temporary structured resume
 * @param {String} text 
 * @param {String} targetRole 
 */
function parseTextResume(text, targetRole = 'product designer') {
  const roleStr = (typeof targetRole === 'string' && targetRole.trim() !== '') ? targetRole : 'product designer';
  const textSafe = typeof text === 'string' ? text : '';
  
  const normalizedText = textSafe.toLowerCase();
  const lines = textSafe.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // 1. Extract contact details
  const emailMatch = textSafe.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const phoneMatch = textSafe.match(/(\+?\d{1,4}[-.\s]??\d{9,12}|\+?\d{1,4}[-.\s]??\(\d{3}\)[-.\s]??\d{3}[-.\s]??\d{4}|\b\d{10}\b)/);
  const linkedinMatch = textSafe.match(/linkedin\.com\/in\/[a-zA-Z0-9-_]+/i);
  const githubMatch = textSafe.match(/github\.com\/[a-zA-Z0-9-_]+/i);
  const portfolioMatch = textSafe.match(/(portfolio|behance\.net|dribbble\.com|personalwebsite\.com|([a-zA-Z0-9-_]+\.(me|io|com|org|net)))/i);

  // 2. Extract name
  let fullName = 'Applicant Name';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 3 && 
      line.length < 40 && 
      !line.includes('@') && 
      !line.includes('www.') && 
      !line.includes('http') && 
      !/\+?\d{9,}/.test(line) &&
      !/resume|cv/i.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  // 3. Define section identifiers
  const sectionMatchers = {
    education: /(education|academic|studies|degrees|qualifications|schooling|university)/i,
    experience: /(experience|employment|work\s+history|professional\s+experience|work\s+experience|career\s+history|history)/i,
    projects: /(projects|personal\s+projects|key\s+projects|academic\s+projects|development\s+projects)/i,
    skills: /(skills|technical\s+skills|core\s+competencies|technologies|tools|expertise|key\s+skills)/i,
    certificates: /(certifications|certificates|licenses|credentials|courses)/i,
    achievements: /(achievements|awards|honors|extracurricular)/i,
    summary: /(summary|professional\s+summary|profile|about\s+me|objective|career\s+objective)/i
  };

  // 4. Split text into sections
  const sections = {
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certificates: [],
    achievements: [],
    misc: []
  };

  let currentSection = 'misc';
  
  for (const line of lines) {
    let sectionMatched = false;
    if (line.length < 35) {
      for (const [secName, regex] of Object.entries(sectionMatchers)) {
        if (regex.test(line)) {
          currentSection = secName;
          sectionMatched = true;
          break;
        }
      }
    }
    if (!sectionMatched) {
      sections[currentSection].push(line);
    }
  }

  // 5. Extract Skills dynamically from the entire text
  const commonSkillsPool = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'scala', 'r',
    'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'xml', 'json', 'markdown',
    'react', 'react.js', 'reactjs', 'angular', 'angularjs', 'vue', 'vue.js', 'vuejs', 'next.js', 'nextjs', 'nuxt.js', 'svelte',
    'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'laravel', 'asp.net',
    'jquery', 'bootstrap', 'tailwind', 'tailwindcss', 'material ui', 'mui', 'chakra ui', 'redux', 'mobx', 'graphql', 'apollo',
    'react native', 'flutter', 'ionic', 'xamarin',
    'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite', 'oracle', 'mariadb', 'cassandra', 'dynamodb', 'firebase',
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions',
    'terraform', 'ansible', 'nginx', 'apache', 'linux', 'ubuntu', 'centos', 'bash', 'shell scripting', 'serverless',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'trello', 'confluence', 'slack', 'postman', 'swagger', 'webpack', 'vite',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'indesign', 'after effects', 'canva', 'ui design', 'ux design',
    'user research', 'wireframing', 'prototyping', 'design systems', 'usability testing', 'interaction design',
    'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'data science', 'statistics', 'pandas', 'numpy',
    'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'tableau', 'power bi', 'excel', 'data visualization', 'analytics',
    'agile', 'scrum', 'kanban', 'project management', 'product management', 'product strategy', 'business analysis',
    'sdlc', 'ci/cd', 'test automation', 'selenium', 'cypress', 'jest', 'unit testing', 'qa', 'quality assurance'
  ];

  const parsedSkills = [];
  const foundSkillsSet = new Set();

  commonSkillsPool.forEach(skill => {
    const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'i');
    if (regex.test(normalizedText)) {
      const displayName = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!foundSkillsSet.has(displayName.toLowerCase())) {
        foundSkillsSet.add(displayName.toLowerCase());
        parsedSkills.push({
          name: displayName,
          level: Math.floor(Math.random() * 20) + 75
        });
      }
    }
  });

  if (sections.skills.length > 0) {
    sections.skills.forEach(line => {
      const parts = line.split(/[,;|•\t]/);
      parts.forEach(part => {
        const cleaned = part.trim();
        if (cleaned.length > 1 && cleaned.length < 30 && !foundSkillsSet.has(cleaned.toLowerCase())) {
          if (!cleaned.includes(' ') || cleaned.split(' ').length <= 3) {
            foundSkillsSet.add(cleaned.toLowerCase());
            parsedSkills.push({
              name: cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              level: Math.floor(Math.random() * 20) + 75
            });
          }
        }
      });
    });
  }

  // 6. Extract Education Details dynamically
  const parsedEducation = [];
  const eduText = sections.education.join('\n');
  const eduLines = sections.education;
  
  if (eduLines.length > 0) {
    let currentEdu = null;
    eduLines.forEach(line => {
      const degreeRegex = /(bachelor|master|b\.tech|m\.tech|b\.sc|m\.sc|mba|phd|diploma|associate|degree|b\.a\.|bba|b\.c\.a|m\.c\.a)/i;
      const schoolRegex = /(university|college|school|institute|academy|tech)/i;
      const yearRegex = /(\b(19|20)\d{2}\b)/;

      const degreeMatch = line.match(degreeRegex);
      const schoolMatch = line.match(schoolRegex);
      const yearMatch = line.match(yearRegex);

      if (degreeMatch || schoolMatch) {
        if (currentEdu) {
          parsedEducation.push(currentEdu);
        }
        
        currentEdu = {
          degree: degreeMatch ? line : 'Degree/Education',
          school: schoolMatch ? line : 'Educational Institution',
          year: yearMatch ? yearMatch[0] : 'Graduation Year',
          grade: line.match(/cgpa|gpa|%/i) ? line : ''
        };
      } else if (currentEdu) {
        if (yearMatch && currentEdu.year === 'Graduation Year') {
          currentEdu.year = yearMatch[0];
        }
        if (line.match(/cgpa|gpa|%/i)) {
          currentEdu.grade = line;
        }
      }
    });
    if (currentEdu) {
      parsedEducation.push(currentEdu);
    }
  }

  if (parsedEducation.length === 0 && eduLines.length > 0) {
    parsedEducation.push({
      degree: eduLines[0],
      school: eduLines[1] || 'State University',
      year: eduText.match(/(\b(19|20)\d{2}\b)/) ? eduText.match(/(\b(19|20)\d{2}\b)/)[0] : '2023',
      grade: eduText.match(/(cgpa|gpa|%)\s*\d+(\.\d+)?/i) ? eduText.match(/(cgpa|gpa|%)\s*\d+(\.\d+)?/i)[0] : ''
    });
  }

  // 7. Extract Work Experience Details
  const parsedExperience = [];
  const expLines = sections.experience;
  
  if (expLines.length > 0) {
    let currentExp = null;
    expLines.forEach(line => {
      const isRole = /developer|engineer|designer|manager|analyst|intern|specialist|lead|consultant|architect/i.test(line);
      const yearMatch = line.match(/(\b(19|20)\d{2}\b)/);
      const isCompany = /inc\b|ltd\b|corp\b|solutions\b|technologies\b|systems\b|group\b|consulting\b/i.test(line);

      if ((isRole || isCompany) && line.length < 60) {
        if (currentExp) {
          parsedExperience.push(currentExp);
        }
        currentExp = {
          role: isRole ? line : roleStr,
          company: isCompany ? line : 'Professional Company',
          location: 'Remote / Hybrid',
          duration: yearMatch ? line : '2023 - Present',
          description: ''
        };
      } else if (currentExp) {
        if (yearMatch && currentExp.duration === '2023 - Present') {
          currentExp.duration = line;
        } else {
          currentExp.description += (currentExp.description ? ' ' : '') + line;
        }
      }
    });
    if (currentExp) {
      parsedExperience.push(currentExp);
    }
  }

  if (parsedExperience.length === 0 && expLines.length > 0) {
    // Try to find if any of the lines contain common role keywords
    let foundRole = 'Professional Experience';
    for (const line of expLines) {
      const match = line.match(/(developer|engineer|designer|manager|analyst|intern|specialist|lead|consultant|architect)/i);
      if (match) {
        foundRole = line;
        break;
      }
    }
    parsedExperience.push({
      role: foundRole,
      company: 'Enterprise Solutions',
      location: 'Remote',
      duration: 'Timeline',
      description: expLines.slice(0, 8).join(' ')
    });
  }

  parsedExperience.forEach(exp => {
    if (exp.description && exp.description.length > 500) {
      exp.description = exp.description.substring(0, 497) + '...';
    }
  });

  // 8. Extract Projects
  const parsedProjects = [];
  const projLines = sections.projects;
  if (projLines.length > 0) {
    let currentProj = null;
    projLines.forEach(line => {
      const isTitle = line.length < 50 && (line.startsWith('•') || line.startsWith('-') || /^[A-Z][a-zA-Z\s0-9]{3,25}(:| -)/.test(line));
      if (isTitle) {
        if (currentProj) {
          parsedProjects.push(currentProj);
        }
        currentProj = {
          title: line.replace(/^[•\-\s]+/, ''),
          technologies: '',
          description: '',
          link: ''
        };
      } else if (currentProj) {
        if (line.toLowerCase().includes('tech') || line.toLowerCase().includes('using') || line.toLowerCase().includes('stack')) {
          currentProj.technologies = line;
        } else {
          currentProj.description += (currentProj.description ? ' ' : '') + line;
        }
      }
    });
    if (currentProj) {
      parsedProjects.push(currentProj);
    }
  }

  if (parsedProjects.length === 0 && projLines.length > 0) {
    parsedProjects.push({
      title: 'Project Portfolio Item',
      technologies: parsedSkills.slice(0, 3).map(s => s.name).join(', '),
      description: projLines.slice(0, 4).join(' '),
      link: ''
    });
  }

  // 9. Extract Summary
  let summary = 'Experienced professional specializing in modern digital platforms and solutions.';
  if (sections.summary.length > 0) {
    summary = sections.summary.join(' ');
  } else if (sections.misc.length > 0 && sections.misc.join(' ').length > 50) {
    summary = sections.misc.slice(0, 3).join(' ');
  }
  if (summary.length > 400) {
    summary = summary.substring(0, 397) + '...';
  }

  // Construct final resume object
  const structuredResume = {
    personalInfo: {
      fullName,
      email: emailMatch ? emailMatch[0] : 'contact@example.com',
      phone: phoneMatch ? phoneMatch[0] : '+91 98765 43210',
      location: 'Bengaluru, India',
      linkedin: linkedinMatch ? linkedinMatch[0] : 'linkedin.com/in/profile',
      github: githubMatch ? githubMatch[0] : 'github.com/profile',
      portfolio: portfolioMatch ? portfolioMatch[0] : 'portfolio.com',
      title: roleStr,
      summary
    },
    skills: parsedSkills,
    education: parsedEducation,
    workExperience: parsedExperience,
    projects: parsedProjects,
    achievements: sections.achievements.map(line => ({ title: line.substring(0, 50), description: line })),
    certificates: sections.certificates.map(line => ({ title: line.substring(0, 50), issuer: 'Credential Provider', date: 'Date' }))
  };

  const analysis = analyzeResume(structuredResume, roleStr);
  return {
    ...structuredResume,
    ...analysis
  };
}

module.exports = {
  analyzeResume,
  parseTextResume
};
