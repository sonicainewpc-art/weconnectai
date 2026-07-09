// Cloudflare Worker — proxy seguro para a Anthropic API
// Deploy:  wrangler deploy
// Secret:  wrangler secret put ANTHROPIC_API_KEY
// Dev:     wrangler dev  (corre em http://localhost:8787)

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Rate limit simples por IP (50 req / 10 min)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const cache = caches.default;
    const key = `https://ratelimit/${ip}`;
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const limit = 50;

    let bucket = [];
    const cached = await cache.match(key);
    if (cached) {
      try { bucket = (await cached.json()).filter(t => now - t < windowMs); } catch (e) {}
    }
    if (bucket.length >= limit) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    bucket.push(now);
    await cache.put(key, new Response(JSON.stringify(bucket)));

    // Encaminhar para a Anthropic
    let body;
    try { body = await request.json(); }
    catch (e) { return new Response('Invalid JSON', { status: 400 }); }

    // Whitelist de modelos (evita abuso se a chave for descoberta)
    const allowed = ['claude-sonnet-4-6', 'claude-opus-4-1'];
    if (!allowed.includes(body.model)) body.model = 'claude-sonnet-4-6';

    // Limite de tokens (evita faturas enormes)
    if (!body.max_tokens || body.max_tokens > 2000) body.max_tokens = 2000;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await resp.text();
    return new Response(data, {
      status: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      }
    });
  }
};