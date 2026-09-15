# Rebuild phases and gates

This plan replaces the earlier presentation baseline. Existing integration code is retained only where it satisfies
the new contracts. The automotive `aem-demo` repository and domain remain outside this project.

| Phase | Outcome | Gate | Status |
| --- | --- | --- | --- |
| 0 | Scope, site map, content model, design system, block contracts, and acceptance criteria | Documents agree on routes, claims, ownership, and status vocabulary | Complete in repository; live content not implied |
| 1 | Reliable global shell and simple homepage | Header/footer survive fragment failure; responsive navigation and core homepage sections work | In implementation |
| 2 | Focused Products and AOG sections | Product model, imagery, compatibility, live/snapshot behavior, and AOG human boundary pass | Planned |
| 3 | Focused architecture and About sections | Technical evidence is contained; fictional and implementation boundaries are explicit | Planned |
| 4 | Refactor and authoring hardening | Shared utilities, defensive block parsing, authoring examples, and no page-specific copy in code | Planned |
| 5 | Production-quality evidence | Source checks, browser smoke, accessibility, visual/responsive, performance, CORS, and outage tests pass | Planned |

## Delivery principles

- Complete and verify one phase before broadening the experience.
- Prefer a small reusable block over a page-specific effect.
- Treat AEM code publication and AEM content publication as separate release events.
- Treat live Mage-OS data as proven only by a current request; otherwise label and constrain the snapshot.
- Keep motion optional and defer it until structure, content, accessibility, and performance are stable.
- Record evidence and known limitations in `release-evidence.md`; never infer production success from local checks.

## Phase 1 minimum release

1. Defensive header and footer with accessible fallbacks.
2. Home-linked brand, four global destinations, and one AOG header action.
3. Homepage sections identified as `products`, `assembly`, `aog-support`, `architecture`, and `about`.
4. One coherent visual system across type, spacing, controls, cards, and status surfaces.
5. Source-contract checks plus manual preview checks at mobile and desktop widths.

The phase is not complete until the authored homepage and fragments are published and the live domain is verified.
