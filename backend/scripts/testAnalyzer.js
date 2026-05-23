const { parseTextResume } = require('../utils/atsAnalyzer');

const developerResume = `
Alex Johnson
alex.johnson@email.com | +91 99999 88888 | Bengaluru, India
github.com/alexj | linkedin.com/in/alexj

Professional Summary:
Passionate Software Engineer with 3+ years of experience building scalable web applications. Expert in React, Node.js, and databases.

Education:
Bachelor of Technology in Computer Science
State Engineering College | 2019 - 2023 | 8.8 CGPA

Skills:
React, Node.js, JavaScript, TypeScript, MongoDB, SQL, Git, Docker, HTML, CSS, Rest API

Experience:
Full Stack Developer | Tech Innovations Inc | 2023 - Present
- Built and maintained multiple web modules reducing load time by 30%.
- Integrated REST APIs with React frontend and MongoDB backend.
- Collaborated with QA team to write unit tests using Jest.

Projects:
E-commerce Platform:
- Developed shopping cart features using React and Node.js.
- Deployed on AWS with Docker containers.
`;

const designerResume = `
Sophia Martinez
sophia.design@email.com | +91 77777 66666 | Delhi, India
portfolio.com/sophia | linkedin.com/in/sophiam

Professional Summary:
Creative UX Designer with 2 years of experience crafting intuitive interfaces and human-centered designs.

Education:
Bachelor of Design in Interaction Design
National Institute of Design | 2020 - 2024 | 9.0 CGPA

Skills:
Figma, UI Design, UX Design, User Research, Wireframing, Prototyping, Design System, Usability Testing

Experience:
UI/UX Designer | Creative Studio | 2023 - Present
- Conducted user research with 15+ participants to guide product design.
- Built a unified design system in Figma, improving design speed by 40%.
- Created wireframes and interactive prototypes for mobile apps.

Projects:
Travel App UI:
- Designed mobile workflows and usability tested with users.
`;

// Test Runs
console.log("=== RUNNING ATS ANALYZER TEST ===");

console.log("\n--- TEST 1: Developer Resume for 'Full Stack Developer' ---");
const res1 = parseTextResume(developerResume, "Full Stack Developer");
console.log("Full Name:", res1.personalInfo.fullName);
console.log("Target Role:", res1.personalInfo.title);
console.log("ATS Score:", res1.atsScore);
console.log("Metrics:", JSON.stringify(res1.scoreMetrics));
console.log("Strengths count:", res1.strengths.length);
console.log("Improvements count:", res1.improvements.length);

console.log("\n--- TEST 2: Developer Resume for 'UX Designer' ---");
const res2 = parseTextResume(developerResume, "UX Designer");
console.log("Target Role:", res2.personalInfo.title);
console.log("ATS Score:", res2.atsScore);
console.log("Metrics:", JSON.stringify(res2.scoreMetrics));

console.log("\n--- TEST 3: Designer Resume for 'UX Designer' ---");
const res3 = parseTextResume(designerResume, "UX Designer");
console.log("Full Name:", res3.personalInfo.fullName);
console.log("Target Role:", res3.personalInfo.title);
console.log("ATS Score:", res3.atsScore);
console.log("Metrics:", JSON.stringify(res3.scoreMetrics));

console.log("\n--- TEST 4: Designer Resume for Custom Role 'Machine Learning Engineer' ---");
const res4 = parseTextResume(designerResume, "Machine Learning Engineer");
console.log("Target Role:", res4.personalInfo.title);
console.log("ATS Score:", res4.atsScore);
console.log("Metrics:", JSON.stringify(res4.scoreMetrics));
console.log("Matched Keywords:", res4.keywordStatus.filter(k => k.status === 'Match').map(k => k.keyword));
console.log("Missing Keywords:", res4.keywordStatus.filter(k => k.status === 'Missing').map(k => k.keyword));

console.log("\n==================================");
