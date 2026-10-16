(function () {
  'use strict';

  if (window.blogDiagramViewerInitialized) return;
  window.blogDiagramViewerInitialized = true;

  // Own rendering explicitly: automatic Mermaid rendering would race with us.
  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'forest',
      securityLevel: 'strict',
      flowchart: { useMaxWidth: false, htmlLabels: true },
      sequence: { useMaxWidth: false }
    });
  }

  function createViewer() {
    const dialog = document.createElement('dialog');
    dialog.className = 'diagram-viewer';
    dialog.setAttribute('aria-labelledby', 'diagram-viewer-title');
    dialog.innerHTML = '<div class="diagram-viewer-header">' +
      '<h2 id="diagram-viewer-title">图表</h2>' +
      '<button type="button" data-action="close" class="diagram-viewer-close" autofocus>关闭 <span aria-hidden="true">×</span></button></div>' +
      '<div class="diagram-viewer-toolbar" role="group" aria-label="图表缩放">' +
      '<button type="button" data-action="out" aria-label="缩小图表">−</button>' +
      '<output class="diagram-viewer-scale" aria-label="当前缩放比例">100%</output>' +
      '<button type="button" data-action="in" aria-label="放大图表">+</button>' +
      '<button type="button" data-action="actual">100%</button>' +
      '<button type="button" data-action="fit">适应窗口</button></div>' +
      '<p id="diagram-viewer-help" class="diagram-viewer-help">拖动平移 · 滚轮或双指缩放 · 方向键移动 · Esc 关闭</p>' +
      '<div class="diagram-viewer-viewport" tabindex="0" aria-label="图表查看区域" aria-describedby="diagram-viewer-help">' +
      '<div class="diagram-viewer-canvas"></div></div>';
    document.body.appendChild(dialog);

    const viewport = dialog.querySelector('.diagram-viewer-viewport');
    const canvas = dialog.querySelector('.diagram-viewer-canvas');
    const output = dialog.querySelector('output');
    const pointers = new Map();
    let current = null;
    let scale = 1;
    let x = 0;
    let y = 0;
    let minimum = 0.02;
    let maximum = 8;
    let fitMode = false;
    let previousSize = { width: 0, height: 0 };

    function paint() {
      canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
      output.value = Math.round(scale * 100) + '%';
      dialog.querySelector('[data-action="out"]').disabled = scale <= minimum;
      dialog.querySelector('[data-action="in"]').disabled = scale >= maximum;
    }

    function fit() {
      if (!current) return;
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      scale = Math.min(1, Math.max(1, width - 40) / current.width, Math.max(1, height - 40) / current.height);
      // Even unusually large diagrams must remain completely visible in fit mode.
      minimum = Math.min(0.02, scale / 2);
      maximum = Math.max(8, scale * 8);
      x = (width - current.width * scale) / 2;
      y = (height - current.height * scale) / 2;
      previousSize = { width: width, height: height };
      fitMode = true;
      paint();
    }

    function zoom(next, point) {
      if (!current) return;
      const center = point || { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 };
      next = Math.min(maximum, Math.max(minimum, next));
      const ratio = next / scale;
      x = center.x - (center.x - x) * ratio;
      y = center.y - (center.y - y) * ratio;
      scale = next;
      fitMode = false;
      paint();
    }

    function localPoint(event) {
      const rect = viewport.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function gesture() {
      const points = Array.from(pointers.values());
      if (points.length === 1) return { center: points[0], distance: 0 };
      return {
        center: { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 },
        distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
      };
    }

    dialog.addEventListener('click', function (event) {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      switch (button.dataset.action) {
        case 'close': dialog.close(); break;
        case 'in': zoom(scale * 1.25); break;
        case 'out': zoom(scale / 1.25); break;
        case 'actual': zoom(1); break;
        case 'fit': fit(); break;
      }
    });

    viewport.addEventListener('wheel', function (event) {
      if (!current) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      zoom(scale * Math.exp(-Math.max(-200, Math.min(200, event.deltaY * unit)) * 0.004), localPoint(event));
    }, { passive: false });

    viewport.addEventListener('pointerdown', function (event) {
      if (!current || (event.pointerType === 'mouse' && event.button !== 0)) return;
      // Embedded diagram links retain their normal click behaviour.
      if (event.target.closest('a')) return;
      event.preventDefault();
      viewport.focus({ preventScroll: true });
      pointers.set(event.pointerId, localPoint(event));
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    });

    viewport.addEventListener('pointermove', function (event) {
      if (!current || !pointers.has(event.pointerId)) return;
      const before = gesture();
      pointers.set(event.pointerId, localPoint(event));
      const after = gesture();
      if (before.distance > 0 && after.distance > 0) zoom(scale * after.distance / before.distance, before.center);
      x += after.center.x - before.center.x;
      y += after.center.y - before.center.y;
      fitMode = false;
      paint();
    });

    function release(event) {
      pointers.delete(event.pointerId);
      if (!pointers.size) viewport.classList.remove('is-dragging');
    }
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);
    viewport.addEventListener('lostpointercapture', release);

    viewport.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target !== viewport) return;
      switch (event.key) {
        case '+': case '=': zoom(scale * 1.25); break;
        case '-': zoom(scale / 1.25); break;
        case '0': zoom(1); break;
        case 'Home': fit(); break;
        case 'ArrowLeft': x += 40; fitMode = false; paint(); break;
        case 'ArrowRight': x -= 40; fitMode = false; paint(); break;
        case 'ArrowUp': y += 40; fitMode = false; paint(); break;
        case 'ArrowDown': y -= 40; fitMode = false; paint(); break;
        default: return;
      }
      event.preventDefault();
    });

    function restoreDiagram() {
      if (!current) return;
      const closing = current;
      current = null;
      pointers.clear();
      viewport.classList.remove('is-dragging');
      closing.marker.replaceWith(closing.svg);
      closing.preview.style.minHeight = closing.previewHeight;
      closing.svg.style.cssText = closing.svgStyle;
      if (closing.svgClass === null) closing.svg.removeAttribute('class');
      else closing.svg.setAttribute('class', closing.svgClass);
      document.documentElement.classList.remove('diagram-viewer-open');
      closing.trigger.focus({ preventScroll: true });
      window.scrollTo({ top: closing.scrollY, left: closing.scrollX, behavior: 'instant' });
    }
    dialog.addEventListener('close', restoreDiagram);
    window.addEventListener('beforeprint', function () {
      if (!current) return;
      dialog.close();
      // The close event is queued; printing needs the SVG back synchronously.
      restoreDiagram();
    });

    function resize() {
      if (!current) return;
      if (fitMode) fit();
      else {
        x += (viewport.clientWidth - previousSize.width) / 2;
        y += (viewport.clientHeight - previousSize.height) / 2;
        previousSize = { width: viewport.clientWidth, height: viewport.clientHeight };
        paint();
      }
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(viewport);
    else window.addEventListener('resize', resize);

    return function (svg, preview, trigger, title) {
      if (current || !dialog.showModal) return;
      const box = svg.viewBox.baseVal;
      const bounds = svg.getBoundingClientRect();
      const marker = document.createComment('diagram returns here when the viewer closes');
      current = {
        svg: svg, preview: preview, trigger: trigger, marker: marker,
        width: box.width || bounds.width || 800,
        height: box.height || bounds.height || 600,
        svgStyle: svg.style.cssText, svgClass: svg.getAttribute('class'),
        previewHeight: preview.style.minHeight,
        scrollX: window.scrollX, scrollY: window.scrollY
      };
      preview.style.minHeight = preview.getBoundingClientRect().height + 'px';
      svg.replaceWith(marker);
      svg.classList.add('diagram-viewer-svg');
      svg.style.width = current.width + 'px';
      svg.style.height = current.height + 'px';
      svg.style.maxWidth = 'none';
      svg.style.maxHeight = 'none';
      canvas.style.width = current.width + 'px';
      canvas.style.height = current.height + 'px';
      canvas.appendChild(svg);
      dialog.querySelector('h2').textContent = title;
      document.documentElement.classList.add('diagram-viewer-open');
      dialog.showModal();
      fit();
    };
  }

  async function renderDiagrams() {
    const sources = Array.from(document.querySelectorAll('.language-mermaid')).filter(function (element) {
      return !element.parentElement.closest('.language-mermaid');
    });
    if (!sources.length) return;
    const openViewer = createViewer();
    const unique = Date.now().toString(36);

    for (let index = 0; index < sources.length; index++) {
      const source = sources[index];
      if (!source.isConnected || source.dataset.diagramProcessed) continue;
      source.dataset.diagramProcessed = 'true';
      const pre = source.closest('pre');
      const original = pre || source;
      const definition = source.textContent;
      const customCaption = source.dataset.caption || original.dataset.caption;
      const title = '图 ' + (index + 1) + (customCaption ? '：' + customCaption : '');
      const figure = document.createElement('figure');
      figure.className = 'diagram-figure';
      const preferredId = source.id || original.id || 'diagram-' + (index + 1);
      let figureId = preferredId;
      let suffix = 2;
      let existing = document.getElementById(figureId);
      while (existing && existing !== source && existing !== original) {
        figureId = preferredId + '-' + suffix++;
        existing = document.getElementById(figureId);
      }
      if (source.id === figureId) source.removeAttribute('id');
      if (original.id === figureId) original.removeAttribute('id');
      figure.id = figureId;
      const preview = document.createElement('div');
      preview.className = 'diagram-preview';
      const caption = document.createElement('figcaption');
      caption.className = 'diagram-caption';
      const label = document.createElement('span');
      const numberLink = document.createElement('a');
      numberLink.href = '#' + encodeURIComponent(figureId);
      numberLink.textContent = '图 ' + (index + 1);
      numberLink.setAttribute('aria-label', '链接到' + title);
      label.appendChild(numberLink);
      if (customCaption) label.appendChild(document.createTextNode('：' + customCaption));
      caption.appendChild(label);
      figure.append(preview, caption);
      original.replaceWith(figure);
      preview.appendChild(original);

      const staging = document.createElement('div');
      staging.className = 'diagram-render-target';
      document.body.appendChild(staging);
      try {
        if (!window.mermaid) throw new Error('Mermaid is unavailable');
        const result = await window.mermaid.render('blog-diagram-' + unique + '-' + index, definition, staging);
        const parsed = document.createElement('div');
        parsed.innerHTML = result.svg;
        const svg = parsed.querySelector('svg');
        if (!svg || svg.querySelector('.error-icon, .error-text')) throw new Error('Diagram rendering failed');
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) svg.setAttribute('aria-label', title);
        if (!svg.hasAttribute('role')) svg.setAttribute('role', 'img');
        preview.replaceChildren(svg);
        if (result.bindFunctions) result.bindFunctions(preview);
        if (typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'diagram-open';
          button.textContent = '放大查看';
          button.setAttribute('aria-label', '放大查看' + title);
          button.setAttribute('aria-haspopup', 'dialog');
          button.addEventListener('click', function () { openViewer(svg, preview, button, title); });
          caption.appendChild(button);
        }
      } catch (error) {
        figure.classList.add('diagram-failed');
        // Keep the authored source readable; a bad diagram cannot stop later ones.
        preview.replaceChildren(original);
        label.appendChild(document.createTextNode('：图表暂时无法显示，以下保留图表源文本。'));
        figure.insertBefore(caption, preview);
      } finally {
        staging.remove();
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderDiagrams, { once: true });
  else renderDiagrams();
}());
