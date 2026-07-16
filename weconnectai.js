(function(){
'use strict';
var AI_PROXY_URL='https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';
var ANTHROPIC_URL=AI_PROXY_URL||'https://api.anthropic.com/v1/messages';
var S={
pt:{
nav:{services:'Servicos',apps:'Apps gratuitas',about:'Sobre',contact:'Contacto',book:'Pedir orcamento'},
hero:{eyebrow:'Algarve - Portugal',title:'Pre-triagem e engenharia civil para o Algarve',lede:'Cinco apps gratuitas com IA para verificar uma propriedade, planear uma renovacao ou licenciamento.',cta_apps:'Experimentar as apps',cta_quote:'Pedir orcamento'},
contact_section:{eyebrow:'Contacto',title:'Fale-nos do seu projeto.',lead_h3:'Pedir orcamento',lead_p:'Respondemos dentro de 1 dia util.'},
footer:{tag:'Apps de pre-triagem e engenharia civil no Algarve.',copy:'2026 WeconnectAi',privacy:'Privacidade',terms:'Termos'}
},
en:{
nav:{services:'Services',apps:'Free apps',about:'About',contact:'Contact',book:'Request a quote'},
hero:{eyebrow:'Algarve - Portugal',title:'Pre-screening and civil engineering for the Algarve',lede:'Five free AI apps to check a property, plan a renovation, or track a licensing process.',cta_apps:'Try the free apps',cta_quote:'Request a quote'},
contact_section:{eyebrow:'Get in touch',title:'Tell us about your project.',lead_h3:'Request a quote',lead_p:'We reply within one working day.'},
footer:{tag:'Pre-screening apps and civil engineering in the Algarve.',copy:'2026 WeconnectAi',privacy:'Privacy',terms:'Terms'}
}
};
function getLang(){return localStorage.getItem('wc-lang')||'en';}
function setLang(l){localStorage.setItem('wc-lang',l);}
window.wcCallAI=async function(sp,uc){return 'AI is not configured in this simplified version. Please restore the full weconnectai.js with translations.';};

