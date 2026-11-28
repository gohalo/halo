---
title: "Halo Theme & Reveal.js Presentation Guide"
date: 2024-03-20T10:00:00+08:00
description: "Author interactive technical slide decks in plain Markdown with 2D navigation, code focus, and speaker notes"
reveal:
    theme: "black"
---

# Halo Live Slides

### Craft Elegant Technical Presentations in Plain Markdown

Press `Space` or Arrow Keys to navigate · Press `S` for Speaker View

Note:
Welcome everyone! This is the speaker notes section. Press the S key on your keyboard to open a dedicated window with notes, a timer, and a next-slide preview.

---

## Key Capabilities

- **Plain-Text Driven**: Skip manual layout tweaking and focus on content <!-- .element: class="fragment" -->
- **2D Slide Hierarchy**: `---` for horizontal topics, `--` for vertical deep dives <!-- .element: class="fragment" -->
- **Step-by-Step Code Focus**: Built-in line highlighting tailored for engineering talks <!-- .element: class="fragment" -->
- **Rich Built-in Plugins**: Speaker notes, full-text search, and click-to-zoom <!-- .element: class="fragment" -->

---

## 2D Navigation Demo

Navigate right for the next topic, or **press Down (`↓`)** to explore sub-slides in this section

--

### Vertical Slide 2.1: Why 2D Navigation?

1. Keep the main storyline concise without overwhelming the audience
2. Dive down into architecture details or backup slides during Q&A
3. Skip vertical sub-slides effortlessly when short on time

--

### Vertical Slide 2.2: Blockquotes & Callouts

> Great tools fade into the background, letting creators focus entirely on ideas and storytelling.

---

## Code Highlighting & Line Focus

Use `[lines|lines]` syntax to step through key lines of code as you advance:

```go [1-3|5-9|11-14]
package main

import "fmt"

type Service struct {
    Name string
    Port int
}

func main() {
    svc := Service{Name: "halo-docs", Port: 8080}
    fmt.Printf("Starting %s on :%d\n", svc.Name, svc.Port)
}
```

Note:
Step 1 highlights package and imports; Step 2 focuses on the struct definition; Step 3 shows service initialization and startup output.

---

## Comparison Table

| Dimension | Traditional Slide Tools | Halo + Reveal.js |
| :--- | :--- | :--- |
| Version Control | Binary files, hard to diff | Plain-text Git collaboration |
| Code Snippets | Screenshots or manual copy-paste | Native syntax highlight & line focus |
| Publishing | Export and send attachments | Instant web URL on build |

---

<!-- .slide: data-background="#0f172a" -->

## Keyboard Shortcuts

- `←` `→` `↑` `↓` / `Space`: 2D slide navigation
- `ESC` / `O`: Toggle slide overview mode
- `S`: Open speaker notes window (with timer)
- `Alt + Click`: Zoom in on any slide element
- `Ctrl + Shift + F`: Search across all slides

---

# Thank You!

![Logo](/images/logo.svg) <!-- .element: style="filter: invert(1);" -->

Click the top-left logo to return to the slides list
