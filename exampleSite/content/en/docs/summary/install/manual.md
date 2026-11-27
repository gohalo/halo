---
title : "Manual Deployment"
menu:
  docs:
    weight: 1
    parent: "summary/install"
    identifier: "summary/install/manual"
---

Download and extract the release archive for your platform, then manage the daemon process with systemd:

```bash
tar -xzf release-linux-amd64.tar.gz -C /usr/local/bin/
systemctl enable --now app.service
```
