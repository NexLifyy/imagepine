import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageB64, mimeType, prompt, model, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 400 });
    }

    const targetModel = model || 'gemini-1.5-flash';
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
      return NextResponse.json({ error: parsedErr }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
