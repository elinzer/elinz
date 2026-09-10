# MTG-Themed Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal portfolio, themed as a Magic: The
Gathering card set, deployed to GitHub Pages.

**Architecture:** Static HTML, CSS, and JavaScript with no build step and no
dependencies. `src/data.js` assigns one global holding all content;
`src/render.js` clones a single `<template>` per entry and appends it into the
matching section; `src/foil.js` adds a pointer-driven tilt by writing CSS
custom properties. All visual decisions live in `styles.css`.

**Tech Stack:** HTML5, CSS (custom properties, grid, `aspect-ratio`), vanilla
ES5-compatible JavaScript as classic scripts. Python's `http.server` for local
preview. GitHub Pages for hosting.

**Spec:** `docs/superpowers/specs/2026-09-09-mtg-portfolio-design.md`

## Global Constraints

- **No build step, no package manager, no CI, no runtime dependencies.**
- **All asset paths are document-relative.** Never begin an asset path with
  `/`. The site is served from `https://elinzer.github.io/elinz/`, so
  `/styles.css` 404s in production while working locally. Never add a `<base>`
  tag.
- **Scripts are classic scripts, not modules.** `data.js`, then `render.js`,
  then `foil.js`, at the end of `<body>`.
- **`render.js` never sets inline style values.** It sets class names and CSS
  custom properties only. `foil.js` sets only `--px` and `--py`.
- **No Wizards of the Coast assets.** No real mana symbols, no Beleren
  typeface, no set symbols, no reproduced frame geometry.
- **Dark theme only.** No light mode, no theme toggle.
- **Total page weight under 50KB** including the font, excluding any resume PDF.
- **Every external link gets `rel="noopener noreferrer"`.**
- **Every commit ends with the trailer:**
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
- **Verification, not tests.** The spec specifies no test framework. Each task
  ends with explicit verification commands and their expected output. Run them
  and read the output before checking the task off.

### Working directory note

Shell access to this repo is intermittently denied by the sandbox. Prefix
commands with an explicit `cd /Users/el.linzer/Documents/projects/elinz` and
retry once if a command reports `Operation not permitted`.

### Local preview

Start the server once and leave it running for the whole session:

```bash
cd /Users/el.linzer/Documents/projects/elinz && python3 -m http.server 8000
```

Open `http://localhost:8000/`. Stop it with Ctrl-C when finished.

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `index.html` | Page shell, section landmarks, the card `<template>`, script tags |
| `styles.css` | Design tokens, card frame, color identities, layout, motion |
| `src/data.js` | All content. Assigns `window.PORTFOLIO`. The only file edited routinely |
| `src/render.js` | Pure card helpers plus the data-to-DOM pass |
| `src/foil.js` | Pointer tilt and sheen. Deletable without breaking the page |
| `assets/fonts/` | One self-hosted woff2, Latin subset, plus its license |
| `.nojekyll` | Stops GitHub Pages running Jekyll over the repo |

---

## Task 1: Page shell, tokens, and deploy plumbing

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `.nojekyll`

**Interfaces:**
- Consumes: nothing.
- Produces: the DOM contract every later task depends on — four `<section>`
  elements, each containing a `<div class="grid" data-section="...">` with
  `data-section` values `projects`, `experience`, `contact`; a
  `<div class="hero__card" data-hero>` in the hero; and CSS custom properties
  `--bg`, `--ink`, `--ink-dim`, `--rule`, `--gap`, `--card-radius`.

- [ ] **Step 1: Create `.nojekyll`**

```bash
cd /Users/el.linzer/Documents/projects/elinz && touch .nojekyll
```

Without this, Pages runs the repo through Jekyll, which ignores files and
directories beginning with an underscore and adds latency to every deploy.

- [ ] **Step 2: Write `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>El Linzer — Software Engineer</title>
<meta name="description" content="Portfolio of El Linzer, software engineer.">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

<main id="main">
  <section class="hero" aria-labelledby="hero-name">
    <div class="hero__card" data-hero></div>
    <div class="hero__intro">
      <h1 id="hero-name">El Linzer</h1>
      <p class="hero__pitch"></p>
      <p class="hero__actions"></p>
    </div>
  </section>

  <section class="section" aria-labelledby="projects-heading">
    <h2 id="projects-heading">Projects</h2>
    <div class="grid" data-section="projects"></div>
  </section>

  <section class="section" aria-labelledby="experience-heading">
    <h2 id="experience-heading">Experience</h2>
    <div class="grid" data-section="experience"></div>
  </section>

  <section class="section" aria-labelledby="contact-heading">
    <h2 id="contact-heading">Contact</h2>
    <div class="grid grid--lands" data-section="contact"></div>
  </section>
</main>

<script src="src/data.js"></script>
<script src="src/render.js"></script>
<script src="src/foil.js"></script>
</body>
</html>
```

The `<template>` and the three script files arrive in Task 2. The scripts are
referenced now so a missing-file 404 shows up immediately rather than later.

- [ ] **Step 3: Write `styles.css` with tokens and page chrome only**

```css
:root {
  --bg: #0d0f14;
  --panel: #161a22;
  --ink: #e8e6e1;
  --ink-dim: #9aa0ab;
  --rule: #2a3140;
  --accent: #c9a227;
  --gap: 1.25rem;
  --card-radius: 4.75%;
  --card-pad: 5.5%;
  --measure: 68rem;
  --serif: Georgia, "Times New Roman", serif;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font: 1rem/1.6 var(--sans);
  -webkit-font-smoothing: antialiased;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--panel);
  color: var(--ink);
  padding: 0.75rem 1rem;
  z-index: 100;
}

.skip-link:focus {
  left: 0;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

main {
  max-width: var(--measure);
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 4rem) clamp(1rem, 4vw, 2rem) 6rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
  padding-block: clamp(2rem, 6vw, 5rem);
}

.hero__intro h1 {
  font: 400 clamp(2rem, 6vw, 3.25rem)/1.1 var(--serif);
  margin: 0 0 0.5rem;
}

.hero__pitch {
  color: var(--ink-dim);
  font-size: 1.125rem;
  margin: 0 0 1.5rem;
  max-width: 34ch;
}

.section {
  padding-block: clamp(2rem, 5vw, 3.5rem);
  border-top: 1px solid var(--rule);
}

.section h2 {
  font: 400 1.5rem/1.2 var(--serif);
  color: var(--ink-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 var(--gap);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--gap);
}

@media (max-width: 40rem) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    justify-items: start;
  }
  .hero__card { max-width: 15rem; }
}
```

`--serif` is a system stack for now. Task 11 replaces it with the self-hosted
webfont; everything else in the file keeps working unchanged.

- [ ] **Step 4: Verify the page serves and every asset resolves**

Start the server in one shell and leave it running:

```bash
cd /Users/el.linzer/Documents/projects/elinz && python3 -m http.server 8000
```

In another shell:

```bash
for p in "" styles.css src/data.js src/render.js src/foil.js; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:8000/$p")" "$p"
done
```

Expected: `200 /`, `200 styles.css`, and `404` for the three `src/` files —
they do not exist yet, and seeing exactly three 404s confirms the script tags
point where you think they do.

