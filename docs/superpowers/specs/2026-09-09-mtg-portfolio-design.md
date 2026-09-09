# MTG-Themed Portfolio Site — Design

Date: 2026-09-09
Status: Approved for planning

## Purpose

A single-page personal portfolio for a software engineer, themed as a Magic:
The Gathering card set. Audience is recruiters, hiring managers, and engineers
met while networking. Success means a reader understands who the author is,
what they have built, and how to contact them within roughly twenty seconds,
and remembers the site afterward.

The theme is a delivery mechanism, not the content. Every card must remain
legible to a reader who has never played Magic.

## Constraints

- Hosted on GitHub Pages, repo `elinz` under account `elinzer`.
- Served from `https://elinzer.github.io/elinz/` — a subpath, not a root domain.
- No build step, no package manager, no CI. Push to `main` and Pages serves it.
- No runtime dependencies.
- A custom domain may be added later via a `CNAME` file.

### Subpath constraint (critical)

Because the site is served from `/elinz/` rather than `/`, every path in the
HTML, CSS, and JS must be document-relative. A root-relative path such as
`/styles.css` resolves to `elinzer.github.io/styles.css` and 404s in production
while working correctly under a local server started inside the project
directory. This failure is invisible in local development.

Rules:

- Reference assets as `styles.css`, `src/render.js`, `assets/resume.pdf`.
- Never begin an asset path with `/`.
- Do not add a `<base>` tag; it interacts badly with in-page anchor links.
- Adding a custom domain later requires no path changes, only a `CNAME` file.

## Architecture

Five files, no build:

```
index.html      semantic shell, section landmarks, <template id="card-template">
styles.css      design tokens, card frame, layout, motion
src/data.js     all content — the only file edited routinely
src/render.js   data -> DOM, via the template
src/foil.js     pointer-driven tilt and sheen
```

`index.html` loads `data.js`, then `render.js`, then `foil.js` as classic
scripts (not modules) at the end of `<body>`. Classic scripts avoid the CORS
restriction that makes ES modules fail under `file://`, so the page can be
opened directly from disk during development as well as through a server.
`data.js` assigns a single global; `render.js` consumes it.

Data flow is one-directional and runs once on load: `render.js` reads the card
array, partitions it by `section`, clones the template per entry, populates it,
and appends each card into the matching section container. There is no state,
no re-render, and no event handling beyond the foil effect and native link
navigation.

### Module boundaries

- `data.js` knows nothing about the DOM. It holds content only.
- `render.js` knows the data shape and the template's internal structure. It is
  the only file that touches the template.
- `foil.js` knows only the `.card` selector and CSS custom properties. It has
  no knowledge of card content and can be deleted without breaking the page.
- `styles.css` owns all visual decisions. `render.js` sets class names and
  custom properties; it never sets inline style values.

## Card data model

Every card on the site — project, role, or contact link — uses one shape. This
is why a single template and a single stylesheet cover the whole page.

```js
{
  id: 'goodcards',
  name: 'GoodCards API',
  cost: ['U', 'G'],
  type: 'Artifact — Service',
  rarity: 'mythic',
  rules: ['Go, Postgres, Redis.', 'Serves 2k req/s at p99 40ms.'],
  flavor: 'Draw two, then discard the legacy one.',
  pt: '3/4',
  links: [
    { label: 'Repo', href: 'https://…', primary: true },
    { label: 'Live', href: 'https://…' },
  ],
  section: 'projects',
}
```

Field notes:

- `cost` — array of zero or more of `W U B R G C`. Drives the card's color
  identity, gradient, and generated art. Two colors produce a split gradient;
  three or more fall back to the gold/multicolor treatment. Lands have no mana
  cost, so contact cards pass `cost: []` and instead set `identity` (the same
  letter set) to select their coloring. `identity` defaults to `cost` when
  omitted, so every other card sets only `cost`.
- `rarity` — `common | uncommon | rare | mythic`. Drives the frame accent only.
- `rules` — array of short strings, each rendered as its own paragraph. This is
  the substantive content: what the thing is and what it achieved.
