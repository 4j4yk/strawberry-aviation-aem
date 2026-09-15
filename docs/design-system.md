# Flightline design system

The interface should feel like a calm mission-control workspace: precise hierarchy, generous whitespace, and a
small number of meaningful status colors. Decoration must not compete with product and operational information.

## Color roles

| Role | Suggested token | Use |
| --- | --- | --- |
| Ink | `#122033` | Headings, primary text, dark surfaces |
| Canvas | `#f7f5ef` | Page background |
| Surface | `#ffffff` | Cards and contained information |
| Strawberry | `#c92f49` | Primary action and brand accent only |
| Steel | `#53677f` | Secondary text, borders, technical context |
| Amber | `#b96800` | AOG urgency and degraded-service notices |
| Success | `#237a57` | Verified positive operational state only |

Meet WCAG AA contrast for normal text. Never communicate source, availability, or urgency through color alone.

## Type and spacing

- Use the existing locally delivered body and condensed display families; system fallbacks must remain readable.
- Maintain one `h1`; headings descend without skipped levels.
- Use a restrained fluid type scale and 1.5 or greater body line height.
- Use an 8-pixel spacing rhythm and a content width near 1180 pixels.
- Prefer section padding and alignment over decorative dividers and stacked shadows.

## Components

- One solid primary button, one outlined/quiet secondary button, and ordinary inline links.
- One card radius, one subtle shadow, and one border treatment.
- Product images share an aspect ratio and `object-fit` behavior.
- Status banners contain a label, plain-language consequence, and recovery path when one exists.
- Motion explains sequence or assembly; it is never continuous decoration.

## Responsive and accessible behavior

- Design mobile-first; grids collapse without changing reading order.
- Interactive targets are at least 44 by 44 CSS pixels.
- Focus indicators remain visible on every background.
- Respect `prefers-reduced-motion`; content and state remain complete with motion disabled.
- Reserve media dimensions to prevent layout shift and lazy-load below-the-fold imagery.

