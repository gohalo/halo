---
title : "运维排障"
menu:
  docs:
    parent: "summary/faq"
    identifier: "summary/faq/devops"
    weight: 301
---

## 节点无法加入集群怎么办？

请依次检查以下配置项：

1. 节点间心跳端口与数据端口是否已被防火墙放行。
2. 各节点系统时钟是否已通过 NTP 同步（偏差需小于 500ms）。
3. 集群 Token 与种子节点地址是否配置一致。