- [ ] **Step 5: Verify no root-relative asset paths**

```bash
cd /Users/el.linzer/Documents/projects/elinz && grep -nE '(src|href)="/' index.html styles.css && echo "FAIL: root-relative path found" || echo "OK: no root-relative asset paths"
```

Expected: `OK: no root-relative asset paths`.

- [ ] **Step 6: Verify the skip link in a browser**

Open `http://localhost:8000/`, press Tab once. Expected: a "Skip to content"
link becomes visible in the top-left with a gold focus ring. Press Enter;
focus moves to the main region.

- [ ] **Step 7: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add index.html styles.css .nojekyll && git commit -m "Add page shell, design tokens, and Pages plumbing" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Card template and render pipeline

**Files:**
- Modify: `index.html` (add `<template id="card-template">` before the scripts)
- Create: `src/data.js`
- Create: `src/render.js`

**Interfaces:**
- Consumes: the `data-section` grids and `data-hero` container from Task 1.
- Produces:
  - `window.PORTFOLIO = { hero: Card, cards: Card[] }` where `Card` is
    `{ id, name, cost, identity?, type, rarity, rules, flavor?, pt?, links, section }`.
  - `window.CardRender.identityOf(card) -> string[]` (canonical WUBRG order,
    never empty, defaults to `['C']`).
  - `window.CardRender.identityClass(identity) -> string` (`ci-u`, `ci-ug`,
    `ci-gold`).
  - `window.CardRender.hash(str) -> number` (unsigned 32-bit FNV-1a).
  - `window.CardRender.buildCard(card) -> HTMLElement`.
  - Card DOM contract used by every later task: `.card` root with modifier
    classes, containing `.card__title` > `.card__name` > `.card__link`,
    `.card__pips`, `.card__art`, `.card__type`, `.card__text` >
    (`.card__rules`, `.card__flavor`), `.card__footer` > (`.card__links`,
    `.card__pt`).

- [ ] **Step 1: Create the `src/` directory**

```bash
cd /Users/el.linzer/Documents/projects/elinz && mkdir -p src
```

- [ ] **Step 2: Add the template to `index.html`**

Insert immediately before the `<script src="src/data.js">` line:

```html
<template id="card-template">
  <article class="card">
    <header class="card__title">
      <h3 class="card__name"><a class="card__link"></a></h3>
      <ul class="card__pips"></ul>
    </header>
    <div class="card__art" aria-hidden="true"></div>
    <p class="card__type"></p>
    <div class="card__text">
      <div class="card__rules"></div>
      <p class="card__flavor"></p>
    </div>
    <footer class="card__footer">
      <ul class="card__links"></ul>
      <span class="card__pt"></span>
    </footer>
  </article>
</template>
```

- [ ] **Step 3: Write `src/data.js` with two cards**

Two cards only for now — one ordinary project and one with no optional fields
— so the render pass can be verified against both the full and the minimal
shape. The full placeholder set arrives in Task 8.

```js
window.PORTFOLIO = {
  hero: null,
  cards: [
    {
      id: 'ledger-service',
      name: 'Ledger Service',
      cost: ['U'],
      type: 'Artifact — Service',
      rarity: 'rare',
      rules: [
        'Go, Postgres, and a write-ahead queue.',
        'Reconciles 40k transactions a day with no manual intervention.'
      ],
      flavor: 'Every entry balances, or nothing does.',
      pt: '4/4',
      links: [
        { label: 'Repo', href: 'https://github.com/elinzer', primary: true },
        { label: 'Write-up', href: 'https://github.com/elinzer' }
      ],
      section: 'projects'
    },
    {
      id: 'bare-minimum',
      name: 'Bare Minimum',
      cost: [],
      type: 'Sorcery',
      rarity: 'common',
      rules: ['A card with no flavor text, no power, and one link.'],
      links: [
        { label: 'Repo', href: 'https://github.com/elinzer', primary: true }
      ],
      section: 'projects'
    }
  ]
};
```

- [ ] **Step 4: Write `src/render.js`**

```js
(function (global) {
  var WUBRG = 'WUBRGC';
  var MOTIFS = ['rings', 'shards', 'grid', 'arcs'];

  function identityOf(card) {
    var source = (card.identity && card.identity.length) ? card.identity : card.cost;
    var seen = {};
    var out = [];
    (source || []).forEach(function (c) {
      var up = String(c).toUpperCase();
      if (WUBRG.indexOf(up) !== -1 && !seen[up]) {
        seen[up] = true;
        out.push(up);
      }
    });
    out.sort(function (a, b) { return WUBRG.indexOf(a) - WUBRG.indexOf(b); });
    return out.length ? out : ['C'];
  }

  function identityClass(identity) {
    if (identity.length > 2) return 'ci-gold';
    return 'ci-' + identity.join('').toLowerCase();
  }

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function motifOf(id) {
    return MOTIFS[hash(id) % MOTIFS.length];
  }

  function primaryLink(card) {
    var links = card.links || [];
    for (var i = 0; i < links.length; i++) {
      if (links[i].primary) return links[i];
    }
    return null;
  }

  function externalAnchor(link) {
    var a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.rel = 'noopener noreferrer';
    a.target = '_blank';
    return a;
  }

  function buildCard(card) {
    var tpl = document.getElementById('card-template');
    var root = tpl.content.firstElementChild.cloneNode(true);
    var identity = identityOf(card);

    root.classList.add(identityClass(identity));
    root.classList.add('rarity-' + card.rarity);
    root.classList.add('motif-' + motifOf(card.id));
    root.dataset.cardId = card.id;

    var nameEl = root.querySelector('.card__name');
    var linkEl = root.querySelector('.card__link');
    var primary = primaryLink(card);
    if (primary) {
      linkEl.href = primary.href;
      linkEl.textContent = card.name;
      linkEl.rel = 'noopener noreferrer';
      linkEl.target = '_blank';
      root.classList.add('card--clickable');
    } else {
      nameEl.textContent = card.name;
    }

    root.querySelector('.card__type').textContent = card.type;

    var rulesEl = root.querySelector('.card__rules');
    (card.rules || []).forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      rulesEl.appendChild(p);
    });

    var flavorEl = root.querySelector('.card__flavor');
    if (card.flavor) {
      flavorEl.textContent = card.flavor;
    } else {
      flavorEl.remove();
    }

    var ptEl = root.querySelector('.card__pt');
    if (card.pt) {
      ptEl.textContent = card.pt;
    } else {
      ptEl.remove();
    }

    var linksEl = root.querySelector('.card__links');
    (card.links || []).forEach(function (link) {
      if (link.primary) return;
      var li = document.createElement('li');
      li.appendChild(externalAnchor(link));
      linksEl.appendChild(li);
    });

    return root;
  }

  function render() {
    var data = global.PORTFOLIO;
    if (!data || !data.cards) return;

    data.cards.forEach(function (card) {
      var grid = document.querySelector('[data-section="' + card.section + '"]');
      if (grid) grid.appendChild(buildCard(card));
    });
  }

  global.CardRender = {
    identityOf: identityOf,
    identityClass: identityClass,
    hash: hash,
    motifOf: motifOf,
    buildCard: buildCard
  };

  render();
})(window);
```

