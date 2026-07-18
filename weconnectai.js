(function(){
'use strict';
var AI_PROXY_URL='https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';
var ANTHROPIC_URL=AI_PROXY_URL;
var S={
pt:{
nav:{services:'Servicos',apps:'Apps gratuitas',about:'Sobre',contact:'Contacto',book:'Pedir orcamento'},
hero:{eyebrow:'Algarve - Portugal',title:'Pre-triagem e engenharia civil para o Algarve',lede:'Cinco apps gratuitas com IA para o seu projeto.',cta_apps:'Experimentar as apps',cta_quote:'Pedir orcamento'},
app:{
compliance:{num:'App 01',title:'Verificador de Conformidade do Algarve',desc:'Cruze o seu projeto com o PDM do municipio relevante.',cta:'Abrir o verificador'},
feasibility:{num:'App 02',title:'Viabilidade do Terreno e Propriedade',desc:'Posso construir ou ampliar aqui?',cta:'Abrir ferramenta de viabilidade'},
licensing:{num:'App 03',title:'Navegador de Licenciamento',desc:'Acompanhe o processo na camara contra os prazos RJUE.',cta:'Abrir o navegador'},
renovation:{num:'App 04',title:'Estimador de Renegociacao',desc:'Faixa de EUR/m2 aproximada para propriedades do Algarve.',cta:'Abrir o estimador'},
energy:{num:'App 05',title:'Pre-Avaliacao Certificado Energetico',desc:'Faixa provavel de classe energetica (A+ a F).',cta:'Abrir pre-avaliacao'}
},
contact_section:{eyebrow:'Contacto',title:'Fale-nos do seu projeto.',lead_h3:'Pedir orcamento',lead_p:'Respondemos dentro de 1 dia util.'},
footer:{tag:'Apps de pre-triagem e engenharia civil no Algarve.',copy:'2026 WeconnectAi',privacy:'Privacidade',terms:'Termos',apps_title:'Apps gratuitas',services_title:'Servicos',company_title:'Empresa'},
form:{
project_params:'Parametros do projeto',
municipality:'Municipio (concelho)',
parish:'Freguesia / localizacao',
parish_ph:'ex. Almancil, Quarteira...',
plot_area:'Area do terreno (m2)',
intended_use:'Uso pretendido',
use_residential:'Residencial (moradia unifamiliar)',
floor_area:'Area de pavimento (m2)',
height:'Altura (m)',
floors:'Pisos acima do solo',
setback_front:'Afastamento - frente (m)',
setback_side:'Afastamento - lateral (m)',
setback_rear:'Afastamento - tardoz (m)',
ran_ren:'Estado RAN / REN',
ran_no:'Fora de RAN ou REN',
ran_hint:'Reserva Agricola / Ecologica Nacional.',
regulation_text:'Texto do regulamento PDM (recomendado)',
regulation_ph:'Cole as clausulas aplicaveis...',
regulation_hint:'A precisao depende do texto que fornecer.',
run_button:'Executar triagem de conformidade',
findings:'Site envelope e resultados',
empty_state:'Preencha os parametros e execute a triagem.'
},
lead:{review_title:'Quer um engenheiro a rever esta triagem?',review_text:'Versao paga: verificacao completa do PDM, relatorio escrito.'}
},
en:{
nav:{services:'Services',apps:'Free apps',about:'About',contact:'Contact',book:'Request a quote'},
hero:{eyebrow:'Algarve - Portugal',title:'Pre-screening and civil engineering for the Algarve',lede:'Five free AI apps for your project.',cta_apps:'Try the free apps',cta_quote:'Request a quote'},
app:{
compliance:{num:'App 01',title:'Algarve Compliance Checker',desc:'Cross-check your project against the relevant municipality PDM.',cta:'Open the checker'},
feasibility:{num:'App 02',title:'Land & Property Feasibility',desc:'Can I build or extend here?',cta:'Open the feasibility tool'},
licensing:{num:'App 03',title:'Licensing Process Navigator',desc:'Track your camara process against RJUE timelines.',cta:'Open the navigator'},
renovation:{num:'App 04',title:'Renovation Scope & Cost Estimator',desc:'Ballpark EUR/m2 range for Algarve properties.',cta:'Open the estimator'},
energy:{num:'App 05',title:'Energy Certificate Pre-assessment',desc:'Likely energy class range (A+ to F).',cta:'Open the pre-assessment'}
},
contact_section:{eyebrow:'Get in touch',title:'Tell us about your project.',lead_h3:'Request a quote',lead_p:'We reply within one working day.'},
footer:{tag:'Pre-screening apps and civil engineering in the Algarve.',copy:'2026 WeconnectAi',privacy:'Privacy',terms:'Terms',apps_title:'Free apps',services_title:'Services',company_title:'Company'},
form:{
project_params:'Project parameters',
municipality:'Municipality (concelho)',
parish:'Parish / location',
parish_ph:'e.g. Almancil, Quarteira...',
plot_area:'Plot area (m2)',
intended_use:'Intended use',
use_residential:'Residential (single-family)',
floor_area:'Floor area (m2)',
height:'Height (m)',
floors:'Floors above ground',
setback_front:'Setback - front (m)',
setback_side:'Setback - side (m)',
setback_rear:'Setback - rear (m)',
ran_ren:'RAN / REN status',
ran_no:'Not in RAN or REN',
ran_hint:'National Agricultural / Ecological Reserve.',
regulation_text:'Relevant PDM / regulation text (recommended)',
regulation_ph:'Paste the applicable clauses...',
regulation_hint:'The analysis is only as accurate as the text you provide.',
run_button:'Run compliance screening',
findings:'Site envelope & findings',
empty_state:'Fill in the project parameters and run a screening.'
},
lead:{review_title:'Want a real engineer to review this screening?',review_text:'Paid version: full PDM cross-check, written report.'}
}
};
function getLang(){return localStorage.getItem('wc-lang')||'en';}
function setLang(l){localStorage.setItem('wc-lang',l);document.documentElement.lang=l;applyStrings(l);var b=document.querySelectorAll('.wc-lang-btn');for(var i=0;i<b.length;i++){b[i].classList.toggle('active',b[i].dataset.lang===l);}}
function gv(o,p){var ps=p.split('.');var v=o;for(var i=0;i<ps.length;i++){v=v&&v[ps[i]];}return typeof v==='string'?v:null;}
function applyStrings(l){var s=S[l];if(!s)return;var e=document.querySelectorAll('[data-i18n]');for(var i=0;i<e.length;i++){var v=gv(s,e[i].dataset.i18n);if(v)e[i].textContent=v;}var h=document.querySelectorAll('[data-i18n-html]');for(var j=0;j<h.length;j++){var v2=gv(s,h[j].dataset.i18nHtml);if(v2)h[j].innerHTML=v2;}var p=document.querySelectorAll('[data-i18n-ph]');for(var k=0;k<p.length;k++){var v3=gv(s,p[k].dataset.i18nPh);if(v3)p[k].setAttribute('placeholder',v3);}}
function initNav(){var t=document.querySelector('.wc-nav-toggle');var l=document.querySelector('.wc-nav-links');if(!t||!l)return;t.addEventListener('click',function(){l.classList.toggle('open');});}
function initCookies(){var b=document.querySelector('.wc-cookies');if(!b)return;var d=localStorage.getItem('wc-cookies');if(d){b.classList.add('hidden');return;}b.classList.remove('hidden');var a=b.querySelector('[data-cookie-accept]');var x=b.querySelector('[data-cookie-decline]');if(a)a.addEventListener('click',function(){localStorage.setItem('wc-cookies','accept');b.classList.add('hidden');});if(x)x.addEventListener('click',function(){localStorage.setItem('wc-cookies','decline');b.classList.add('hidden');});}
window.wcSubmitLead=async function(form,source){if(!form)return false;var data=new FormData(form);var payload={access_key:'e29393bd-9c89-4ff0-af84-aeac777fd871',subject:'WeconnectAi lead',from_name:'WeconnectAi Site',replyto:data.get('email')||'',name:data.get('name')||'',email:data.get('email')||'',phone:data.get('phone')||'',topic:data.get('topic')||'',message:data.get('message')||'',source:source||'unknown',page:location.pathname,lang:getLang()};try{var response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});var result=await response.json();if(result.success){var ok=form.querySelector('.wc-lead-ok');if(!ok){ok=document.createElement('p');ok.className='wc-lead-ok';ok.style.cssText='color:#B6862C;font-weight:600;padding:12px;background:#F1E4CE;border-radius:4px;margin-top:10px;';ok.textContent='Obrigado! Recebemos a sua mensagem.';form.appendChild(ok);}form.reset();}else{throw new Error(result.message||'Web3Forms error');}}catch(err){var ff=data.get('name')||data.get('email')||'web';var s='WeconnectAi lead - '+(source||'contact')+' - '+ff;var lines=[];data.forEach(function(v,k){if(v)lines.push(k+': '+v);});lines.push('','Source: '+(source||'unknown'),'Page: '+location.pathname,'Lang: '+getLang());var b=encodeURIComponent(lines.join('\n'));window.location.href='mailto:geralfiscalia@proton.me?subject='+encodeURIComponent(s)+'&body='+b;}return false;};
window.wcCallAI=async function(sp,uc){var r=await fetch(ANTHROPIC_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1200,system:sp,messages:[{role:'user',content:uc}]})});var d=await r.json();var t='';if(d&&d.content){for(var i=0;i<d.content.length;i++){if(d.content[i].text)t+=d.content[i].text+'\n';}}t=t.replace(/\json/g,'');t=t.replace(/\/g,'');return t.trim();};
window.wcStore={set:function(k,v){try{localStorage.setItem('wc:'+k,JSON.stringify({value:v,ts:Date.now()}));}catch(e){}},get:function(k){try{var r=localStorage.getItem('wc:'+k);if(!r)return null;var p=JSON.parse(r);return p&&p.value;}catch(e){return null;}},list:function(p){var o=[];try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('wc:'+p)===0)o.push(k.substring(3));}}catch(e){}return o.sort().reverse();},delete:function(k){try{localStorage.removeItem('wc:'+k);}catch(e){}}};
document.addEventListener('DOMContentLoaded',function(){setLang(getLang());initNav();initCookies();var b=document.querySelectorAll('.wc-lang-btn');for(var i=0;i<b.length;i++){b[i].addEventListener('click',function(e){e.preventDefault();setLang(this.dataset.lang);});}});
})();
