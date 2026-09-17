# Release evidence

## 2026-09-16 experience reset

- Repository head: `e260602` (`main`).
- AEM preview: rebuilt shell, all five landmarks, all blocks and footer browser-verified without console errors.
- Production origin: versioned `scripts.js` and `styles.css` confirmed over HTTP.
- Production CDN Worker: version `ace5c05b-1350-4545-aa8e-9e1a6f0416d4` deployed on `aviation.ajayk.xyz/*` with a versioned origin cache key.

## 2026-09-17 production stabilization

- Commit `53791b3` makes the exploded-part block use the reviewed local NavCore illustration instead of an inconsistent authored document image.
- Commit `450d6a4` prevents a zero-value upstream record from being presented as a credible selling price; the live card now says `Price pending data review` and the catalog status reports the review count.
- Contract tests: 12 passed; JavaScript and CSS lint passed.
- The AEM origin served the revised block module with the local media path and reduced-motion control behavior.
- The custom domain visually rendered the corrected exploded assembly after Worker version `41333e2c-9e7a-497a-98f4-28e76a098701` was deployed.
- The custom domain catalog reported `Live inventory · 10 parts`; the zero-price data-quality presentation is awaiting the final cache-key deployment and browser check.
- Open evidence gate: a fresh production-browser performance/accessibility trace and final product photography beyond the reviewed showcase illustration.

Evidence captured on 2026-09-10 for commit `6b0685b` and the independently authored DA content source.

| Gate | Result |
| --- | --- |
| AEM preview | HTTP 200; all five custom blocks present |
| AEM live | HTTP 200; all five custom blocks present |
| Mage-OS catalog | `SAR-90-200` returned 10 live products |
| Compatibility switch | `SVJ-40B` returned 7 live products |
| Catalog gateway health | HTTP 200 |
| CORS | Approved AEM origin allowed; unapproved origin rejected with HTTP 403 |
| Mage-OS forced outage | `CURATED_SNAPSHOT` returned with timestamp `2026-09-10T00:00:00.000Z` |
| Snapshot actions | Product anchors removed and marked `aria-disabled` |
| Interactive blocks | Compatibility, product disclosure and architecture-path controls verified in browser |
| Source checks | ESLint, Stylelint, Node contract tests, Worker dry-run and TypeScript passed |
| GitHub Actions | Build workflow `34511111465` passed |
| Dependency audit | 0 production or development vulnerabilities after safe updates |

## Published services

- Production domain: <https://aviation.ajayk.xyz/>
- AEM live origin: <https://main--strawberry-aviation-aem--4j4yk.aem.live/>

## Custom domain

- Cloudflare proxied CNAME: `aviation.ajayk.xyz` -> `main--strawberry-aviation-aem--4j4yk.aem.live`
- Dedicated Worker: `strawberry-aviation-aem-cdn`
- Worker route: `aviation.ajayk.xyz/*`
- The Worker forwards `X-Forwarded-Host`, enables AEM push invalidation, preserves approved media/JSON query parameters, and removes the upstream `Age` header.
- The automotive `aem-demo.ajayk.xyz` domain and its Worker were not changed.
- Verified 2026-09-15: the production domain rendered `Strawberry Aviation Supply | Composable AEM and Mage-OS Demo` and exposed the expected Mage-OS links.
- AEM preview: <https://main--strawberry-aviation-aem--4j4yk.aem.page/>
- GraphQL gateway: <https://strawberry-catalog-gateway.ajaykhampariya14.workers.dev/graphql>
- Transactional Mage-OS reference: <https://store.ajayk.xyz/>

## Outstanding measurement

Chrome DevTools performance tracing could not be captured because the Chrome DevTools MCP connector is not
configured in the current Codex environment. No performance score is claimed without that measurement.
