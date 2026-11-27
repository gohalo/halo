---
title : "Operations Troubleshooting"
menu:
  docs:
    parent: "summary/faq"
    identifier: "summary/faq/devops"
    weight: 301
---

## What if a node fails to join the cluster?

Verify the following items in order:

1. Check whether heartbeat and data ports between nodes are allowed through the firewall.
2. Ensure system clocks across all nodes are synchronized via NTP (drift must be under 500ms).
3. Confirm the cluster token and seed node addresses match across all nodes.
