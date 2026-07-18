Set-Location "C:\Users\Sonia\Documents\FISCALIA antigo\WEBSITE\weconnectai"
Remove-Item weconnectai.js -ErrorAction SilentlyContinue
"(function(){" | Out-File -Encoding utf8 weconnectai.js
"'use strict';" | Out-File -Append -Encoding utf8 weconnectai.js
"var AI_PROXY_URL='https://weconnectai-ai-proxy.sonia-weconnectai.workers.dev';" | Out-File -Append -Encoding utf8 weconnectai.js
"var ANTHROPIC_URL=AI_PROXY_URL;" | Out-File -Append -Encoding utf8 weconnectai.js
"var S={pt:{},en:{}};" | Out-File -Append -Encoding utf8 weconnectai.js
"S.pt.nav={services:'Servicos',apps:'Apps gratuitas',about:'Sobre',contact:'Contacto',book:'Pedir orcamento'};" | Out-File -Append -Encoding utf8 weconnectai.js
"S.en.nav={services:'Services',apps:'Free apps',about:'About',contact:'Contact',book:'Request a quote'};" | Out-File -Append -Encoding utf8 weconnectai.js
"function getLang(){return localStorage.getItem('wc-lang')||'en';}" | Out-File -Append -Encoding utf8 weconnectai.js
"function setLang(l){localStorage.setItem('wc-lang',l);}" | Out-File -Append -Encoding utf8 weconnectai.js
"function gv(o,p){var ps=p.split('.');var v=o;for(var i=0;i<ps.length;i++){v=v&&v[ps[i]];}return typeof v==='string'?v:null;}" | Out-File -Append -Encoding utf8 weconnectai.js
"function applyStrings(l){var s=S[l];if(!s)return;var e=document.querySelectorAll('[data-i18n]');for(var i=0;i<e.length;i++){var v=gv(s,e[i].dataset.i18n);if(v)e[i].textContent=v;}}" | Out-File -Append -Encoding utf8 weconnectai.js
"})();" | Out-File -Append -Encoding utf8 weconnectai.js
Write-Host "Parte 1 OK. Linhas:" (Get-Content weconnectai.js).Count
Set-Location "C:\Users\Sonia\Documents\FISCALIA antigo\WEBSITE\weconnectai"
$lines = @(
"S.pt.form={project_params:'Parametros do projeto',municipality:'Municipio (concelho)',parish:'Freguesia / localizacao',parish_ph:'ex. Almancil, Quarteira',plot_area:'Area do terreno (m2)',intended_use:'Uso pretendido',use_residential:'Residencial (moradia unifamiliar)',floor_area:'Area de pavimento (m2)',height:'Altura (m)',floors:'Pisos acima do solo',setback_front:'Afastamento - frente (m)',setback_side:'Afastamento - lateral (m)',setback_rear:'Afastamento - tardoz (m)',ran_ren:'Estado RAN / REN',ran_no:'Fora de RAN ou REN',ran_hint:'Reserva Agricola / Ecologica Nacional.',regulation_text:'Texto do regulamento PDM (recomendado)',regulation_ph:'Cole as clausulas aplicaveis',regulation_hint:'A precisao depende do texto que fornecer.',run_button:'Executar triagem de conformidade',findings:'Resultados da triagem',empty_state:'Preencha os parametros e execute a triagem.'};"
"S.en.form={project_params:'Project parameters',municipality:'Municipality (concelho)',parish:'Parish / location',parish_ph:'e.g. Almancil, Quarteira',plot_area:'Plot area (m2)',intended_use:'Intended use',use_residential:'Residential (single-family)',floor_area:'Floor area (m2)',height:'Height (m)',floors:'Floors above ground',setback_front:'Setback - front (m)',setback_side:'Setback - side (m)',setback_rear:'Setback - rear (m)',ran_ren:'RAN / REN status',ran_no:'Not in RAN or REN',ran_hint:'National Agricultural/Ecological Reserve.',regulation_text:'Relevant PDM / regulation text (recommended)',regulation_ph:'Paste the applicable clauses',regulation_hint:'The analysis is only as accurate as the text you provide.',run_button:'Run compliance screening',findings:'Site envelope and findings',empty_state:'Fill in the project parameters and run a screening.'};"
)
$lines | Out-File -Append -Encoding utf8 weconnectai.js
Write-Host "Parte 2 OK. Linhas:" (Get-Content weconnectai.js).Count
Select-String -Path weconnectai.js -Pattern "form.project_params"