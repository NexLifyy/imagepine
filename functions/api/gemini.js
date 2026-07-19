// Cloudflare Pages Function: functions/api/gemini.js
// Handles POST /api/gemini and OPTIONS preflight requests

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestPost(context) {
  const { request } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const { imageB64, mimeType, prompt, model, apiKey } = body || {};

  if (!apiKey) {
    return json({ error: "Missing API Key" }, 400);
  }

  const targetModel = model || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

  const parts = [{ text: prompt || 'Ping' }];
  if (imageB64 && mimeType) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: imageB64
      }
    });
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: parts
      }
    ]
  };

  // For metadata generation (where we send images), enforce JSON mode
  if (imageB64 && mimeType) {
    payload.generationConfig = {
      responseMimeType: "application/json"
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      let parsedErr = text;
      try { parsedErr = JSON.parse(text)?.error?.message || text; } catch {}
      return json({ error: parsedErr }, response.status);
    }

    const data = await response.json();
    return json(data);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// Handle OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
