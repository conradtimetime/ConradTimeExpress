(function () {
  "use strict";

  const reviewPhotos = [
    'brand-images/review-1.jpg',
    'brand-images/review-2.jpg',
    'brand-images/review-3.jpg',
    'brand-images/review-4.jpg',
    'brand-images/review-5.jpg',
  ];

  const whyImage = 'brand-images/WHY_CONRAD-EXPRESS.jpg';

  /* Process step images — key = step index 0–3 */
  const processImages = {
    0: { src: 'brand-images/How-it-work-1.jpg', fit: 'cover', objectPosition: 'center center' },
    1: { src: 'brand-images/How-it-work-2.jpg', fit: 'cover', objectPosition: 'center 68%' },
    2: { src: 'brand-images/How-it-work-3.jpg', fit: 'cover', objectPosition: 'center 62%' },
    3: { src: 'brand-images/How-it-work-4.jpg', fit: 'cover', objectPosition: 'center 64%' },
  };

  window.CONRAD_EXPRESS_ASSETS = { reviewPhotos, whyImage, processImages };
})();
