(function () {
  "use strict";

  const reviewPhotos = [
    'brand-images/review-1.jpg',
    'brand-images/review-2.jpg',
    'brand-images/review-3.jpg',
    'brand-images/review-4.jpg',
    'brand-images/review-5.jpg',
    'brand-images/review-6.jpg',
    'brand-images/review-7.jpg',
    'brand-images/review-8.jpg',
    'brand-images/review-9.jpg',
    'brand-images/review-10.jpg',
    'brand-images/review-11.jpg',
  ];

  const whyImage = 'brand-images/WHY_CONRAD-EXPRESS.jpg';

  /* Process step images — key = step index 0–3 */
  const processImages = {
    0: { src: 'brand-images/How-it-work-1.jpg', fit: 'cover', objectPosition: 'center center' },
    1: { src: 'brand-images/How-it-work-2.jpg', fit: 'cover', objectPosition: 'center 68%' },
    2: { src: 'brand-images/How-it-work-3.jpg', fit: 'cover', objectPosition: 'center 62%' },
    3: { src: 'brand-images/How-it-work-4.jpg', fit: 'cover', objectPosition: 'center 64%' },
  };

  // BEGIN GENERATED RESPONSIVE IMAGES
  const responsiveImages = {
    "brand-images/Section_Hero.jpg": {
      "src": "brand-images/optimized/section-hero-640-0008288d6220.webp",
      "width": 640,
      "height": 360,
      "variants": [
        [
          "brand-images/optimized/section-hero-640-0008288d6220.webp",
          640
        ],
        [
          "brand-images/optimized/section-hero-1280-cb92f1d701fa.webp",
          1280
        ],
        [
          "brand-images/optimized/section-hero-1920-1c72e4d2a59b.webp",
          1920
        ]
      ]
    },
    "brand-images/services/Luxury Watches.jpg": {
      "src": "brand-images/optimized/luxury-watches-960-6ab7bfaa5b8b.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/luxury-watches-320-9292cfa98ab0.webp",
          320
        ],
        [
          "brand-images/optimized/luxury-watches-640-1e5a27440afe.webp",
          640
        ],
        [
          "brand-images/optimized/luxury-watches-960-6ab7bfaa5b8b.webp",
          960
        ]
      ]
    },
    "brand-images/services/Fine Art.jpg": {
      "src": "brand-images/optimized/fine-art-960-83a3f60da2eb.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/fine-art-320-7f1133c8bf93.webp",
          320
        ],
        [
          "brand-images/optimized/fine-art-640-71a73c17728c.webp",
          640
        ],
        [
          "brand-images/optimized/fine-art-960-83a3f60da2eb.webp",
          960
        ]
      ]
    },
    "brand-images/services/Collection.jpg": {
      "src": "brand-images/optimized/collection-960-b8fe97caf400.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/collection-320-15bd35d6ea58.webp",
          320
        ],
        [
          "brand-images/optimized/collection-640-232cc3bed58d.webp",
          640
        ],
        [
          "brand-images/optimized/collection-960-b8fe97caf400.webp",
          960
        ]
      ]
    },
    "brand-images/services/Gemstones.jpg": {
      "src": "brand-images/optimized/gemstones-960-d1aec5a5c335.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/gemstones-320-1f002f1d175c.webp",
          320
        ],
        [
          "brand-images/optimized/gemstones-640-d2b9c5c6ec32.webp",
          640
        ],
        [
          "brand-images/optimized/gemstones-960-d1aec5a5c335.webp",
          960
        ]
      ]
    },
    "brand-images/services/Gold.jpg": {
      "src": "brand-images/optimized/gold-960-7a72fff46835.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/gold-320-49db21a5ddc0.webp",
          320
        ],
        [
          "brand-images/optimized/gold-640-ed8f592a8bed.webp",
          640
        ],
        [
          "brand-images/optimized/gold-960-7a72fff46835.webp",
          960
        ]
      ]
    },
    "brand-images/services/Luxury Fashion.jpg": {
      "src": "brand-images/optimized/luxury-fashion-960-2e0afb525486.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/luxury-fashion-320-ecbd4dcbfdea.webp",
          320
        ],
        [
          "brand-images/optimized/luxury-fashion-640-3be15ea3914c.webp",
          640
        ],
        [
          "brand-images/optimized/luxury-fashion-960-2e0afb525486.webp",
          960
        ]
      ]
    },
    "brand-images/services/Confidential.jpg": {
      "src": "brand-images/optimized/confidential-960-b6f2ecde5c9d.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/confidential-320-fbc468b2034f.webp",
          320
        ],
        [
          "brand-images/optimized/confidential-640-50c6d63c8e2f.webp",
          640
        ],
        [
          "brand-images/optimized/confidential-960-b6f2ecde5c9d.webp",
          960
        ]
      ]
    },
    "brand-images/services/Gadgets.jpg": {
      "src": "brand-images/optimized/gadgets-960-86e7a49b37db.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/gadgets-320-f4004cc93704.webp",
          320
        ],
        [
          "brand-images/optimized/gadgets-640-929ccb76cab8.webp",
          640
        ],
        [
          "brand-images/optimized/gadgets-960-86e7a49b37db.webp",
          960
        ]
      ]
    },
    "brand-images/services/IT.jpg": {
      "src": "brand-images/optimized/it-960-b240c0adedc9.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/it-320-578552b3efdd.webp",
          320
        ],
        [
          "brand-images/optimized/it-640-b233e050c9b9.webp",
          640
        ],
        [
          "brand-images/optimized/it-960-b240c0adedc9.webp",
          960
        ]
      ]
    },
    "brand-images/services/Other.jpg": {
      "src": "brand-images/optimized/other-960-73c546afef6c.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/other-320-a3c60725ac12.webp",
          320
        ],
        [
          "brand-images/optimized/other-640-95f202dba4e9.webp",
          640
        ],
        [
          "brand-images/optimized/other-960-73c546afef6c.webp",
          960
        ]
      ]
    },
    "brand-images/review-1.jpg": {
      "src": "brand-images/optimized/review-1-600-433f93fbfcdd.webp",
      "width": 600,
      "height": 800,
      "variants": [
        [
          "brand-images/optimized/review-1-400-db9f7e90e633.webp",
          400
        ],
        [
          "brand-images/optimized/review-1-600-433f93fbfcdd.webp",
          600
        ]
      ]
    },
    "brand-images/review-2.jpg": {
      "src": "brand-images/optimized/review-2-600-cfe972ea5fd5.webp",
      "width": 600,
      "height": 800,
      "variants": [
        [
          "brand-images/optimized/review-2-400-76af01ce8dfb.webp",
          400
        ],
        [
          "brand-images/optimized/review-2-600-cfe972ea5fd5.webp",
          600
        ]
      ]
    },
    "brand-images/review-3.jpg": {
      "src": "brand-images/optimized/review-3-600-bec34cb0c974.webp",
      "width": 600,
      "height": 800,
      "variants": [
        [
          "brand-images/optimized/review-3-400-bd4642f1bff8.webp",
          400
        ],
        [
          "brand-images/optimized/review-3-600-bec34cb0c974.webp",
          600
        ]
      ]
    },
    "brand-images/review-4.jpg": {
      "src": "brand-images/optimized/review-4-600-13537e929ec1.webp",
      "width": 600,
      "height": 800,
      "variants": [
        [
          "brand-images/optimized/review-4-400-7de496b5cc34.webp",
          400
        ],
        [
          "brand-images/optimized/review-4-600-13537e929ec1.webp",
          600
        ]
      ]
    },
    "brand-images/review-5.jpg": {
      "src": "brand-images/optimized/review-5-600-3f29576257e1.webp",
      "width": 600,
      "height": 800,
      "variants": [
        [
          "brand-images/optimized/review-5-400-2e0add290f08.webp",
          400
        ],
        [
          "brand-images/optimized/review-5-600-3f29576257e1.webp",
          600
        ]
      ]
    },
    "brand-images/review-6.jpg": {
      "src": "brand-images/optimized/review-6-800-6f939713f373.webp",
      "width": 800,
      "height": 1067,
      "variants": [
        [
          "brand-images/optimized/review-6-400-f89949ad0c63.webp",
          400
        ],
        [
          "brand-images/optimized/review-6-800-6f939713f373.webp",
          800
        ],
        [
          "brand-images/optimized/review-6-1200-c9eaefb96337.webp",
          1200
        ]
      ]
    },
    "brand-images/review-7.jpg": {
      "src": "brand-images/optimized/review-7-800-7bda5cc24deb.webp",
      "width": 800,
      "height": 1067,
      "variants": [
        [
          "brand-images/optimized/review-7-400-6f0d58c4dcf6.webp",
          400
        ],
        [
          "brand-images/optimized/review-7-800-7bda5cc24deb.webp",
          800
        ],
        [
          "brand-images/optimized/review-7-1200-530b3e72906c.webp",
          1200
        ]
      ]
    },
    "brand-images/review-8.jpg": {
      "src": "brand-images/optimized/review-8-800-3b7f0cfee233.webp",
      "width": 800,
      "height": 1067,
      "variants": [
        [
          "brand-images/optimized/review-8-400-a25eaf328548.webp",
          400
        ],
        [
          "brand-images/optimized/review-8-800-3b7f0cfee233.webp",
          800
        ],
        [
          "brand-images/optimized/review-8-1200-e52b054651e6.webp",
          1200
        ]
      ]
    },
    "brand-images/review-9.jpg": {
      "src": "brand-images/optimized/review-9-800-1057265e03f0.webp",
      "width": 800,
      "height": 1067,
      "variants": [
        [
          "brand-images/optimized/review-9-400-d7a69565f30d.webp",
          400
        ],
        [
          "brand-images/optimized/review-9-800-1057265e03f0.webp",
          800
        ],
        [
          "brand-images/optimized/review-9-1200-2d96fb8e1bcf.webp",
          1200
        ]
      ]
    },
    "brand-images/review-10.jpg": {
      "src": "brand-images/optimized/review-10-800-0242bb53f532.webp",
      "width": 800,
      "height": 1067,
      "variants": [
        [
          "brand-images/optimized/review-10-400-89f038691b06.webp",
          400
        ],
        [
          "brand-images/optimized/review-10-800-0242bb53f532.webp",
          800
        ],
        [
          "brand-images/optimized/review-10-1200-a70f3f870a74.webp",
          1200
        ]
      ]
    },
    "brand-images/review-11.jpg": {
      "src": "brand-images/optimized/review-11-800-c56df220ebac.webp",
      "width": 800,
      "height": 1067,
      "variants": [
        [
          "brand-images/optimized/review-11-400-67d0c3092fc2.webp",
          400
        ],
        [
          "brand-images/optimized/review-11-800-c56df220ebac.webp",
          800
        ],
        [
          "brand-images/optimized/review-11-1200-3bcf8648a0cb.webp",
          1200
        ]
      ]
    },
    "brand-images/How-it-work-1.jpg": {
      "src": "brand-images/optimized/how-it-work-1-960-3707809ae88d.webp",
      "width": 960,
      "height": 960,
      "variants": [
        [
          "brand-images/optimized/how-it-work-1-480-6704decd4036.webp",
          480
        ],
        [
          "brand-images/optimized/how-it-work-1-960-3707809ae88d.webp",
          960
        ],
        [
          "brand-images/optimized/how-it-work-1-1200-bcaf7c1b6526.webp",
          1200
        ]
      ]
    },
    "brand-images/How-it-work-2.jpg": {
      "src": "brand-images/optimized/how-it-work-2-960-244ed2888edf.webp",
      "width": 960,
      "height": 640,
      "variants": [
        [
          "brand-images/optimized/how-it-work-2-480-74ca9060900f.webp",
          480
        ],
        [
          "brand-images/optimized/how-it-work-2-960-244ed2888edf.webp",
          960
        ],
        [
          "brand-images/optimized/how-it-work-2-1200-0ed01d80a3dd.webp",
          1200
        ]
      ]
    },
    "brand-images/How-it-work-3.jpg": {
      "src": "brand-images/optimized/how-it-work-3-960-2f2b8ebdc167.webp",
      "width": 960,
      "height": 535,
      "variants": [
        [
          "brand-images/optimized/how-it-work-3-480-a9fb0436dada.webp",
          480
        ],
        [
          "brand-images/optimized/how-it-work-3-960-2f2b8ebdc167.webp",
          960
        ],
        [
          "brand-images/optimized/how-it-work-3-1200-566171602548.webp",
          1200
        ]
      ]
    },
    "brand-images/How-it-work-4.jpg": {
      "src": "brand-images/optimized/how-it-work-4-960-2340e099a164.webp",
      "width": 960,
      "height": 640,
      "variants": [
        [
          "brand-images/optimized/how-it-work-4-480-e2e13f10a8c4.webp",
          480
        ],
        [
          "brand-images/optimized/how-it-work-4-960-2340e099a164.webp",
          960
        ],
        [
          "brand-images/optimized/how-it-work-4-1200-504b5d5eccae.webp",
          1200
        ]
      ]
    }
  };
  // END GENERATED RESPONSIVE IMAGES

  // Preserve configured/custom images that are not in the prepared registry.
  // Callers supply sizes because each section has its own responsive layout.
  function getImageProps(originalPath, sizes) {
    if (!Object.prototype.hasOwnProperty.call(responsiveImages, originalPath)) {
      return { src: originalPath };
    }
    const image = responsiveImages[originalPath];
    return {
      src: image.src,
      srcSet: image.variants.map(([src, width]) => `${src} ${width}w`).join(', '),
      sizes,
      width: image.width,
      height: image.height,
    };
  }

  window.CONRAD_EXPRESS_ASSETS = { reviewPhotos, whyImage, processImages, getImageProps };
})();
