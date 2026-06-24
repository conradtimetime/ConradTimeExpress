(function () {
  "use strict";

  /* ── Real client review photos ──
     Drop the photos into brand-images/ with these exact names.
     Leave a slot '' to fall back to the placeholder. */
  const reviewPhotos = [
    'brand-images/review-1.jpg',
    'brand-images/review-2.jpg',
    'brand-images/review-3.jpg',
    'brand-images/review-4.jpg',
    'brand-images/review-5.jpg',
  ];

  window.CONRAD_EXPRESS_ASSETS = {
    reviewPhotos,
  };
})();
