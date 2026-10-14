(function ($) {
  'use strict';

  $(function () {
    $('.docs-container [href="#"]').off('click.blogPlaceholder').on('click.blogPlaceholder', function (event) {
      event.preventDefault();
    });

    const navigation = document.getElementById('navigation');
    if (!navigation || navigation.dataset.scrollTracking === 'true') return;
    navigation.dataset.scrollTracking = 'true';

    const sections = [];
    navigation.querySelectorAll('a[href]').forEach(function (link) {
      const target = new URL(link.href);
      if (target.origin !== location.origin || target.pathname !== location.pathname || !target.hash) return;
      let id = target.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch (error) {
        // A literal percent sign can also be part of a heading ID.
      }
      const heading = document.getElementById(id);
      if (heading) sections.push({ link: link, heading: heading, top: 0 });
    });
    if (!sections.length) return;

    let activeLink = null;
    let framePending = false;

    function update() {
      framePending = false;
      const position = window.scrollY + 80;
      let current = sections[0];
      for (const section of sections) {
        if (section.top > position) break;
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
