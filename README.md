# Strawberry Aviation AEM Storefront

An independent AEM Edge Delivery Services storefront for the fictional Strawberry Aviation Supply business. It
demonstrates composable content, live Mage-OS catalog delivery, aircraft compatibility, AOG procurement, graceful
commerce fallback, accessible motion, and architecture evidence without changing the automotive `aem-demo` site.

This repository is not affiliated with an aircraft manufacturer or Adobe. All aviation identities, products,
documents, prices, fulfillment locations, and workflows are fictional demonstration material and are not valid for
aviation use.

## Architecture

```text
DA.live authoring -> AEM Edge Delivery -> Strawberry Aviation storefront
                                             |
                                             v
                               Strawberry Catalog Gateway (GraphQL)
                                             |
                              +--------------+--------------+
                              |                             |
                         live Mage-OS              dated static snapshot
                         Minimal 3.4.0              read-only fallback
```

- AEM owns authored pages, campaigns, navigation, and presentation.
- Mage-OS owns products, prices, availability, carts, orders, and the live AOG transaction.
- The GraphQL gateway exposes a bounded read-only storefront schema and marks every result as live or snapshot.
- The Luma storefront at [store.ajayk.xyz](https://store.ajayk.xyz) remains the transactional reference and checkout destination.

See [docs/architecture.md](docs/architecture.md) and [docs/authoring.md](docs/authoring.md).

## Experience blocks

| Block | Responsibility |
| --- | --- |
| `aviation-catalog` | Live GraphQL catalog with dated, non-transactional authored fallback |
| `aircraft-compatibility-explorer` | Aircraft-system selection that updates compatible products |
| `exploded-part` | Progressive component explanation over an authored image |
| `aog-response-timeline` | Implemented and simulated AOG workflow stages |
| `commerce-architecture-flow` | Live and outage data-path comparison |

Native CSS handles routine motion. Anime.js is vendored under its MIT license and loaded only by motion-enabled
blocks, only when reduced motion is not requested.

## Local development

```sh
npm ci
npx -y @adobe/aem-cli up
```

The AEM proxy combines local experience code with preview content. Content is authored and published separately.

## Catalog gateway

```sh
npm run gateway:types
npm run gateway:check
npm run gateway:dev
```

The public schema is query-only, caps product results, masks internal errors, rejects unapproved CORS origins, and
falls back to a dated catalog snapshot when Mage-OS is unavailable. It is a portfolio-scale open-source catalog
facade, not Adobe Catalog Service or Live Search.

Deployed endpoint: [strawberry-catalog-gateway.ajaykhampariya14.workers.dev/graphql](https://strawberry-catalog-gateway.ajaykhampariya14.workers.dev/graphql)

## Verification

```sh
npm run check
```

Release evidence must distinguish implemented, simulated, planned, live, and snapshot behavior.
