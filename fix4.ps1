Set-Location "C:\Users\Sonia\Documents\FISCALIA antigo\WEBSITE\weconnectai"
$lines = @(
"S.pt.hero={eyebrow:'Algarve - Portugal',title:'Pre-triagem e engenharia civil para o Algarve',lede:'Cinco apps gratuitas com IA para o seu projeto.',cta_apps:'Experimentar as apps',cta_quote:'Pedir orcamento'};"
"S.pt.contact_section={eyebrow:'Contacto',title:'Fale-nos do seu projeto.',lead_h3:'Pedir orcamento',lead_p:'Respondemos dentro de 1 dia util.'};"
"S.pt.footer={tag:'Apps de pre-triagem no Algarve.',copy:'2026 WeconnectAi',privacy:'Privacidade',terms:'Termos',apps_title:'Apps gratuitas',services_title:'Servicos',company_title:'Empresa'};"
"S.pt.lead={review_title:'Quer um engenheiro a rever esta triagem?',review_text:'Versao paga: verificacao completa do PDM, relatorio escrito.'};"
"S.en.hero={eyebrow:'Algarve - Portugal',title:'Pre-screening and civil engineering for the Algarve',lede:'Five free AI apps for your project.',cta_apps:'Try the free apps',cta_quote:'Request a quote'};"
"S.en.contact_section={eyebrow:'Get in touch',title:'Tell us about your project.',lead_h3:'Request a quote',lead_p:'We reply within one working day.'};"
"S.en.footer={tag:'Pre-screening apps in the Algarve.',copy:'2026 WeconnectAi',privacy:'Privacy',terms:'Terms',apps_title:'Free apps',services_title:'Services',company_title:'Company'};"
"S.en.lead={review_title:'Want a real engineer to review this screening?',review_text:'Paid version: full PDM cross-check, written report.'};"
)
$lines | Out-File -Append -Encoding utf8 weconnectai.js
Write-Host "Parte 4 OK. Linhas:" (Get-Content weconnectai.js).Count