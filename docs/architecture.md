# Solution architecture

## System ownership

| Fact or behavior | Owner | Storefront treatment |
| --- | --- | --- |
| Editorial content and page composition | AEM Edge Delivery / DA.live | Server-delivered HTML enhanced by blocks |
| Products, public prices and sellability | Mage-OS Minimal 3.4.0 | Read through the catalog gateway |
| Search index | Mage-OS OpenSearch | Queried behind Mage-OS catalog services |
| Aircraft compatibility and AOG eligibility | Strawberry Mage-OS module | Sanitized read-only catalog fields |
| Cart, customer, approval and order | Mage-OS | Secure handoff to the Luma reference store |
| Fallback product cards | This repository | Dated snapshot; never transactional |
| Assistant guidance and citations | Cloudflare Worker plus approved repository knowledge | Read-only, bounded and visibly fictional |

## Live request

```text
Browser -> AEM block -> GraphQL gateway -> public Strawberry REST adapter -> Mage-OS services -> OpenSearch
```

The browser does not receive administrative credentials. The gateway accepts only bounded public queries. Mage-OS
continues to calculate storefront visibility, formatted public price, and availability.

## Failure path

```text
Mage-OS timeout/error -> GraphQL gateway returns CURATED_SNAPSHOT + timestamp
                     -> AEM labels snapshot and disables product actions
```

The static response is evidence of graceful degradation, not evidence that commerce is operational. It contains no
customer, cart, order, stock quantity, secret, or mutable state.

## Grounded assistant path

```text
Browser -> AEM parts-assistant -> Cloudflare /assistant
                                  |-> approved versioned knowledge passages
                                  |-> read-only Mage-OS catalog adapter
                                  `-> Workers AI grounded synthesis
```

The Worker supplies citations independently of model output and falls back to a deterministic answer if generation
fails. The model never receives credentials or customer context. It cannot certify aircraft compatibility or mutate
inventory, carts, approvals, checkout, orders, payments, or fulfillment. The user must continue into the governed
Mage-OS AOG flow for transactional work.

## Motion boundary

- Semantic content is complete before animation runs.
- CSS handles hover, focus, and short state transitions.
- Anime.js is dynamically imported only by signature blocks.
- `prefers-reduced-motion` prevents runtime animation and retains every fact.
- Authored product artwork remains a normal image with textual component details; animation never creates
  maintenance instructions.

## Deployment units

1. GitHub experience code delivered by AEM Code Bus.
2. DA.live content delivered through AEM preview and live tiers.
3. Cloudflare GraphQL Worker deployed independently.
4. Existing Oracle-hosted Mage-OS deployment.
5. Static portfolio evidence retained in GitHub and suitable for a separate static mirror.
