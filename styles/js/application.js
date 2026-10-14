(function ($) {
  'use strict';

  $(function () {
    $('.docs-container [href="#"]').off('click.blogPlaceholder').on('click.blogPlaceholder', function (event) {
      event.preventDefault();
    });

    const navigation = document.getElementById('navigation');
    if (!navigation || navigation.dataset.scrollTracking === 'true') return;
    navigation.dataset.scrollTracking = 'true';

    function resolveSection(link) {
      const target = new URL(link.href);
      if (target.origin !== location.origin || target.pathname !== location.pathname ||
          target.search !== location.search || !target.hash) return null;
      let id = target.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch (error) {
        // A literal percent sign can also be part of a heading ID.
      }
      const heading = document.getElementById(id);
      return heading ? { link: link, heading: heading, hash: target.hash, top: 0 } : null;
    }

    const panel = document.getElementById('table-of-contents');
    const toggle = document.getElementById('toc-toggle');
    if (panel && window.bootstrap) {
      let pendingSection = null;

      panel.addEventListener('show.bs.offcanvas', function () {
        document.documentElement.classList.add('toc-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      });
      panel.addEventListener('hide.bs.offcanvas', function () {
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
      panel.addEventListener('shown.bs.offcanvas', function () {
        const body = panel.querySelector('.offcanvas-body');
        const current = navigation.querySelector('[aria-current="location"]');
        if (!body || !current) return;
        const bodyBounds = body.getBoundingClientRect();
        const linkBounds = current.getBoundingClientRect();
        // Only scroll the drawer; opening it must leave the article in place.
        if (linkBounds.top < bodyBounds.top || linkBounds.bottom > bodyBounds.bottom) {
          body.scrollTop += linkBounds.top - bodyBounds.top - body.clientHeight / 2 + linkBounds.height / 2;
        }
      });
      panel.addEventListener('hidden.bs.offcanvas', function () {
        document.documentElement.classList.remove('toc-open');
        if (!pendingSection) return;
        const section = pendingSection;
        pendingSection = null;
        // Bootstrap first restores focus to the trigger. Move focus afterwards
        // so keyboard readers continue from the section they chose.
        window.requestAnimationFrame(function () {
          if (location.hash !== section.hash) location.hash = section.hash;
          section.heading.scrollIntoView({ block: 'start' });
          if (!section.heading.hasAttribute('tabindex')) {
            section.heading.setAttribute('tabindex', '-1');
            section.heading.addEventListener('blur', function () {
              section.heading.removeAttribute('tabindex');
            }, { once: true });
          }
          section.heading.focus({ preventScroll: true });
        });
      });
      navigation.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
            event.shiftKey || event.altKey) return;
        const link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const section = resolveSection(link);
        if (!section || !panel.classList.contains('show')) return;
        event.preventDefault();
        pendingSection = section;
        window.bootstrap.Offcanvas.getOrCreateInstance(panel).hide();
      });
    }

    const sections = [];
    navigation.querySelectorAll('a[href]').forEach(function (link) {
      const section = resolveSection(link);
      if (section) sections.push(section);
    });
    if (!sections.length) return;

    let activeLink = null;
    let framePending = false;

    function update() {
      framePending = false;
      const position = window.scrollY + 80;
      let current = sections[0];
      for (const section of sections) {
        // Native fragment scrolling rounds positions to device pixels, while
        // headings can retain fractional layout positions.
        if (section.top > position + 2) break;
        current = section;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }
      if (activeLink === current.link) return;
      activeLink = current.link;

      navigation.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      activeLink.setAttribute('aria-current', 'location');
      let item = activeLink.closest('li');
      while (item && navigation.contains(item)) {
        const link = item.querySelector(':scope > .nav-link');
        if (link) link.classList.add('active');
        item = item.parentElement.closest('li');
      }
    }

    function scheduleUpdate() {
      if (framePending) return;
      framePending = true;
      window.requestAnimationFrame(update);
    }

    function refresh() {
      sections.forEach(function (section) {
        section.top = section.heading.getBoundingClientRect().top + window.scrollY;
      });
      sections.sort(function (first, second) { return first.top - second.top; });
      scheduleUpdate();
    }

    // Track heading positions instead of observing their short boxes: the
    // current section stays highlighted throughout long paragraphs/code blocks.
    refresh();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', refresh);
    if (document.readyState !== 'complete') {
      window.addEventListener('load', refresh, { once: true });
    }
    document.querySelectorAll('.docs-content img').forEach(function (image) {
      if (!image.complete) image.addEventListener('load', refresh, { once: true });
    });
    const content = document.querySelector('.docs-content');
    if (content && window.ResizeObserver) {
      new ResizeObserver(refresh).observe(content);
    }
  });
}(jQuery));
