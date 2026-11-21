// 搜索面板 UI：<dialog>、快捷键、结果渲染、键盘导航。
// 数据来自 window.haloSearch（见 flexsearch.js）。
//
// 该文件由 Hugo 通过 resources.ExecuteAsTemplate 渲染，因此可以注入翻译文本。

(function () {
  const resultsFoundTemplate = {{ i18n "search_results_found" | default "%d results found" | jsonify }};
  const noResultsText = {{ i18n "search_no_results" | default "No results found." | jsonify }};

  const EDITABLE_TAGS = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'];
  const isMac = /iPad|iPhone|Macintosh/.test(navigator.userAgent);

  let dialog;
  let input;
  let resultsEl;
  let emptyEl;
  let statusEl;
  let viewportEl;
  let innerEl;
  let closeTimer = null;
  let collapseTimer = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    dialog = document.getElementById('halo-search-dialog');
    if (!dialog) return;

    input = dialog.querySelector('.halo-search-input');
    resultsEl = dialog.querySelector('.halo-search-results');
    emptyEl = dialog.querySelector('[data-search-empty]');
    statusEl = dialog.querySelector('.halo-search-status');
    viewportEl = dialog.querySelector('[data-search-viewport]');
    innerEl = dialog.querySelector('[data-search-inner]');

    if (isMac) {
      document.querySelectorAll('.halo-search-kbd').forEach((el) => {
        while (el.firstChild) el.removeChild(el.firstChild);
        el.appendChild(document.createTextNode('⌘K'));
      });
    }

    document.querySelectorAll('[data-search-open]').forEach((btn) => {
      btn.addEventListener('click', () => openDialog());
    });

    const closeBtn = dialog.querySelector('[data-search-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => closeDialog());

    document.addEventListener('keydown', handleGlobalKeyDown);
    input.addEventListener('input', runSearch);
    // 输入法组合结束后补一次查询：部分浏览器/输入法的最终 input 事件仍带 isComposing，
    // 会导致「页面」这类组合输入完成后没有触发检索。
    input.addEventListener('compositionend', () => {
      setTimeout(runSearch, 0);
    });
    dialog.addEventListener('keydown', handleDialogKeyDown);

    // 点击遮罩关闭
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDialog();
    });

    dialog.addEventListener('close', () => {
      input.setAttribute('aria-expanded', 'false');
    });

    // 接管原生 Escape，播放关闭动画
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDialog();
    });

    // 点击结果后关闭面板
    resultsEl.addEventListener('click', (e) => {
      if (e.target.closest('a[role="option"]')) closeDialog();
    });

    // 悬停与键盘焦点同步高亮
    resultsEl.addEventListener('mousemove', (e) => {
      const anchor = e.target.closest('a[role="option"]');
      if (anchor) setActiveOption(anchor, { scroll: false });
    });
    resultsEl.addEventListener('focusin', (e) => {
      const anchor = e.target.closest('a[role="option"]');
      if (anchor) setActiveOption(anchor, { scroll: false });
    });
  }

  function isEditableElement(element) {
    const tag = element && element.tagName;
    return !!element && (EDITABLE_TAGS.includes(tag) || element.isContentEditable);
  }

  function setActiveDescendant(id) {
    if (id) input.setAttribute('aria-activedescendant', id);
    else input.removeAttribute('aria-activedescendant');
  }

  function handleGlobalKeyDown(e) {
    const inEditable = isEditableElement(document.activeElement);

    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      if (inEditable) return;
      e.preventDefault();
      const isClosing = dialog.dataset.state === 'closing';
      if (dialog.open && !isClosing) closeDialog();
      else openDialog();
      return;
    }

    if (dialog.open) return;

    if (e.key === '/') {
      if (inEditable) return;
      e.preventDefault();
      openDialog();
    }
  }

  function openDialog() {
    if (dialog.open && dialog.dataset.state === 'closing') {
      cancelClose();
      input.focus();
      input.select();
      return;
    }
    if (dialog.open) return;

    dialog.showModal();
    input.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
    if (window.haloSearch) window.haloSearch.preload().catch(() => {});
  }

  function cancelClose() {
    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    delete dialog.dataset.state;
  }

  function closeDialog() {
    if (!dialog.open || dialog.dataset.state === 'closing') return;
    cancelCollapse();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      dialog.close();
      return;
    }

    dialog.dataset.state = 'closing';
    const finalize = () => {
      if (closeTimer !== null) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (dialog.dataset.state === 'closing') {
        delete dialog.dataset.state;
        dialog.close();
      }
    };
    dialog.addEventListener(
      'animationend',
      (e) => {
        if (e.animationName === 'halo-search-out') finalize();
      },
      { once: true }
    );
    closeTimer = setTimeout(finalize, 400);
  }

  function setViewportExpanded(expanded) {
    if (viewportEl) viewportEl.dataset.expanded = expanded ? 'true' : 'false';
  }

  function cancelCollapse() {
    if (collapseTimer !== null) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }
  }

  function clearResults() {
    while (resultsEl.firstChild) resultsEl.removeChild(resultsEl.firstChild);
  }

  function handleDialogKeyDown(e) {
    const anchor = e.target.closest('a[role="option"]');
    const fromInput = e.target === input;
    if (!fromInput && !anchor) return;

    // 输入法组合期间交给 IME 处理
    if (fromInput && (e.isComposing || e.keyCode === 229)) return;

    const focusResults = !!anchor;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveSelection(1, { current: anchor, focus: focusResults });
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveSelection(-1, { current: anchor, focus: focusResults });
        break;
      case 'Home': {
        const all = getOptions();
        if (!all.length) return;
        e.preventDefault();
        selectOption(all[0], { focus: focusResults });
        break;
      }
      case 'End': {
        const all = getOptions();
        if (!all.length) return;
        e.preventDefault();
        selectOption(all[all.length - 1], { focus: focusResults });
        break;
      }
      case 'Enter': {
        if (!fromInput) return;
        const opt = getActiveOption();
        if (!opt) return;
        e.preventDefault();
        opt.click();
        break;
      }
      case 'Escape':
        e.preventDefault();
        closeDialog();
        break;
    }
  }

  function getOptions() {
    return Array.from(resultsEl.querySelectorAll('a[role="option"]'));
  }

  function getActiveOption() {
    return resultsEl.querySelector('a[aria-selected="true"]');
  }

  function setActiveOption(el, opts) {
    const scroll = !opts || opts.scroll !== false;
    getOptions().forEach((o) => o.setAttribute('aria-selected', o === el ? 'true' : 'false'));
    if (el) {
      setActiveDescendant(el.id);
      if (scroll) el.scrollIntoView({ block: 'nearest' });
    } else {
      setActiveDescendant();
    }
  }

  function focusOption(el) {
    setActiveOption(el, { scroll: false });
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'nearest' });
  }

  function selectOption(el, opts) {
    if (opts && opts.focus) focusOption(el);
    else setActiveOption(el);
  }

  function moveSelection(delta, opts) {
    const options = getOptions();
    if (!options.length) return;
    const current = (opts && opts.current) || getActiveOption();
    let i = options.indexOf(current);
    if (i === -1) {
      i = delta > 0 ? 0 : options.length - 1;
    } else {
      i = (i + delta + options.length) % options.length;
    }
    selectOption(options[i], opts);
  }

  async function runSearch(e) {
    if (e && e.isComposing) return;

    const query = input.value.trim();
    if (!query) {
      setActiveDescendant();
      if (statusEl) statusEl.textContent = '';
      setViewportExpanded(false);
      cancelCollapse();
      collapseTimer = setTimeout(() => {
        collapseTimer = null;
        clearResults();
        if (emptyEl) emptyEl.hidden = true;
      }, 250);
      return;
    }

    if (!window.haloSearch) return;

    let results;
    try {
      results = await window.haloSearch.search(query);
    } catch (err) {
      // 旧查询的失败结果直接忽略
      if (input.value.trim() !== query) return;
      console.warn('[halo-search]', err);
      results = [];
    }

    // 输入已变化则丢弃过期结果
    if (input.value.trim() !== query) return;
    renderResults(results, query);
  }

  function appendHighlightedText(container, text, query) {
    if (!text) return;
    if (!query) {
      container.textContent = text;
      return;
    }
    const escapedQuery = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    if (!escapedQuery) {
      container.textContent = text;
      return;
    }
    const regex = new RegExp(escapedQuery, 'gi');
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const span = document.createElement('span');
      span.className = 'halo-search-match';
      span.textContent = match[0];
      container.appendChild(span);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      container.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  }

  function createBreadcrumbSeparator() {
    const span = document.createElement('span');
    span.className = 'halo-search-crumb-separator';
    span.textContent = '/';
    span.setAttribute('aria-hidden', 'true');
    return span;
  }

  function appendBreadcrumb(container, parts) {
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) container.appendChild(createBreadcrumbSeparator());
      const part = document.createElement('span');
      part.textContent = parts[i];
      container.appendChild(part);
    }
  }

  function renderResults(results, query) {
    cancelCollapse();
    clearResults();
    if (innerEl) innerEl.scrollTop = 0;

    if (!results.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (statusEl) statusEl.textContent = noResultsText;
      setActiveDescendant();
      setViewportExpanded(true);
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    const fragment = document.createDocumentFragment();
    let isFirstOption = true;
    let optionCount = 0;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');

      const link = document.createElement('a');
      link.id = result.id;
      link.href = result.route;
      link.setAttribute('role', 'option');
      link.setAttribute('aria-selected', isFirstOption ? 'true' : 'false');
      isFirstOption = false;
      optionCount++;

      if (result.breadcrumbs && result.breadcrumbs.length) {
        const crumb = document.createElement('div');
        crumb.className = 'halo-search-crumb';
        crumb.setAttribute('aria-label', result.breadcrumbs.join(' > '));
        appendBreadcrumb(crumb, result.breadcrumbs);
        link.appendChild(crumb);
      }

      const title = document.createElement('div');
      title.className = 'halo-search-title';
      appendHighlightedText(title, result.title, query);
      link.appendChild(title);

      li.appendChild(link);
      fragment.appendChild(li);

      for (let j = 0; j < result.matches.length; j++) {
        const match = result.matches[j];
        const hasExcerpt = match.content && match.content !== match.title;
        if (match.title === result.title && !hasExcerpt) continue;

        const excerptLi = document.createElement('li');
        excerptLi.setAttribute('role', 'presentation');
        excerptLi.classList.add('halo-search-child');

        const excerptLink = document.createElement('a');
        excerptLink.id = match.id;
        excerptLink.href = match.route;
        excerptLink.setAttribute('role', 'option');
        excerptLink.setAttribute('aria-selected', isFirstOption ? 'true' : 'false');
        isFirstOption = false;
        optionCount++;

        const label = hasExcerpt ? `${match.title} - ${match.content}` : match.title;
        if (label) excerptLink.setAttribute('aria-label', label);

        if (match.title && match.title !== result.title) {
          const title = document.createElement('div');
          title.className = 'halo-search-title';
          appendHighlightedText(title, match.title, query);
          excerptLink.appendChild(title);
        }

        if (hasExcerpt) {
          const excerpt = document.createElement('div');
          excerpt.className = 'halo-search-excerpt';
          appendHighlightedText(excerpt, match.content, query);
          excerptLink.appendChild(excerpt);
        }

        excerptLi.appendChild(excerptLink);
        fragment.appendChild(excerptLi);
      }
    }

    resultsEl.appendChild(fragment);

    const firstOption = resultsEl.querySelector('a[role="option"]');
    setActiveDescendant(firstOption && firstOption.id);

    if (statusEl) {
      statusEl.textContent = resultsFoundTemplate.replace('%d', optionCount.toString());
    }

    setViewportExpanded(true);
  }
})();
