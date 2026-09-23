# Client portal: activation and operations

Portal: https://mullingar-solicitors-gratitude.vimakasystems.workers.dev/portal/

This is an independent gratitude project, not an endorsed production service of the practice. The practice must adopt the service, establish the publisher/office data-processing arrangements, privacy notice, retention policy and operational ownership before real client matters are entered. The implementation is tested but has not received an independent security audit. No real client records, service prices, payment credentials or administrator passwords were seeded.

## Activate the administrator

The publisher receives a private local `ADMIN-SETUP.md` outside this repository. Its one-use setup link lets the intended administrator choose their own email and password. The public portal offers no self-registration. The setup endpoint stops working after the first administrator exists. Delete the `PORTAL_SETUP_TOKEN` Worker secret after activation.

Under Administration, invite a client by name and email. Deliver the private link through an agreed channel; the application does not automatically email invitations. Invitations expire after 48 hours and are single-use. The client enters the matching email and chooses a password of at least 12 characters. Re-invite to reset a client's password; activation revokes existing sessions. Revoke access to immediately disable the client and remove their sessions and invitations. Administrator password recovery requires an authenticated infrastructure operator; there is no public recovery bypass.

## Fees and payments

Add the office's genuine services, billing unit, unit price excluding VAT, and applicable VAT percentage. The form initially suggests 23%, the Irish standard rate at implementation, but the solicitor must confirm the applicable treatment. Prices are stored in integer euro cents; calculations and VAT rounding occur on the server. Existing estimates keep their original amounts if catalogue prices change.

Clients request an estimate. An administrator supplies the complete applicable written costs notice and engagement information before approving it. A calculator is not a substitute for section 150 duties. This version calculates service fee plus VAT; disbursements and other adjustments need a separately agreed, correctly priced service/estimate. There is no automatic time tracking, invoice numbering, refunds or client-money ledger.

To enable Stripe, the office must provide its own approved Stripe account. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` using the Cloudflare secret UI or `wrangler secret put`; never enter them in the public integration settings or commit them. First use Stripe test-mode keys and complete an end-to-end test with the office account. Register:

`https://mullingar-solicitors-gratitude.vimakasystems.workers.dev/api/portal/stripe-webhook`

Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Only a valid timestamped Stripe signature, matching Checkout ID, EUR currency, exact approved total and paid status can mark the estimate paid. A checkout redirect alone never confirms payment. Checkout is hosted by Stripe; the application stores no card details. In the present deployment payment buttons stay disabled because no payment keys have been supplied. Payment is for approved fees, not escrow or client funds. Expired Checkout sessions require a fresh estimate in this initial version.

References: [LSRA costs duties](https://www.lsra.ie/for-law-professionals/your-legal-costs-duties/), [Revenue legal services](https://www.revenue.ie/en/vat/vat-on-services/professional-services/legal-services.aspx), [Revenue VAT rates](https://www.revenue.ie/en/vat/vat-rates/search-vat-rates/current-VAT-rates.aspx), [Stripe Checkout](https://docs.stripe.com/api/checkout/sessions/create), [Stripe signatures](https://docs.stripe.com/webhooks/signature).

## Appointments and meetings

Administrators open slots using Europe/Dublin local time. Non-existent and ambiguous daylight-saving times are rejected. The database prevents overlapping slots and duplicate active bookings. Clients see available slots and their own bookings; cancellation frees the slot. They can download a private calendar event.

Create the actual meeting in the office's Google Meet, Microsoft Teams or Zoom account and enter its HTTPS link when opening the slot. The portal does not provision a video room or synchronise a calendar provider. Meeting links appear only to the booked client and administrator. No booking email is automatically sent. The app currently assumes one shared office appointment calendar.

## Files, scanning, Google Drive and Dropbox

Local upload and phone photo capture work without third-party app credentials. Photo scanning supports rotation, margin crop, grayscale and up to 10 pages combined into a PDF. Image rendering strips the original photo metadata; it does not perform OCR or automatic perspective correction. Native camera behaviour depends on the mobile browser. Maximum 5 MiB per file, 25 MiB and 50 active files per client. PDF, JPEG, PNG and WebP are recognised by their file signatures. Files are not malware-scanned.

The initial Cloudflare account has not enabled R2. Documents therefore use AES-256-GCM encryption in the Worker and chunked BLOBs in D1, with unique nonces and document/owner-bound authenticated data. The D1 database was created with EU jurisdiction. This does not by itself guarantee all processing, backups or connected providers remain in the EU. The secret `PORTAL_VAULT_KEY` is required for decryption. Preserve it in a secure secret manager with `PORTAL_PEPPER`; losing either affects document/password recovery. Do not rotate these values without a migration. Deletion removes active chunks; hosting backups may retain previous versions. Establish a retention and backup policy before real use. D1 capacity/Cloudflare account quotas still apply across the whole deployment; this is bounded storage for an initial portal, not an unlimited document management service.

Google Drive setup: create the office's Google Cloud project, enable Google Picker and Drive APIs, configure the OAuth consent screen and a web OAuth client. Authorise this site's exact HTTPS origin. Restrict the browser API key to that origin and the required APIs. Under Administration save the public `googleClientId`, `googleApiKey` and numeric project `googleAppId`. The picker requests `drive.file` scope; access tokens stay in browser memory and are revoked after selected-file import. Google Docs can be exported to PDF. OAuth publishing/verification requirements are controlled by Google. [Google Picker guide](https://developers.google.com/workspace/drive/picker/guides/overview).

Dropbox setup: create an office-owned Dropbox app and allow this host as a Chooser domain, then save only its public `dropboxAppKey`. The Chooser supplies the selected file's temporary direct link. The app imports only that file into the private vault; this is not background folder synchronisation. [Dropbox Chooser](https://docs.dropboxapi.com/dropbox-api/docs/pre-built-components/chooser).

Both provider controls remain disabled until public app identifiers are configured. Their signed-in account flows could not be end-to-end tested without the office's registered apps. No chat connector installation is required for these website integrations.

## Security and deployment

Server-side client ownership checks apply to every private list/download/delete. Admin endpoints require the admin role. Sessions use hashed random tokens, Secure/HttpOnly/SameSite=Strict cookies, eight-hour expiry and server-side revocation. Passwords use PBKDF2-SHA256 with 100,000 iterations and unique salts after HMAC pre-hashing with a separate secret pepper. Same-origin checks protect mutations; Cloudflare rate limits protect authentication and writes. Sensitive responses are never cached. Audit records include actions and record IDs, not document bodies. No session or provider token uses localStorage. MFA, automatic malware scanning and comprehensive monitoring are not implemented.

Run `npm run build` and `npm test` with Node 22.14+ (tests use its experimental built-in SQLite). Tests cover client isolation, encrypted round-trip storage, oversized upload, CSRF, invitation reuse, session revocation, fee tampering, booking collisions, Dublin DST and signed payment confirmation. A local synthetic browser run also verified quote creation and photo-to-PDF upload. Production smoke tests verify the portal routes and unauthenticated access denial; no production administrator was created by the developer.

Apply `portal-schema.sql` to the bound D1 database before deployment. Configure `PORTAL_DB`, `PORTAL_LIMIT`, `PORTAL_SETUP_TOKEN`, `PORTAL_PEPPER`, `PORTAL_VAULT_KEY` along with the existing AI and intake rate-limit bindings. `wrangler.jsonc` contains public binding identifiers only. Keep all secrets out of Git and preserve them during deployments.
