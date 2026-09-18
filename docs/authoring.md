# Authoring contracts

The following tables show the source-document shape for each block. Authors may omit optional rows; decorators must
retain useful semantic content if JavaScript or a remote service is unavailable.

## Aviation catalog

| aviation-catalog |  |
| --- | --- |
| Catalog gateway | https://catalog-api.example.test/graphql |
| Commerce origin | https://store.ajayk.xyz |
| Storefront | https://store.ajayk.xyz |
| Aircraft variant | SAR-90-200 |
| Product | Hydraulic Pump Assembly | SAS-HYD-1001 | $12,450.00 | In stock | product link | 2026-09-09 |
| Product | Carbon Brake Assembly | SAS-BRK-2001 | $8,760.00 | In stock | product link | 2026-09-09 |

Fallback rows are deliberately dated. The block disables their links when the gateway cannot establish a live
Mage-OS source.

## Aircraft compatibility explorer

| aircraft-compatibility-explorer |  |  |
| --- | --- | --- |
| Hydraulics | SAR-90-200 | Pumps, actuators, seals and service kits |
| Landing gear | SAR-90-100 | Brake, wheel and indication assemblies |
| Avionics | SVJ-40B | Flight-control and communication units |

The variant column is sent to the catalog block; the system label remains the user-facing control.

## Exploded part

| exploded-part |  |
| --- | --- |
| authored product illustration |  |
| Pump housing | Structural enclosure and mounting interface |
| Rotor assembly | Demonstration component group |
| Seal kit | Related service-kit reference |

The first row may contain an authored image. All remaining rows remain readable without animation. Always include
the fictional-document disclaimer in the surrounding section.

## AOG response timeline

| aog-response-timeline |  |  |
| --- | --- | --- |
| Compatibility verified | Match aircraft and part eligibility | implemented |
| Manager approval | Apply company authority policy | implemented |
| ERP export fails once | Demonstrate deterministic retry | simulated |
| Shipment created | Record native Mage-OS fulfillment | implemented |

## Parts assistant

The homepage currently adds the site-wide assistant automatically before the AOG section so the first vertical slice
does not require a coupled content publication. The same block can be authored explicitly later:

| parts-assistant |  |
| --- | --- |
| Assistant gateway | https://strawberry-catalog-gateway.ajaykhampariya14.workers.dev |
| Storefront | https://store.ajayk.xyz |
| Aircraft variant | SAR-90-200 |

The assistant is read-only. It may retrieve approved guidance and public catalog facts, but it cannot certify
compatibility, mutate carts, approve purchasing, reserve inventory, or create orders.

## Commerce architecture flow

| commerce-architecture-flow |  |  |
| --- | --- | --- |
| AEM | Content and presentation | live |
| Catalog gateway | Bounded GraphQL composition | live |
| Mage-OS | Commerce system of record | live |
| Curated snapshot | Read-only outage experience | fallback |