`primary` links open in a new tab so a reader browsing your work never loses
the portfolio itself. The anchor carries the card name as its text, which is
what makes the card announce correctly to a screen reader in Task 10.

- [ ] **Step 5: Create an empty `src/foil.js` placeholder**

```bash
cd /Users/el.linzer/Documents/projects/elinz && printf '' > src/foil.js
```

Task 9 fills it. Creating it now clears the 404 from Task 1.

- [ ] **Step 6: Verify both cards render**

Reload `http://localhost:8000/`. Expected: two unstyled cards under Projects.
"Ledger Service" shows a linked name, type line, two rules paragraphs, flavor
text, `4/4`, and a "Write-up" link. "Bare Minimum" shows a linked name, one
rules paragraph, and no flavor or power line.

- [ ] **Step 7: Verify the optional fields are removed, not blanked**

In the browser console:

```js
document.querySelectorAll('[data-card-id="bare-minimum"] .card__flavor, [data-card-id="bare-minimum"] .card__pt').length
```

Expected: `0`. An empty element left in place would leave a gap in the frame
once Task 3 adds layout.

- [ ] **Step 8: Verify the pure helpers**

In the browser console:

```js
CardRender.identityOf({ cost: ['G', 'U'] })            // ["U", "G"]
CardRender.identityOf({ cost: [] })                    // ["C"]
CardRender.identityOf({ cost: [], identity: ['B'] })   // ["B"]
CardRender.identityOf({ cost: ['U', 'U', 'x'] })       // ["U"]
CardRender.identityClass(['U', 'G'])                   // "ci-ug"
CardRender.identityClass(['W', 'U', 'B'])              // "ci-gold"
CardRender.hash('a') === CardRender.hash('a')          // true
```

Expected: each line matches the comment. Canonical WUBRG ordering is what
keeps `ci-ug` from also needing a `ci-gu` rule in the stylesheet.

- [ ] **Step 9: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add index.html src/data.js src/render.js src/foil.js && git commit -m "Add card template and render pipeline" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Card frame

**Files:**
- Modify: `styles.css` (append a card frame block)

**Interfaces:**
- Consumes: the card DOM contract from Task 2.
- Produces: `.card` as a positioned, five-row grid at `aspect-ratio: 63/88`,
  with `.card__art` as the flexible row. Later tasks paint into `.card__art`
  and add border accents; neither changes this geometry.

- [ ] **Step 1: Append the frame styles to `styles.css`**

```css
.card {
  position: relative;
  aspect-ratio: 63 / 88;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto minmax(0, 1.15fr) auto;
  gap: 0.4rem;
  padding: var(--card-pad);
  border-radius: var(--card-radius);
  background: #14171f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.45);
  container-type: inline-size;
}

.card > * {
  position: relative;
}

.card__title,
.card__type {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.55rem;
  border-radius: 0.35rem;
  background: var(--panel);
  border: 1px solid var(--rule);
}

.card__title { justify-content: space-between; }

.card__name {
  margin: 0;
  font: 600 clamp(0.72rem, 4.4cqi, 0.95rem)/1.15 var(--serif);
  letter-spacing: 0.01em;
}

.card__name a { color: inherit; text-decoration: none; }

.card__type {
  margin: 0;
  font-size: clamp(0.6rem, 3.4cqi, 0.78rem);
  color: var(--ink);
}

.card__art {
  border-radius: 0.35rem;
  border: 1px solid var(--rule);
  overflow: hidden;
}

.card__text {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.35rem;
  background: var(--panel);
  border: 1px solid var(--rule);
  font-size: clamp(0.62rem, 3.4cqi, 0.8rem);
  line-height: 1.45;
  overflow: hidden;
}

.card__rules { display: flex; flex-direction: column; gap: 0.35rem; }
.card__rules p { margin: 0; }

.card__flavor {
  margin: 0;
  padding-top: 0.4rem;
  border-top: 1px solid var(--rule);
  font-style: italic;
  color: var(--ink-dim);
}

.card__footer {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 1.5rem;
}

.card__links {
  display: flex;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card__links a {
  position: relative;
  z-index: 3;
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--rule);
  background: rgba(0, 0, 0, 0.35);
  color: var(--ink);
  font-size: clamp(0.58rem, 3cqi, 0.72rem);
  text-decoration: none;
}

.card__links a:hover { border-color: var(--accent); }

.card__pt {
  margin-left: auto;
  padding: 0.15rem 0.5rem;
  border-radius: 0.3rem;
  background: var(--panel);
  border: 1px solid var(--rule);
  font: 600 clamp(0.62rem, 3.4cqi, 0.8rem)/1 var(--serif);
}
```

Type scales with `cqi` (container-inline units) rather than viewport units so
a card reads correctly at any grid width — the hero card and a four-across
grid card use the same rules.

Note what `.card > *` does *not* set: a `z-index`. Giving every row its own
stacking context would trap the footer's `z-index: 3` inside that row and
silently break the stretched link overlay in Task 10. Only `.card__footer`
raises itself, so the layer order across the whole card is art (0), link
overlay (1), sheen (2), footer buttons (3).

- [ ] **Step 2: Verify the frame at three widths**

Open `http://localhost:8000/`, open dev tools, and check 375px, 768px, and
1440px. Expected at each: cards keep a portrait 63:88 proportion, nothing
overflows the card edge, the text box clips rather than spilling, and the
footer sits on the bottom edge with `4/4` right-aligned.

- [ ] **Step 3: Verify the long-text case does not break the frame**

In the browser console:

```js
document.querySelector('[data-card-id="ledger-service"] .card__rules p').textContent = 'x '.repeat(120);
```

Expected: the text box clips its overflow. The card's outer dimensions and the
footer position do not move.

Reload to discard the change.

- [ ] **Step 4: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add styles.css && git commit -m "Add card frame layout and typography" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
## Task 4: Color identity and generated art

**Files:**
- Modify: `styles.css` (append mana palette, identity classes, art layers)
- Modify: `src/render.js` (set `--motif-angle`)
- Modify: `src/data.js` (add coverage cards)

**Interfaces:**
- Consumes: `identityClass`, `motifOf`, `hash` from Task 2.
- Produces: CSS custom properties `--c1` and `--c2` set by every `ci-*` class,
  and a `--motif-angle` custom property set per card. Tasks 5 and 6 read
  `--c1` for pips and land coloring.

- [ ] **Step 1: Append the mana palette and identity classes to `styles.css`**