- `flavor` — optional italic line below a divider. Voice and personality.
- `pt` — optional footer-right value. Either a real power/toughness or a
  headline metric. Printing this on a non-creature card is a deliberate
  departure from real card rules: the footer-right slot is the strongest
  position on the frame, and a number like `2k req/s` earns it more than
  correctness does. Cards with no meaningful metric omit the field.
- `links` — the entry marked `primary: true` becomes the card's whole-card
  click target. Others render as small buttons in the footer.
- `section` — `projects | experience | contact`. Determines placement.

The hero card uses this same shape but lives as a separate top-level object
rather than a member of the array, because it renders into its own layout
beside the name and pitch rather than into a section grid.

### Color pie as skill taxonomy

Mana colors encode domain, deliberately and consistently:

| Color | Domain |
|-------|--------|
| W | Testing, process, reliability, mentorship |
| U | Backend, APIs, data modeling |
| B | Legacy rescue, cost reduction, incident work |
| R | Infrastructure, performance, systems |
| G | Scale, developer tooling, DX |
| C | Everything else (colorless / artifact) |

A reader fluent in Magic infers specialty from the pips before reading a word.
A reader who is not sees a consistent color code. Both readings work.

### Rarity as emphasis

Rarity ranks the author's own work without a label saying so: `mythic` for the
one or two flagship items, `rare` for solid work, `uncommon` and `common` for
smaller pieces. Contact-section cards are always `common`.

### Card types by section

- Projects — `Artifact`, `Sorcery`, `Instant`, or `Enchantment` plus a
  descriptive subtype, e.g. `Artifact — Service`.
- Experience — `Saga — <Employer>`, with `rules` rendered as ordered chapters
  (I, II, III). A Saga is a card that tells a story in numbered chapters, so it
  is the structurally correct type for a job, and the ordering reads as career
  progression without needing explanation.
- Contact — `Land`. Lands are the resource you tap to do anything else, which
  makes them the right type for LinkedIn, GitHub, and email.

## Page structure

Single scrolling page. No routing, no nav bar beyond a skip link.

