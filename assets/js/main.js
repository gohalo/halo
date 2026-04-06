// 页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuButton = document.getElementById('main-mobile-menu-button');
    const mobileMenu = document.getElementById('main-mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

  // 搜索功能
  const searchButton = document.getElementById('search-button');
  const searchBox = document.getElementById('search-box');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchSubmit = document.getElementById('search-submit');
  const searchResults = document.getElementById('search-results');

  if (searchButton && searchBox) {
    // 从 data 属性获取 i18n 文本
    const i18nPrompt = searchResults.dataset.i18nPrompt || 'Enter keywords to start searching...';
    const i18nSearching = searchResults.dataset.i18nSearching || 'Searching...';
    const i18nDevNotice = searchResults.dataset.i18nDevNotice || 'Search functionality is under development...';

    // 打开搜索框
    searchButton.addEventListener('click', function(e) {
      e.stopPropagation();
      searchBox.classList.toggle('hidden');
      if (!searchBox.classList.contains('hidden')) {
        searchInput.focus();
      }
    });

    // 关闭搜索框
    if (searchClose) {
      searchClose.addEventListener('click', function() {
        searchBox.classList.add('hidden');
        searchInput.value = '';
        searchResults.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400">${i18nPrompt}</p>`;
      });
    }

    // 点击页面其他地方关闭搜索框
    document.addEventListener('click', function(e) {
      if (!searchBox.contains(e.target) && e.target !== searchButton) {
        searchBox.classList.add('hidden');
      }
    });

    // 阻止搜索框内部点击事件冒泡
    searchBox.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // 执行搜索
    function performSearch(query) {
      if (!query.trim()) {
        searchResults.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400">${i18nPrompt}</p>`;
        return;
      }

      // 显示搜索中状态
      searchResults.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400">${i18nSearching}</p>`;

      // TODO: 实现实际的搜索功能
      // 这里可以集成 Algolia, Lunr.js, 或其他搜索方案
      setTimeout(() => {
        searchResults.innerHTML = `
          <div class="space-y-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">"${query}"</p>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p class="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                ${i18nDevNotice}
              </p>
            </div>
          </div>
        `;
      }, 500);
    }

    // 搜索按钮点击
    if (searchSubmit) {
      searchSubmit.addEventListener('click', function() {
        performSearch(searchInput.value);
      });
    }

    // 回车键搜索
    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          performSearch(searchInput.value);
        }
      });

      // 实时搜索（可选）
      let searchTimeout;
      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (searchInput.value.trim()) {
            performSearch(searchInput.value);
          }
        }, 300); // 300ms 延迟，防止输入时频繁搜索
      });
    }
  }

    // 代码块复制按钮
    function addCopyButtonToCodeBlocks() {
        // 查找所有代码块
        const codeBlocks = document.querySelectorAll('.highlight');
        codeBlocks.forEach((block) => {
            // 避免重复添加
            if (block.querySelector('.copy-code-button')) {
                return;
            }

            // 创建复制按钮
            const button = document.createElement('button');
            button.className = 'copy-code-button';
            button.innerHTML = `
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                `;
            button.setAttribute('aria-label', 'Copy Code');
            button.setAttribute('title', 'Copy Code');

            // 创建语言标签
            const langLabel = document.createElement('div');
            langLabel.className = 'code-language-label';

            // 获取语言类型
            const codeElement = block.querySelector('code[data-lang]');
            if (codeElement) {
                let lang = codeElement.getAttribute('data-lang');
                // 如果是 fallback，显示为 text
                if (lang === 'fallback') {
                    lang = 'text';
                }
                langLabel.textContent = lang;
            } else {
                langLabel.textContent = 'text';
            }

            // 创建工具栏容器
            const toolbar = document.createElement('div');
            toolbar.className = 'code-toolbar';
            toolbar.appendChild(langLabel);
            toolbar.appendChild(button);

            // 将工具栏添加到代码块
            block.style.position = 'relative';
            block.appendChild(toolbar);
            button.addEventListener('click', async () => {
                let code = '';

                // 方法1: 带行号的代码块（table 布局）
                const codeCell = block.querySelector('table td:last-child code');
                if (codeCell) {
                    // 获取所有 .cl 元素（实际代码内容）
                    const codeLines = codeCell.querySelectorAll('.cl');
                    if (codeLines.length > 0) {
                        code = Array.from(codeLines).map(line => line.textContent).join('');
                    } else {
                        // 如果没有 .cl，使用整个 code 元素
                        code = codeCell.textContent;
                    }
                } else {
                    // 方法2: 不带行号的代码块
                    const codeElement = block.querySelector('pre code');
                    if (codeElement) {
                        const codeLines = codeElement.querySelectorAll('.cl');
                        if (codeLines.length > 0) {
                            code = Array.from(codeLines).map(line => line.textContent).join('');
                        } else {
                            code = codeElement.textContent;
                        }
                    }
                }

                // 去除首尾空白
                code = code.trim();
                if (!code) return;

                // 复制到剪贴板
                try {
                    await navigator.clipboard.writeText(code);
                    // 显示复制成功反馈
                    button.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    `;
                    button.classList.add('copied');

                    // 2秒后恢复原图标
                    setTimeout(() => {
                        button.innerHTML = `
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        `;
                        button.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });
        });
    }

    // 初始化复制按钮
    addCopyButtonToCodeBlocks();

    // 初始化所有 tabs 的高度
    initAllTabs();

    // 返回顶部按钮功能
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        // 监听滚动事件，显示/隐藏按钮
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });
    }

    // 初始化文档菜单
    initDocsMenuToggle();
});

// 返回顶部功能
window.scrollBackToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Tabs 组件功能，切换标签页
if (typeof switchTab === 'undefined') {
    window.switchTab = function(containerId, targetId) {
        const container = document.querySelector(`[data-tabs-id="${containerId}"]`);
        if (!container) return;

        // 更新按钮状态
        container.querySelectorAll('.tab-button').forEach(btn => {
            const isActive = btn.getAttribute('data-tab-target') === targetId;
            btn.classList.toggle('tab-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // 更新内容显示
        container.querySelectorAll('.tab-pane').forEach(pane => {
            if (pane.id === targetId) {
                pane.classList.remove('invisible');
            } else {
                pane.classList.add('invisible');
            }
        });
  };
}

// 初始化指定容器的 tabs 高度
window.initTabsHeight = function(containerId) {
    const container = document.querySelector(`[data-tabs-id="${containerId}"] .tab-content-container`);
    if (!container) return;

    const panes = container.querySelectorAll('.tab-pane');
    let maxHeight = 0;

    // 临时显示所有 tab 来测量高度
    panes.forEach(pane => {
        pane.classList.remove('invisible');
        pane.style.position = 'relative';
        const height = pane.offsetHeight;
        if (height > maxHeight) maxHeight = height;
        pane.style.position = '';
    });

    // 设置容器高度
    container.style.height = maxHeight + 'px';

    // 恢复隐藏状态 - 只显示激活的
    panes.forEach(pane => {
        if (!pane.classList.contains('invisible')) {
            // 保持当前激活的可见
        } else {
            pane.classList.add('invisible');
        }
    });
};

// 初始化页面上所有 tabs 的高度
function initAllTabs() {
    const allTabsContainers = document.querySelectorAll('.tabs-container');
    allTabsContainers.forEach(container => {
        const containerId = container.getAttribute('data-tabs-id');
        if (containerId) {
            initTabsHeight(containerId);
        }
    });
}

// 文档菜单切换功能
function initDocsMenuToggle() {
    const sidebar = document.querySelector('.docs-sidebar');
    if (!sidebar) {
        return;
    }

    // 为所有展开/折叠按钮添加点击事件
    sidebar.querySelectorAll('.docs-menu-toggle').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const menuItem = button.closest('.docs-menu-item');
            const children = menuItem.querySelector('.docs-menu-children');
            if (!children) {
                return;
            }

            // 切换当前菜单
            children.classList.toggle('expanded');
            const arrow = button.querySelector('svg');
            if (arrow) {
                arrow.classList.toggle('rotate-90');
            }
        });
    });
}
