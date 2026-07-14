(function(){
  'use strict';

  const AI_PROXY_URL = 'https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';
  const ANTHROPIC_URL = AI_PROXY_URL || 'https://api.anthropic.com/v1/messages';

  const STRINGS = {
    pt: {
      nav: { services: 'Servicos', apps: 'Apps gratuitas', about: 'Sobre', contact: 'Contacto', book: 'Pedir orcamento' },
      cookies: { body: 'Usamos cookies essenciais.', accept: 'Aceitar', decline: 'Apenas essenciais' },
      footer: { tag: 'Apps de pre-triagem e servicos de engenharia civil no Algarve.', copy: '(c) 2026 WeconnectAi - Algarve, Portugal' }
    },
    en: {
      nav: { services: 'Services', apps: 'Free apps', about: 'About', contact: 'Contact', book: 'Request a quote' },
      cookies: { body: 'We use essential cookies.', accept: 'Accept', decline: 'Essential only' },
      footer: { tag: 'Pre-screening apps and civil engineering services in the Algarve.', copy: '(c) 2026 WeconnectAi - Algarve, Portugal' }
    }
  };

  function getLang(){
    return localStorage.getItem('wc-lang') || (navigator.language && navigator.language.toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en');
  }
  function setLang(lang){
    localStorage.setItem('wc-lang', lang);
    document.documentElement.lang = lang;
    applyStrings(lang);
    document.querySelectorAll('.wc-lang-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.lang === lang); });
  }
  function applyStrings(lang){
    var s = STRINGS[lang]; if (!s) return;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var path = el.dataset.i18n.split('.');
      var v = s;
      for (var i = 0; i < path.length; i++){ v = v && v[path[i]]; }
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var path = el.dataset.i18nHtml.split('.');
      var v = s;
      for (var i = 0; i < path.length; i++){ v = v && v[path[i]]; }
      if (typeof v === 'string') el.innerHTML = v;
    });
  }

  function initMobileNav(){
    var toggle = document.querySelector('.wc-nav-toggle');
    var links = document.querySelector('.wc-nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
    document.querySelectorAll('.wc-nav-link').forEach(function(a){ a.addEventListener('click', function(){ links.classList.remove('open'); }); });
  }

  function initCookies(){
    var banner = document.querySelector('.wc-cookies');
    if (!banner) return;
    var decision = localStorage.getItem('wc-cookies');
    if (decision) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    var accept = banner.querySelector('[data-cookie-accept]');
    var decline = banner.querySelector('[data-cookie-decline]');
    if (accept) accept.addEventListener('click', function(){ localStorage.setItem('wc-cookies','accept'); banner.classList.add('hidden'); });
    if (decline) decline.addEventListener('click', function(){ localStorage.setItem('wc-cookies','decline'); banner.classList.add('hidden'); });
  }

  window.wcSubmitLead = function(form, source){
    if (!form) return false;
    var data = new FormData(form);
    var firstField = data.get('name') || data.get('email') || 'web';
    var subject = 'WeconnectAi lead - ' + (source || 'contact') + ' - ' + firstField;
    var lines = [];
    data.forEach(function(value, key){ if (value) lines.push(key + ': ' + value); });
    lines.push('', 'Source: ' + (source || 'unknown'), 'Page: ' + location.pathname, 'Lang: ' + getLang());
    var body = encodeURIComponent(lines.join('\n'));
    var to = form.dataset.to || 'geral@weconnectai.pt';
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&&body=' + body;
    return false;
  };

  window.wcCallAI = async function(systemPrompt, userContent){
    var response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
      })
    });
    var data = await response.json();
    var text = '';
    if (data && data.content) {
      for (var i = 0; i < data.content.length; i++){
        if (data.content[i].text) text += data.content[i].text + '\n';
      }
    }
    text = text.replace(/\u0060\u0060\u0060json/g, '');
    text = text.replace(/\u0060\u0060\u0060/g, '');
    return text.trim();
  };

  window.wcStore = {
    set: function(k, v){ try { localStorage.setItem('wc:' + k, JSON.stringify({value: v, ts: Date.now()})); } catch(e){} },
    get: function(k){ try { var raw = localStorage.getItem('wc:' + k); if (!raw) return null; var parsed = JSON.parse(raw); return parsed && parsed.value; } catch(e){ return null; } },
    list: function(prefix){
      var out = [];
      try {
        for (var i = 0; i < localStorage.length; i++){
          var key = localStorage.key(i);
          if (key && key.indexOf('wc:' + prefix) === 0) out.push(key.substring(3));
        }
      } catch(e){}
      return out.sort().reverse();
    },
    delete: function(k){ try { localStorage.removeItem('wc:' + k); } catch(e){} }
  };

  document.addEventListener('DOMContentLoaded', function(){
    setLang(getLang());
    initMobileNav();
    initCookies();
    document.querySelectorAll('.wc-lang-btn').forEach(function(b){
      b.addEventListener('click', function(e){ e.preventDefault(); setLang(b.dataset.lang); });
    });
  });
})();