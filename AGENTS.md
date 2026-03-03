基于 hugo 和 tailwind 的静态页面生成主题，支持多语言，在 exampleSite 包含示例文档。

* 导航栏固定在顶部，左侧包含 Logo、Title，接着是配置的标题，支持多层级下拉、按优先级向左对齐、是否激活、通过 section 参数设置在文档处于该 section 时展示，右侧包含了搜索、Dark切换、多语言切换、Github、关于按钮

运行示例代码切换到 exampleSite 后执行如下命令。

```
/usr/local/bin/hugo server --themesDir ../.. --port=38786
```
