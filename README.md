# elinz

Personal portfolio site, themed as a Magic: The Gathering card set.

Static HTML, CSS, and JavaScript with no build step and no dependencies.
Served by GitHub Pages from `main` at
[elinzer.github.io/elinz](https://elinzer.github.io/elinz/).

## Local development

```
python3 -m http.server
```

Then open http://localhost:8000.

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Page shell and the card `<template>` |
| `styles.css` | Design tokens, card frame, layout, motion |
| `src/data.js` | All site content — the only file edited routinely |
| `src/render.js` | Renders data into the template |
| `src/foil.js` | Pointer-driven tilt and sheen |

All asset paths are document-relative. The site is served from a subpath
(`/elinz/`), so a leading `/` on any asset path breaks it in production while
still working locally.

## Design

See [docs/superpowers/specs/2026-09-09-mtg-portfolio-design.md](docs/superpowers/specs/2026-09-09-mtg-portfolio-design.md).
