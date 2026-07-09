`

# WeconnectAi — site estático bilingue

Site estático (PT/EN) com 5 apps gratuitas de pré-triagem para projetos no Algarve + formulário de contacto para vender serviços de engenharia civil e fiscalização.

## Estrutura
weconnectai/

├── index.html Landing (hero + 5 apps + serviços + contacto)

├── weconnectai.css Design system partilhado

├── weconnectai.js i18n PT/EN, nav, cookies, lead capture, AI proxy helper

├── netlify.toml Configuração do Netlify (headers, cache, CSP)

├── privacy.html Política de privacidade (RGPD/GDPR)

├── terms.html Termos de uso

├── worker.js Cloudflare Worker (proxy seguro para a Anthropic API)

├── wrangler.toml Configuração do Worker

└── apps/

├── compliance.html App 1 — Compliance Checker

├── feasibility.html App 2 — Feasibility Pre-screening

├── licensing.html App 3 — Licensing Process Navigator

├── renovation.html App 4 — Renovation Scope & Cost Estimator

└── energy.html App 5 — Energy Certificate Pre-Assessment