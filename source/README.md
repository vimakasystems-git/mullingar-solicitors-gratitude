# Original site import

Fetched 23 September 2026 from https://mullingarsolicitors.ie/ using its public WordPress REST API and original homepage navigation. Cross-checked the page, post and category XML sitemaps.

- 26 published pages, including the homepage, and 15 published articles.
- `site.json`: original nested menu, image URL allowlist and page manifest.
- `pages/*.json`: page titles, source URL, modification date and sanitised content.
- `wordpress-export.part1.b64` through `part3.b64`: concatenate, base64-decode and gunzip to restore the complete original REST content export. These are archival source data, never executed or exposed as application routes.

Original content and imagery remain the property of the practice and their respective owners. This is an independent proposal, not an approved practice website. Imported pages retain English source content; the existing homepage and portal still provide five languages. The redesign homepage remains the landing page; the original homepage content is included in the source archive. All other original pages and articles have individual `/en-IE/…` routes. Unprefixed original paths redirect to their project equivalents. The original blog alias `/?page_id=1823` and `/category/uncategorized/` are supported. `/en-IE/site-map/` lists all imported pages and articles.

Scripts, inline event handlers, forms, embedded frames and original styling are removed. Internal links and image references are rewritten. Images are fetched server-side through a fixed allowlist, so visitors do not contact the source website directly for those images. Native accessible navigation replaces the original menu scripts. The source privacy and cookie policies are labelled as the practice's source material, not this portal's current policies. Article legal claims and dates have not been reviewed for present-day accuracy.
