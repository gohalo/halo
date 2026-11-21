// FlexSearch 数据层：首次使用时懒加载索引数据并构建索引，提供 window.haloSearch。
// 界面交互见 search-dialog.js。
//
// 该文件由 Hugo 通过 resources.ExecuteAsTemplate 渲染，因此可以注入站点参数。

(function () {
  const searchDataURL = '{{ .searchData.RelPermalink }}';
  const tokenize = '{{ .flexsearch.tokenize | default "forward" }}';
  const maxPageResults = parseInt('{{ .flexsearch.maxPageResults | default 20 }}', 10);
  const maxSectionResults = parseInt('{{ .flexsearch.maxSectionResults | default 10 }}', 10);

  let pageIndex;
  let sectionIndex;
  let indexPromise = null;

  // 中日韩等无空格语言：按「单字 + 相邻双字(bigram)」编码。
  //   - 单字保证「页」这类单字查询有结果；
  //   - 双字保证「页面」这类词组查询命中的是连续文本，而不是同一页里分散出现的两个字。
  // 其他语言（拉丁/西里尔/阿拉伯等）仍按完整单词编码。
  const regex = new RegExp(
    `([\u{4E00}-\u{9FFF}\u{3040}-\u{309F}\u{30A0}-\u{30FF}\u{AC00}-\u{D7A3}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{31350}-\u{323AF}\u{2EBF0}-\u{2EE5F}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}])|([0-9A-Za-zа-яÀ-ſЀ-ӿ؀-ۿঀ-৿Ḁ-ỿ֐-׿]+)`,
    'gu'
  );
  const encode = (str) => {
    const tokens = [];
    const text = ('' + str).toLowerCase();
    let prev = '';
    let lastEnd = 0;
    for (const match of text.matchAll(regex)) {
      // 空格/标点/emoji 等未匹配字符会中断 bigram，避免跨标点生成词组
      if (match.index > lastEnd) prev = '';
      lastEnd = match.index + match[0].length;
      if (match[1]) {
        tokens.push(match[1]);
        if (prev) tokens.push(prev + match[1]);
        prev = match[1];
      } else {
        tokens.push(match[2]);
        prev = '';
      }
    }
    return tokens;
  };

  // 无结果时退化为「按单字拆分」再查一次，避免「页面」这类词组因缺少连续
  // bigram 而完全查不到（例如正文中两个字被标点/标签隔开时）。
  function relaxQuery(query) {
    const parts = [];
    for (const match of ('' + query).matchAll(regex)) {
      parts.push(match[1] ? match[1] : match[2]);
    }
    return parts.join(' ');
  }

  function buildIndex() {
    pageIndex = new FlexSearch.Document({
      tokenize,
      encode,
      cache: 100,
      document: {
        id: 'id',
        store: ['title', 'breadcrumbs'],
        index: 'content'
      }
    });

    sectionIndex = new FlexSearch.Document({
      tokenize,
      encode,
      cache: 100,
      document: {
        id: 'id',
        store: ['title', 'content', 'url', 'display', 'crumb'],
        index: 'content',
        tag: [{ field: 'pageId' }]
      }
    });
  }

  function addPage(data, route, pageId) {
    const urlParts = route.split('/').filter((x) => x !== '' && !x.startsWith('#'));
    const crumbParts = [];
    let crumb = '';
    let searchUrl = '/';

    for (let i = 0; i < urlParts.length; i++) {
      searchUrl += urlParts[i] + '/';
      const crumbData = data[searchUrl];
      if (!crumbData) continue;

      let title = crumbData.title;
      if (title === '_index') {
        title = urlParts[i].split('-').join(' ');
      }
      crumbParts.push(title);
      crumb += title;
      if (i < urlParts.length - 1) crumb += ' > ';
    }

    let pageContent = '';

    for (const heading in data[route].data) {
      const separator = heading.indexOf('#');
      const hash = separator === -1 ? heading : heading.slice(0, separator);
      const text = separator === -1 ? '' : heading.slice(separator + 1);
      const url = hash ? `${route}#${hash}` : route;
      const title = text || data[route].title;

      const content = data[route].data[heading] || '';
      const paragraphs = content.split('\n').filter(Boolean);

      sectionIndex.add({
        id: url,
        url,
        title,
        crumb,
        pageId: `page_${pageId}`,
        content: title,
        ...(paragraphs[0] && { display: paragraphs[0] })
      });

      for (let i = 0; i < paragraphs.length; i++) {
        sectionIndex.add({
          id: `${url}_${i}`,
          url,
          title,
          crumb,
          pageId: `page_${pageId}`,
          content: paragraphs[i]
        });
      }

      pageContent += ` ${title} ${content}`;
    }

    pageIndex.add({
      id: pageId,
      title: data[route].title,
      breadcrumbs: crumbParts.slice(0, -1),
      content: pageContent
    });
  }

  function preloadIndex() {
    if (indexPromise) return indexPromise;

    const attempt = (async () => {
      buildIndex();

      const resp = await fetch(searchDataURL);
      const data = await resp.json();
      let pageId = 0;

      for (const route in data) {
        addPage(data, route, ++pageId);
      }
    })();

    // 构建失败时清空缓存，下一次调用可以重试
    const wrapped = attempt.catch((err) => {
      if (indexPromise === wrapped) indexPromise = null;
      pageIndex = undefined;
      sectionIndex = undefined;
      throw err;
    });

    indexPromise = wrapped;
    return indexPromise;
  }

  function collectGroups(query) {
    const pageResults =
      pageIndex.search(query, maxPageResults, { enrich: true })[0]?.result || [];

    const groups = [];
    const pageTitleMatches = {};

    for (let i = 0; i < pageResults.length; i++) {
      const result = pageResults[i];
      pageTitleMatches[i] = 0;

      const sectionResults =
        sectionIndex.search(query, {
          enrich: true,
          tag: { pageId: `page_${result.id}` }
        })[0]?.result || [];

      const occurred = {};
      const group = {
        _page_rk: i,
        route: '',
        title: result.doc.title,
        breadcrumbs: result.doc.breadcrumbs || [],
        matches: []
      };

      const nResults = Math.min(sectionResults.length, maxSectionResults);
      for (let j = 0; j < nResults; j++) {
        const { doc } = sectionResults[j];
        const isMatchingTitle = doc.display !== undefined;
        if (isMatchingTitle) pageTitleMatches[i]++;

        const { url, title } = doc;
        const content = doc.display || doc.content;

        if (occurred[url + '@' + content]) continue;
        occurred[url + '@' + content] = true;
        if (!group.route) group.route = url.split('#')[0];
        group.matches.push({ route: url, title, content });
      }

      if (group.matches.length) groups.push(group);
    }

    return { groups, pageTitleMatches };
  }

  function performSearch(query) {
    let { groups, pageTitleMatches } = collectGroups(query);

    if (!groups.length) {
      const relaxed = relaxQuery(query);
      if (relaxed && relaxed !== query) {
        ({ groups, pageTitleMatches } = collectGroups(relaxed));
      }
    }

    let optionId = 0;
    return groups
      .sort((a, b) => {
        if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
          return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk];
        }
        return a._page_rk - b._page_rk;
      })
      .map((res) => ({
        id: `halo-search-opt-${optionId++}`,
        route: res.route,
        title: res.title,
        breadcrumbs: res.breadcrumbs,
        matches: res.matches.map((match) => ({
          id: `halo-search-opt-${optionId++}`,
          route: match.route,
          title: match.title,
          content: match.content
        }))
      }));
  }

  window.haloSearch = {
    preload: preloadIndex,
    async search(query) {
      await preloadIndex();
      return performSearch(query);
    }
  };
})();
