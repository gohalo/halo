# 语言自动识别

主题内置了客户端语言检测，同时支持在边缘/网关层做根路径重定向。

## 客户端检测

配置项位于 `config/_default/params.yaml`：

```yaml
language:
  detect: true # 首次访问按浏览器语言自动跳转
  remember: true   # 记住用户在语言切换器中的选择
```

行为约定：

| 场景 | 行为 |
| --- | --- |
| 首次访问（无任何记录） | 按 `navigator.languages` 匹配 `languageCode`，跳转到对应翻译页；无翻译则跳目标语言首页 |
| 访问深链接（无记录） | 同上，优先跳该页面的翻译版本 |
| 用户点过语言切换器 | 写入 `localStorage.lang`，此后仅纠正语言首页，不再改动深链接 |
| URL 带 `?lang=en` | 最高优先级，跳转到对应翻译页或目标语言首页 |
| 同一次会话内 | `sessionStorage.lang-detected` 打标，避免重复跳转和循环 |
| 目标语言与当前一致 | 不跳转 |

匹配规则：

- 使用 `languageCode`（如 `zh-CN`、`en-US`），并兼容 `_`、大小写与主语言子标签（`zh-CN` → `zh`）
- 站点语言键 `zh` 与 `languageCode: zh-CN` 通过主语言子标签匹配，浏览器上报的 `zh-CN`、`zh-TW`、`zh-Hant` 都会命中 `zh`
- 页面同时输出 `hreflang` 与 `x-default`，利于 SEO

## 边缘/网关重定向（可选）

建议**只对根路径 `/` 做重定向**，深链接交给客户端脚本处理，避免翻译 slug 不一致时跳错。边缘层与客户端通过 cookie `lang=<lang>` 协同：

- 边缘层优先使用 `Cookie: lang`，没有时再读 `Accept-Language`
- 重定向响应需要 `Vary: Accept-Language` 与 `Cache-Control: private, no-store`，避免 CDN 缓存错语言
- 客户端只把 cookie 当作“已检测结果”，用户手动切换后仍以 `localStorage` 为准

### Cloudflare Worker

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== '/') {
      return fetch(request);
    }

    const cookie = request.headers.get('cookie') || '';
    const saved = cookie.match(/(?:^|;\s*)lang=(en|zh)/);
    let lang = saved && saved[1];

    if (!lang) {
      const accept = request.headers.get('accept-language') || '';
      // 简化示例：生产环境建议按 q 值排序后再匹配
      lang = /(^|,)\s*zh\b/i.test(accept) ? 'zh' : 'en';
    }

    return new Response(null, {
      status: 302,
      headers: {
        location: `/${lang}/`,
        'set-cookie': `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`,
        vary: 'Accept-Language',
        'cache-control': 'private, no-store',
      },
    });
  },
};
```

### nginx

```nginx
map $http_accept_language $lang_home {
    default  /en/;
    ~*zh     /zh/;
}

server {
    location = / {
        add_header Vary Accept-Language;
        add_header Cache-Control "private, no-store";
        return 302 $lang_home;
    }
}
```

如需 cookie 优先，可在 `location = /` 中先用 `if ($cookie_lang = zh)` 做 302，`map` 作为兜底。

### Vercel（`vercel.json`）

```json
{
  "redirects": [
    {
      "source": "/",
      "has": [{ "type": "header", "key": "accept-language", "value": ".*zh.*" }],
      "destination": "/zh/",
      "permanent": false
    },
    {
      "source": "/",
      "destination": "/en/",
      "permanent": false
    }
  ]
}
```

### Netlify

`_redirects` 不支持 `Accept-Language` 条件，需要使用 Edge Function；未配置边缘重定向时，根路径仍由 Hugo 跳到默认语言，再由客户端脚本纠正。
