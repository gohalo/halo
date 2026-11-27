---
# "|" in project title forces a line break
type: "landing"
title: "GoHalo"
description: "Content, projects, and operations — a handy open-source toolkit."

hero:
  eyebrow: "GoHalo · Open-Source Toolkit"
  title: "Put content, projects, and operations,"
  highlight: "right where they belong."
  summary: "Three focused open-source projects covering content publishing, R&D collaboration, and secure access. Effortless where you want it, in control where you need it."
  primary:
    text: "Browse Projects"
    url: "#projects"
  secondary:
    text: "GitHub"
    url: "https://github.com/gohalo"

projects:
  - key: "halo"
    index: "01"
    eyebrow: "Content Management"
    title: "Hugo-based Content Management"
    summary: "Write in Markdown, let Hugo handle the rest."
    description: "Unify articles, documentation, slides, and project pages in a single repository—build to publish. No database, no backend latency, just a blazing-fast static site."
    tags:
      - "Markdown"
      - "Multilingual"
      - "Static Build"
      - "CDN Friendly"
    features:
      - icon: "file-text"
        title: "Markdown First"
        desc: "Focus on writing while typography, table of contents, and syntax highlighting happen automatically."
      - icon: "languages"
        title: "Multilingual Content"
        desc: "Maintain Chinese and English content side by side, generating language sites by directory."
      - icon: "zap"
        title: "Sub-second Builds"
        desc: "Static artifacts can be hosted anywhere with near-zero maintenance cost."
    image: "/images/projects/hugo-cms.webp"
    image_alt: "Hugo content management interface preview"
    link:
      text: "Explore Halo Theme"
      url: "/project/halo/"
    reverse: false
    accent: "sky"

  - key: "opc"
    index: "02"
    eyebrow: "R&D Management"
    title: "Enterprise Project |Development for OPC"
    summary: "A clear collaboration pipeline from requirement to delivery."
    description: "R&D project management built for OPC scenarios: requirement breakdown, task dispatch, progress tracking, and delivery acceptance in one place so every role knows what comes next."
    tags:
      - "Task Board"
      - "Milestones"
      - "Permissions"
      - "Delivery Forecast"
    features:
      - icon: "layout-dashboard"
        title: "Global Overview"
        desc: "Kanban boards, milestones, and reports give an instant view of project health."
      - icon: "git-branch"
        title: "Configurable Workflows"
        desc: "Customize status transitions, approvals, and delivery checkpoints to fit your team."
      - icon: "users"
        title: "Roles & Permissions"
        desc: "Clear boundaries for product, engineering, and QA teams."
    image: "/images/projects/opc-board.webp"
    image_alt: "OPC project task board preview"
    link:
      text: "View R&D Solution"
      url: "/project/"
    reverse: true
    accent: "emerald"

  - key: "bastion"
    index: "03"
    eyebrow: "Secure Access"
    title: "Bastion Host"
    summary: "One gateway to safely reach every machine."
    description: "Centralize SSH, database, and internal service access behind a unified gateway: per-user authorization, full audit trails, and session replay for efficient, auditable operations."
    tags:
      - "SSH Sessions"
      - "Database Proxy"
      - "Command Audit"
      - "Session Replay"
    features:
      - icon: "terminal"
        title: "SSH Sessions"
        desc: "Connect to Linux hosts directly from the browser without storing private keys locally."
      - icon: "database"
        title: "Database Access"
        desc: "Manage MySQL, PostgreSQL, and more with granular table-level permissions."
      - icon: "shield-check"
        title: "Audit & Replay"
        desc: "Operation logs, command auditing, and session playback for full traceability."
    image: "/images/projects/bastion-terminal.webp"
    image_alt: "Bastion SSH session and audit interface preview"
    link:
      text: "Learn About Secure Access"
      url: "/project/"
    reverse: false
    accent: "amber"

cta:
  eyebrow: "Get Started"
  title: "Put the tools to work and save your energy for what matters."
  summary: "Deploy the three projects independently or combine them into a complete workflow."
  primary:
    text: "View All Projects"
    url: "/project/"
  secondary:
    text: "GitHub Repository"
    url: "https://github.com/gohalo"

footer:
  about:
    title: "GoHalo"
    description: "Content, projects, and operations — a handy open-source toolkit. Effortless where you want it, in control where you need it."
    socials:
      - icon: "github"
        label: "GitHub"
        url: "https://github.com/gohalo"
      - icon: "rss"
        label: "RSS Feed"
        url: "/index.xml"
  columns:
    - title: "Projects"
      links:
        - text: "Hugo-based Content Management"
          url: "#halo"
        - text: "OPC R&D Management"
          url: "#opc"
        - text: "Bastion Host"
          url: "#bastion"
    - title: "Navigation"
      links:
        - text: "Blog"
          url: "/blog/"
        - text: "Docs"
          url: "/docs/"
        - text: "Cheatsheet"
          url: "/cheatsheet/"
        - text: "About"
          url: "/about/"
    - title: "Contact"
      links:
        - text: "GitHub Repository"
          url: "https://github.com/gohalo/halo"
        - text: "Issue Tracker"
          url: "https://github.com/gohalo/halo/issues"
        - text: "RSS Feed"
          url: "/index.xml"
  note: "Built with Hugo and Tailwind CSS"
---