```css
:root {
  --mana-w: #ddd6bd;
  --mana-u: #3b7fc4;
  --mana-b: #5b5468;
  --mana-r: #c05038;
  --mana-g: #4f9160;
  --mana-c: #8a8f99;
  --mana-gold: #c9a227;
}

.ci-w { --c1: var(--mana-w); --c2: var(--mana-w); }
.ci-u { --c1: var(--mana-u); --c2: var(--mana-u); }
.ci-b { --c1: var(--mana-b); --c2: var(--mana-b); }
.ci-r { --c1: var(--mana-r); --c2: var(--mana-r); }
.ci-g { --c1: var(--mana-g); --c2: var(--mana-g); }
.ci-c { --c1: var(--mana-c); --c2: var(--mana-c); }

.ci-wu { --c1: var(--mana-w); --c2: var(--mana-u); }
.ci-wb { --c1: var(--mana-w); --c2: var(--mana-b); }
.ci-wr { --c1: var(--mana-w); --c2: var(--mana-r); }
.ci-wg { --c1: var(--mana-w); --c2: var(--mana-g); }
.ci-ub { --c1: var(--mana-u); --c2: var(--mana-b); }
.ci-ur { --c1: var(--mana-u); --c2: var(--mana-r); }
.ci-ug { --c1: var(--mana-u); --c2: var(--mana-g); }
.ci-br { --c1: var(--mana-b); --c2: var(--mana-r); }
.ci-bg { --c1: var(--mana-b); --c2: var(--mana-g); }
.ci-rg { --c1: var(--mana-r); --c2: var(--mana-g); }

.ci-gold { --c1: var(--mana-gold); --c2: #8c6f1f; }
```

The ten two-color classes are exhaustive because `identityOf` sorts into
canonical WUBRG order — `ci-gu` can never be produced, so it needs no rule.

- [ ] **Step 2: Append the card colouring and art layers to `styles.css`**

```css
.card {
  background:
    linear-gradient(160deg,
      color-mix(in srgb, var(--c1, var(--mana-c)) 28%, #10131a),
      color-mix(in srgb, var(--c2, var(--mana-c)) 18%, #0e1117));
}

.card__art {
  position: relative;
  background:
    radial-gradient(120% 90% at 22% 18%,
      color-mix(in srgb, var(--c1, var(--mana-c)) 70%, transparent), transparent 65%),
    radial-gradient(120% 90% at 82% 88%,
      color-mix(in srgb, var(--c2, var(--mana-c)) 62%, transparent), transparent 62%),
    linear-gradient(145deg, #0f1218, #191d27);
}

.card__art::before,
.card__art::after {
  content: "";
  position: absolute;
  inset: -25%;
  transform: rotate(var(--motif-angle, 0deg));
}

.card__art::before { opacity: 0.35; }

.motif-rings .card__art::before {
  background: repeating-radial-gradient(circle at 40% 45%,
    transparent 0 7px, color-mix(in srgb, var(--c2) 55%, transparent) 7px 9px);
}

.motif-shards .card__art::before {
  background: repeating-linear-gradient(58deg,
    transparent 0 9px, color-mix(in srgb, var(--c2) 50%, transparent) 9px 12px);
}

.motif-grid .card__art::before {
  background:
    repeating-linear-gradient(0deg,
      transparent 0 11px, color-mix(in srgb, var(--c2) 45%, transparent) 11px 12px),
    repeating-linear-gradient(90deg,
      transparent 0 11px, color-mix(in srgb, var(--c2) 45%, transparent) 11px 12px);
}

.motif-arcs .card__art::before {
  background: conic-gradient(from 210deg at 30% 70%,
    color-mix(in srgb, var(--c2) 55%, transparent), transparent 38%, transparent 62%,
    color-mix(in srgb, var(--c1) 45%, transparent));
}

.card__art::after {
  opacity: 0.22;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

The grain is one inline SVG data URI shared by every card, so it costs a few
hundred bytes total rather than an image request. `color-mix` keeps a single
palette entry driving both the frame tint and the art without hand-mixing
twenty shades.

- [ ] **Step 3: Set `--motif-angle` in `src/render.js`**

In `buildCard`, immediately after the `root.dataset.cardId = card.id;` line,
add:

```js
    root.style.setProperty('--motif-angle', (hash(card.id) % 360) + 'deg');
