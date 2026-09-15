# Acceptance criteria

A release is accepted only when the source, authored content, deployed code, and live behavior agree. A source file
or successful deployment alone is not evidence of a working visitor journey.

## Experience shell

- [ ] Header and footer render when their AEM fragments succeed.
- [ ] Accessible local fallbacks render when either fragment is empty, missing, malformed, or unreachable.
- [ ] Global navigation contains Home/brand, Products, AOG Support, Architecture, and About destinations.
- [ ] Mobile navigation works with keyboard, Escape, focus movement, and viewport resizing.
- [ ] No uncaught exception is produced during shell loading.

## Content and commerce

- [ ] Homepage follows the approved content order and contains no full technical deep dive.
- [ ] Every published product has a useful image, SKU, name, availability, and source state.
- [ ] Live product links remain bounded to `https://store.ajayk.xyz`.
- [ ] Snapshot data includes a visible date and every transactional action is disabled.
- [ ] Live, Snapshot, Simulated, and Planned labels follow `content-model.md` and do not conflict on one claim.
- [ ] Every page makes the fictional-business and non-maintenance-guidance boundary discoverable.

## Accessibility and performance

- [ ] One `h1`, logical heading order, landmarks, alt text, visible focus, and labelled controls on every route.
- [ ] All functions remain understandable with JavaScript unavailable and reduced motion enabled.
- [ ] Automated accessibility scan reports no serious or critical violations.
- [ ] Mobile and desktop smoke tests cover every landmark and the live-to-snapshot transition.
- [ ] Production Lighthouse targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 90+.
- [ ] LCP is 2.5 seconds or less and CLS is 0.1 or less at the agreed mobile test profile.

## Architecture evidence

- [ ] The architecture page separates implemented, simulated, fallback, and planned capabilities.
- [ ] Browser requests carry no administrative Mage-OS credentials.
- [ ] Gateway permits only documented operations, bounded inputs, and approved origins.
- [ ] A forced upstream outage demonstrates the dated, non-transactional fallback.
- [ ] Release evidence records URL, commit, content publication state, test command, date, and known limitation.

## Release gate

Run `npm run check`, then verify the preview URL before merging. After code and content are independently published,
repeat smoke, accessibility, responsive, CORS, and live/fallback checks against the production domain.
