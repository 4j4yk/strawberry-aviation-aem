# Block contracts

Blocks use progressive enhancement: authored HTML is meaningful before JavaScript runs, optional cells may be
missing, and remote-service failure must produce a useful bounded state. Block CSS is scoped to the block class.

## Core experience blocks

| Block | Authored input | Enhanced behavior | Failure behavior |
| --- | --- | --- | --- |
| `hero` | Picture, heading, body, up to two links | Adds presentation hooks only | Original content remains visible |
| `cards` | One row per card with image and copy | Normalizes card structure | Original links and copy remain usable |
| `aviation-catalog` | Gateway, origins, variant, dated fallback rows | Fetches normalized product summaries | Renders snapshot rows, labels date, disables actions |
| `aircraft-compatibility-explorer` | System, aircraft variant, description | Emits a selected variant for the catalog | Rows remain readable as compatibility reference |
| `aog-response-timeline` | Step, description, evidence status | Optional motion and active-step emphasis | Ordered workflow remains readable |
| `commerce-architecture-flow` | System, responsibility, evidence status | Optional flow emphasis | Ownership table remains readable |
| `exploded-part` | Product image plus component/description rows | Optional staged assembly motion | Complete image and component list remain visible |
| `parts-assistant` | Gateway, storefront, aircraft variant | Retrieves approved guidance and read-only catalog facts with citations | Reports a bounded error and retains the governed AOG link |

## Global shell

The header attempts to load the configured navigation fragment and the footer attempts to load its configured
footer fragment. Missing, empty, malformed, or unreachable fragments must not throw. Each must render a local,
accessible fallback so navigation and the fictional-demo disclosure are always available.

Header requirements:

- A labelled `nav` landmark, home-linked brand, four global links, and one AOG action.
- A real button for the mobile menu with synchronized `aria-expanded` state.
- Keyboard close behavior and no forced body-scroll lock after resizing.

Footer requirements:

- Navigation remains available without duplicating the header's emphasized action.
- The fictional-company and demonstration disclosure is visible text.
- No status such as `Live` is hard-coded into the shell.

## Cross-block events

| Event | Producer | Consumer | Detail |
| --- | --- | --- | --- |
| `strawberry:aircraft-selected` | Compatibility explorer | Catalog | `{ system, variant, description }` |
| `strawberry:catalog-state` | Catalog | Optional status presentation | `{ state, message }` where state is `loading`, `live`, or `snapshot` |

Events communicate interface state only. They do not authorize price changes, inventory reservation, checkout,
order mutation, or shipment creation.

## Section identifiers

Stable identifiers support navigation and tests. The homepage reserves `products`, `assembly`, `aog-support`,
`architecture`, and `about`. IDs must not be duplicated in the same document. Hash links remain optional
enhancements; page content cannot depend on them.
