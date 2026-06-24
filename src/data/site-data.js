(function () {
  "use strict";

  const modules = {
    SITE_CONFIG: window.CONRAD_EXPRESS_CONFIG,
    COPY: window.CONRAD_EXPRESS_COPY,
    REVIEW_CARDS: window.CONRAD_EXPRESS_REVIEWS,
    ASSETS: window.CONRAD_EXPRESS_ASSETS,
  };

  Object.entries(modules).forEach(([name, value]) => {
    if (!value) throw new Error(`Missing Conrad Express data module: ${name}`);
  });

  const { SITE_CONFIG, COPY, REVIEW_CARDS, ASSETS } = modules;

  window.CONRAD_EXPRESS_DATA = {
    SITE_CONFIG,
    COPY,
    REVIEW_CARDS,
    REVIEW_PHOTOS: ASSETS.reviewPhotos,
    ASSETS,
  };
})();
