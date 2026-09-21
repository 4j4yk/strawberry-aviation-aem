# Release evidence

## 2026-09-21 assistant scope guardrails

- Reproduced the reported failure in production: an instruction-override request for a Python DFS algorithm returned generated code with HTTP 200.
- Added server-side English/domain scope enforcement immediately after request parsing and before catalog access or Workers AI inference. Unsupported, mixed-scope, prompt-injection, coding, creative, unsafe-topic, and non-ASCII-confusable requests return a deterministic `policy-guardrail` response with `commerceSource: NOT_QUERIED`.
- Added output validation as defense in depth: generated text must be cited and domain-relevant and is discarded if it resembles code, prompt/credential disclosure, approval bypass, or maintenance instruction.
- Preserved normal parts, SKU, AOG, approval, catalog ownership, checkout, and demo-architecture questions. Added explicit coverage for architecture questions containing the words `algorithm` and `script`.
- Verification passed ESLint, Stylelint, 18 Node contract tests, Worker dry-run, TypeScript, and patch hygiene. A separate bypass review supplied additional mixed-prompt, Unicode-confusable, output-validation, and compatibility cases that are now regression-tested.
- Production API acceptance blocked the original DFS prompt and a mixed capital-of-France plus hydraulic-pump prompt without a commerce lookup; legitimate hydraulic-pump and gateway-snapshot questions still returned grounded deterministic responses and live Mage-OS facts where applicable.
- Production browser acceptance rendered the domain-scope response and no generated code for the original prompt. Versioned block imports were added so future block changes use explicit browser cache keys.
- Gateway Worker version `4516e282-9fc4-45aa-a2fe-71e42ec08056`; CDN Worker version `9866cfb4-8450-4058-b05b-69b0ef74983d`; repository release commit `a5b7906`.

## 2026-09-18 grounded parts assistant

- Implemented a site-wide `parts-assistant` block and a bounded `POST /assistant` gateway route.
- Retrieval uses six versioned approved passages; current product matches come from the existing read-only Mage-OS catalog adapter.
- Workers AI synthesis is constrained by supplied evidence, while citations are attached by the server independently of model output.
- The endpoint enforces bounded input, exact-origin CORS, no-store responses, read-only/fictitious/human-approval boundaries, and deterministic generation fallback.
- Local end-to-end verification returned a Workers AI response, three citations, live Mage-OS facts, and the AeroFlow Hydraulic Pump match for `SAR-90-200`.
- Source verification passed 16 Node tests, ESLint, Stylelint, TypeScript, Worker dry-run, and a 34.5 ms active local startup profile.
- Commit `6c27b85` introduced the assistant API and UI; follow-up commits `f62fa8b`, `c5cb8fd`, and `55a0eae` corrected AEM insertion timing and explicit asset versioning discovered through production-browser acceptance.
- Catalog gateway Worker version `c284b6f0-44e9-42c1-88a6-8f031fdedf77` deployed the Workers AI binding and `POST /assistant` route.
- CDN Worker version `7887a54a-c628-4723-a0bd-f9916291db10` deployed the final AEM cache key.
- Production API acceptance returned HTTP 200, `generatedBy: workers-ai`, `commerceSource: LIVE_MAGE_OS`, three approved citations, the AeroFlow product match, and explicit read-only/fictitious/human-approval boundaries. Unapproved-origin preflight returned HTTP 403.
- Custom-domain browser acceptance confirmed the assistant between Assembly and AOG Support; its submitted response rendered live product links, three citation links, and only the governed AOG handoff.

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
- Worker version `57b30420-fc5d-4f9d-936c-b66e011ff1bc` deployed cache key `aem-experience-reset-2026-09-17-2` to `aviation.ajayk.xyz/*`.
- Final custom-domain browser acceptance reported `Live inventory · 10 parts`; all ten prices were non-zero, including ClearCom Pilot Headset at `$895.00` and in stock. The zero-price guard is source-tested but was not exercised by that healthy production response.
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
