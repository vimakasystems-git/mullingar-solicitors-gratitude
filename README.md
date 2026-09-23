# Nooney & Dowdall LLP â€” independent gratitude website

A responsive, five-language redesign proposal created as a thank-you for the service received. Independently published by Vimaka Sistemas Inteligentes. This is not the firm's official website and no firm endorsement is claimed.

## Run

Node.js 20+; no runtime dependencies.

```sh
npm run build
npm test
npm run dev
```

Preview: http://127.0.0.1:4173. Cloudflare entry: `dist/worker.mjs`. After authenticating Wrangler, deploy with `npx wrangler deploy`.

## Languages

`/en-IE/` (default), `/pt-BR/`, `/pl/`, `/ro/`, `/uk/`. Full server-rendered pages; language selection and disclosures work without JavaScript. Translations require qualified human review before official adoption. Website languages are not a claim of multilingual solicitor availability.

## Scope and publication

Seven practice categories, consultation preparation, costs explanation, official Irish resources, telephone/email/map links, privacy information and gratitude statement. Contact links point directly to the firm's published contact details. Includes an opt-in AI enquiry assistant using Cloudflare Workers AI (Llama 3.3 70B). No booking submission, automated legal advice, enquiry database, analytics or advertising cookies. Hosting necessarily processes connection data. The intake asks for non-identifying facts; name and contact fields are added separately on the client at review. Visitors are instructed not to provide confidential evidence, documents, third-party names or sensitive identifiers. No search indexing until the proposal is formally adopted. No changes to the original domain or website.

The hero image is an optimised local copy of the existing site's image, bundled with the Worker. The firm or its licensors retain image rights; original source is listed below. All CSS, client JavaScript and text are served by the Worker; system fonts avoid font-provider requests. A canvas mesh animates the original flock and its reflection, with pause/resume, reduced-motion support and automatic suspension off screen. It is a photo animation, not a generated video. The palette uses the original siteâ€™s #041562, #DA1212, #BAD7E9 and white.

## Sources checked 23 September 2026

- Firm identity, establishment, services, contact details and image: https://mullingarsolicitors.ie/
- Team: https://mullingarsolicitors.ie/about-us/
- Image: https://mullingarsolicitors.ie/wp-content/uploads/2024/02/NDSOL-banner-2-1-1536x864.png
- Costs: https://www.lsra.ie/for-law-professionals/your-legal-costs-duties/
- Advertising: https://www.lsra.ie/for-consumers/advertising-by-lawyers/
- Cookies: https://www.dataprotection.ie/en/dpc-guidance/guidance-cookies-and-other-tracking-technologies
- Firm privacy: https://mullingarsolicitors.ie/privacy-policy

Content is general information, not legal advice or a legal-compliance certification. No invented reviews, awards, success rates, response times, prices or language-service guarantees are included. Before official adoption the firm should review content, translations, publisher/controller details, image rights and its actual operational policies.

## Validation

`npm test` checks all five routes, page language, gratitude copy, internal anchors, contact links, security headers, default redirect, HEAD, invalid paths and disallowed methods. Manual browser checks cover layout, language switching and expandable FAQs. The Worker serves the image locally. AI messages use the Workers AI binding; no court API calls or outbound email delivery occur.

## AI intake and handover

- Model: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, via server-side AI binding.
- Opt-in before inference; conversation stays in browser memory, with no transcript storage, analytics or Worker logs. Cloudflare processes inference and hosting data; do not promise privilege, EU-only processing or complete absence of provider operational metadata.
- Collects general matter, location, chronology, visitor-stated deadlines, existing proceedings/representation, preferred language and requested help. Identity/conflict checks remain with the firm.
- English handover summary is editable. Name, email and telephone fields are not sent to the AI by the application.
- The visitor reviews and explicitly chooses an email draft addressed to reception@ndsol.ie, then sends it in their own email app. A text download provides a fallback. No automatic dispatch, CRM integration, email-delivery receipt, booking or allocation to an individual lawyer is claimed.
- Server enforces same origin, consent, role order, supported language/mode, body/message bounds, timeout and safe text output. No HTML from model responses is rendered.
- Workers rate limit bindings: 6 requests/minute per IP and 60/minute under a shared key per Cloudflare location. These are abuse controls, not a strict global billing cap. Workers AI may incur usage charges under the account plan.
- Local `npm run dev` is a visual preview; real inference requires the deployed Worker bindings. Unit tests use explicit mocked bindings; a separate live synthetic case verified real inference.

## Court integrations

Research did not locate a supported, documented public API for individual Irish case status. Added official High Court search, Courts Portal, judgments and record-access links. No scraping, credentials or private court data is used. Open court statistics are distinct from access to individual case files. See COURT-RESEARCH.md.

## Private client portal

The five-language `/portal/` adds administrator invitations and revocation, encrypted client documents, local upload, mobile photo-to-PDF scanning, server-calculated service estimates with VAT, solicitor approval and written costs notices, Stripe Checkout/webhook integration, appointment slots and private meeting links. Seven test groups now cover the website, AI intake and portal. See [PORTAL-SETUP.md](PORTAL-SETUP.md) for activation, provider setup, verified features and limitations.

No real administrator or client account has been created. Actual service rates, Stripe keys and Google Drive/Dropbox app identifiers must be supplied by the office. These external integrations stay disabled until configured. The database and encryption secrets are deployed; local uploads and scanning require an administrator-invited login. The private activation link is delivered outside Git.

The original five Node test groups cover routes and AI intake; two additional groups exercise the portal against SQLite. Live synthetic enquiries validate multilingual response and English handover; no test emails are sent to the practice.
