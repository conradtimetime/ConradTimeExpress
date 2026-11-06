'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { mount, text, descendants, hasClass, root } = require('./helpers/component-harness.cjs');

const byType = type => node => node.type === type;
const byClass = name => node => hasClass(node, name);
const safeExternal = link => {
  assert.match(link.props.href, /^https:\/\//);
  assert.equal(link.props.target, '_blank');
  assert.ok(link.props.rel.includes('noopener') && link.props.rel.includes('noreferrer'));
};
const localImageExists = image => {
  assert.ok(fs.existsSync(path.join(root, image.props.src)), `Image exists: ${image.props.src}`);
};

test('TC-NAV01: navigation exposes the five section anchors and a safe LINE booking link', () => {
  for (const language of ['en', 'th']) {
    const nav = mount('Nav', { language });
    const desktop = nav.find(byClass('nav-links'));
    const links = [...descendants(desktop)].filter(byType('a'));
    assert.deepEqual(links.filter(link => link.props.href.startsWith('#')).map(link => link.props.href),
      ['#services', '#why', '#process', '#packages', '#contact']);
    const booking = links.find(link => link.props['data-cta'] === 'nav');
    assert.equal(booking.props.href, nav.data.SITE_CONFIG.contact.lineUrl);
    safeExternal(booking);
    for (const link of links) assert.ok(text(link).trim());
  }
});

test('TC-NAV02: language buttons request the opposite language in both directions', () => {
  const nav = mount('Nav', { language: 'th' });
  nav.fire(nav.find(node => node.props['aria-label'] === 'Switch to English'));
  assert.deepEqual(nav.calls.language, ['en']);
  nav.setLanguage('en');
  nav.fire(nav.find(node => node.props['aria-label'] === 'Switch to Thai'));
  assert.deepEqual(nav.calls.language, ['en', 'th']);
});

test('TC-NAV03: mobile menu opens, exposes matching anchors, and closes after selecting a link', () => {
  const nav = mount('Nav');
  assert.equal(nav.all(node => node.type === 'a' && node.props.href === '#contact').length, 1);
  nav.fire(nav.find(byClass('nav-burger')));
  const contactLinks = nav.all(node => node.type === 'a' && node.props.href === '#contact');
  assert.equal(contactLinks.length, 2);
  nav.fire(contactLinks.find(link => typeof link.props.onClick === 'function'));
  assert.equal(nav.all(node => node.type === 'a' && node.props.href === '#contact').length, 1);
});

test('TC-NAV04: scrolled navigation gains its readable dark surface', () => {
  const nav = mount('Nav');
  assert.equal(nav.find(byType('nav')).props.style.background, 'transparent');
  nav.setProps({ scrolled: true });
  assert.equal(nav.find(byType('nav')).props.style.background, '#0f1e35fa');
});

test('TC-HR01: hero renders localized title, configured image, starting price, and both CTA targets', () => {
  for (const language of ['en', 'th']) {
    const hero = mount('Hero', { language });
    const copy = hero.data.COPY[language];
    assert.equal(hero.find(byType('h1')) && text(hero.find(byType('h1'))), copy.hero.title);
    assert.equal(text(hero.find(byClass('hero-price-amount'))), copy.packages.items[0].price);
    const image = hero.find(byType('img'));
    assert.equal(image.props.src, hero.data.ASSETS.getImageProps(hero.data.SITE_CONFIG.heroBackground, '100vw').src);
    localImageExists(image);
    const links = hero.all(byType('a'));
    assert.equal(links.length, 2);
    assert.equal(links[0].props.href, hero.data.SITE_CONFIG.contact.lineUrl);
    safeExternal(links[0]);
    assert.equal(links[1].props.href, '#services');
    const trust = text(hero.find(byClass('h5')));
    copy.trust.forEach(label => assert.ok(trust.includes(label.toUpperCase())));
  }
});

test('TC-HR02: dark and light hero themes keep a contrasting title color', () => {
  const hero = mount('Hero');
  assert.equal(hero.find(byType('h1')).props.style.color, '#ffffff');
  hero.setProps({ layout: 'light' });
  assert.equal(hero.find(byType('h1')).props.style.color, '#0f1e35');
});

test('TC-BR01: all five partner logos exist, have names, and link safely to their websites', () => {
  for (const language of ['en', 'th']) {
    const brands = mount('Brands', { language });
    const links = brands.all(byClass('brand-logo-card'));
    assert.equal(links.length, 5);
    assert.equal(brands.all(byClass('brand-logo')).length, 5);
    links.forEach(link => {
      safeExternal(link);
      assert.ok(link.props['aria-label']);
      const image = [...descendants(link)].find(byType('img'));
      assert.ok(image.props.alt);
      localImageExists(image);
    });
    assert.equal(text(brands.find(byClass('brands-title'))), brands.data.COPY[language].brands.title);
  }
});

test('TC-SV01: all ten services render matching bilingual IDs, localized descriptions and existing photos', () => {
  const english = mount('Services');
  const ids = Array.from(english.data.COPY.en.services.items, item => item.id);
  assert.deepEqual(ids, Array.from(english.data.COPY.th.services.items, item => item.id));
  assert.equal(new Set(ids).size, 10);
  for (const language of ['en', 'th']) {
    const services = mount('Services', { language });
    const cards = services.all(byClass('service-card'));
    assert.equal(cards.length, 10);
    assert.equal(services.find(byType('a')).props.href, '#contact');
    cards.forEach((card, index) => {
      const nodes = [...descendants(card)];
      const service = services.data.COPY[language].services.items[index];
      assert.equal(text(nodes.find(byClass('service-title'))), service.title);
      assert.equal(text(nodes.find(byClass('service-copy'))), service.desc);
      const image = nodes.find(byClass('service-photo'));
      assert.equal(image.props.alt, service.title);
      localImageExists(image);
      assert.equal(card.props.tabIndex, '0');
    });
  }
});

test('TC-SV02: broken service photos hide while fallback and service content remain available', () => {
  const services = mount('Services');
  const photo = services.find(byClass('service-photo'));
  const target = { style: {} };
  services.fire(photo, 'onError', { target });
  assert.equal(target.style.display, 'none');
  assert.equal(services.all(byClass('service-fallback')).length, 10);
  assert.equal(services.all(byClass('service-title')).length, 10);
});

test('TC-WHY01: six trust pillars render their localized title, subtitle and explanation', () => {
  for (const language of ['en', 'th']) {
    const why = mount('WhyUs', { language });
    const copy = why.data.COPY[language];
    assert.equal(text(why.find(byClass('why-heading'))), copy.why.title);
    const cards = why.all(byClass('why-feature'));
    assert.equal(cards.length, 6);
    assert.equal(why.find(byType('a')).props.href, '#contact');
    cards.forEach((card, index) => {
      const nodes = [...descendants(card)];
      assert.equal(text(nodes.find(byClass('why-feature-title'))), copy.pillars.items[index].title);
      if (copy.pillars.items[index].sub) assert.equal(text(nodes.find(byClass('why-feature-sub'))), copy.pillars.items[index].sub);
      assert.equal(text(nodes.find(byClass('why-feature-desc'))), copy.pillars.items[index].desc);
    });
  }
});

test('TC-WHY02: hover emphasis moves to one trust pillar and clears on leave', () => {
  const why = mount('WhyUs');
  why.fire(why.all(byClass('why-feature'))[2], 'onMouseEnter');
  assert.equal(why.all(byClass('is-hover')).length, 1);
  assert.ok(hasClass(why.all(byClass('why-feature'))[2], 'is-hover'));
  why.fire(why.all(byClass('why-feature'))[2], 'onMouseLeave');
  assert.equal(why.all(byClass('is-hover')).length, 0);
});

test('TC-PR01: process initially selects step one, 25% progress, and its matching photo', () => {
  const process = mount('Process');
  assert.equal(process.all(byClass('process-step-card')).length, 4);
  assert.equal(process.find(byClass('process-progress-fill')).props.style.width, '25%');
  assert.equal(process.find(byType('a')).props.href, '#contact');
  assert.equal(process.find(node => node.props['aria-current'] === 'step').props.className.includes('is-active'), true);
  const image = process.find(byType('img'));
  assert.equal(image.props.src, process.data.ASSETS.getImageProps(process.data.ASSETS.processImages[0].src).src);
  localImageExists(image);
});

test('TC-PR02: selecting each of the four steps updates active state, progress and localized image text', () => {
  for (const language of ['en', 'th']) {
    const process = mount('Process', { language });
    for (let index = 0; index < 4; index++) {
      process.fire(process.all(byClass('process-step-card'))[index]);
      assert.equal(process.find(byClass('process-progress-fill')).props.style.width, `${(index + 1) * 25}%`);
      assert.equal(process.all(node => node.props['aria-current'] === 'step').length, 1);
      assert.ok(hasClass(process.all(byClass('process-step-card'))[index], 'is-active'));
      assert.equal(process.all(byClass('is-complete')).length, index);
      const image = process.find(byType('img'));
      assert.equal(image.props.src, process.data.ASSETS.getImageProps(process.data.ASSETS.processImages[index].src).src);
      assert.equal(image.props.alt, process.data.COPY[language].process.steps[index].title);
      localImageExists(image);
    }
  }
});

test('TC-PR03: returning from final process step to first removes all completed flags', () => {
  const process = mount('Process');
  process.fire(process.all(byClass('process-step-card'))[3]);
  assert.equal(process.all(byClass('is-complete')).length, 3);
  process.fire(process.all(byClass('process-step-card'))[0]);
  assert.equal(process.all(byClass('is-complete')).length, 0);
  assert.equal(process.find(byClass('process-progress-fill')).props.style.width, '25%');
});

const reviewButtons = view => view.all(byType('button'));
const activeReview = view => reviewButtons(view).findIndex(button => button.props.style.width === '28px');
test('TC-RV01: testimonial photos follow the featured order and have bilingual customer names', () => {
  for (const language of ['en', 'th']) {
    const reviews = mount('Testimonials', { language });
    const images = reviews.all(byType('img'));
    assert.equal(reviews.find(byType('a')).props.href, '#contact');
    assert.deepEqual(images.map(image => image.props.src), [9, 10, 11, 2, 4, 5].map(number =>
      reviews.data.ASSETS.getImageProps(`brand-images/review-${number}.jpg`).src));
    assert.equal(images.length, reviewButtons(reviews).length);
    images.forEach((image, index) => {
      assert.equal(image.props.alt, reviews.data.REVIEW_CARDS[language][index].author);
      localImageExists(image);
    });
  }
});

test('TC-RV02: every testimonial navigation control selects its photo and language change keeps selection', () => {
  const reviews = mount('Testimonials');
  assert.equal(activeReview(reviews), 0);
  for (let index = 0; index < 6; index++) {
    reviews.fire(reviewButtons(reviews)[index]);
    assert.equal(activeReview(reviews), index);
  }
  reviews.setLanguage('th');
  assert.equal(activeReview(reviews), 5);
});

test('TC-RV05: testimonial navigation buttons have localized accessible names and mark the current photo', () => {
  for (const [language, pattern] of [['en', /^Show review 3 of 6: .+/], ['th', /^ดูรีวิวที่ 3 จาก 6: .+/]]) {
    const reviews = mount('Testimonials', { language });
    const buttons = reviewButtons(reviews);
    assert.equal(buttons.length, 6);
    assert.match(buttons[2].props['aria-label'], pattern);
    assert.equal(new Set(buttons.map(button => button.props['aria-label'])).size, 6, 'Each name is unique');
    assert.ok(buttons.every(button => button.props.type === 'button'));
    reviews.fire(buttons[2]);
    assert.deepEqual(reviewButtons(reviews).map(button => button.props['aria-current']),
      [undefined, undefined, 'true', undefined, undefined, undefined]);
  }
});

test('TC-RV03: testimonials auto-advance only while visible and wrap after the final photo', () => {
  const reviews = mount('Testimonials');
  reviews.advanceTimers(12000);
  assert.equal(activeReview(reviews), 0, 'Offscreen carousel stays still');
  reviews.intersect('testimonials', true);
  reviews.advanceTimers(6000);
  assert.equal(activeReview(reviews), 1);
  reviews.fire(reviewButtons(reviews)[5]);
  reviews.advanceTimers(6000);
  assert.equal(activeReview(reviews), 0, 'Final photo wraps to first');
  reviews.intersect('testimonials', false);
  reviews.advanceTimers(12000);
  assert.equal(activeReview(reviews), 0, 'Leaving viewport stops the interval');
});

test('TC-RV04: testimonial card dimensions recompute for mobile without exceeding viewport width', () => {
  const reviews = mount('Testimonials');
  const card = () => reviews.find(node => typeof node.props.onClick === 'function' && node.props.style?.transform?.includes('scale(1.04)'));
  assert.equal(card().props.style.width, '400px');
  reviews.resize(375);
  assert.equal(card().props.style.width, '293px');
  assert.ok(parseInt(card().props.style.width, 10) * 1.04 < 375);
});

test('TC-PK01: four packages show their price/contact text, features, promotion and one recommended tier', () => {
  for (const language of ['en', 'th']) {
    const packages = mount('Packages', { language });
    const cards = packages.all(byClass('package-card'));
    assert.equal(cards.length, 4);
    assert.equal(packages.all(byClass('is-highlighted')).length, 1);
    cards.forEach((card, index) => {
      const data = packages.data.COPY[language].packages.items[index];
      const nodes = [...descendants(card)];
      assert.equal(text(nodes.find(byType('h3'))), data.name.toUpperCase());
      const price = nodes.find(byClass(data.priceText ? 'package-price-contact' : 'package-price-amount'));
      assert.equal(text(price), data.priceText || data.price);
      const details = text(nodes.find(byClass('package-details-list')));
      for (const feature of [...(data.details || []), ...(data.features || [])]) assert.ok(details.includes(feature));
      if (data.cornerTag) assert.equal(text(nodes.find(byClass('package-corner-tag'))), data.cornerTag.label);
      if (data.badge) assert.ok(text(card).includes(data.badge));
      assert.ok(card.props['aria-label'].includes(data.name));
    });
    assert.equal(text(packages.find(byClass('package-price-note'))), packages.data.COPY[language].packages.priceNote);
  }
});

test('TC-PK02: package CTA links use LINE with package attribution and preserve selected card state', () => {
  const packages = mount('Packages');
  for (let index = 0; index < 4; index++) {
    const link = packages.all(byClass('package-cta'))[index];
    safeExternal(link);
    assert.equal(link.props.href, packages.data.SITE_CONFIG.contact.lineUrl);
    assert.equal(link.props['data-cta'], 'package');
    assert.equal(link.props['data-package'], packages.data.COPY.en.packages.items[index].name);
    packages.fire(link);
    assert.equal(packages.all(byClass('is-active')).length, 1);
    assert.ok(hasClass(packages.all(byClass('package-card'))[index], 'is-active'));
  }
  packages.fire(packages.find(node => node.props.id === 'packages'));
  assert.equal(packages.all(byClass('is-active')).length, 0);
});

test('TC-FL01: floating contact widget appears after 1200ms, opens, and closes after contact selection', () => {
  const floating = mount('FloatingLine');
  assert.equal(floating.find(byClass('fabx')).props.style.opacity, 0);
  floating.advanceTimers(1199);
  assert.equal(floating.find(byClass('fabx')).props.style.opacity, 0);
  floating.advanceTimers(1);
  assert.equal(floating.find(byClass('fabx')).props.style.opacity, 1);
  floating.fire(floating.find(byClass('fabx-main')));
  assert.equal(floating.find(byClass('fabx-main')).props['aria-expanded'], true);
  assert.equal(floating.all(node => node.type === 'a' && hasClass(node, 'is-open')).length, 2);
  floating.fire(floating.find(node => node.props['data-cta'] === 'floating_line'));
  assert.equal(floating.find(byClass('fabx-main')).props['aria-expanded'], false);
});

test('TC-FL03: floating contact widget rides above the footer and closed actions let clicks through', () => {
  let footerTop = 2400;
  let reads = 0;
  const footer = { getBoundingClientRect: () => { reads++; return { top: footerTop }; } };
  const floating = mount('FloatingLine', { height: 600, elements: { '.contact-footer': footer } });
  const bottom = () => floating.find(byClass('fabx')).props.style.bottom;
  const shift = () => floating.find(byClass('fabx')).props.ref.current.style.getPropertyValue('--footer-shift');
  assert.equal(bottom(), '30px');
  for (let i = 0; i < 120; i++) floating.scroll();
  assert.equal(reads, 0, 'No footer geometry reads while offscreen');
  footerTop = 420; // 180px of footer on screen
  floating.intersect('.contact-footer', true);
  assert.equal(shift(), '-180px');
  const updates = floating.calls.stateUpdates;
  footerTop = 400;
  floating.scroll();
  assert.equal(shift(), '-200px');
  assert.equal(bottom(), '30px', 'Layout position stays fixed; translation clears the footer');
  assert.equal(floating.calls.stateUpdates, updates, 'Scrolling does not call React state setters');
  footerTop = 380;
  floating.resize(1024);
  assert.equal(shift(), '-220px', 'Active footer lift follows resize without state updates');
  footerTop = 900; // footer scrolled back out of view
  floating.intersect('.contact-footer', false);
  assert.equal(shift(), '0px');
  const before = reads;
  floating.scroll();
  assert.equal(reads, before, 'Leaving the footer removes the scroll listener');
  const css = text(floating.find(byType('style')));
  assert.match(css, /\.fabx-actions \{[^}]*pointer-events:none/);
  assert.match(css, /\.fabx-act\.is-open \{[^}]*pointer-events:auto/);
});

test('TC-RV06: reduced motion disables autoplay initially and when changed, while manual navigation remains usable', () => {
  const reviews = mount('Testimonials', { reducedMotion: true });
  reviews.intersect('testimonials', true);
  reviews.advanceTimers(12000);
  assert.equal(activeReview(reviews), 0);
  reviews.fire(reviewButtons(reviews)[3]);
  assert.equal(activeReview(reviews), 3);
  reviews.reducedMotion(false);
  reviews.advanceTimers(6000);
  assert.equal(activeReview(reviews), 4);
  reviews.reducedMotion(true);
  reviews.advanceTimers(12000);
  assert.equal(activeReview(reviews), 4);
  reviews.unmount();
});

test('TC-FL02: floating contact labels change language, tracking falls back to LINE, and back-to-top scrolls', () => {
  const floating = mount('FloatingLine');
  assert.equal(floating.find(byClass('fabx-main')).props['aria-label'], 'Contact us');
  for (const link of floating.all(byType('a'))) {
    safeExternal(link);
    assert.equal(link.props.href, floating.data.SITE_CONFIG.contact.lineUrl);
  }
  floating.setLanguage('th');
  assert.equal(floating.find(byClass('fabx-main')).props['aria-label'], 'ติดต่อเรา');
  assert.equal(floating.find(node => node.props['data-cta'] === 'floating_track').props.title, 'ติดตามสถานะการขนส่ง');
  floating.fire(floating.find(node => node.props['aria-label'] === 'Back to top'));
  assert.equal(floating.calls.scroll.length, 1);
  assert.equal(floating.calls.scroll[0].top, 0);
  assert.equal(floating.calls.scroll[0].behavior, 'smooth');
});
