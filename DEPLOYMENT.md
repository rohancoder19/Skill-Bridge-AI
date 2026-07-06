# 🚀 Deploying Skill-Bridge AI to Render

This guide provides instructions to deploy the **Skill-Bridge AI** full-stack MERN application to [Render](https://render.com/).

The application is configured as a monorepo where the **Node.js/Express backend** serves the compiled **React/Vite frontend** assets in production. This allows you to host the entire application under a single Render Web Service on the Free tier.

---

## 📋 Prerequisites

Before deploying, ensure you have:
1. A **Render Account** (Free tier is perfectly fine).
2. A **GitHub Repository** containing this codebase (e.g., `https://github.com/rohancoder19/Skill-Bridge-AI`).
3. A **MongoDB Atlas Connection URI**.
   > [!IMPORTANT]
   > Do not rely on the in-memory MongoDB server in production. In-memory databases lose all data when the server restarts or goes to sleep on Render's Free tier.
4. A **Google Gemini API Key** for ATS parsing and resume scoring.

---

## ⚡ Method 1: Blueprint Deployment (Recommended)

Render Blueprints allow you to deploy your infrastructure as code using the `render.yaml` file included in this repository.

1. **Commit and Push** these deployment files to your GitHub repository:
   ```bash
   git add render.yaml DEPLOYMENT.md
   git commit -m "Configure deployment to Render"
   git push origin main
   ```
2. Open the [Render Dashboard](https://dashboard.render.com/).
3. Click on **Blueprints** in the top navigation bar.
4. Click **New Blueprint Instance**.
5. Connect your `Skill-Bridge-AI` repository.
6. Render will automatically read the `render.yaml` file. Configure the following fields:
   * **Service Name**: `skill-bridge-ai` (or any name you prefer)
   * **MONGO_URI**: Your MongoDB Atlas Connection String.
   * **GEMINI_API_KEY**: Your Google Gemini API Key.
   * **JWT_SECRET**: (Optional) You can leave this blank; Render will automatically generate a secure random string for you.
7. Click **Approve**. Render will provision your Web Service, build both the frontend and backend, and start the server.

---

## 🛠️ Method 2: Manual Web Service Deployment

If you prefer to configure the Web Service manually through the Render UI:

1. **Commit and Push** your files to GitHub.
2. Open the [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your `Skill-Bridge-AI` repository.
4. Set the following configuration parameters:
   * **Name**: `skill-bridge-ai`
   * **Region**: Choose the region closest to your users.
   * **Branch**: `main` (or your active branch)
   * **Runtime**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm run start`
   * **Instance Type**: `Free`
5. Expand the **Advanced** section to add the following **Environment Variables**:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode and static asset serving. |
   | `PORT` | `10000` | Port for Render to bind to. |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas Connection String. |
   | `GEMINI_API_KEY` | `AIzaSy...` | Your Gemini API Key. |
   | `JWT_SECRET` | `your_secret_key` | Any secure random string. |
6. Click **Create Web Service**.

---

## 🗄️ Database Seeding

The application has an **auto-seeding mechanism** in the backend database configuration ([db.js](file:///c:/Users/rohan/Desktop/TRAI%20Project/Skill_Bridge%20AI/backend/config/db.js)).
* When the web service connects to MongoDB for the first time, it checks if there are any users in the database.
* If the database is completely empty, it automatically triggers the seeding script ([seed.js](file:///c:/Users/rohan/Desktop/TRAI%20Project/Skill_Bridge%20AI/backend/scripts/seed.js)), populating the database with mock candidate accounts, job listings, and recruiter data.
* You can test immediately using the seeded accounts:
  * **Candidate**: `alex@example.com` / `password123`
  * **Recruiter**: `recruiter@example.com` / `password123`

---

## 🔍 Verifying the Deployment

1. Once the build finishes, Render will output `Server running on port 10000` and provide a URL like `https://skill-bridge-ai.onrender.com`.
2. Open the URL in your browser.
3. Verify that:
   * The landing page loads successfully.
   * You can log in using the demo candidate or recruiter credentials.
   * Navigating through pages (Dashboard, Job Search, Resume Builder) works smoothly without any `404` errors.
