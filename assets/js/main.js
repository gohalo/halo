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

    // 代码块复制按钮
    function addCopyButtonToCodeBlocks() {
        // 查找所有代码块：Chroma 高亮块 + 非高亮的缩进代码块
        const codeBlocks = document.querySelectorAll('.highlight, .content pre:not(.chroma):not(.mermaid)');
        codeBlocks.forEach((block) => {
            // 避免重复添加（工具栏已存在，或已被包进 shell）
            if (
                block.querySelector('.copy-code-button') ||
                (block.parentElement && block.parentElement.classList.contains('code-block-shell'))
            ) {
                return;
            }

            // 非高亮代码块包一层容器，避免工具栏随横向滚动移动；带文件名的代码块挂载到外层容器
            let container = block;
            if (block.tagName === 'PRE') {
                container = document.createElement('div');
                container.className = 'code-block-shell';
                block.parentNode.insertBefore(container, block);
                container.appendChild(block);
            } else if (block.parentElement && block.parentElement.classList.contains('code-block')) {
                container = block.parentElement;
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

            // 将工具栏添加到代码块容器
            container.style.position = 'relative';
            container.appendChild(toolbar);
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
                    const codeElement = block.querySelector('code');
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
        const updateBackToTop = function() {
            backToTopButton.classList.toggle('hidden', window.scrollY <= 300);
        };
        window.addEventListener('scroll', updateBackToTop, { passive: true });
        // 页面加载/刷新、浏览器恢复滚动位置后同步一次状态
        updateBackToTop();
        window.addEventListener('load', updateBackToTop);
        window.addEventListener('pageshow', updateBackToTop);
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
