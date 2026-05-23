# Skill-Bridge AI

Skill-Bridge AI is a state-of-the-art career ecosystem built on the MERN stack. It leverages artificial intelligence to analyze resumes, score them against ATS keyword algorithms, build custom-designed resumes, and match job seekers with recruiter openings.

---

## 🌟 Key Features

### 👤 Candidate View
1. **Interactive Dashboard**: Features circular SVG progress gauges for ATS scores and profile strength, active timelines of job applications, and visually animated skill analytics.
2. **ATS Resume Analyzer**: Drag-and-drop resume audits using stable AI parsers (via Gemini API) and custom keyword extraction libraries. 
3. **Resume Builder**: Professional layout editors (Personal, Work, Education, Projects, Skills) with dynamic margins, fonts, colors, and 7 customizable templates.
4. **Smart Job Search**: A double-pane layout displaying recruiter job postings with dynamic compatability percentage matches based on the candidate's parsed skills.
5. **No Fake Times**: All postings show real, computed relative ages (e.g. *"Just now"*, *"15m ago"*, *"3h ago"*, *"Yesterday"*) based on database creation dates.

### 🏢 Recruiter View
1. **Recruiter Command Center**: An executive dashboard showing key metrics (Active Postings, Total Applicants, Needs Review).
2. **Post Job Openings**: A premium form to publish job openings with title, company, location, experience requirements, salary ranges, required skill lists, and structured tasks.
3. **Applicant Tracking**: View a live candidate counter for each posted job. Clicking a job lists all applicants, their contact cards, target titles, skill badges, and compatibility scores.
4. **Status Management**: Recruiter can transition applicants dynamically between `Applied`, `Under Review`, `Interview`, and `Rejected` states to notify them.

---

## 🔑 Quick Demo Credentials

To test the platform immediately with seeded mock data matching all UI designs:

* **Candidate Account**
  * **Email**: `alex@example.com`
  * **Password**: `password123`
* **Recruiter Account**
  * **Email**: `recruiter@example.com`
  * **Password**: `password123`

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Lucide icons, Custom glassmorphic CSS.
* **Backend**: Node.js, Express, JWT Authentication, file parser hooks (`pdf-parse`, `mammoth`).
* **Database**: MongoDB (Mongoose).
* **AI Integration**: Google Gemini API (`gemini-2.5-flash`).

---

## 🚀 Running the Prototype Locally

The project is structured with root scripts to install and run the entire stack with simple single-command executions.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended). 

### Setup Instructions

1. **Install All Dependencies**
   Run the following command in the project root directory. This will concurrently install dependencies for the root orchestrator, the backend API server, and the frontend React app:
   ```bash
   npm run install-all
   ```

2. **Configure Environment Variables (Optional)**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   JWT_SECRET=skillbridge_secret_key_12345
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no `MONGO_URI` is provided in `.env`, the server automatically spins up an ephemeral, in-memory MongoDB Server (`mongodb-memory-server`) and populates it with candidates, resumes, and recruiter profiles, letting you explore the prototype with zero database configuration!*

3. **Start the Dev Servers**
   Run the following command from the root directory to run both the Vite client (port `3001` / `3000`) and API server (port `5000`) concurrently:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open your browser and navigate to:
   * **Application Interface**: [http://localhost:3001](http://localhost:3001) or [http://localhost:3000](http://localhost:3000)
   * **Backend REST API**: [http://localhost:5000](http://localhost:5000)

---

## 📂 Project Architecture

```
├── backend/                  # Node/Express API Server
│   ├── config/               # Database connectivity hooks
│   ├── controllers/          # Business logic & Route handlers
│   ├── middleware/           # Auth protectors and role limits
│   ├── models/               # Mongoose Schemas (User, Job, Application, Resume)
│   ├── routes/               # Express Router mapping
│   ├── scripts/              # Database seeder and CLI test scripts
│   └── utils/                # ATS keyword scorers & AI analyzer engines
│
├── frontend/                 # Vite + React Client
│   ├── src/
│   │   ├── components/       # Custom Gauge/Radar SVGs and Sidebar navigation
│   │   ├── context/          # Global AppContext (API actions and auth session hooks)
│   │   └── pages/            # Core views (Dashboard, ResumeBuilder, PostJob, etc.)
│   └── index.html
│
├── package.json              # Root script manager
└── .gitignore                # Global ignore file (excludes node_modules, .env, and binary/bin files)
```