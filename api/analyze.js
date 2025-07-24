const fetch = require('node-fetch');

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

  try {
    console.log('[analyze] Request body:', req.body);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('[analyze] OpenRouter response status:', response.status);
    // Optionally log a summary of the response, not the full content
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