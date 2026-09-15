# Site map and page purpose

Strawberry Aviation Supply is a fictional aviation-parts business and an architecture demonstration. The public
experience stays useful to a buyer; implementation evidence lives on a separate architecture page.

The first rebuilt release is intentionally a single page. Its hash landmarks make every primary task directly
addressable without requiring several independently authored pages.

| Route | Primary visitor question | Required content | Primary action |
| --- | --- | --- | --- |
| `/#products` | Which compatible parts are available? | Compatibility, catalog status, product cards, snapshot disclosure | View live product |
| `/#assembly` | What does this assembly contain? | Product visual and bounded component explanation | Browse products |
| `/#aog-support` | How do I handle an aircraft-on-ground request? | Four-step response process and human approval boundary | Start AOG request |
| `/#architecture` | How is the demonstration built and governed? | Ownership map, live/fallback paths, status legend | Review the flow |
| `/#about` | Is this a real aviation supplier? | Fictional-business disclosure and implementation boundaries | Explore architecture |

## Global navigation

Use the same four links: `Products`, `AOG Support`, `Architecture`, and `About`. The brand links home.
The single emphasized header action is `Request AOG Support`.

## Homepage content order

1. Mission-focused hero with one primary and one secondary action.
2. Compact trust bar with response, compatibility, traceability, and dispatch concepts.
3. Three featured products backed by the same catalog contract as `/parts`.
4. Four-step AOG summary: identify, validate, approve, dispatch.
5. Compact architecture section; deep implementation evidence stays in repository documentation.
6. Footer with navigation and a visible fictional-demo disclosure.

Additional routes are deferred until the single-page experience is reliable, complete, and demonstrably too large
for one task-oriented page. Navigation labels must match the corresponding hash identifiers.
