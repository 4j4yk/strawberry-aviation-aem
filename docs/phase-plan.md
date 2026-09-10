# Delivery phases and acceptance

| Phase | Deliverable | Current repository status |
| --- | --- | --- |
| 0 | Independent repository, architecture boundaries and budgets | Published to GitHub; CI passing |
| 1 | Flightline design tokens, motion loader and authorable block shells | Published on AEM preview and live |
| 2 | Live Mage-OS catalog through a bounded GraphQL gateway | Deployed and verified with live Mage-OS data |
| 3 | Dated static fallback with transactions disabled | Forced-outage and non-transactional link behavior verified |
| 4 | Secure product handoff to the Mage-OS reference storefront | Published and browser-verified with bounded product URLs |
| 5 | Compatibility, exploded part, AOG timeline and architecture motion blocks | Authored, published and interaction-verified |
| 6 | Accessibility, performance, CORS, uptime and production evidence | Semantic browser tree, CORS, gateway health and CI verified; DevTools trace pending |

No phase is accepted solely because source code exists. The specialized Chrome DevTools performance trace remains a
separate gate because that MCP connector is not configured in the current Codex environment. The automotive
`aem-demo` repository and domain remain explicitly outside this project.
