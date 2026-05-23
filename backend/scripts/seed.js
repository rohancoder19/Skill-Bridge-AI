const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { analyzeResume } = require('../utils/atsAnalyzer');

dotenv.config();

const jobsData = [];

const seedDB = async () => {
  try {
    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge_ai');
      console.log('Connected to MongoDB for Seeding...');
    } else {
      console.log('Using existing MongoDB connection for seeding...');
    }

    // Clear existing data
    await User.deleteMany();
    await Resume.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('Database cleared.');

    // 1. Create Default Demo User
    const demoUser = new User({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123', // Will be hashed by UserSchema pre-save hook
      profileStrength: 75,
      targetTitle: 'Product Designer',
      skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'User Research', 'Wireframing'],
      summary: 'Creative and detail-oriented Product Designer with 4+ years of experience in designing user-centered digital products. Skilled in UX/UI design, prototyping, and collaborating with cross-functional teams.'
    });
    await demoUser.save();
    console.log('Demo user seeded.');

    // Seed Recruiter
    const demoRecruiter = new User({
      name: 'Sarah Jenkins',
      email: 'recruiter@example.com',
      password: 'password123',
      role: 'recruiter',
      summary: 'Senior Technical Recruiter with 8+ years of experience sourcing top talent in product design and software engineering.'
    });
    await demoRecruiter.save();
    console.log('Demo recruiter seeded.');

    // 2. Create Jobs
    const seededJobs = await Job.insertMany(jobsData);
    console.log(`${seededJobs.length} Jobs seeded.`);

    // 3. Create Default Resume for Alex Johnson (matching screenshot 5)
    const alexResumeData = {
      user: demoUser._id,
      personalInfo: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka, India',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson',
        portfolio: 'alexjohnson.dev',
        title: 'Product Designer',
        summary: 'Motivated Full Stack Developer & Product Designer with 2+ years of experience building scalable web applications. Passionate about solving complex problems and creating impactful user solutions.'
      },
      education: [
        {
          degree: 'B.Tech in Computer Science',
          school: 'RV College of Engineering',
          year: '2019 - 2023',
          grade: 'CGPA: 8.62 / 10.00'
        }
      ],
      workExperience: [
        {
          role: 'Software Engineer',
          company: 'TechNova Solutions',
          location: 'Bengaluru, India',
          duration: 'May 2023 - Present',
          description: 'Developed and maintained scalable web applications using React, Node.js, and MongoDB. Collaborated with cross-functional teams to design and implement new features. Optimized application performance, improving load time by 30%. Implemented RESTful APIs and integrated third-party services.'
        },
        {
          role: 'Associate Developer',
          company: 'CodeCraft Technologies',
          location: 'Bengaluru, India',
          duration: 'Jan 2022 - Apr 2023',
          description: 'Worked on front-end development using React JS and Tailwind CSS. Built reusable components and improved UI/UX across the platform. Fixed bugs and improved application performance.'
        }
      ],
      internships: [
        {
          role: 'Web Development Intern',
          company: 'Pixel Perfect Labs',
          location: 'Bengaluru, India',
          duration: 'Jun 2021 - Aug 2021',
          description: 'Developed responsive websites using HTML, CSS, JavaScript, and React. Worked closely with the design team to implement UI/UX designs.'
        }
      ],
      projects: [
        {
          title: 'DevConnect',
          technologies: 'React, Node.js, MongoDB, Socket.io',
          description: 'A developer social platform to connect, share and collaborate.',
          link: 'github.com/alexjohnson/devconnect'
        },
        {
          title: 'Portfolio Website',
          technologies: 'Next.js, Tailwind CSS, Framer Motion',
          description: 'Personal portfolio to showcase projects and blogs.',
          link: 'alexjohnson.dev'
        }
      ],
      achievements: [
        {
          title: 'Winner - Smart India Hackathon 2022',
          description: 'Built an AI-based solution for smart traffic management.'
        },
        {
          title: 'LeetCode Knight',
          description: 'Solved 500+ problems on LeetCode with 1600+ rating.'
        }
      ],
      certificates: [
        {
          title: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          date: 'Oct 2023'
        },
        {
          title: 'React - The Complete Guide (2023 Edition)',
          issuer: 'Udemy',
          date: 'Aug 2023'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'React.js', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'Next.js', level: 80 },
        { name: 'Tailwind CSS', level: 85 },
        { name: 'Python', level: 70 },
        { name: 'Figma', level: 95 },
        { name: 'UI Design', level: 90 },
        { name: 'UX Design', level: 90 },
        { name: 'Prototyping', level: 85 },
        { name: 'User Research', level: 80 },
        { name: 'Wireframing', level: 85 }
      ],
      additionalInfo: {
        languages: 'English, Hindi, Kannada',
        interests: 'Open Source, Blogging, Reading, Photography'
      },
      templateStyle: {
        templateId: 'modern',
        primaryColor: '#6366f1',
        fontFamily: 'Inter',
        fontSize: 10
      }
    };

    // Calculate ATS score metrics automatically
    const analysis = analyzeResume(alexResumeData, 'product designer');
    
    const alexResume = new Resume({
      ...alexResumeData,
      atsScore: 85, // Set to 85 to perfectly match the dashboard (image 2) and analyzer (image 3)
      scoreMetrics: {
        contentQuality: 92,
        keywordOptimization: 80,
        formatStructure: 85,
        relevance: 82
      },
      strengths: analysis.strengths,
      improvements: analysis.improvements
    });
    await alexResume.save();
    console.log('Alex Johnson resume seeded.');

    // 4. Create Applications for Demo User (matching dashboard status in image 2)
    const googleJob = seededJobs.find(j => j.company === 'Google');
    const msJob = seededJobs.find(j => j.company === 'Microsoft');
    const airbnbJob = seededJobs.find(j => j.company === 'Airbnb');

    if (googleJob) {
      await Application.create({
        user: demoUser._id,
        job: googleJob._id,
        status: 'Under Review',
        appliedAt: new Date('2026-05-30')
      });
    }

    if (msJob) {
      await Application.create({
        user: demoUser._id,
        job: msJob._id,
        status: 'Interview',
        appliedAt: new Date('2026-05-28')
      });
    }

    if (airbnbJob) {
      await Application.create({
        user: demoUser._id,
        job: airbnbJob._id,
        status: 'Applied',
        appliedAt: new Date('2026-05-26')
      });
    }

    console.log('Job applications seeded.');
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

if (require.main === module) {
  const runSeeding = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge_ai');
      console.log('Connected to MongoDB for Seeding...');
      await seedDB();
      process.exit(0);
    } catch (err) {
      console.error('Seeding script failed', err);
      process.exit(1);
    }
  };
  runSeeding();
}

module.exports = seedDB;
