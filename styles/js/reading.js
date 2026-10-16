(function () {
  'use strict';

  let article;
  let observer;
  let nextId = 0;
  let activeMathZoom;
  const scrollRegions = new Map();
  const excluded = '.language-mermaid, .mermaid, .reading-diagram, .MathJax, .MathJax_Display, .MathJax_SVG_Display, .MJXc-display, .MathJax_Preview, [id^="MathJax-"]';

  function refreshOverflow() {
    scrollRegions.forEach(function (region, viewport) {
      const overflowing = viewport.scrollWidth > viewport.clientWidth + 2;
      if (region.overflowing === overflowing) return;
      region.overflowing = overflowing;
      region.hint.hidden = !overflowing;
      viewport.classList.toggle('reading-overflows', overflowing);
      if (overflowing) {
        viewport.setAttribute('tabindex', '0');
        viewport.setAttribute('role', 'region');
        viewport.setAttribute('aria-label', region.label);
        viewport.setAttribute('aria-describedby', region.hint.id);
      } else {
        ['tabindex', 'role', 'aria-label', 'aria-describedby'].forEach(function (name) {
          const value = region.attributes[name];
          if (value === null) viewport.removeAttribute(name);
          else viewport.setAttribute(name, value);
        });
      }
    });
  }

  function trackOverflow(viewport, content, container, label) {
    if (scrollRegions.has(viewport)) return;
    const hint = document.createElement(container.tagName === 'SPAN' ? 'span' : 'p');
    hint.className = 'reading-scroll-hint';
    hint.id = 'reading-scroll-hint-' + (++nextId);
    hint.textContent = '可左右滑动，或聚焦后用方向键滚动';
    hint.hidden = true;
    container.appendChild(hint);
    const attributes = {};
    ['tabindex', 'role', 'aria-label', 'aria-describedby'].forEach(function (name) {
      attributes[name] = viewport.getAttribute(name);
    });
    scrollRegions.set(viewport, { hint: hint, label: label, attributes: attributes });
    if (observer) {
      observer.observe(viewport);
      if (content !== viewport) observer.observe(content);
    }
  }

  function languageFor(root) {
    const candidates = [root].concat(Array.from(root.querySelectorAll('code, [class*="language-"], [data-lang]')));
    for (const node of candidates) {
      const match = Array.from(node.classList).find(function (name) { return /^(?:language|lang)-/.test(name); });
      const language = node.getAttribute('data-lang') || (match && match.replace(/^(?:language|lang)-/, ''));
      if (language) {
        const names = { cpp: 'C++', 'c++': 'C++', c: 'C', js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', py: 'Python', python: 'Python', bash: 'Bash', sh: 'Shell', shell: 'Shell', haskell: 'Haskell', scheme: 'Scheme', rust: 'Rust', text: '纯文本', plaintext: '纯文本' };
        return names[language.toLowerCase()] || language;
      }
    }
    return '纯文本';
  }

  function codeText(root, pre) {
    const content = root.querySelector('.rouge-code') || root.querySelector('code') || pre;
    const clone = content.cloneNode(true);
    clone.querySelectorAll('.lineno, .gutter, .rouge-gutter').forEach(function (node) { node.remove(); });
    return clone.textContent;
  }

  function legacyCopy(value) {
    const focus = document.activeElement;
    const selection = window.getSelection();
    const ranges = [];
    if (selection) {
      for (let i = 0; i < selection.rangeCount; i++) ranges.push(selection.getRangeAt(i).cloneRange());
    }
    const input = document.createElement('textarea');
    input.value = value;
    input.className = 'reading-copy-buffer';
    input.setAttribute('readonly', '');
    document.body.appendChild(input);
    input.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      input.remove();
      if (focus && typeof focus.focus === 'function') focus.focus({ preventScroll: true });
      if (selection) {
        selection.removeAllRanges();
        ranges.forEach(function (range) { selection.addRange(range); });
      }
    }
    if (!copied) throw new Error('Copy unavailable');
  }

  async function copy(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch (error) {
        // A browser may deny the Clipboard API while allowing a user-initiated copy.
      }
    }
    legacyCopy(value);
  }

  function enhanceCode() {
    article.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.reading-code, .gutter, .lineno, ' + excluded) || pre.querySelector(excluded)) return;
      let root = pre.closest('.highlight') || pre;
      root = root.closest('.highlighter-rouge') || root;
      if (!article.contains(root) || root.closest('.reading-code') || root.matches(excluded) || root.querySelector(excluded)) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'reading-code';
      const toolbar = document.createElement('div');
      toolbar.className = 'reading-code-toolbar';
      const language = document.createElement('span');
      language.className = 'reading-code-language';
      language.textContent = languageFor(root);
      const status = document.createElement('span');
      status.className = 'reading-code-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      const wrap = document.createElement('button');
      wrap.type = 'button';
      wrap.className = 'reading-code-button';
      wrap.textContent = '自动换行';
      wrap.setAttribute('aria-pressed', 'false');
      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'reading-code-button';
      copyButton.textContent = '复制';
      copyButton.setAttribute('aria-label', '复制代码');
      toolbar.append(language, status, wrap, copyButton);

      const body = document.createElement('div');
      body.className = 'reading-code-body';
      root.before(wrapper);
      wrapper.append(toolbar, body);
      body.appendChild(root);
      trackOverflow(body, pre, wrapper, language.textContent + '代码，可左右滚动');

      wrap.addEventListener('click', function () {
        const enabled = wrapper.classList.toggle('reading-code-wrap');
        wrap.setAttribute('aria-pressed', String(enabled));
        refreshOverflow();
      });
      let feedbackTimer;
      copyButton.addEventListener('click', async function () {
        window.clearTimeout(feedbackTimer);
        copyButton.disabled = true;
        status.textContent = '';
        try {
          await copy(codeText(root, pre));
          status.textContent = '已复制';
          status.classList.remove('reading-copy-failed');
        } catch (error) {
          status.textContent = '复制失败，请手动选择代码';
          status.classList.add('reading-copy-failed');
        } finally {
          copyButton.disabled = false;
          feedbackTimer = window.setTimeout(function () { status.textContent = ''; }, 5000);
        }
      });
    });
  }

  function enhanceTables() {
    article.querySelectorAll('table').forEach(function (table) {
      if (table.closest('.reading-code, .reading-table, pre, .highlight, ' + excluded)) return;
      let viewport = table.parentElement;
      if (!viewport.classList.contains('table-responsive')) {
        viewport = document.createElement('div');
        viewport.className = 'table-responsive';
        table.before(viewport);
        viewport.appendChild(table);
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'reading-table';
      viewport.before(wrapper);
      wrapper.appendChild(viewport);
      trackOverflow(viewport, table, wrapper, '表格，可左右滚动');
    });
  }

  function enhanceMath() {
    if (!article) return;
    article.querySelectorAll('.MathJax_Display, .MathJax_SVG_Display, .MJXc-display').forEach(function (display) {
      if (display.closest('.reading-math, #MathJax_Zoom, #MathJax_MenuFrame')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'reading-math';
      const viewport = document.createElement('div');
      viewport.className = 'reading-math-scroll';
      const preview = display.previousElementSibling;
      const source = display.nextElementSibling;
      display.before(wrapper);
      wrapper.appendChild(viewport);
      if (preview && preview.classList.contains('MathJax_Preview')) viewport.appendChild(preview);
      viewport.appendChild(display);
      // Keep the source adjacent to its output: MathJax uses this relationship
      // when reprocessing a formula or changing its renderer from the menu.
      if (source && source.tagName === 'SCRIPT' && /^math\//.test(source.type)) viewport.appendChild(source);
      trackOverflow(viewport, display, wrapper, '公式，可左右滚动');
    });
    enhanceInlineMath();
    refreshOverflow();
  }

  function enhanceInlineMath() {
    if (!article) return;
    article.querySelectorAll('[id^="MathJax-Element-"][id$="-Frame"]').forEach(function (math) {
      if (math.closest('.reading-math, .reading-inline-math, .MathJax_Display, .MathJax_SVG_Display, .MJXc-display, #MathJax_Zoom')) return;
      const paragraph = math.closest('p, li, blockquote, .post-content');
      if (!paragraph) return;
      const styles = window.getComputedStyle(paragraph);
      const available = paragraph.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      if (math.getBoundingClientRect().width <= available + 2) return;
      // A few legacy posts contain whole aligned equations in inline delimiters.
      // Only those that cannot fit on a line get their own scrolling surface.
      const wrapper = document.createElement('span');
      wrapper.className = 'reading-inline-math';
      const viewport = document.createElement('span');
      viewport.className = 'reading-inline-math-scroll';
      const preview = math.previousElementSibling;
      const source = math.nextElementSibling;
      math.before(wrapper);
      wrapper.appendChild(viewport);
      if (preview && preview.classList.contains('MathJax_Preview')) viewport.appendChild(preview);
      viewport.appendChild(math);
      if (source && source.tagName === 'SCRIPT' && /^math\//.test(source.type)) viewport.appendChild(source);
      trackOverflow(viewport, math, wrapper, '长公式，可左右滚动');
    });
  }

  function restoreMathZoom() {
    if (!activeMathZoom) return;
    const state = activeMathZoom;
    activeMathZoom = null;
    state.viewport.classList.remove('reading-math-zoom-active');
    state.viewport.scrollLeft = state.scrollLeft;
  }

  function enhanceMathZoom() {
    const zoom = window.MathJax && MathJax.Extension && MathJax.Extension.MathZoom;
    if (!zoom || zoom.readingEnhanced) return;
    const originalZoom = zoom.Zoom;
    zoom.Zoom = function (event, math) {
      // MathJax sizes its native zoom against the nearest overflow container.
      // Temporarily expose this one formula so its popup can use the full page.
      if (document.getElementById('MathJax_ZoomFrame')) this.Remove();
      restoreMathZoom();
      const viewport = math.closest('.reading-math-scroll, .reading-inline-math-scroll');
      if (viewport) {
        activeMathZoom = { viewport: viewport, scrollLeft: viewport.scrollLeft };
        viewport.classList.add('reading-math-zoom-active');
      }
      try {
        return originalZoom.apply(this, arguments);
      } finally {
        if (!document.getElementById('MathJax_ZoomFrame')) restoreMathZoom();
      }
    };
    zoom.readingEnhanced = true;
  }

  document.addEventListener('blog:math-typeset', function () {
    window.requestAnimationFrame(enhanceMath);
  });
  document.addEventListener('blog:math-zoom-ready', enhanceMathZoom);
  document.addEventListener('blog:math-unzoomed', restoreMathZoom);

  function initialize() {
    article = document.querySelector('.post-content');
    if (!article || article.dataset.readingEnhanced === 'true') return;
    article.dataset.readingEnhanced = 'true';
    if (window.ResizeObserver) observer = new ResizeObserver(refreshOverflow);
    enhanceCode();
    enhanceTables();
    enhanceMath();
    enhanceMathZoom();
    window.addEventListener('resize', function () {
      enhanceInlineMath();
      refreshOverflow();
    });
    window.addEventListener('load', refreshOverflow, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(enhanceMath);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