```

This is a custom property, not an inline style value, which is the boundary
the spec draws for `render.js`.

- [ ] **Step 4: Add coverage cards to `src/data.js`**

Append these four entries to the `cards` array so every identity branch is
visible on screen at once:

```js
    {
      id: 'coverage-two-color',
      name: 'Split Identity',
      cost: ['G', 'U'],
      type: 'Artifact — Pipeline',
      rarity: 'uncommon',
      rules: ['Exercises the two-color gradient.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-three-color',
      name: 'Gold Fallback',
      cost: ['W', 'U', 'B'],
      type: 'Enchantment',
      rarity: 'rare',
      rules: ['Three or more colors collapse to the gold treatment.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-colorless',
      name: 'Colorless Engine',
      cost: ['C'],
      type: 'Artifact',
      rarity: 'common',
      rules: ['Exercises the colorless palette.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-land-identity',
      name: 'Identity Without Cost',
      cost: [],
      identity: ['R'],
      type: 'Land',
      rarity: 'common',
      rules: ['No mana cost, but colored by identity.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    }
```

- [ ] **Step 5: Verify every identity branch renders distinctly**

Reload. Expected, reading the Projects grid: "Ledger Service" blue, "Bare
Minimum" grey (empty cost defaults to colorless), "Split Identity" a
blue-to-green gradient, "Gold Fallback" gold, "Colorless Engine" grey,
"Identity Without Cost" red. No two adjacent cards show the same art motif
orientation.

- [ ] **Step 6: Verify the motif angle is stable across reloads**

In the browser console:

```js
getComputedStyle(document.querySelector('[data-card-id="ledger-service"]')).getPropertyValue('--motif-angle')
```

Note the value, reload, and run it again. Expected: identical both times. The
hash is deterministic, so a card's art must never change between visits.

- [ ] **Step 7: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add styles.css src/render.js src/data.js && git commit -m "Add color identity palette and generated card art" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Mana pips and rarity

**Files:**
- Modify: `src/render.js` (render pips)
- Modify: `styles.css` (pip shapes, visually-hidden helper, rarity accents)

**Interfaces:**
- Consumes: `card.cost` and the `rarity-*` class already applied in Task 2.
- Produces: `.card__pips > li.pip.pip--<letter>` each containing a
  `.visually-hidden` accessible name. Task 10 audits these.

- [ ] **Step 1: Add pip rendering to `src/render.js`**

Add this constant beside `MOTIFS` at the top of the IIFE:

```js
  var COLOR_NAMES = {
    W: 'white', U: 'blue', B: 'black',
    R: 'red', G: 'green', C: 'colorless'
  };
```

Add this function beside `primaryLink`:

```js
  function buildPips(card, listEl) {
    (card.cost || []).forEach(function (raw) {
      var letter = String(raw).toUpperCase();
      if (!COLOR_NAMES[letter]) return;
      var li = document.createElement('li');
      li.className = 'pip pip--' + letter.toLowerCase();
      var label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = COLOR_NAMES[letter];
      li.appendChild(label);
      listEl.appendChild(li);
    });
  }
```

In `buildCard`, immediately after the `root.querySelector('.card__type')` line,
add:

```js
    buildPips(card, root.querySelector('.card__pips'));
```

Pips iterate `card.cost`, not the identity, so a `{U}{U}` card shows two pips
and a Land shows none.

- [ ] **Step 2: Append pip and rarity styles to `styles.css`**

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.card__pips {
  display: flex;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-shrink: 0;
}

.pip {
  width: clamp(0.55rem, 3.2cqi, 0.72rem);
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.45);
  position: relative;
}

.pip::after {
  content: "";
  position: absolute;
  inset: 22%;
  background: rgba(0, 0, 0, 0.55);
}

.pip--w { background: var(--mana-w); }
.pip--u { background: var(--mana-u); }
.pip--b { background: var(--mana-b); }
.pip--r { background: var(--mana-r); }
.pip--g { background: var(--mana-g); }
.pip--c { background: var(--mana-c); }

.pip--w::after { clip-path: circle(50%); }
.pip--u::after { clip-path: polygon(50% 0, 100% 62%, 50% 100%, 0 62%); }
.pip--b::after { clip-path: circle(38%); }
.pip--r::after { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.pip--g::after { clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }
.pip--c::after { clip-path: polygon(50% 8%, 92% 50%, 50% 92%, 8% 50%); }

.card {
  border: 1px solid var(--rarity-line, var(--rule));
}

.rarity-common { --rarity-line: #6b7280; }
.rarity-uncommon { --rarity-line: #9fb3c8; }
.rarity-rare { --rarity-line: #d4b45a; }
.rarity-mythic { --rarity-line: #e06a2b; }

.rarity-rare { box-shadow: 0 1px 2px rgba(0,0,0,.6), 0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(212,180,90,.25); }
.rarity-mythic { box-shadow: 0 1px 2px rgba(0,0,0,.6), 0 10px 30px rgba(0,0,0,.5), 0 0 18px rgba(224,106,43,.28); }
```

The shapes are geometric primitives drawn with `clip-path` — deliberately not
Wizards' symbols, and they cost nothing to load.

- [ ] **Step 3: Verify pip counts and rarity accents**

Reload. Expected: "Ledger Service" shows one blue pip and a gold border,
"Split Identity" shows a blue and a green pip with a pale border, "Gold
Fallback" shows white, blue, and black pips, and "Identity Without Cost" shows
no pips at all despite being red.

- [ ] **Step 4: Verify pips are not color-only**

In the browser console:

```js
[...document.querySelectorAll('[data-card-id="coverage-three-color"] .pip')].map(p => p.textContent)
```

Expected: `["white", "blue", "black"]`. Colorblind readers and screen readers
both need this; the text is visually hidden but present.

- [ ] **Step 5: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add src/render.js styles.css && git commit -m "Add mana pips and rarity accents" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Saga and Land variants

**Files:**
- Modify: `src/render.js` (chapter rendering, land class)
- Modify: `styles.css` (chapter list, land grid)
- Modify: `src/data.js` (one saga, one land)

**Interfaces:**
- Consumes: `buildCard` from Task 2.
- Produces: `.card--saga` with `.card__chapters` (an `<ol>`) replacing
  `.card__rules` paragraphs, and `.card--land`. Task 8 relies on both.

- [ ] **Step 1: Add variant handling to `src/render.js`**

Replace the rules-rendering block in `buildCard`:

```js
    var rulesEl = root.querySelector('.card__rules');
    (card.rules || []).forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      rulesEl.appendChild(p);
    });
```

with:

```js
    var rulesEl = root.querySelector('.card__rules');
    var isSaga = /^Saga\b/.test(card.type || '');
    var isLand = /\bLand\b/.test(card.type || '');
    if (isSaga) root.classList.add('card--saga');
    if (isLand) root.classList.add('card--land');

    if (isSaga) {
      var chapters = document.createElement('ol');
      chapters.className = 'card__chapters';
      (card.rules || []).forEach(function (line) {
        var li = document.createElement('li');
        li.textContent = line;
        chapters.appendChild(li);
      });
      rulesEl.appendChild(chapters);
    } else {
      (card.rules || []).forEach(function (line) {
        var p = document.createElement('p');
        p.textContent = line;
        rulesEl.appendChild(p);
      });
    }
```

Deriving the variant from `card.type` rather than from `card.section` keeps
one source of truth: the type line a reader sees is the thing that decides how
the card renders.

- [ ] **Step 2: Append variant styles to `styles.css`**

```css
.card__chapters {
  margin: 0;
  padding-left: 1.4em;
  list-style: upper-roman;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card__chapters li::marker {
  color: var(--ink-dim);
  font-family: var(--serif);
}

.grid--lands {
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  max-width: 42rem;
}
```

- [ ] **Step 3: Add a saga and a land to `src/data.js`**

Append to the `cards` array:

```js
    {
      id: 'coverage-saga',
      name: 'Coverage Corp',
      cost: ['W', 'U'],
      type: 'Saga — Coverage Corp',
      rarity: 'rare',
      rules: [
        'Joined as the third backend engineer.',
        'Led the migration off the monolith.',
        'Now owns the platform team roadmap.'
      ],
      flavor: 'Senior Engineer · 2022–present',
      links: [{ label: 'Company', href: 'https://example.com', primary: true }],
      section: 'experience'
    },
    {
      id: 'coverage-linkedin',
      name: 'LinkedIn',
      cost: [],
      identity: ['U'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: add one professional connection.'],
      links: [{ label: 'Open', href: 'https://linkedin.com', primary: true }],
      section: 'contact'
    }
```

- [ ] **Step 4: Verify chapters and land placement**

Reload. Expected: under Experience, "Coverage Corp" renders three chapters
numbered I, II, III, with the role and dates as flavor text. Under Contact,
"LinkedIn" renders as a blue card with no pips, in a narrower grid than the
Projects section.

- [ ] **Step 5: Verify the chapter list is a real ordered list**

In the browser console:

```js
document.querySelector('[data-card-id="coverage-saga"] .card__chapters').tagName
```

Expected: `"OL"`. A screen reader announces "list, 3 items" and the ordering
carries meaning, which is the whole reason a job is a Saga.

- [ ] **Step 6: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add src/render.js styles.css src/data.js && git commit -m "Add saga chapters and land variants" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Hero

**Files:**
- Modify: `src/render.js` (hero rendering)
- Modify: `styles.css` (hero actions)
- Modify: `src/data.js` (hero object)

**Interfaces:**
- Consumes: `buildCard`, and the `[data-hero]`, `.hero__pitch`,
  `.hero__actions` elements from Task 1.
- Produces: `window.PORTFOLIO.hero` as a `Card` plus `pitch`, `email`, and
  optional `resume` fields.

- [ ] **Step 1: Add hero rendering to `src/render.js`**

Replace the `render` function with:

```js
  function renderHero(hero) {
    if (!hero) return;

    var slot = document.querySelector('[data-hero]');
    if (slot) slot.appendChild(buildCard(hero));

    var pitch = document.querySelector('.hero__pitch');
    if (pitch && hero.pitch) pitch.textContent = hero.pitch;

    var actions = document.querySelector('.hero__actions');
    if (!actions) return;

    if (hero.resume) {
      var resume = document.createElement('a');
      resume.className = 'button';
      resume.href = hero.resume;
      resume.textContent = 'Resume';
      actions.appendChild(resume);
    }

    if (hero.email) {
      var mail = document.createElement('a');
      mail.className = 'button';
      mail.href = 'mailto:' + hero.email;
      mail.textContent = 'Email';
      actions.appendChild(mail);
    }
  }

  function render() {
    var data = global.PORTFOLIO;
    if (!data) return;

    renderHero(data.hero);

    (data.cards || []).forEach(function (card) {
      var grid = document.querySelector('[data-section="' + card.section + '"]');
      if (grid) grid.appendChild(buildCard(card));
    });
  }
```

The resume button is built only when `hero.resume` is set, so no dead link
ships before the PDF exists. The mailto link is deliberately not
`target="_blank"`.

- [ ] **Step 2: Append hero action styles to `styles.css`**

```css
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;
}

.button {
  display: inline-block;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--rule);
  background: var(--panel);
  color: var(--ink);
  text-decoration: none;
  font-size: 0.95rem;
}

.button:hover { border-color: var(--accent); }

.hero__card .card { max-width: 18rem; }
```

- [ ] **Step 3: Add the hero object to `src/data.js`**

Replace `hero: null,` with:

```js
  hero: {
    id: 'commander',
    name: 'El Linzer',
    cost: ['U', 'G'],
    type: 'Legendary Creature — Human Engineer',
    rarity: 'mythic',
    rules: [
      'Whenever a service enters the battlefield, draw a runbook.',
      'Backend systems, developer tooling, and the boring reliability work.'
    ],
    flavor: 'Ship it, then measure it.',
    pt: '4/5',
    links: [],
    section: 'hero',
    pitch: 'Software engineer building backend systems and the tooling that keeps them honest.',
    email: 'el.linzer@spothero.com'
  },
```

`links` is empty, so the hero card renders with a plain name rather than a
link to itself, and `section: 'hero'` matches no grid — it is rendered by
`renderHero`, not by the section loop.

- [ ] **Step 4: Verify the hero renders and the resume button is absent**

Reload. Expected: a mythic blue-green commander card beside your name, the
pitch line, and exactly one button reading "Email". No "Resume" button, and no
console errors.

- [ ] **Step 5: Verify the hero card is not also in a grid**

In the browser console:

```js
document.querySelectorAll('[data-card-id="commander"]').length
```

Expected: `1`.

- [ ] **Step 6: Verify the resume button appears when the field is set**

Temporarily add `resume: 'assets/resume.pdf',` to the hero object in
`src/data.js` and reload. Expected: two buttons, "Resume" then "Email".

Remove the line again and reload. Expected: only "Email". Leave it removed —
the PDF does not exist yet, and Task 11 ships without it.

- [ ] **Step 7: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add src/render.js styles.css src/data.js && git commit -m "Add hero commander card and intro actions" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
## Task 8: Full placeholder content set

**Files:**
- Modify: `src/data.js` (replace the coverage cards with the full set)

**Interfaces:**
- Consumes: the `Card` shape from Task 2 and the variants from Task 6.
- Produces: the content set every remaining task verifies against — one hero,
  six projects, three sagas, three lands.

- [ ] **Step 1: Replace the entire `cards` array in `src/data.js`**

Keep the `hero` object from Task 7 unchanged. Replace everything from
`cards: [` to its closing `]` with:

```js
  cards: [
    {
      id: 'ledger-service',
      name: 'Ledger Service',
      cost: ['U'],
      type: 'Artifact — Service',
      rarity: 'mythic',
      rules: [
        'Go, Postgres, and a write-ahead queue.',
        'Reconciles 40k transactions a day with no manual intervention.'
      ],
      flavor: 'Every entry balances, or nothing does.',
      pt: '2k rps',
      links: [
        { label: 'Repo', href: '#', primary: true },
        { label: 'Write-up', href: '#' }
      ],
      section: 'projects'
    },
    {
      id: 'drift-detector',
      name: 'Drift Detector',
      cost: ['U', 'G'],
      type: 'Enchantment — Tooling',
      rarity: 'rare',
      rules: [
        'Diffs live infrastructure against Terraform state nightly.',
        'Opens a pull request describing what changed and who changed it.'
      ],
      flavor: 'Nothing drifts quietly for long.',
      pt: '18 repos',
      links: [{ label: 'Repo', href: '#', primary: true }],
      section: 'projects'
    },
    {
      id: 'cold-path',
      name: 'Cold Path',
      cost: ['B'],
      type: 'Sorcery — Migration',
      rarity: 'rare',
      rules: [
        'Moved eleven years of event history off a rented Oracle box.',
        'Cut the annual bill by 68% and the p99 read by half.'
      ],
      flavor: 'Exile target legacy system.',
      pt: '-$310k/yr',
      links: [{ label: 'Write-up', href: '#', primary: true }],
      section: 'projects'
    },
    {
      id: 'flightcheck',
      name: 'Flightcheck',
      cost: ['W'],
      type: 'Instant — Test Harness',
      rarity: 'uncommon',
      rules: [
        'Runs contract tests against every service before a deploy proceeds.',
        'Fails the pipeline in under ninety seconds.'
      ],
      flavor: 'Counter target regression.',
      pt: '90s',
      links: [
        { label: 'Repo', href: '#', primary: true },
        { label: 'Docs', href: '#' }
      ],
      section: 'projects'
    },
    {
      id: 'hot-lane',
      name: 'Hot Lane',
      cost: ['R'],
      type: 'Artifact — Cache',
      rarity: 'uncommon',
      rules: [
        'A read-through cache layer with per-tenant eviction budgets.',
        'Took the checkout path from 240ms to 38ms at p95.'
      ],
      flavor: 'Haste.',
      pt: '38ms',
      links: [{ label: 'Repo', href: '#', primary: true }],
      section: 'projects'
    },
    {
      id: 'paper-trail',
      name: 'Paper Trail',
      cost: ['C'],
      type: 'Artifact',
      rarity: 'common',
      rules: ['A small CLI that turns git history into a release changelog.'],
      links: [{ label: 'Repo', href: '#', primary: true }],
      section: 'projects'
    },

    {
      id: 'saga-current',
      name: 'Coverage Corp',
      cost: ['U', 'G'],
      type: 'Saga — Coverage Corp',
      rarity: 'mythic',
      rules: [
        'Joined as the third backend engineer on a team of nine.',
        'Led the migration off the monolith across four quarters.',
        'Built the deploy tooling the whole org now uses.',
        'Now owns the platform roadmap and mentors two engineers.'
      ],
      flavor: 'Senior Software Engineer · 2022–present',
      links: [{ label: 'Company', href: '#', primary: true }],
      section: 'experience'
    },
    {
      id: 'saga-previous',
      name: 'Midfield Systems',
      cost: ['U'],
      type: 'Saga — Midfield Systems',
      rarity: 'rare',
      rules: [
        'Owned the billing service end to end.',
        'Rewrote the invoicing pipeline with zero customer-visible downtime.',
        'Cut on-call pages for the team by two thirds.'
      ],
      flavor: 'Software Engineer · 2019–2022',
      links: [{ label: 'Company', href: '#', primary: true }],
      section: 'experience'
    },
    {
      id: 'saga-first',
      name: 'First Light',
      cost: ['W'],
      type: 'Saga — First Light',
      rarity: 'uncommon',
      rules: [
        'First engineering role, on a team of three.',
        'Shipped the customer portal that carried the company through Series A.'
      ],
      flavor: 'Junior Engineer · 2017–2019',
      links: [{ label: 'Company', href: '#', primary: true }],
      section: 'experience'
    },

    {
      id: 'land-linkedin',
      name: 'LinkedIn',
      cost: [],
      identity: ['U'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: add one professional connection.'],
      links: [{ label: 'Open', href: '#', primary: true }],
      section: 'contact'
    },
    {
      id: 'land-github',
      name: 'GitHub',
      cost: [],
      identity: ['B'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: reveal the top card of the commit history.'],
      links: [{ label: 'Open', href: '#', primary: true }],
      section: 'contact'
    },
    {
      id: 'land-email',
      name: 'Email',
      cost: [],
      identity: ['W'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: begin a conversation.'],
      links: [{ label: 'Open', href: 'mailto:el.linzer@spothero.com', primary: true }],
      section: 'contact'
    }
  ]
```

Placeholder hrefs are `#` rather than plausible-looking URLs, so an
unreplaced link is obvious rather than quietly wrong. The set covers all six
identities, both two-color and colorless cases, all four rarities, and sagas
of two, three, and four chapters.

- [ ] **Step 2: Verify the full set renders**

Reload. Expected: six project cards, three experience sagas, three contact
lands, and the hero. No console errors.

- [ ] **Step 3: Verify saga chapter counts**

In the browser console:

```js
[...document.querySelectorAll('.card--saga')].map(c => c.querySelectorAll('.card__chapters li').length)
```

Expected: `[4, 3, 2]`. Varying lengths confirm the text box handles the range
without the frame changing size.

- [ ] **Step 4: Verify every placeholder link is findable**

```bash
cd /Users/el.linzer/Documents/projects/elinz && grep -c "href: '#'" src/data.js
```

Expected: `13` — eight across the six projects, three across the sagas, and
two of the three lands. The email land uses a real `mailto:` and is
deliberately not counted. Note the number: replacing content later means
driving it to zero.

- [ ] **Step 5: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add src/data.js && git commit -m "Add full placeholder content set" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Foil interaction

**Files:**
- Modify: `src/foil.js` (currently empty)
- Modify: `styles.css` (tilt transform, sheen overlay, reduced-motion guard)

**Interfaces:**
- Consumes: `.card` elements and the `.grid` / `.hero__card` containers.
- Produces: `--px` and `--py` custom properties on the hovered card, each a
  unitless number from 0 to 1.

- [ ] **Step 1: Write `src/foil.js`**

```js
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = window.matchMedia('(pointer: coarse)');
  if (reduce.matches || coarse.matches) return;

  var pending = null;
  var frame = null;
  var active = null;

  function paint() {
    frame = null;
    if (!pending) return;
    pending.card.style.setProperty('--px', pending.x.toFixed(3));
    pending.card.style.setProperty('--py', pending.y.toFixed(3));
  }

  function clear(card) {
    card.style.removeProperty('--px');
    card.style.removeProperty('--py');
    card.classList.remove('is-foil');
  }

  document.addEventListener('pointermove', function (event) {
    var card = event.target.closest ? event.target.closest('.card') : null;

    if (card !== active) {
      if (active) clear(active);
      active = card;
      if (card) card.classList.add('is-foil');
    }

    if (!card) {
      pending = null;
      return;
    }

    var box = card.getBoundingClientRect();
    pending = {
      card: card,
      x: (event.clientX - box.left) / box.width,
      y: (event.clientY - box.top) / box.height
    };

    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });

  document.addEventListener('pointerleave', function () {
    if (active) clear(active);
    active = null;
    pending = null;
  });
}());
```

One document-level listener rather than one per card, and every write is
batched into a single `requestAnimationFrame` so a fast pointer sweep produces
one style write per frame instead of dozens.

- [ ] **Step 2: Append the tilt and sheen styles to `styles.css`**

```css
.card {
  transition: transform 140ms ease-out, box-shadow 140ms ease-out;
  transform: perspective(900px)
    rotateX(calc((var(--py, 0.5) - 0.5) * -9deg))
    rotateY(calc((var(--px, 0.5) - 0.5) * 9deg));
  will-change: transform;
}

.card.is-foil {
  transition: none;
  box-shadow: 0 1px 2px rgba(0,0,0,.6), 0 18px 42px rgba(0,0,0,.55);
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 160ms ease-out;
  background: radial-gradient(
    38% 42% at calc(var(--px, 0.5) * 100%) calc(var(--py, 0.5) * 100%),
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.05) 45%,
    transparent 70%);
}

.card.is-foil::before { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
    transform: none;
  }
  .card::before { display: none; }
}
```

The CSS guard duplicates the JS guard on purpose: the JS bails before adding
any listener, and the CSS neutralises the transform even if a stale `--px`
survives a preference change mid-session.

- [ ] **Step 3: Verify the tilt tracks the pointer**

Reload and move the pointer slowly across a card. Expected: the card tilts
toward the cursor, a soft highlight follows it, and the shadow deepens.
Moving off the card returns it to flat.

- [ ] **Step 4: Verify reduced motion disables it**

In dev tools, emulate `prefers-reduced-motion: reduce`, then hard-reload.
Expected: hovering produces no tilt and no highlight. In the console:

```js
getComputedStyle(document.querySelector('.card')).transform
```

Expected: `"none"`.

- [ ] **Step 5: Verify footer links stay clickable under the sheen**

With the effect on, click a "Write-up" link on the Ledger Service card.
Expected: it opens in a new tab. The sheen overlay sets `pointer-events: none`
and the footer links sit at `z-index: 3`, so neither blocks the other.

- [ ] **Step 6: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add src/foil.js styles.css && git commit -m "Add pointer-driven foil tilt and sheen" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Whole-card link target and accessibility audit

**Files:**
- Modify: `styles.css` (stretched link overlay)
- Modify: `index.html` (only if the audit finds a heading or landmark problem)

**Interfaces:**
- Consumes: `.card--clickable` applied in Task 2 and the `z-index` values from
  Tasks 3 and 9.
- Produces: no new interface. This task makes the existing DOM correct.

- [ ] **Step 1: Append the stretched link overlay to `styles.css`**

```css
.card--clickable .card__link::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}

.card--clickable:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.card__link:focus-visible { outline: none; }
```

The card gets exactly one focusable element — a real anchor whose text is the
card name — and the pseudo-element expands its hit area to the whole card. The
focus ring moves to the card so keyboard users see the whole target, which is
why the anchor's own ring is suppressed.

- [ ] **Step 2: Verify the whole card is clickable**

Click a project card in its art box, well away from the title. Expected: the
primary link opens in a new tab.

- [ ] **Step 3: Verify one tab stop per card**

Tab through the Projects section. Expected: focus lands on each card once
(showing a gold ring around the whole card), then on any footer link buttons
that card has, then moves to the next card. Tab order matches visual order,
left to right and top to bottom.

- [ ] **Step 4: Verify heading structure**

In the browser console:

```js
[...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 28))
```

Expected: one `H1` (your name), then `H2 Projects`, six `H3`s, `H2 Experience`,
three `H3`s, `H2 Contact`, three `H3`s. No level is skipped and there is
exactly one `H1`.

- [ ] **Step 5: Verify every external link is safe and labelled**

```js
[...document.querySelectorAll('a[target="_blank"]')].every(a => a.rel.includes('noopener') && a.rel.includes('noreferrer'))
```

Expected: `true`.

```js
[...document.querySelectorAll('a')].filter(a => !a.textContent.trim()).length
```

Expected: `0`. An anchor with no text is invisible to a screen reader.

- [ ] **Step 6: Verify the art is hidden from assistive technology**

```js
[...document.querySelectorAll('.card__art')].every(el => el.getAttribute('aria-hidden') === 'true')
```

Expected: `true`. The art is decorative; announcing it would add noise between
the card name and its rules text.

- [ ] **Step 7: Run an automated accessibility check**

In dev tools, open Lighthouse, select Accessibility only, and run it against
`http://localhost:8000/`. Expected: score 100, no contrast failures. If
contrast fails on a specific card, the offending text is sitting on the art
rather than on `.card__text` — fix the layer, not the color.

- [ ] **Step 8: Commit**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add styles.css index.html && git commit -m "Add whole-card link target and fix accessibility findings" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Typography, performance budget, and go-live

**Files:**
- Create: `assets/fonts/eb-garamond-latin-400.woff2`
- Create: `assets/fonts/eb-garamond-latin-600.woff2`
- Create: `assets/fonts/LICENSE.txt`
- Modify: `styles.css` (`@font-face`, `--serif`)
- Modify: `index.html` (font preload)

**Interfaces:**
- Consumes: the `--serif` token defined in Task 1.
- Produces: a live site at `https://elinzer.github.io/elinz/`.

- [ ] **Step 1: Download the Latin-subset woff2 files**

```bash
cd /Users/el.linzer/Documents/projects/elinz && mkdir -p assets/fonts && curl -sS -H 'User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36' 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&display=swap' -o /tmp/ebg.css && grep -B4 'unicode-range: U+0000' /tmp/ebg.css | grep -o 'https://[^)]*\.woff2'
```

Expected: two URLs. The `unicode-range: U+0000` block is the Latin subset —
Google serves the file already subsetted, so no local font tooling is needed.

- [ ] **Step 2: Save them under `assets/fonts/`**

Using the two URLs from the previous step, in weight order:

```bash
cd /Users/el.linzer/Documents/projects/elinz && curl -sS '<400-weight-url>' -o assets/fonts/eb-garamond-latin-400.woff2 && curl -sS '<600-weight-url>' -o assets/fonts/eb-garamond-latin-600.woff2 && ls -lh assets/fonts/
```

Expected: two files, each roughly 15–25KB.

- [ ] **Step 3: Save the license**

EB Garamond is licensed under the SIL Open Font License, which requires the
license to travel with the font files.

```bash
cd /Users/el.linzer/Documents/projects/elinz && curl -sS 'https://raw.githubusercontent.com/octaviopardo/EBGaramond12/master/OFL.txt' -o assets/fonts/LICENSE.txt && head -3 assets/fonts/LICENSE.txt
```

Expected: the first lines of the SIL Open Font License. If the URL 404s, save
the license text from `https://openfontlicense.org` instead — do not ship the
fonts without it.

- [ ] **Step 4: Add `@font-face` rules at the very top of `styles.css`**

```css
@font-face {
  font-family: 'EB Garamond';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('assets/fonts/eb-garamond-latin-400.woff2') format('woff2');
}

@font-face {
  font-family: 'EB Garamond';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('assets/fonts/eb-garamond-latin-600.woff2') format('woff2');
}
```

Both `src` paths are relative to `styles.css`, which lives at the repo root, so
they resolve correctly under the `/elinz/` subpath.

- [ ] **Step 5: Point `--serif` at the webfont**

In the `:root` block, replace:

```css
  --serif: Georgia, "Times New Roman", serif;
```

with:

```css
  --serif: 'EB Garamond', Georgia, "Times New Roman", serif;
```

- [ ] **Step 6: Preload the 600 weight in `index.html`**

Add immediately before the stylesheet link:

```html
<link rel="preload" href="assets/fonts/eb-garamond-latin-600.woff2" as="font" type="font/woff2" crossorigin>
```

Only the 600 weight is preloaded — it renders every card name above the fold.
Preloading both would compete for bandwidth with the one that matters.

- [ ] **Step 7: Verify the font loads and paths are still relative**

Reload with the network tab open. Expected: both woff2 files return 200, card
names render in a serif with visibly different letterforms from Georgia, and
no text is invisible during load.

```bash
cd /Users/el.linzer/Documents/projects/elinz && grep -nE '(src|href)="/|url\((["'"'"']?)/' index.html styles.css && echo "FAIL: root-relative path found" || echo "OK: all paths relative"
```

Expected: `OK: all paths relative`.

- [ ] **Step 8: Verify the page weight budget**

```bash
cd /Users/el.linzer/Documents/projects/elinz && find index.html styles.css src assets -type f -not -name '*.txt' -exec du -k {} + | awk '{s+=$1} END {print s " KB total"}'
```

Expected: under 50. If it is over, the font files are the only thing large
enough to matter — drop the 400 weight and let the browser synthesise it.

- [ ] **Step 9: Run a full Lighthouse pass**

Run Lighthouse against `http://localhost:8000/` with all categories enabled.
Expected: Performance 100, Accessibility 100. Record the actual numbers; do
not claim the target was met without reading the report.

- [ ] **Step 10: Commit and push**

```bash
cd /Users/el.linzer/Documents/projects/elinz && git add assets index.html styles.css && git commit -m "Self-host EB Garamond and meet the page weight budget" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>" && git push
```

The remote uses SSH. If the push fails with `Permission denied (publickey)`,
add an SSH key to the account rather than switching the remote to HTTPS.

- [ ] **Step 11: Enable GitHub Pages**

```bash
cd /Users/el.linzer/Documents/projects/elinz && gh api -X POST repos/elinzer/elinz/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Expected: JSON describing the new Pages site.

- [ ] **Step 12: Verify the deployed site**

Wait roughly a minute for the first build, then:

```bash
for p in "" styles.css src/render.js assets/fonts/eb-garamond-latin-600.woff2; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "https://elinzer.github.io/elinz/$p")" "/$p"
done
```

Expected: `200` on all four. A `404` on `styles.css` while the root returns
`200` is the subpath bug — check for a leading `/` in `index.html`.

Then open `https://elinzer.github.io/elinz/` and confirm it matches what you
saw locally.

---

## Notes for whoever executes this

**Replacing the placeholder content** is a single-file job. Edit `src/data.js`,
drive `grep -c "href: '#'" src/data.js` to zero, and drop a `resume` field on
the hero object once `assets/resume.pdf` exists. Nothing else needs to change.

**Adding a custom domain** later: put the bare domain in a `CNAME` file at the
repo root, point DNS at GitHub's Pages IPs, and enable Enforce HTTPS. Every
path in this build is relative, so no source changes are required.
