/* Prepare the article before application.js tracks the current section. */
(function ($) {
  'use strict';

  $(function () {
    const source = document.getElementById('markdown-toc');
    const destination = document.querySelector('#navigation .sidenav');

    // The home page already has a year/month index and no Markdown TOC.
    if (source && destination) {
      destination.replaceChildren(...source.childNodes);
      source.remove();
    }

    $('#navigation ul').addClass('nav flex-column');
    $('#navigation li').addClass('nav-item');
    $('#navigation a').addClass('nav-link');
    const toggle = document.getElementById('toc-toggle');
    if (toggle) {
      toggle.hidden = !document.querySelector('#navigation a[href]:not([href=""]):not([href="#"])');
    }

    $('.docs-content table').addClass('table table-hover').each(function () {
      if (this.parentElement.classList.contains('table-responsive')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      this.before(wrapper);
      wrapper.appendChild(this);
    });

    $('.docs-content').find('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').each(function () {
      if (!this.id || this.querySelector(':scope > a.anchor')) return;

      const anchor = document.createElement('a');
      anchor.className = 'anchor fa fa-link';
      anchor.href = '#' + encodeURIComponent(this.id);
      anchor.setAttribute('aria-label', '链接到：' + this.textContent.trim());
      anchor.title = '链接到本节';
      this.appendChild(anchor);
    });
  });
}(jQuery));
