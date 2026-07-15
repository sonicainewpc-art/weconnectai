(function(){
  'use strict';

  var AI_PROXY_URL = 'https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';
  var ANTHROPIC_URL = AI_PROXY_URL || 'https://api.anthropic.com/v1/messages';

  // ===== I18N STRINGS (PT + EN) =====
  var STRINGS = {
    pt: {
      nav: {
        services: 'Servicos',
        apps: 'Apps gratuitas',
        about: 'Sobre',
        contact: 'Contacto',
        book: 'Pedir orcamento'
      },
      hero: {
        eyebrow: 'Algarve · Portugal',
        title: 'Ferramentas de pre-triagem e engenharia civil, feitas para o Algarve.',
        lede: 'Cinco apps gratuitas com IA para verificar uma propriedade, planear uma renovacao ou acompanhar um processo de licenciamento - antes de gastar dinheiro num profissional. E quando precisar de um engenheiro de verdade, ai que entramos nos.',
        cta_apps: 'Experimentar as apps',
        cta_quote: 'Pedir orcamento'
      },
      apps_section: {
        eyebrow: 'Ferramentas gratuitas · prototipo v0.1',
        title: 'Cinco apps para testar o seu projeto antes de se comprometer.',
        desc: 'Cada app corre no seu browser, demora 2-5 minutos, e da-lhe uma pre-triagem nao vinculativa - nao e uma determinacao legal ou profissional. Util para dimensionar o trabalho, sinalizar problemas obvios, e decidir se vale a pena uma consulta paga.'
      },
      app: {
        compliance: { num: 'App 01', title: 'Verificador de Conformidade do Algarve', desc: 'Cruze o seu projeto com o PDM do municipio relevante e o texto do regulamento que cola. Os 16 concelhos do Algarve, cada um com as suas particularidades.', cta: 'Abrir o verificador' },
        feasibility: { num: 'App 02', title: 'Viabilidade do Terreno e Propriedade', desc: 'Posso construir / ampliar / converter aqui? Combina zonamento, cadastro, RAN/REN, servidao costeira (POOC) e risco de inundacao numa resposta com pontuacao de risco.', cta: 'Abrir a ferramenta de viabilidade' },
        licensing: { num: 'App 03', title: 'Navegador de Processo de Licenciamento', desc: 'Acompanhe o seu processo na camara contra os prazos de base do RJUE, marque a lista de documentos instrutorios, e cole qualquer notificacao para obter uma explicacao em linguagem simples.', cta: 'Abrir o navegador' },
        renovation: { num: 'App 04', title: 'Estimador de Ambito e Custo de Renegociacao', desc: 'Uma faixa de €/m2 aproximada para propriedades mais antigas do Algarve, mais uma lista de quais itens provavelmente estao isentos vs. quais provavelmente exigem licenca.', cta: 'Abrir o estimador' },
        energy: { num: 'App 05', title: 'Pre-Avaliacao de Certificado Energetico', desc: 'Uma faixa provavel de classe (A+ a F) para a propriedade, antes da visita do perito certificado. Util para agentes e vendedores para definir expetativas e sinalizar melhorias faceis.', cta: 'Abrir a pre-avaliacao' }
      },
      services_section: {
        eyebrow: 'Servicos profissionais',
        title: 'Quando precisa de um engenheiro de verdade em campo.',
        desc: 'Fazemos o trabalho nos proprios, internamente, com mais de 20 anos de experiencia em engenharia civil no Algarve. Para servicos adjacentes (arquitetos, topografos, advogados), coordenamos parceiros de confianca para que nao tenha de gerir o processo de contratacao.',
        s1_title: 'Fiscalizacao de obra', s1_p: 'Supervisao independente do local para proteger o interesse do comprador: verificacoes de qualidade, controlo de prazos, conformidade com o projeto licenciado.' },
        s2_title: 'Conformidade de planeamento urbano', s2_p: 'Versao paga (real) da App 01 - verificacao completa do PDM, pareceres, comunicacoes com a camara, relatorios de due diligence para compradores.' },
        s3_title: 'Apoio ao licenciamento', s3_p: 'Gestao de ponta a ponta do licenciamento, comunicacao previa ou PIP na camara. Versao real da App 03.' },
        s4_title: 'Gestao de projeto de renegociacao', s4_p: 'Briefing, selecao de empreiteiros, revisao de contrato, coordenacao no local. Versao real da App 04.' }
      },
      about_section: {
        eyebrow: 'Sobre',
        title: 'Construido por um engenheiro civil que esta farto de ver clientes lesados.',
        p1: 'As apps gratuitas existem porque as mesmas perguntas aparecem vezes sem conta com compradores estrangeiros, pequenos ateliers de arquitetura e pequenos construtores no Algarve: "posso construir aqui?", "quanto tempo levara a camara?", "esta renovacao vai precisar de licenca?" - e as respostas estao dispersas por 16 PDMs diferentes, dezenas de leis, e uma camara que e mais lenta que a seguinte.',
        p2: 'As apps dao-lhe uma pre-triagem rapida e honesta. Os servicos profissionais dao-lhe um engenheiro de verdade. Ambos existem porque mais ninguem os oferece num so lugar.'
      },
      faq_section: {
        eyebrow: 'FAQ',
        title: 'Perguntas frequentes',
        q1: 'As apps sao mesmo gratuitas?', a1: 'Sim. Correm no seu browser e usam uma pequena quantidade de creditos de IA por triagem. Sem conta, sem pagamento, sem email necessario para usar as apps.' },
        q2: 'As apps sao uma determinacao legal ou profissional?', a2: 'Nao. Sao apenas pre-triagem preliminar. Veja os nossos termos de uso e o aviso em cada app.' },
        q3: 'Armazenam os dados que escrevo nas apps?', a3: 'As suas ultimas triagens sao guardadas no localStorage do seu browser (nao nos nossos servidores) para poder voltar a elas. Veja a politica de privacidade.' },
        q4: 'Tenho uma propriedade em Lagos / Tavira / Silves - o verificador funciona para o meu concelho?', a4: 'Sim, todos os 16 concelhos do Algarve estao cobertos. A precisao depende do texto do regulamento que cola - sem ele, a ferramenta sinaliza o que verificar em vez de inventar numeros.' },
        q5: 'Sou comprador nao residente (UK / DE / NL / FR) - podem ajudar?', a5: 'Sim, trabalhamos regularmente com compradores nao residentes. NIF, NISS, abertura de conta bancaria e o processo AIMA fazem parte do apoio que coordenamos com solicitadores e consultores fiscais locais.' }
      },
      contact_section: {
        eyebrow: 'Contacto',
        title: 'Fale-nos do seu projeto.',
        lead_h3: 'Pedir orcamento ou fazer uma pergunta',
        lead_p: 'Respondemos dentro de um dia util. Regiao do Algarve, Portugal - tambem servimos Lisboa e a costa alentejana a pedido.'
      },
      cookies: {
        body: 'Usamos cookies essenciais (idioma, sessao) e - com o seu consentimento - cookies de medicao. Pode alterar a sua escolha em qualquer momento na <a href="/privacy.html">politica de privacidade</a>.',
        accept: 'Aceitar',
        decline: 'Apenas essenciais'
      },
      footer: {
  tag: 'Apps de pre-triagem e servicos de engenharia civil no Algarve. Apps gratuitas - servicos profissionais por orcamento.',
  copy: '(c) 2026 WeconnectAi - Algarve, Portugal',
  apps_title: 'Apps gratuitas',
  services_title: 'Servicos',
  company_title: 'Empresa',
  privacy: 'Privacidade',
  terms: 'Termos'
},
      forms: {
        name_ph: 'O seu nome',
        email_ph: 'Email',
        phone_ph: 'Telefone / WhatsApp (opcional)',
        msg_ph: 'Descricao curta do projeto, propriedade, localizacao, e o que precisa.',
        send: 'Enviar',
        note: 'Ao submeter abre o seu cliente de email com a mensagem pre-preenchida. Nunca partilhamos os seus dados. Veja a nossa <a href="/privacy.html">politica de privacidade</a>.'
      }
    },
    en: {
      nav: {
        services: 'Services',
        apps: 'Free apps',
        about: 'About',
        contact: 'Contact',
        book: 'Request a quote'
      },
      hero: {
        eyebrow: 'Algarve · Portugal',
        title: 'Pre-screening tools and civil engineering, built for the Algarve.',
        lede: 'Five free AI-powered apps to help you check a property, plan a renovation, or track a licensing process - before you spend money on a professional. And when you need a real engineer, that is where we come in.',
        cta_apps: 'Try the free apps',
        cta_quote: 'Request a quote'
      },
      apps_section: {
        eyebrow: 'Free tools · prototype v0.1',
        title: 'Five apps to test your project before you commit.',
        desc: 'Every app runs in your browser, takes 2-5 minutes, and gives you a non-binding pre-screening - not a legal or professional determination. Useful to size the work, flag obvious problems, and decide if a paid consultation is worth it.'
      },
      app: {
        compliance: { num: 'App 01', title: 'Algarve Compliance Checker', desc: 'Cross-check your project against the relevant municipality PDM and the regulation text you paste in. The 16 concelhos of the Algarve, each with its own quirks.', cta: 'Open the checker' },
        feasibility: { num: 'App 02', title: 'Land & Property Feasibility', desc: 'Can I build / extend / convert here? Combines zoning, cadastro, RAN/REN, coastal servitude (POOC), and flood risk into one pre-screening answer with a risk score.', cta: 'Open the feasibility tool' },
        licensing: { num: 'App 03', title: 'Licensing Process Navigator', desc: 'Track your camara process against RJUE baseline timelines, check off the instrutorio document list, and paste any notification in for a plain-language explanation.', cta: 'Open the navigator' },
        renovation: { num: 'App 04', title: 'Renovation Scope & Cost Estimator', desc: 'A ballpark EUR/m2 range for older Algarve properties plus a list of which items are likely exempt vs. likely to trigger a licenca. Useful for sanity-checking a project before commissioning real quotes.', cta: 'Open the estimator' },
        energy: { num: 'App 05', title: 'Energy Certificate Pre-Assessment', desc: 'A rough likely class range (A+ to F) for the property, before the certified perito visits. Useful for agents and sellers to set expectations and flag quick wins.', cta: 'Open the pre-assessment' }
      },
      services_section: {
        eyebrow: 'Professional services',
        title: 'When you need a real engineer on the ground.',
        desc: 'We do the work ourselves, in-house, with 20+ years of civil engineering experience in the Algarve. For adjacent services (architects, topographers, legal), we coordinate trusted partners so you do not have to run the procurement yourself.',
        s1_title: 'Construction oversight (fiscalizacao)', s1_p: 'Independent site supervision to protect the buyer interest: workmanship checks, schedule control, conformity with the licensed project.' },
        s2_title: 'Urban planning compliance', s2_p: 'Real (paid) version of App 01 - full PDM cross-check, pareceres, communications with the camara, due-diligence reports for buyers.' },
        s3_title: 'Licensing support', s3_p: 'End-to-end management of licenciamento, comunicacao previa, or PIP processes with the camara. Real version of App 03.' },
        s4_title: 'Renovation project management', s4_p: 'Brief, contractor selection, contract review, on-site coordination. Real version of App 04.' }
      },
      about_section: {
        eyebrow: 'About',
        title: 'Built by a civil engineer tired of seeing clients get hurt.',
        p1: 'The free apps exist because the same questions come up over and over with foreign buyers, small architecture studios, and small builders in the Algarve: "can I build here?", "how long will the camara take?", "is this renovation going to need a licenca?" - and the answers are scattered across 16 different PDMs, dozens of laws, and one camara that is slower than the next.',
        p2: 'The apps give you a fast, honest pre-screening. The professional services give you a real engineer. Both exist because nobody else is offering them in one place.'
      },
      faq_section: {
        eyebrow: 'FAQ',
        title: 'Common questions',
        q1: 'Are the apps really free?', a1: 'Yes. They run in your browser and use a small amount of AI credits per screening. No account, no payment, no email required to use the apps.' },
        q2: 'Are the apps a legal or professional determination?', a2: 'No. They are preliminary screening only. See our terms of use and the disclaimer in every app.' },
        q3: 'Do you store the data I type into the apps?', a3: 'Your last few screenings are saved in your browser localStorage (not on our servers) so you can come back to them. See the privacy policy.' },
        q4: 'I have a property in Lagos / Tavira / Silves - does the Compliance Checker work for my concelho?', a4: 'Yes, all 16 concelhos of the Algarve are covered. Accuracy depends on the regulation text you paste in - without it, the tool will flag what to check rather than invent numbers.' },
        q5: 'I am a non-resident buyer (UK / DE / NL / FR) - can you help?', a5: 'Yes, we work with non-resident buyers regularly. NIF, NISS, bank account opening, and the AIMA residency process are part of the support we coordinate with local solicitors and tax advisers.' }
      },
      contact_section: {
        eyebrow: 'Get in touch',
        title: 'Tell us about your project.',
        lead_h3: 'Request a quote or ask a question',
        lead_p: 'We reply within one working day. Algarve region, Portugal - also serving Lisbon and the Alentejo coast on request.'
      },
      cookies: {
        body: 'We use essential cookies (language, session) and - with your consent - measurement cookies. You can change your choice anytime in our <a href="/privacy.html">privacy policy</a>.',
        accept: 'Accept',
        decline: 'Essential only'
      },
      footer: {
  tag: 'Pre-screening apps and civil engineering services in the Algarve. Free apps - professional services on quote.',
  copy: '(c) 2026 WeconnectAi - Algarve, Portugal',
  apps_title: 'Free apps',
  services_title: 'Services',
  company_title: 'Company',
  privacy: 'Privacy',
  terms: 'Terms'
},
      forms: {
        name_ph: 'Your name',
        email_ph: 'Email',
        phone_ph: 'Phone / WhatsApp (optional)',
        msg_ph: 'Short description of the project, the property, where it is, and what you need.',
        send: 'Send',
        note: 'Submitting opens your email client with the message pre-filled. We never share your details. See our <a href="/privacy.html">privacy policy</a>.'
      }
    }
  };

  // ===== LANG =====
  function getLang(){
    return localStorage.getItem('wc-lang') || (navigator.language && navigator.language.toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en');
  }
  function setLang(lang){
    localStorage.setItem('wc-lang', lang);
    document.documentElement.lang = lang;
    applyStrings(lang);
    var btns = document.querySelectorAll('.wc-lang-btn');
    for (var i = 0; i < btns.length; i++){
      btns[i].classList.toggle('active', btns[i].dataset.lang === lang);
    }
  }
  function getNested(obj, path){
    var parts = path.split('.');
    var v = obj;
    for (var i = 0; i < parts.length; i++){ v = v && v[parts[i]]; }
    return typeof v === 'string' ? v : null;
  }
  function applyStrings(lang){
    var s = STRINGS[lang]; if (!s) return;
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++){
      var key = els[i].dataset.i18n;
      var v = getNested(s, key);
      if (v) els[i].textContent = v;
    }
    var htmls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmls.length; j++){
      var key2 = htmls[j].dataset.i18nHtml;
      var v2 = getNested(s, key2);
      if (v2) htmls[j].innerHTML = v2;
    }
    var phs = document.querySelectorAll('[data-i18n-ph]');
    for (var k = 0; k < phs.length; k++){
      var key3 = phs[k].dataset.i18nPh;
      var v3 = getNested(s, key3);
      if (v3) phs[k].setAttribute('placeholder', v3);
    }
  }

  // ===== MOBILE NAV =====
  function initMobileNav(){
    var toggle = document.querySelector('.wc-nav-toggle');
    var links = document.querySelector('.wc-nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
    var navLinks = document.querySelectorAll('.wc-nav-link');
    for (var i = 0; i < navLinks.length; i++){
      navLinks[i].addEventListener('click', function(){ links.classList.remove('open'); });
    }
  }

  // ===== COOKIES =====
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

  // ===== LEAD CAPTURE (Web3Forms) =====
window.wcSubmitLead = async function(form, source){
  if (!form) return false;
  var data = new FormData(form);
  var payload = {
    access_key: 'e29393bd-9c89-4ff0-af84-aeac777fd871',
    subject: 'WeconnectAi lead - ' + (source || 'contact'),
    from_name: 'WeconnectAi Site',
    replyto: data.get('email') || '',
    name: data.get('name') || '',
    email: data.get('email') || '',
    phone: data.get('phone') || '',
    topic: data.get('topic') || '',
    message: data.get('message') || '',
    source: source || 'unknown',
    page: location.pathname,
    lang: getLang()
  };

  try {
    var response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    var result = await response.json();
    if (result.success) {
      var ok = form.querySelector('.wc-lead-ok');
      if (!ok) {
        ok = document.createElement('p');
        ok.className = 'wc-lead-ok';
        ok.style.cssText = 'color:#B6862C;font-weight:600;padding:12px;background:#F1E4CE;border-radius:4px;margin-top:10px;';
        ok.textContent = 'Obrigado! Recebemos a sua mensagem e respondemos dentro de 1 dia util.';
        form.appendChild(ok);
      }
      form.reset();
    } else {
      throw new Error(result.message || 'Web3Forms error');
    }
  } catch (err) {
    var firstField = data.get('name') || data.get('email') || 'web';
    var subject = 'WeconnectAi lead - ' + (source || 'contact') + ' - ' + firstField;
    var lines = [];
    data.forEach(function(value, key){ if (value) lines.push(key + ': ' + value); });
    lines.push('', 'Source: ' + (source || 'unknown'), 'Page: ' + location.pathname, 'Lang: ' + getLang());
    var body = encodeURIComponent(lines.join('\n'));
    var to = 'geralfiscalia@proton.me';
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + body;
  }
  return false;
};

  // ===== AI HELPER =====
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

  // ===== LOCALSTORAGE HELPER =====
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

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function(){
    setLang(getLang());
    initMobileNav();
    initCookies();
    var btns = document.querySelectorAll('.wc-lang-btn');
    for (var i = 0; i < btns.length; i++){
      btns[i].addEventListener('click', function(e){ e.preventDefault(); setLang(this.dataset.lang); });
    }
  });
})();