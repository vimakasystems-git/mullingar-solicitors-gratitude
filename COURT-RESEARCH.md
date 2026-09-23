# Irish court integration research — 23 September 2026

No supported public developer API for individual case status was identified in the official sources searched. This is a research finding, not a claim that no private or partner interface exists. The data strategy discusses APIs, but does not itself document a generally available case-query service.

Available official services:

- https://www.courts.ie/high-court-search — search available High Court records by reference and other criteria. The page identifies a last-updated date; it should not be presented as universally real-time or covering every court.
- https://portal.courts.ie/ — court portal, with access depending on user role and permissions.
- https://www2.courts.ie/Judgments — published judgments, not a complete case-management feed.
- https://www.courts.ie/organisation-information/access-to-court-records — records are under judicial control; access may be limited to parties, representatives or permission-based access.
- https://www.courts.ie/news/courts-service-launches-pilot-open-data-portal — open data concerns aggregate statistics; it is not a substitute for individual case access.

Implemented: translated external resource links; no guessed endpoints, scraping or automated case lookup. A future supported integration requires the Courts Service's documented API/partner access and applicable access terms. The AI assistant has no access to court records and is instructed never to claim it has checked a case.
