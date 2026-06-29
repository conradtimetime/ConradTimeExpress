# Conrad Express Data

This folder keeps page content and runtime configuration separate from UI components.

- `config.js`: runtime settings such as contact links and hero image path.
- `copy.js`: bilingual EN/TH page copy.
- `reviews.js`: testimonial card content.
- `assets.js`: image paths and asset registries used by components.
- `site-data.js`: compatibility aggregator that exposes `window.CONRAD_EXPRESS_DATA`.
- `tweaks.js`: edit-mode defaults exposed as `window.TWEAK_DEFAULTS`.

Load order matters in `index.html`: config, copy, reviews, and assets must load before `site-data.js`; `tweaks.js` must load before the generated app bundle.
