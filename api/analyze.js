module.exports = async (req, res) => {
  console.log('[analyze] Incoming request:', req.method, req.url);
  if (req.method !== 'POST') {
    console.log('[analyze] Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[analyze] API key not configured');
    res.status(500).json({ error: 'API key not configured' });
    return;
  } else {
    console.log('[analyze] API key is present');
  }

  let body = req.body;
  // Vercel may not parse JSON automatically, so handle raw body if needed
  if (typeof body === 'undefined') {
    try {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
    } catch (err) {
      console.error('[analyze] Failed to parse request body:', err.message);
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  }

  try {
    console.log('[analyze] Request body:', body);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[analyze] OpenRouter response status:', response.status);
    if (data.choices && Array.isArray(data.choices)) {
      console.log('[analyze] OpenRouter response choices count:', data.choices.length);
    } else {
      console.log('[analyze] OpenRouter response:', data);
    }
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[analyze] Error contacting OpenRouter:', err.message);
    res.status(500).json({ error: 'Failed to contact OpenRouter', details: err.message });
  }
}; 