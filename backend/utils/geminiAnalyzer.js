const https = require('https');
const { analyzeResume } = require('./atsAnalyzer');

/**
 * Make a direct HTTPS POST request to Gemini API
 * @param {String} prompt 
 * @returns {Promise<String>}
 */
const callGemini = (prompt) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return reject(new Error('GEMINI_API_KEY environment variable is not defined.'));
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000 // 30s timeout
    };

    const req = https.request(url, options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.error) {
            return reject(new Error(json.error.message || 'Gemini API call failed.'));
          }
          if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts[0]) {
            const textResponse = json.candidates[0].content.parts[0].text;
            resolve(textResponse);
          } else {
            reject(new Error('Invalid response structure received from Gemini.'));
          }
        } catch (err) {
          reject(new Error(`Failed to parse Gemini response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API request timed out.'));
    });

    req.write(postData);
    req.end();
  });
};

/**
 * Run advanced ATS analysis utilizing the Gemini API
 * Fallback to standard rule-based parser if API call fails or key is missing
 * @param {Object} resumeData 
 * @param {String} targetRole 
 */
const analyzeResumeAsync = async (resumeData, targetRole = 'product designer') => {
  if (!process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY is not defined. Falling back to local rule-based ATS analysis.');
    return analyzeResume(resumeData, targetRole);
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) Analyzer and career advisor.
Evaluate the following resume data against the target role: "${targetRole}".

Resume JSON Data:
${JSON.stringify(resumeData, null, 2)}

Provide a thorough evaluation in JSON format. Ensure all fields below are calculated and formatted correctly:
- "atsScore": an integer from 0 to 100 representing how well the resume matches the target role.
- "scoreMetrics": an object containing:
  - "contentQuality": integer 0-100 (checks depth of sections, presence of numbers/metrics).
  - "keywordOptimization": integer 0-100 (checks matches of industry keywords for the role).
  - "formatStructure": integer 0-100 (checks layout, contact details, standard headings).
  - "relevance": integer 0-100 (checks alignment of user's experiences and summary with target role).
- "strengths": an array of 3-5 specific, professional strengths identified in their resume for this target role.
- "improvements": an array of 3-5 actionable recommendations to make their resume stand out and score higher on ATS.
- "keywordStatus": an array of objects for 10-15 key skills/keywords relevant to the target role "${targetRole}", with status "Match" if present in the resume or "Missing" if not. Format: { "keyword": "Figma", "status": "Match" }

Ensure your response is ONLY the raw JSON object. Do not wrap the JSON output in markdown fences, backticks, or any other formatting.
`;

  try {
    console.log(`Sending resume analysis request to Gemini for target role: "${targetRole}"...`);
    const rawResult = await callGemini(prompt);
    const cleanJsonText = rawResult.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    const evaluation = JSON.parse(cleanJsonText);
    
    // Verify properties exist
    const hasAtsScore = evaluation.hasOwnProperty('atsScore') && (typeof evaluation.atsScore === 'number' || typeof evaluation.atsScore === 'string');
    if (hasAtsScore && evaluation.scoreMetrics && Array.isArray(evaluation.strengths) && Array.isArray(evaluation.improvements)) {
      console.log('Gemini ATS analysis completed successfully.');
      
      // Normalize score to 0-100 range in case Gemini returns a rating on a 0-10 or 0-1 scale
      const normalizeScore = (val) => {
        let num = typeof val === 'number' ? val : parseFloat(val);
        if (isNaN(num)) return 0;
        if (num > 0 && num <= 1) return Math.round(num * 100);
        if (num > 0 && num <= 10) return Math.round(num * 10);
        return Math.min(100, Math.round(num));
      };

      evaluation.atsScore = normalizeScore(evaluation.atsScore);
      if (evaluation.scoreMetrics) {
        evaluation.scoreMetrics.contentQuality = normalizeScore(evaluation.scoreMetrics.contentQuality);
        evaluation.scoreMetrics.keywordOptimization = normalizeScore(evaluation.scoreMetrics.keywordOptimization);
        evaluation.scoreMetrics.formatStructure = normalizeScore(evaluation.scoreMetrics.formatStructure);
        evaluation.scoreMetrics.relevance = normalizeScore(evaluation.scoreMetrics.relevance);
      }

      return evaluation;
    } else {
      throw new Error('Missing required properties in Gemini response structure.');
    }
  } catch (error) {
    console.error('Gemini Resume Analysis failed, using local fallback:', error.message);
    return analyzeResume(resumeData, targetRole);
  }
};

/**
 * Asynchronously parse resume text using Gemini AI
 * @param {String} textContent 
 * @param {String} targetRole 
 */
const parseResumeTextAsync = async (textContent, targetRole = 'product designer') => {
  if (!process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY is not defined. Falling back to local rule-based parsing.');
    // Fallback to local parsing which returns a structured resume with local analysis
    const localParsed = require('./atsAnalyzer').parseTextResume(textContent, targetRole);
    return localParsed;
  }

  const prompt = `
You are a Resume Parser. Convert the following plain text resume into a structured JSON schema.
Target role is: "${targetRole}".

Resume Plain Text:
"""
${textContent}
"""

Extract information accurately. Output must be a JSON object containing:
- "personalInfo": { "fullName", "email", "phone", "location", "linkedin", "github", "portfolio", "title", "summary" }
- "skills": array of objects { "name", "level" } (e.g. { "name": "Figma", "level": 90 }) - level should be a number between 0 and 100.
- "education": array of objects { "degree", "school", "year", "grade" }
- "workExperience": array of objects { "role", "company", "location", "duration", "description" }
- "internships": array of objects { "role", "company", "location", "duration", "description" }
- "projects": array of objects { "title", "technologies", "description", "link" }
- "achievements": array of objects { "title", "description" }
- "certificates": array of objects { "title", "issuer", "date" }

Ensure all fields are fully populated based on the text. If a section is not found, leave it as an empty array.
Your output must be ONLY the raw JSON object. Do not wrap the JSON output in markdown fences, backticks, or any other formatting.
`;

  try {
    console.log(`Sending resume text parse request to Gemini...`);
    const rawResult = await callGemini(prompt);
    const cleanJsonText = rawResult.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    const parsedData = JSON.parse(cleanJsonText);

    // Call advanced analyzer to calculate scores and keyword metrics
    const analysis = await analyzeResumeAsync(parsedData, targetRole);
    
    return {
      ...parsedData,
      ...analysis
    };
  } catch (error) {
    console.error('Gemini Resume Parsing failed, using local fallback:', error.message);
    const { parseTextResume } = require('./atsAnalyzer');
    return parseTextResume(textContent, targetRole);
  }
};

module.exports = {
  analyzeResumeAsync,
  parseResumeTextAsync
};
