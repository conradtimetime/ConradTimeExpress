# Conrad Express Static Site

Static React landing page for Conrad Express luxury and high-value logistics.

## Architecture

- `Conrad Express.html` is the static HTML shell, global styles, CDN React loader, CSP, and script order.
- `src/data/` owns runtime configuration, bilingual copy, reviews, image registries, and tweak defaults.
- `src/components/` owns reusable UI and page sections.
- `tweaks-panel.jsx` owns edit-mode controls and host messaging.
- `scripts/build-static-bundle.mjs` compiles JSX source into `dist/conrad-express.bundle.js`.
- `dist/conrad-express.bundle.js` is generated and committed so the site can be served as plain static files.

## Commands

Requires Node.js `>=22.18.0`.

Install dependencies:

```sh
npm install
```

Build the runtime bundle:

```sh
npm run build
```

Run the repeatable QA check:

```sh
npm run verify
```

Serve locally for a browser smoke test:

```sh
python3 -m http.server 8755
```

Open:

```text
http://127.0.0.1:8755/Conrad%20Express.html
```

## Editing Workflow

1. Edit content in `src/data/`.
2. Edit UI behavior or layout in `src/components/` or `tweaks-panel.jsx`.
3. Run `npm run verify`.
4. Smoke test the page in a browser.
5. Commit both source changes and the regenerated `dist/conrad-express.bundle.js`.

## Release Checklist

- `npm install` completes with `0 vulnerabilities`.
- `npm run verify` passes.
- Local browser smoke test loads the hero, sections, language switcher, contact form, and floating Line link.
- `Conrad Express.html` has no `type="text/babel"` scripts and no `unsafe-eval` in CSP.
- Contact details and external links are correct.
- `git status --short` is clean after the release commit.

## Security And Performance Notes

- React and ReactDOM load as pinned production UMD builds with SRI.
- Runtime Babel is removed; JSX is compiled before release.
- CSP disallows `unsafe-eval`.
- Inline styles are still used heavily by the current component layer, so CSP still allows `unsafe-inline` for styles.
