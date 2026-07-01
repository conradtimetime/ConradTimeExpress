(function () {
  "use strict";

  const reviewPhotos = [
    'brand-images/review-1.jpg',
    'brand-images/review-2.jpg',
    'brand-images/review-3.jpg',
    'brand-images/review-4.jpg',
    'brand-images/review-5.jpg',
  ];

  const logoSymbol = 'brand-images/Logo_Symbol-CRE.png';

  const whyImage = 'brand-images/WHY_CONRAD-EXPRESS.png';

  /* Process step images — key = step index 0–3 */
  const processImages = {
    0: { src: 'brand-images/Consultation.png', fit: 'cover', objectPosition: 'center center' },
    1: { src: 'brand-images/Collection.png',   fit: 'cover', objectPosition: 'center 68%' },
    2: { src: 'brand-images/Transit.png',       fit: 'cover', objectPosition: 'center 62%' },
    3: { src: 'brand-images/Delivery.png',      fit: 'cover', objectPosition: 'center 64%' },
  };

  window.CONRAD_EXPRESS_ASSETS = { reviewPhotos, logoSymbol, whyImage, processImages };
})();
