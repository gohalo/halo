基于 hugo 和 tailwind 生成的静态页面生成，主题保存在 themes/halo 目录下，支持多语言

* 导航栏固定在顶部，左侧包含 Logo、Title，接着是配置的标题，支持多层级下拉、按优先级向左对齐、是否激活、通过 section 参数设置在文档处于该 section 时展示，右侧包含了搜索、Dark切换、多语言切换、Github、关于按钮

# Docs 页面布局

左侧展示文档导航，菜单信息在页面的元数据中维护，通过 menuStartLevel 可以设置开始层级，通过 accordionMode 设置打开菜单时是否折叠同级其它菜单，当前页面所在路径高亮显示



执行 hugo 命令使用绝对路径 /usr/local/bin/hugo
