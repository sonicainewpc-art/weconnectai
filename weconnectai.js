(function(){
'use strict';
var AI_PROXY_URL='https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';
var ANTHROPIC_URL=AI_PROXY_URL||'https://api.anthropic.com/v1/messages';
var S={
pt:{nav:{services:'Servicos',apps:'Apps gratuitas',about:'Sobre',contact:'Contacto',book:'Pedir orcamento'}},
en:{nav:{services:'Services',apps:'Free apps',about:'About',contact:'Contact',book:'Request a quote'}}
};
function getLang(){return localStorage.getItem('wc-lang')||'en';}
function setLang(l){localStorage.setItem('wc-lang',l);}
window.wcCallAI=async function(sp,uc){return 'AI is not configured in this simplified version. Please restore the full weconnectai.js with translations.';};
})();
