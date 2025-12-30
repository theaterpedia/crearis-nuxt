# YAML Export Protocol for MDC Course Files

Date: 2024-12-29

This document lists the required YAML format changes when exporting course files (like `einstiege-ins-theaterspiel-*.md`) for Nuxt Content compatibility.

## Critical Requirements

### 1. Body Content After Frontmatter
**CRITICAL**: The file MUST have content after the closing `---`. Empty files with only YAML frontmatter will NOT be indexed by Nuxt Content and will return 404.

```yaml
---
# ... yaml content ...
---
Some body text here

<!-- PUBLISH-FROM-HERE -->
```

### 2. Indentation Style
Use **1-space indentation** for nested objects (NOT 2-space):

```yaml
# CORRECT (1-space)
details:
 programm:
  title: Programm & Struktur
  header: |
   ## Programm & Struktur

# WRONG (2-space)
details:
  programm:
    title: Programm & Struktur
```

**Exception**: Array items under `cssclasses` and `views` use **2-space** indentation:

```yaml
cssclasses:
  - course
views:
  - product
  - details
```

### 3. Date Format
Dates must be **unquoted** ISO format (parsed as date objects, not strings):

```yaml
# CORRECT
start: 2026-03-08
end: 2026-12-01

# WRONG (quoted = string)
start: '2026-03-08'
end: '2026-12-01'
```

### 4. DateTime Format
Use short format without seconds or quotes:

```yaml
# CORRECT
start: 2026-05-14T19:00
ende: 2026-05-15T18:30

# WRONG
start: '2026-05-14T19:00:00'
ende: '2026-05-15T07:18:30'
```

### 5. String Quoting Rules

#### Use double quotes `"..."` only for:
- Strings containing `**` markdown bold (e.g., heading)

```yaml
heading: "**Einstiege ins Theaterspiel** München..."
```

#### Do NOT use quotes for:
- Simple strings without special characters
- `tag` values (even with parentheses - just remove them)

```yaml
# CORRECT
tag: Do., 14.5. bis So., 17.5 (Seminarhaus)
tag: Fortsetzung Do., 14.5. bis So., 17.5

# WRONG
tag: "(Fortsetzung: Do., 14.5. bis So., 17.5)"
```

### 6. Multiline Strings with `|`

Content under `|` must be indented **1 space** from parent:

```yaml
# CORRECT
header: |
 ## Programm & Struktur
body: |
 Den Einstieg in die elementare Animation...

# WRONG (2-space or 4-space indent)
header: |
  ## Programm & Struktur
```

### 7. Avoid `\r\n` Escape Sequences

Use proper multiline `|` blocks instead of inline escape sequences:

```yaml
# CORRECT
ablauf: |
 Do. 19:00-21:30
 Fr. 09:00-18:30

# WRONG
ablauf: "DO 19:00-21:00\r\nFR 09:00-18:00"
```

### 8. No Duplicate Keys

Each key in a YAML object must be unique:

```yaml
# WRONG - duplicate a1_158 key
items:
  a1_158:
    title: First item
  a1_158:
    title: Second item

# CORRECT - use unique keys
items:
  a1_158:
    title: First item
  a1b_158:
    title: Second item
```

### 9. Empty URL Values

Use empty string without quotes:

```yaml
# CORRECT
image: 
 url: ''
 caption: Caption text

# or just omit if not needed
```

### 10. Trailing Space After `items:`

The `items:` key should have a trailing space before the newline:

```yaml
items: 
 a1_158:
```

## Complete Working Example Structure

```yaml
---
navigation: false
navigation_highlight: /ausbildung-theaterpaedagogik/einstiege
shortcode: m18b
heading: "**Einstiege ins Theaterspiel** München..."
start: 2026-03-08
end: 2026-12-01
ctype: course
tag: course
description: Weiterbildung Theaterpädagogik...
title: Einstiege ins Theaterspiel
cssclasses:
  - course
views:
  - product
  - details
details:
 programm:
  title: Programm & Struktur
  header: |
   ## Programm & Struktur
  info:
   struktur: |
    ### Struktur
    - **Item 1**
    - **Item 2**
 konditionen:
  title: Kosten & Konditionen
  header: |
   ## Kosten & Konditionen
  info:
   kosten: |
    ### Kosten
    - **Cost item**
product:
 header: |
  ## Header text
 footer: |
  ## Footer text
items: 
 a1_158:
  ctype: event
  shortcode: a1
  tag: Do., 14.5. bis So., 17.5 (Seminarhaus)
  title: Title **Bold Part**
  image: 
   url: https://example.com/image.jpg
   caption: Caption
  body: |
   Body text here.
  start: 2026-05-14T19:00
  ende: 2026-05-15T18:30
  ort: |
   Address line 1
   Address line 2
  ablauf: |
   Do. 19:00-21:30
   Fr. 09:00-18:30
  mit: Person Name
---
Body content after frontmatter (required!)

<!-- PUBLISH-FROM-HERE -->
```
