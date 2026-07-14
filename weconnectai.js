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
    


Here's the complete, fixed weconnectai.js — copy-paste ready. Open your current weconnectai.js, select all (Ctrl+A), delete, paste this, save.

// weconnectai.js
// Shared utilities for the WeconnectAi site + apps.
// v2 — fixed broken regex on the original line 112 that crashed the entire file.

(function () {
  'use strict';
  console.log('weconnectai.js v2 loaded — wcCallAI + wcStore ready');

  // ===== CONFIG =====
  // Aponta para o seu Cloudflare Worker. Em desenvolvimento local, deixe em branco
  // e a app chama api.anthropic.com diretamente (modo demo).
  const AI_PROXY_URL = 'https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';
  const ANTHROPIC_URL = AI_PROXY_URL || 'https://api.anthropic.com/v1/messages';

  // ===== I18N STRINGS =====
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

  // ===== LANGUAGE =====
  function getLang() {
    return localStorage.getItem('wc-lang') || (navigator.language && navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en');
  }
  function setLang(lang) {
    localStorage.setItem('wc-lang', lang);
    document.documentElement.lang = lang;
    applyStrings(lang);
    document.querySelectorAll('.wc-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  }
  function applyStrings(lang) {
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

  // ===== NAV + COOKIES =====
  function initMobileNav() {
    const toggle = document.querySelector('.wc-nav-toggle');
    const links = document.querySelector('.wc-nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    document.querySelectorAll('.wc-nav-link').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  function initCookies() {
    const banner = document.querySelector('.wc-cookies');
    if (!banner) return;
    const decision = localStorage.getItem('wc-cookies');
    if (decision) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    const accept = banner.querySelector('[data-cookie-accept]');
    const decline = banner.querySelector('[data-cookie-decline]');
    if (accept) accept.addEventListener('click', () => { localStorage.setItem('wc-cookies', 'accept'); banner.classList.add('hidden'); loadAnalytics(); });
    if (decline) decline.addEventListener('click', () => { localStorage.setItem('wc-cookies', 'decline'); banner.classList.add('hidden'); });
  }
  function loadAnalytics() {
    // Substituir pelo seu ID GA4 / Plausible / Umami quando quiser analytics
  }

  // ===== LEAD CAPTURE (mailto: pre-filled) =====
  window.wcSubmitLead = function (form, source) {
    if (!form) return false;
    const data = new FormData(form);
    const subject = 'WeconnectAi lead — ' + (source || 'contact') + ' — ' + (data.get('name') || data.get('email') || 'web');
    const lines = [];
    for (const [k, v] of data.entries()) if (v) lines.push(k + ': ' + v);
    lines.push('', 'Source: ' + (source || 'unknown'));
    lines.push('Page: ' + location.pathname);
    lines.push('Lang: ' + getLang());
    const body = encodeURIComponent(lines.join('\n'));
    const to = form.dataset.to || 'geral@weconnectai.pt';
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + body;
    return false;
  };

  // ===== AI CALL =====
  // Returns the raw text from the model (markdown code fences stripped).
  // Wrapped in try/catch so apps always get a string back.
  window.wcCallAI = async function (systemPrompt, userContent) {
    try {
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
      if (!response.ok) {
        const errText = await response.text();
        throw new Error('AI proxy ' + response.status + ': ' + errText);
      }
      const data = await response.json();
      const text = (data.content || []).map(b => b.text || '').join('\n');
      // Strip markdown code fences (
json ... `` or ` ... `) return text.replace(/`json|`/g, '').trim(); } catch (e) { console.error('wcCallAI failed:', e); return 'Erro ao contactar a IA: ' + e.message + '. Tente novamente em alguns segundos.'; } }; // ===== LOCAL STORAGE HELPER ===== window.wcStore = { set: function (k, v) { try { localStorage.setItem('wc:' + k, JSON.stringify({ value: v, ts: Date.now() })); } catch (e) {} }, get: function (k) { try { const r = JSON.parse(localStorage.getItem('wc:' + k)); return r && r.value; } catch (e) { return null; } }, list: function (prefix) { const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('wc:' + prefix)) out.push(k.slice(3)); } return out.sort().reverse(); }, delete: function (k) { try { localStorage.removeItem('wc:' + k); } catch (e) {} } }; // ===== BOOT ===== document.addEventListener('DOMContentLoaded', function () { setLang(getLang()); initMobileNav(); initCookies(); document.querySelectorAll('.wc-lang-btn').forEach(b => { b.addEventListener('click', function (e) { e.preventDefault(); setLang(b.dataset.lang); }); }); }); })(); ``