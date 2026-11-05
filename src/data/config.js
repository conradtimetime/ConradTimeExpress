(function () {
  "use strict";

  const SITE_CONFIG = {
    heroBackground: "brand-images/Section_Hero.jpg",
    contact: {
      email: "conradtime.time@gmail.com",
      lineUrl: "https://line.me/ti/p/~@ConradExpress",
      trackUrl: "",
      formEndpoint: "https://script.google.com/macros/s/AKfycbwSiEBlsmjYevzxkLyU25V2S4vJYpcnClHGJZnjqoGzPsG-CY0kwGj7286t7nQIVf8QWQ/exec",
    },
    analytics: {
      // Google Tag Manager container ID, e.g. "GTM-AB12CD3". Leave empty to keep
      // all Google tags (and the consent banner) off. Run `npm run build` after
      // changing it: the build stamps it into index.html and opens the CSP.
      gtmId: "",
    },
  };

  window.CONRAD_EXPRESS_CONFIG = SITE_CONFIG;
})();
