# Content model

The source document owns language, links, images, and block rows. JavaScript enhances that content; it must not be
the only place where a visitor can discover a product, instruction, or disclosure.

## Shared fields

| Field | Rule |
| --- | --- |
| Eyebrow | Optional, two to five words; never a second heading |
| Heading | One clear promise or visitor task; sentence case |
| Body | One or two short paragraphs; explain outcomes before technology |
| Primary action | One per section; use a verb and destination |
| Secondary action | Optional; visually quieter than the primary action |
| Image | Authored media with useful alt text, intrinsic dimensions, and no text baked into the image |
| Disclosure | Plain text near the relevant simulated or fictional behavior |

## Product summary

Every product card uses one normalized model regardless of whether data came from Mage-OS or the curated snapshot:

| Field | Required | Notes |
| --- | --- | --- |
| `sku` | Yes | Stable commerce identifier |
| `name` | Yes | Human-readable part name |
| `image` | Yes for published cards | Consistent 4:3 or square crop; descriptive alt text |
| `formattedPrice` | No | If absent, display `Request quote`; never invent a price |
| `availability` | Yes | One of `IN_STOCK`, `OUT_OF_STOCK`, or `UNKNOWN` before presentation mapping |
| `compatibility` | No | Aircraft family/variant claim from the governed commerce source |
| `url` | Live source only | Must resolve to the approved Mage-OS storefront origin |
| `source` | Yes | `LIVE_MAGE_OS` or `CURATED_SNAPSHOT` |
| `dataTimestamp` | Snapshot only | ISO timestamp rendered as a human-readable date |

Snapshot cards are read-only. They must have no cart, checkout, product-detail, or other transactional link.

## Operational status vocabulary

These labels have distinct meanings and should not be substituted for one another:

- **Live**: the current request succeeded against the named operational source.
- **Snapshot**: dated, read-only fallback data; all transactional actions are disabled.
- **Simulated**: an intentionally scripted demonstration event, not an external-system result.
- **Planned**: documented direction that is not implemented or proven.

`Loading` and `Unavailable` may be transient interface states, but neither is evidence that a system is live.

## Content voice

- Lead with the aviation task: find, validate, approve, or dispatch.
- Keep implementation terms on `/architecture`.
- Never present the fictional company, certifications, inventory, shipping promises, or maintenance guidance as real.
- Avoid repeated claims, unexplained acronyms, and paragraphs that mix business copy with test evidence.

