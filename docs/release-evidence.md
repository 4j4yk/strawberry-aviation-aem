# Release evidence

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

- AEM live: <https://main--strawberry-aviation-aem--4j4yk.aem.live/>
- AEM preview: <https://main--strawberry-aviation-aem--4j4yk.aem.page/>
- GraphQL gateway: <https://strawberry-catalog-gateway.ajaykhampariya14.workers.dev/graphql>
- Transactional Mage-OS reference: <https://store.ajayk.xyz/>

## Outstanding measurement

Chrome DevTools performance tracing could not be captured because the Chrome DevTools MCP connector is not
configured in the current Codex environment. No performance score is claimed without that measurement.
