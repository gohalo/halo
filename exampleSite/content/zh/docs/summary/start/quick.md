---
title : "五分钟上手"
menu:
  docs:
    weight: 2
    parent: "summary/start"
    identifier: "summary/start/quick"
---

通过以下命令即可在本地快速拉起单节点体验环境：

```bash
docker run -d --name demo-node -p 8080:8080 ghcr.io/gohalo/demo:latest
```

启动完成后访问 `http://localhost:8080` 查看控制台状态。
