# Nooney & Dowdall LLP — independent gratitude website

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

Seven practice categories, consultation preparation, costs explanation, official Irish resources, telephone/email/map links, privacy information and gratitude statement. Contact links point directly to the firm's published contact details. No booking submission, chat agent, legal advice automation, enquiry database, analytics or advertising cookies. Hosting necessarily processes connection data. No forms collect confidential information. No search indexing until the proposal is formally adopted. No changes to the original domain or website.

The hero image is an optimised local copy of the existing site's image, bundled with the Worker. The firm or its licensors retain image rights; original source is listed below. All CSS and text are served by the Worker; system fonts avoid font-provider requests.

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

`npm test` checks all five routes, page language, gratitude copy, internal anchors, contact links, security headers, default redirect, HEAD, invalid paths and disallowed methods. Manual browser checks cover layout, language switching and expandable FAQs. The Worker serves the image locally and makes no outbound requests.

