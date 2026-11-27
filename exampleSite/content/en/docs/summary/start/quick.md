---
title : "5-Minute Quickstart"
menu:
  docs:
    weight: 2
    parent: "summary/start"
    identifier: "summary/start/quick"
---

Spin up a single-node sandbox environment locally with the following command:

```bash
docker run -d --name demo-node -p 8080:8080 ghcr.io/gohalo/demo:latest
```

Once started, visit `http://localhost:8080` to inspect the dashboard status.
