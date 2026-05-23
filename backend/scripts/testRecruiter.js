const http = require('http');

const postRequest = (path, body, token = '') => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(postData);
    req.end();
  });
};

const getRequest = (path, token = '') => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: {}
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', err => reject(err));
    req.end();
  });
};

const run = async () => {
  console.log("=== RUNNING RECRUITER & AUTH TEST ===");

  try {
    // 1. Log in as Candidate (Alex)
    console.log("\n1. Logging in as Candidate (Alex)...");
    const candidateLogin = await postRequest('/api/auth/login', {
      email: 'alex@example.com',
      password: 'password123'
    });
    console.log("Response Status:", candidateLogin.status);
    console.log("Role returned in login response:", candidateLogin.body.role);
    const candidateToken = candidateLogin.body.token;

    // 2. Log in as Recruiter (Sarah)
    console.log("\n2. Logging in as Recruiter (Sarah)...");
    const recruiterLogin = await postRequest('/api/auth/login', {
      email: 'recruiter@example.com',
      password: 'password123'
    });
    console.log("Response Status:", recruiterLogin.status);
    console.log("Role returned in login response:", recruiterLogin.body.role);
    const recruiterToken = recruiterLogin.body.token;

    // 3. Try to post a job as Candidate (Should be Forbidden 403)
    console.log("\n3. Candidate trying to post a job...");
    const sampleJob = {
      title: 'DevOps Engineer',
      company: 'Netlify',
      location: 'Remote',
      experience: '3-6 Years',
      salary: '22 - 35 LPA',
      jobType: 'Remote',
      overview: 'Netlify is looking for a DevOps Engineer to optimize deployment pipelines and cloud infrastructure.',
      requirements: ['3+ years in AWS/GCP', 'Kubernetes and Docker experience', 'Terraform CI/CD'],
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD']
    };
    
    const candidatePost = await postRequest('/api/jobs', sampleJob, candidateToken);
    console.log("Response Status (Expected 403):", candidatePost.status);
    console.log("Message:", candidatePost.body.message);

    // 4. Post a job as Recruiter (Should succeed 201)
    console.log("\n4. Recruiter posting the job...");
    const recruiterPost = await postRequest('/api/jobs', sampleJob, recruiterToken);
    console.log("Response Status (Expected 201):", recruiterPost.status);
    console.log("Job ID:", recruiterPost.body._id);
    console.log("Logo generated:", recruiterPost.body.logo);

    // 5. Candidate searches jobs to see if the new job is returned with match percentage
    console.log("\n5. Candidate searching jobs to see the newly posted Netlify job...");
    const candidateSearch = await getRequest('/api/jobs', candidateToken);
    console.log("Response Status:", candidateSearch.status);
    const netlifyJob = candidateSearch.body.find(j => j.company === 'Netlify');
    if (netlifyJob) {
      console.log("SUCCESS! Netlify job found.");
      console.log("Match Percentage calculated for Alex:", netlifyJob.matchPercentage + "%");
    } else {
      console.log("FAILED: Netlify job not found in search results.");
    }

  } catch (err) {
    console.error("Test failed with error:", err);
  }
};

run();
