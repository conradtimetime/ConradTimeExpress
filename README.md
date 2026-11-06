# Conrad Express Static Site

React landing page for Conrad Express luxury and high-value logistics, with a Vercel contact API.

## Architecture

- `index.html` is the static HTML shell, global styles, CDN React loader, CSP, and script order.
- `src/data/` owns runtime configuration, bilingual copy, reviews, image registries, and tweak defaults.
- `src/components/` owns reusable UI and page sections.
- `api/contact.js` forwards contact requests to Apps Script and checks its storage acknowledgement before returning success.
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

Serve the static UI locally for a browser smoke test (contact submissions need the Vercel function):

```sh
python3 -m http.server 8755
```

Open:

```text
http://127.0.0.1:8755/
```

For local testing with the contact API, use `npx vercel dev --listen 8755`.

## Contact Delivery

The browser posts JSON to `/api/contact` on the same origin. The function follows the Apps Script Content Service redirect and returns success only when the receiver responds with JSON `{ "ok": true }`. HTTP errors, timeouts, malformed responses, and `{ "ok": false }` keep the visitor's form populated and do not record a lead conversion. Requests are not automatically retried because a lost acknowledgement can happen after a write.

- The function uses the existing Apps Script deployment by default. Set the Vercel environment variable `CONTACT_FORM_UPSTREAM` to an Apps Script `/exec` URL to override it.
- Publish the updated `integrations/google-sheets-contact.gs` to the existing Apps Script web-app deployment before releasing the website. The receiver stores user fields as literal rich text and acknowledges only after the sheet is flushed; email notification failure is logged separately.
- Deploy this project to Vercel with its root `api/` directory included. A plain static host can display the page but cannot run the contact API.
- `npm test` exercises each page section, analytics/consent, API, receiver, form acknowledgement/error behavior, language selection, labels, and carousel with local mocks. It does not send emails or write to live Sheets.
- `npm run qa:serve` starts a local-only browser QA server at `http://127.0.0.1:8755/`. Every Apps Script request is mocked. Put `[qa:fail]`, `[qa:bad-json]`, `[qa:http-error]`, or `[qa:network-error]` in the message to exercise failures; `[qa:slow]` delays the response to check submitting/duplicate-click behavior. Ordinary messages simulate a successful acknowledgement. This command never forwards form data to Google.
- The QA server also disables the GTM network loader in its served analytics script while keeping consent and local `dataLayer` behavior active. The production source and build are unchanged by this guard.
- See [section test cases](docs/6_Test_Cases.md) and the [2026-11-05 execution report](docs/7_Test_Report_2026-11-05.md) for browser steps, results, known failures, and manual checks.

## Vercel Settings

- Application Preset: `Other`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.`
- Root Directory: repository root

## Editing Workflow

1. Edit content in `src/data/`.
2. Edit UI behavior or layout in `src/components/` or `tweaks-panel.jsx`.
3. Run `npm run verify`.
4. Smoke test the page in a browser.
5. Commit both source changes and the regenerated `dist/conrad-express.bundle.js`.

### Preparing photos

`npm run images:optimize` prepares responsive WebP variants for Hero, Services,
Reviews and Process, then updates the generated registry in `src/data/assets.js`.
Run it after replacing a registered source image; commit the resulting WebP files
and registry together. The normal build uses these prepared files and generates
the matching Hero preload automatically. Original JPGs are retained.

The image filenames contain a content hash and use immutable caching on Vercel.
Do not replace the contents of an existing hashed filename. Components select
the appropriate variant with `srcset`/`sizes`; custom images outside the registry
fall back to their configured path. Only the Hero uses eager/high priority.

Analytics is the first deferred script, before the app. It queues consent
defaults before it inserts the GTM loader, without blocking HTML parsing.

## Release Checklist

- `npm install` completes with `0 vulnerabilities`.
- `npm run verify` passes.
- Local browser smoke test loads the hero, sections, language switcher, contact form, and floating Line link.
- `index.html` has no `type="text/babel"` scripts and no `unsafe-eval` in CSP.
- Contact details and external links are correct.
- `git status --short` is clean after the release commit.

## Security And Performance Notes

- React and ReactDOM load as pinned production UMD builds with SRI.
- Runtime Babel is removed; JSX is compiled before release.
- CSP disallows `unsafe-eval`.
- Inline styles are still used heavily by the current component layer, so CSP still allows `unsafe-inline` for styles.
