const { callGeminiAPI } = require('./gemini-proxy');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === '/api/chatwork-proxy' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const { endpoint, token, params } = JSON.parse(body);
      
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      const apiUrl = `https://api.chatwork.com/v2/${endpoint}${queryString}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-ChatWorkToken': token
        }
      });
      
      const data = await response.text();
      
      if (response.ok) {
        res.status(200).json(JSON.parse(data));
      } else {
        res.status(response.status).json({ error: data });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
    
  } else if (pathname === '/api/ai-proxy' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const { apiKey, systemPrompt, userMessage, aiProvider } = JSON.parse(body);
      
      console.log('AI Provider:', aiProvider);
      console.log('API Key length:', apiKey ? apiKey.length : 'undefined');
      
      if (aiProvider === 'gemini' || !aiProvider) {
        // Google Gemini (無料・高品質)
        try {
          const result = await callGeminiAPI(apiKey, systemPrompt, userMessage);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(400).json({ error: 'Unsupported AI provider' });
      }
      
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON: ' + error.message });
    }
    
  } else if (pathname === '/') {
    // Serve the HTML file
    const fs = require('fs');
    const path = require('path');
    
    try {
      const htmlPath = path.join(__dirname, 'index-free.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(htmlContent);
    } catch (error) {
      res.status(404).json({ error: 'HTML file not found' });
    }
    
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
};

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}