1. **Hero** — the author's commander card (`Legendary Creature — Human
   Engineer`, rarity `mythic`) beside an `<h1>` name, a one-line pitch, and two
   buttons: resume and email. Until a resume PDF exists, the resume button is
   omitted rather than pointing at a dead link.
2. **Projects** — responsive grid of project cards.
3. **Experience** — grid of Saga cards, most recent first.
4. **Contact** — row of Land cards for LinkedIn, GitHub, and email.

Each section is a `<section>` with an `<h2>` and an `aria-labelledby`
association.

## Visual design

### Frame

One `.card` element per card, `aspect-ratio: 63 / 88` to match a physical card.
Corner radius expressed as a percentage so it stays proportional at any size.
Internal CSS grid rows, top to bottom:

1. Title row — name left, mana pips right
2. Art box
3. Type line
4. Text box — rules paragraphs, divider, flavor
5. Footer — link buttons left, `pt` right

The card background is a gradient derived from color identity; the art box and
text box are inset panels layered on top with a subtle inner shadow to suggest
the printed bevel.

### Generated art

The art box is composed entirely in CSS and inline SVG. No image files.

- A base gradient in the card's color identity.
- An SVG grain/noise overlay at low opacity, shared across all cards.
- A geometric motif selected by hashing `card.id` into a small fixed set
  (rings, shards, grid, arcs) and rotated by the same hash.

The result is that every card looks individual while the set looks cohesive,
and the cost is zero bytes of images and zero IP exposure.

### Mana pips

Original CSS circles with author-designed glyphs. Wizards of the Coast's actual
mana symbols, card frame geometry, set symbols, and the Beleren typeface are
not used anywhere on the site. The design evokes the format; it does not
reproduce protected trade dress.

### Typography

- Card names and type lines: one serif webfont, woff2, subsetted to Latin,
  preloaded, with a system serif fallback in the stack. Budget ~20KB.
- Everything else: `system-ui` stack.
- `font-display: swap` so a slow font never blocks text.

### Theme

Dark page background throughout; cards supply the color. No light mode. A card
frame that must work on both a dark and a light ground loses the depth cues
that make it read as a card, and the tradeoff is not worth a toggle nobody
asked for.

### Layout and responsiveness

- Grid: `repeat(auto-fit, minmax(240px, 1fr))` with a sensible `max-width` on
  the page container.
- Roughly three cards across on desktop, two on tablet, one on phone.
- Hero stacks vertically below the tablet breakpoint.
- Verified at 375px, 768px, and 1440px.

## Interaction

On pointer hover, a card tilts toward the cursor using a CSS `perspective`
transform, and a specular gradient sweeps across it, imitating a foil. The
shadow deepens with the tilt.

`foil.js` attaches one `pointermove` listener on the grid container rather than
one per card, reads the pointer position relative to the hovered card, and
writes two CSS custom properties (`--px`, `--py`) that the stylesheet consumes.
All animation lives in CSS. Updates are throttled with `requestAnimationFrame`.

The effect is disabled entirely when `prefers-reduced-motion: reduce` is set,
and on coarse pointers (`pointer: coarse`), where it has no meaning and costs
touch responsiveness.

Clicking a card follows its `primary` link. There is no modal, no flip, and no
hidden content — everything the reader needs is on the card face.

## Accessibility

- Each card is an `<article>` whose title contains a real `<a href>`. A
  `::after` pseudo-element on that anchor is stretched over the whole card to
  make the full surface clickable. This yields one focusable element per card
  with correct link semantics, rather than a `div` with a click handler.
- Because the anchor is stretched, footer link buttons need `position:
  relative` and a higher `z-index` to remain clickable and focusable.
- Body text renders on the opaque text box, never over the gradient art, so
  contrast is controlled and meets WCAG AA.
- Mana pips carry accessible names ("blue", "green") via visually hidden text;
  they are not conveyed by color alone.
- A skip link precedes the hero.
- Visible focus rings on all interactive elements, not suppressed.
- Headings run `h1` (name) then `h2` (sections) then `h3` (card names) with no
  levels skipped.
- Every external link gets `rel="noopener noreferrer"`.

## Error handling

The failure modes for a static page are narrow and are handled by structure
rather than by runtime checks:

- A card missing `flavor` or `pt` renders without those rows; `render.js`
  removes the empty nodes rather than leaving blank space.
- A card with no `primary` link renders as non-clickable, with the whole-card
  anchor omitted.
- An unrecognized value in `cost` falls back to the colorless treatment.
- If `data.js` fails to load, the sections render empty rather than throwing;
  `render.js` guards on the global being present.

There is no network I/O, no user input, and no persistence, so there is nothing
else to fail.

## Performance

- Total page weight target: under 50KB including the font, excluding a resume
  PDF.
- No dependencies, no build output, no images.
- Lighthouse target: 100 on Performance and Accessibility.

## Placeholder content

The first implementation ships with plausible filler so the design can be
judged before real content exists. `data.js` opens with a marker identifying it
as placeholder. Filler covers:

- One hero commander card.
- Six project cards spanning single-color, two-color, and colorless identities,
  and all four rarities, so every visual variant is exercised.
- Three Saga experience cards with two, three, and four chapters respectively,
  to confirm the text box handles varying content length.
- Three Land contact cards.

Filler link targets point at `#`. Replacing filler with real content is an edit
to `data.js` alone.

## Verification

No test framework; the page has no logic worth unit testing. Verification is
manual and evidenced, run before any completion claim:

1. Serve locally with `python3 -m http.server` and load the page.
2. Confirm layout at 375px, 768px, and 1440px.
3. Tab through the entire page; confirm every card and button is reachable,
   focus is visible, and tab order matches visual order.
4. Toggle `prefers-reduced-motion` and confirm tilt and sheen stop.
5. Run Lighthouse and record the scores.
6. Grep the source for root-relative asset paths to confirm the subpath
   constraint holds.

Commands will be run only with explicit approval, and output shown rather than
summarized.

## Deployment

1. `git init`, commit, push to `elinzer/elinz` on `main`.
2. Settings, then Pages, then Source: deploy from branch, `main`, `/` root.
3. Site is live at `https://elinzer.github.io/elinz/`.

Custom domain later: add a `CNAME` file containing the domain at the repo root,
point DNS at GitHub's Pages IPs, enable Enforce HTTPS. Because all paths are
relative, no source changes are needed.

## Out of scope

- Light mode.
- Analytics.
- A blog or long-form writeups.
- Contact form (email link only; a form needs a backend).
- Card detail modals or flip animations.
