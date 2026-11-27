---
title : "手动部署"
menu:
  docs:
    weight: 1
    parent: "summary/install"
    identifier: "summary/install/manual"
---

下载对应平台的发行包并解压后，使用 systemd 托管守护进程：

```bash
tar -xzf release-linux-amd64.tar.gz -C /usr/local/bin/
systemctl enable --now app.service
```
