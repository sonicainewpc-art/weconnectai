(function(){
  'use strict';

  // ===== CONFIG =====
  // Aponta para o seu Cloudflare Worker (definido em README.md / worker.js).
  // Para desenvolvimento local, deixe em branco e as apps chamam api.anthropic.com
  // diretamente (modo demo, igual aos ficheiros originais).
  const AI_PROXY_URL = 'https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';  // <-- SUBSTITUIR pelo seu subdomínio Cloudflare
  const ANTHROPIC_URL = AI_PROXY_URL || 'https://api.anthropic.com/v1/messages';

  const STRINGS = {
    pt: {
      nav: { services: 'Serviços', apps: 'Apps gratuitas', about: 'Sobre', contact: 'Contacto', book: 'Pedir orçamento' },
      cookies: {
        body: 'Usamos cookies essenciais (idioma, sessão) e — com o seu consentimento — cookies de medição (Google Analytics). Pode alterar a sua escolha em qualquer momento na <a href="/privacy.html">política de privacidade</a>.',
        accept: 'Aceitar', decline: 'Apenas essenciais'
      },
      footer: {
        tag: 'Apps de pré-triagem e serviços de engenharia civil no Algarve. Apps gratuitas — serviços profissionais por orçamento.',
        copy: '© 2026 WeconnectAi · Algarve, Portugal'
      }
    },
    en: {
      nav: { services: 'Services', apps: 'Free apps', about: 'About', contact: 'Contact', book: 'Request a quote' },
      cookies: {
        body: 'We use essential cookies (language, session) and — with your consent — measurement cookies (Google Analytics). You can change your choice anytime in our <a href="/privacy.html">privacy policy</a>.',
        accept: 'Accept', decline: 'Essential only'
      },
      footer: {
        tag: 'Pre-screening apps and civil engineering services in the Algarve. Free apps — professional services on quote.',
        copy: '© 2026 WeconnectAi · Algarve, Portugal'
      }
    }
  };

  function getLang(){
    return localStorage.getItem('wc-lang') || (navigator.language && navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en');
  }
  function setLang(lang){
    localStorage.setItem('wc-lang', lang);
    document.documentElement.lang = lang;
    applyStrings(lang);
    document.querySelectorAll('.wc-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  }
  function applyStrings(lang){
    const s = STRINGS[lang]; if (!s) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const path = el.dataset.i18n.split('.'); let v = s;
      for (const k of path) v = v && v[k];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const path = el.dataset.i18nHtml.split('.'); let v = s;
      for (const k of path) v = v && v[k];
      if (typeof v === 'string') el.innerHTML = v;
    });
  }

  function initMobileNav(){
    const toggle = document.querySelector('.wc-nav-toggle');
    const links = document.querySelector('.wc-nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    document.querySelectorAll('.wc-nav-link').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  function initCookies(){
    const banner = document.querySelector('.wc-cookies');
    if (!banner) return;
    const decision = localStorage.getItem('wc-cookies');
    if (decision) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    const accept = banner.querySelector('[data-cookie-accept]');
    const decline = banner.querySelector('[data-cookie-decline]');
    if (accept) accept.addEventListener('click', () => { localStorage.setItem('wc-cookies','accept'); banner.classList.add('hidden'); loadAnalytics(); });
    if (decline) decline.addEventListener('click', () => { localStorage.setItem('wc-cookies','decline'); banner.classList.add('hidden'); });
  }
  function loadAnalytics(){
    // Substituir pelo seu ID GA4 / Plausible / Umami quando quiser analytics
  }

  // Lead capture (mailto: pre-filled)
  window.wcSubmitLead = function(form, source){
    if (!form) return false;
    const data = new FormData(form);
    const subject = `WeconnectAi lead — ${source || 'contact'} — ${data.get('name') || data.get('email') || 'web'}`;
    const lines = [];
    for (const [k,v] of data.entries()) if (v) lines.push(`${k}: ${v}`);
    lines.push('', `Source: ${source || 'unknown'}`);
    lines.push(`Page: ${location.pathname}`);
    lines.push(`Lang: ${getLang()}`);
    const body = encodeURIComponent(lines.join('\n'));
    const to = form.dataset.to || 'geral@weconnectai.pt';
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    return false;
  };

  // Helper partilhado para chamar a API (usado por todas as apps)
  window.wcCallAI = async function(systemPrompt, userContent){
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
      })
    });
    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('\n');
    return text.replace(/
json|``/g,'').trim(); }; // Helper para localStorage (substitui window.storage nas apps) window.wcStore = { set: (k,v) => { try { localStorage.setItem('wc:'+k, JSON.stringify({value:v, ts:Date.now()})); } catch(e){} }, get: (k) => { try { const r = JSON.parse(localStorage.getItem('wc:'+k)); return r && r.value; } catch(e){ return null; } }, list: (prefix) => { const out = []; for (let i=0; i<localStorage.length; i++){ const k = localStorage.key(i); if (k && k.startsWith('wc:'+prefix)) out.push(k.slice(3)); } return out.sort().reverse(); }, delete: (k) => { try { localStorage.removeItem('wc:'+k); } catch(e){} } }; document.addEventListener('DOMContentLoaded', () => { setLang(getLang()); initMobileNav(); initCookies(); document.querySelectorAll('.wc-lang-btn').forEach(b => { b.addEventListener('click', (e) => { e.preventDefault(); setLang(b.dataset.lang); }); }); }); })(); ___CODE_BLOCK_3___javascript // Cloudflare Worker — proxy seguro para a Anthropic API // Deploy: wrangler deploy // Secret: wrangler secret put ANTHROPIC_API_KEY export default { async fetch(request, env) { // CORS preflight if (request.method === 'OPTIONS') { return new Response(null, { headers: { 'Access-Control-Allow-Origin': 'https://weconnectai.pt', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', } }); } if (request.method !== 'POST') { return new Response('Method not allowed', { status: 405 }); } // Rate limit simples por IP (50 req / 10 min) — Cloudflare também tem WAF const ip = request.headers.get('CF-Connecting-IP') || 'unknown'; const cache = caches.default; const key = https://ratelimit/${ip}; const now = Date.now(); const windowMs = 10 * 60 * 1000; const limit = 50; let bucket = []; const cached = await cache.match(key); if (cached) { try { bucket = (await cached.json()).filter(t => now - t < windowMs); } catch(e){} } if (bucket.length >= limit) { return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://weconnectai.pt' } }); } bucket.push(now); await cache.put(key, new Response(JSON.stringify(bucket))); // Encaminhar para a Anthropic let body; try { body = await request.json(); } catch(e) { return new Response('Invalid JSON', { status: 400 }); } const allowed = ['claude-sonnet-4-6', 'claude-opus-4-1']; if (!allowed.includes(body.model)) body.model = 'claude-sonnet-4-6'; const resp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) }); const data = await resp.text(); return new Response(data, { status: resp.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://weconnectai.pt', 'Cache-Control': 'no-store' } }); } }; ___CODE_BLOCK_4___toml name = "weconnectai-ai-proxy" main = "worker.js" compatibility_date = "2024-01-01" [vars] ALLOWED_ORIGIN = "https://weconnectai.pt" # wrangler secret put ANTHROPIC_API_KEY # (set via CLI, nunca em plaintext no repo) ___CODE_BLOCK_5___html <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>WeconnectAi — Pre-screening apps & civil engineering services in the Algarve</title> <meta name="description" content="Free pre-screening tools for property buyers and small builders in the Algarve: regulatory compliance, feasibility, licensing, renovation cost, energy certificate. Professional engineering services on quote." /> <meta name="theme-color" content="#1B2A45" /> <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231B2A45'/%3E%3Ctext x='16' y='22' text-anchor='middle' fill='white' font-family='Georgia' font-size='18' font-weight='600'%3EW%3C/text%3E%3C/svg%3E" /> <link rel="canonical" href="https://weconnectai.pt/" /> <meta property="og:title" content="WeconnectAi — Algarve pre-screening & engineering" /> <meta property="og:description" content="Free AI-powered pre-screening tools + professional civil engineering services in the Algarve, Portugal." /> <meta property="og:type" content="website" /> <meta property="og:url" content="https://weconnectai.pt/" /> <link rel="stylesheet" href="weconnectai.css" /> <script type="application/ld+json"> { "@context": "https://schema.org", "@type": "LocalBusiness", "name": "WeconnectAi", "description": "Pre-screening apps and civil engineering services in the Algarve, Portugal.", "areaServed": [{"@type":"AdministrativeArea","name":"Algarve, Portugal"}], "url": "https://weconnectai.pt", "priceRange": "€€", "email": "geral@weconnectai.pt" } </script> </head> <body> <nav class="wc-nav"> <div class="wc-nav-inner"> <a class="wc-brand" href="/"> <span class="wc-brand-mark">W</span> <span> <span class="wc-brand-name">WeconnectAi</span> <span class="wc-brand-tag">Algarve · Engineering</span> </span> </a> <button class="wc-nav-toggle" aria-label="Menu">Menu</button> <div class="wc-nav-links"> <a class="wc-nav-link" href="#services" data-i18n="nav.services">Services</a> <a class="wc-nav-link" href="#apps" data-i18n="nav.apps">Free apps</a> <a class="wc-nav-link" href="#about" data-i18n="nav.about">About</a> <a class="wc-nav-link" href="#contact" data-i18n="nav.contact">Contact</a> <div class="wc-lang-switch"> <button class="wc-lang-btn" data-lang="pt">PT</button> <button class="wc-lang-btn" data-lang="en">EN</button> </div> <a class="wc-nav-cta" href="#contact" data-i18n="nav.book">Request a quote</a> </div> </div> </nav> <header class="wc-page-hero"> <div class="wc-page-hero-inner"> <div class="wc-eyebrow">Algarve · Portugal</div> <h1 class="wc-h1">Pre-screening tools & civil engineering, built for the Algarve.</h1> <p class="wc-lede">Five free AI-powered apps to help you check a property, plan a renovation, or track a licensing process — before you spend money on a professional. And when you need a real engineer, that's where we come in.</p> <p style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;"> <a class="wc-btn wc-btn-large" href="#apps">Try the free apps</a> <a class="wc-btn wc-btn-large wc-btn-secondary" href="#contact" data-i18n="nav.book">Request a quote</a> </p> </div> </header> <section id="apps" class="wc-section"> <div class="wc-container"> <div class="wc-section-eyebrow">Free tools · prototype v0.1</div> <h2 class="wc-section-title">Five apps to test your project before you commit.</h2> <p style="color: var(--ink-soft); max-width: 680px; margin-bottom: 32px;">Every app runs in your browser, takes 2–5 minutes, and gives you a non-binding pre-screening — not a legal or professional determination. Useful to size the work, flag obvious problems, and decide if a paid consultation is worth it.</p> <div class="wc-app-grid"> <a class="wc-app-card" href="/apps/compliance.html"><div class="wc-app-card-num">App 01</div><h3 class="wc-app-card-title">Algarve Compliance Checker</h3><p class="wc-app-card-desc">Cross-check your project against the relevant municipality's PDM and the regulation text you paste in. The 16 concelhos of the Algarve, each with its own quirks.</p><div class="wc-app-card-cta">Open the checker →</div></a> <a class="wc-app-card" href="/apps/feasibility.html"><div class="wc-app-card-num">App 02</div><h3 class="wc-app-card-title">Land &amp; Property Feasibility</h3><p class="wc-app-card-desc">Can I build / extend / convert this? Combines zoning, cadastro, RAN/REN, coastal servitude (POOC), and flood risk into one pre-screening answer with a risk score.</p><div class="wc-app-card-cta">Open the feasibility tool →</div></a> <a class="wc-app-card" href="/apps/licensing.html"><div class="wc-app-card-num">App 03</div><h3 class="wc-app-card-title">Licensing Process Navigator</h3><p class="wc-app-card-desc">Track your câmara municipal process against RJUE baseline timelines, check off the instrutório document list, and paste any notification in to get a plain-language explanation.</p><div class="wc-app-card-cta">Open the navigator →</div></a> <a class="wc-app-card" href="/apps/renovation.html"><div class="wc-app-card-num">App 04</div><h3 class="wc-app-card-title">Renovation Scope &amp; Cost Estimator</h3><p class="wc-app-card-desc">A ballpark €/m² range for older Algarve properties plus a list of which items are likely exempt vs. likely to trigger a licença. Useful for sanity-checking a project before commissioning real quotes.</p><div class="wc-app-card-cta">Open the estimator →</div></a> <a class="wc-app-card" href="/apps/energy.html"><div class="wc-app-card-num">App 05</div><h3 class="wc-app-card-title">Energy Certificate Pre-assessment</h3><p class="wc-app-card-desc">A rough likely class range (A+ to F) for the property, before the certified perito visits. Useful for agents and sellers to set expectations and flag quick wins.</p><div class="wc-app-card-cta">Open the pre-assessment →</div></a> </div> </div> </section> <section id="services" class="wc-section wc-section-alt"> <div class="wc-container"> <div class="wc-section-eyebrow">Professional services</div> <h2 class="wc-section-title">When you need a real engineer on the ground.</h2> <p style="color: var(--ink-soft); max-width: 680px; margin-bottom: 32px;">We do the work ourselves, in-house, with 20+ years of civil engineering experience in the Algarve. For adjacent services (architects, topographers, legal), we coordinate trusted partners so you don't have to run the procurement yourself.</p> <div class="wc-services"> <div class="wc-service"><h3>Construction oversight (fiscalização)</h3><p>Independent site supervision to protect the buyer's interest: workmanship checks, schedule control, conformity with the licensed project.</p></div> <div class="wc-service"><h3>Urban planning compliance</h3><p>Real (paid) version of App 01 — full PDM cross-check, pareceres, communications with the câmara, due-diligence reports for buyers.</p></div> <div class="wc-service"><h3>Licensing support</h3><p>End-to-end gestão of licenciamento, comunicação prévia, or PIP processes with the câmara. Real version of App 03.</p></div> <div class="wc-service"><h3>Renovation project management</h3><p>Brief, contractor selection, contract review, on-site coordination. Real version of App 04.</p></div> </div> </div> </section> <section id="about" class="wc-section"> <div class="wc-container-narrow"> <div class="wc-section-eyebrow">About</div> <h2 class="wc-section-title">Built by a civil engineer who's tired of seeing clients get hurt.</h2> <p style="font-size: 16px; line-height: 1.7; color: var(--ink-soft);">The free apps exist because the same questions come up over and over with foreign buyers, small architecture studios, and small builders in the Algarve: <em>"can I build here?", "how long will the câmara take?", "is this renovation going to need a licença?"</em> — and the answers are scattered across 16 different PDMs, dozens of laws, and one câmara that's slower than the next.</p> <p style="font-size: 16px; line-height: 1.7; color: var(--ink-soft);">The apps give you a fast, honest pre-screening. The professional services give you a real engineer. Both exist because nobody else is offering them in one place.</p> </div> </section> <section id="faq" class="wc-section wc-section-alt"> <div class="wc-container-narrow"> <div class="wc-section-eyebrow">FAQ</div> <h2 class="wc-section-title">Common questions</h2> <div class="wc-faq"> <div class="wc-faq-item"><p class="wc-faq-q">Are the apps really free?</p><p class="wc-faq-a">Yes. They run in your browser and use a small amount of AI credits per screening. No account, no payment, no email required to use the apps.</p></div> <div class="wc-faq-item"><p class="wc-faq-q">Are the apps a legal or professional determination?</p><p class="wc-faq-a">No. They are preliminary screening only. See our <a href="/terms.html">terms of use</a> and the disclaimer in every app.</p></div> <div class="wc-faq-item"><p class="wc-faq-q">Do you store the data I type into the apps?</p><p class="wc-faq-a">Your last few screenings are saved in your browser's local storage (not on our servers) so you can come back to them. See the <a href="/privacy.html">privacy policy</a>.</p></div> <div class="wc-faq-item"><p class="wc-faq-q">I have a property in Lagos / Tavira / Silves — does the Compliance Checker work for my concelho?</p><p class="wc-faq-a">Yes, all 16 concelhos of the Algarve are covered. Accuracy depends on the regulation text you paste in — without it, the tool will flag what to check rather than invent numbers.</p></div> <div class="wc-faq-item"><p class="wc-faq-q">I'm a non-resident buyer (UK / DE / NL / FR) — can you help?</p><p class="wc-faq-a">Yes, we work with non-resident buyers regularly. NIF, NISS, bank account opening, and the AIMA residency process are part of the support we coordinate with local solicitors and tax advisers.</p></div> </div> </div> </section> <section id="contact" class="wc-section"> <div class="wc-container"> <div class="wc-section-eyebrow">Get in touch</div> <h2 class="wc-section-title">Tell us about your project.</h2> <div class="wc-lead" style="max-width: 720px;"> <h3>Request a quote or ask a question</h3> <p>We reply within one working day. Algarve region, Portugal — also serving Lisbon and the Alentejo coast on request.</p> <form onsubmit="return wcSubmitLead(this, 'contact-form')" data-to="geral@weconnectai.pt"> <div class="wc-lead-row"> <input type="text" name="name" placeholder="Your name" required /> <input type="email" name="email" placeholder="Email" required /> </div> <div class="wc-lead-row"> <input type="text" name="phone" placeholder="Phone / WhatsApp (optional)" /> <select name="topic" required> <option value="">What is this about?</option> <option>Construction oversight (fiscalização)</option> <option>Urban planning compliance</option> <option>Licensing support</option> <option>Renovation project management</option> <option>Question about a free app</option> <option>Something else</option> </select> </div> <textarea name="message" placeholder="Short description of the project, the property, where it is, and what you need." style="margin-bottom: 10px;"></textarea> <button class="wc-lead-btn" type="submit">Send</button> <p class="wc-lead-note">Submitting opens your email client with the message pre-filled. We never share your details. See our <a href="privacy.html">privacy policy</a>.</p> </form> </div> </div> </section> <div class="wc-cookies hidden"> <p data-i18n-html="cookies.body">We use essential cookies (language, session) and — with your consent — measurement cookies. You can change your choice anytime in our <a href="/privacy.html">privacy policy</a>.</p> <div class="wc-cookies-btns"> <button data-cookie-accept data-i18n="cookies.accept">Accept</button> <button class="wc-decline" data-cookie-decline data-i18n="cookies.decline">Essential only</button> </div> </div> <footer class="wc-footer"> <div class="wc-footer-inner"> <div><div class="wc-footer-brand">WeconnectAi</div><p class="wc-footer-tag" data-i18n="footer.tag">Pre-screening apps and civil engineering services in the Algarve. Free apps — professional services on quote.</p></div> <div><h4>Free apps</h4><ul><li><a href="/apps/compliance.html">Compliance</a></li><li><a href="/apps/feasibility.html">Feasibility</a></li><li><a href="/apps/licensing.html">Licensing</a></li><li><a href="/apps/renovation.html">Renovation</a></li><li><a href="/apps/energy.html">Energy</a></li></ul></div> <div><h4>Services</h4><ul><li><a href="#services">Construction oversight</a></li><li><a href="#services">Compliance</a></li><li><a href="#services">Licensing</a></li><li><a href="#services">Renovation</a></li></ul></div> <div><h4>Company</h4><ul><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li><li><a href="/privacy.html">Privacy</a></li><li><a href="/terms.html">Terms</a></li></ul></div> </div> <div class="wc-footer-bottom"><span data-i18n="footer.copy">© 2026 WeconnectAi · Algarve, Portugal</span><span><a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></span></div> </footer> <script src="weconnectai.js"></script> </body> </html> ``