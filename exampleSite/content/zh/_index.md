---
# 项目标题中的 "|" 用于强制换行
type: "landing"
title: "GoHalo"
description: "内容、项目与运维，一套顺手的开源工具集。"

hero:
  eyebrow: "GoHalo · 开源工具集"
  title: "让内容、项目与运维，"
  highlight: "各就各位。"
  summary: "三个专注的开源项目，覆盖内容发布、研发协同与安全接入。该省心的地方省心，该掌控的地方掌控。"
  primary:
    text: "浏览项目"
    url: "#projects"
  secondary:
    text: "GitHub"
    url: "https://github.com/gohalo"

projects:
  - key: "halo"
    index: "01"
    eyebrow: "内容管理"
    title: "基于 Hugo 的内容管理"
    summary: "写好 Markdown，剩下的交给 Hugo。"
    description: "把文章、文档、幻灯片与项目页统一到一个仓库里，构建即发布。没有数据库，没有后台等待，只有快到几乎无感的静态站点。"
    tags:
      - "Markdown"
      - "多语言"
      - "静态构建"
      - "CDN 友好"
    features:
      - icon: "file-text"
        title: "Markdown 优先"
        desc: "专注写作，排版、目录与代码高亮自动完成。"
      - icon: "languages"
        title: "多语言内容"
        desc: "中英文内容并存，按目录自动生成语言站点。"
      - icon: "zap"
        title: "秒级构建"
        desc: "静态产物可直接托管，维护成本几乎为零。"
    image: "/images/projects/hugo-cms.webp"
    image_alt: "Hugo 内容管理界面预览"
    link:
      text: "了解 Halo 主题"
      url: "/project/halo/"
    reverse: false
    accent: "sky"

  - key: "opc"
    index: "02"
    eyebrow: "研发管理"
    title: "面向 OPC 的企业级|项目开发管理"
    summary: "从需求到交付，一条清晰的协作链路。"
    description: "为 OPC 场景打造的研发项目管理：需求拆解、任务分发、进度跟踪与交付验收集中在一处，让每个角色都清楚下一步该做什么。"
    tags:
      - "任务看板"
      - "里程碑"
      - "权限模型"
      - "交付预测"
    features:
      - icon: "layout-dashboard"
        title: "全局视图"
        desc: "看板、里程碑与统计报表，项目健康度一目了然。"
      - icon: "git-branch"
        title: "流程可编排"
        desc: "按团队习惯配置状态流转、审批与交付节点。"
      - icon: "users"
        title: "角色与权限"
        desc: "产品、研发、测试各司其职，信息边界清晰。"
    image: "/images/projects/opc-board.webp"
    image_alt: "OPC 项目任务看板预览"
    link:
      text: "查看研发管理方案"
      url: "/project/"
    reverse: true
    accent: "emerald"

  - key: "bastion"
    index: "03"
    eyebrow: "安全接入"
    title: "堡垒机"
    summary: "一个入口，安全抵达每一台机器。"
    description: "把 SSH、数据库与内网服务的访问收拢到统一入口：按人授权、全程留痕、随时回放，让运维既高效又可审计。"
    tags:
      - "SSH 会话"
      - "数据库代理"
      - "命令审计"
      - "会话回放"
    features:
      - icon: "terminal"
        title: "SSH 会话"
        desc: "浏览器直连 Linux 主机，无需在本地保存私钥。"
      - icon: "database"
        title: "数据库访问"
        desc: "MySQL、PostgreSQL 等连接统一托管，权限细化到库表。"
      - icon: "shield-check"
        title: "审计与回放"
        desc: "操作记录、命令审计与会话回放，问题可追溯。"
    image: "/images/projects/bastion-terminal.webp"
    image_alt: "堡垒机 SSH 会话与审计界面预览"
    link:
      text: "了解安全接入"
      url: "/project/"
    reverse: false
    accent: "amber"

cta:
  eyebrow: "开始使用"
  title: "把工具用起来，把精力留给重要的事。"
  summary: "三个项目可以独立部署，也可以组合成一套完整的工作流。"
  primary:
    text: "查看全部项目"
    url: "/project/"
  secondary:
    text: "GitHub 仓库"
    url: "https://github.com/gohalo"

footer:
  about:
    title: "GoHalo"
    description: "内容、项目与运维，一套顺手的开源工具集。让该省心的地方省心，该掌控的地方掌控。"
    socials:
      - icon: "github"
        label: "GitHub"
        url: "https://github.com/gohalo"
      - icon: "rss"
        label: "RSS 订阅"
        url: "/index.xml"
  columns:
    - title: "项目"
      links:
        - text: "基于 Hugo 的内容管理"
          url: "#halo"
        - text: "OPC 研发管理"
          url: "#opc"
        - text: "堡垒机"
          url: "#bastion"
    - title: "导航"
      links:
        - text: "博客"
          url: "/blog/"
        - text: "文档"
          url: "/docs/"
        - text: "常用命令"
          url: "/cheatsheet/"
        - text: "关于"
          url: "/about/"
    - title: "联系"
      links:
        - text: "GitHub 仓库"
          url: "https://github.com/gohalo/halo"
        - text: "问题反馈"
          url: "https://github.com/gohalo/halo/issues"
        - text: "RSS 订阅"
          url: "/index.xml"
  note: "基于 Hugo 与 Tailwind CSS 构建"
---
