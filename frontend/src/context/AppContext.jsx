import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [recruiterApplications, setRecruiterApplications] = useState([]);

  // Set auth header helper
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  });

  // Verify and fetch profile on startup
  useEffect(() => {
    const bootstrapSession = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await fetch('/api/auth/profile', {
            headers: getHeaders(),
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            // Fetch associated details
            if (userData.role === 'recruiter') {
              fetchRecruiterData(token);
            } else {
              fetchResumeData(token);
              fetchApplicationsData(token);
              fetchJobsData(token);
            }
          } else {
            // Token expired
            logout();
          }
        } catch (err) {
          console.error('Session bootstrap failed', err);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };
    bootstrapSession();
  }, [token]);

  const fetchResumeData = async (authToken) => {
    try {
      const res = await fetch('/api/resumes', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const resumeData = await res.json();
        setResume(resumeData);
      }
    } catch (err) {
      console.error('Error fetching resume', err);
    }
  };

  const fetchApplicationsData = async (authToken) => {
    try {
      const res = await fetch('/api/jobs/applications', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const appData = await res.json();
        setApplications(appData);
      }
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  const fetchJobsData = async (authToken, filters = {}) => {
    try {
      let url = '/api/jobs?';
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `${key}=${encodeURIComponent(filters[key])}&`;
        }
      });

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const jobsList = await res.json();
        setJobs(jobsList);
      }
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  };

  const fetchRecruiterData = async (authToken) => {
    try {
      const res = await fetch('/api/jobs/recruiter/dashboard', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRecruiterJobs(data.jobs || []);
        setRecruiterApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching recruiter data', err);
    }
  };

  // Auth Operations
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      if (data.role === 'recruiter') {
        await fetchRecruiterData(data.token);
      } else {
        await Promise.all([
          fetchResumeData(data.token),
          fetchApplicationsData(data.token),
          fetchJobsData(data.token)
        ]);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'candidate') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      if (data.role === 'recruiter') {
        await fetchRecruiterData(data.token);
      } else {
        await Promise.all([
          fetchResumeData(data.token),
          fetchApplicationsData(data.token),
          fetchJobsData(data.token)
        ]);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setResume(null);
    setJobs([]);
    setApplications([]);
    setRecruiterJobs([]);
    setRecruiterApplications([]);
    setError(null);
  };

  // Resume Operations
  const saveResume = async (resumeData) => {
    if (!token) return;
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(resumeData),
      });
      if (res.ok) {
        const updatedResume = await res.json();
        setResume(updatedResume);
        
        // Also update target title/skills on the user profile if modified in the resume
        if (updatedResume.personalInfo.title !== user.targetTitle) {
          const userRes = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
              targetTitle: updatedResume.personalInfo.title,
              skills: updatedResume.skills.map(s => s.name)
            })
          });
          if (userRes.ok) {
            const updatedUser = await userRes.json();
            setUser(updatedUser);
          }
        }
        return updatedResume;
      }
    } catch (err) {
      console.error('Error saving resume', err);
    }
  };

  // Upload simulation
  const uploadResume = async (file, targetRole) => {
    if (!token) return;
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);

      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload resume error', err);
      throw err;
    }
  };

  // Job Board Operations
  const queryJobs = async (filters) => {
    if (!token) return;
    await fetchJobsData(token, filters);
  };

  const applyJob = async (jobId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchApplicationsData(token);
        return true;
      }
    } catch (err) {
      console.error('Error applying to job', err);
    }
    return false;
  };

  const bookmarkJob = async (jobId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        // Update user savedJobs list locally
        setUser(prev => ({
          ...prev,
          savedJobs: data.savedJobs
        }));
        return true;
      }
    } catch (err) {
      console.error('Error bookmarking job', err);
    }
    return false;
  };

  const updateUserProfileStrength = async (strengthPercent) => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ profileStrength: strengthPercent })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Error updating profile strength', err);
    }
  };

  const postJob = async (jobData) => {
    if (!token) return;
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData),
      });
      
      if (res.ok) {
        const newJob = await res.json();
        if (user?.role === 'recruiter') {
          await fetchRecruiterData(token);
        } else {
          await fetchJobsData(token);
        }
        return newJob;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to post job');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      throw err;
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/jobs/applications/${appId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updatedApp = await res.json();
        setRecruiterApplications(prev => 
          prev.map(app => app._id === appId ? updatedApp : app)
        );
        return true;
      }
    } catch (err) {
      console.error('Error updating application status', err);
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        resume,
        jobs,
        applications,
        loading,
        error,
        recruiterJobs,
        recruiterApplications,
        login,
        register,
        logout,
        saveResume,
        uploadResume,
        queryJobs,
        applyJob,
        bookmarkJob,
        updateUserProfileStrength,
        postJob,
        updateApplicationStatus,
        fetchRecruiterData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
