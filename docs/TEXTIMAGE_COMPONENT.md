# TextImage Component

## Overview
The `TextImage` component is a responsive 2-column layout component designed for displaying text content alongside images or other media. It's built for the packages/ui component library.

## Features

### Layout
- **2-Column Design**: Text on the left, media on the right (desktop)
- **Responsive**: Automatically stacks on mobile with media on top
- **Fixed Height**: Default height of 'prominent' with 4 size options
- **Flexible Content**: Supports both image URLs and custom media slots

### Alignment Options
- **Content Vertical Alignment**: Top, center, or bottom alignment for text
- **Image Positioning**: Full control over X/Y positioning (left/right/center/stretch/cover)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heightTmp` | `'full' \| 'prominent' \| 'medium' \| 'mini'` | `'prominent'` | Defines the height of the component |
| `imgTmp` | `string` | - | URL of the image for the media column |
| `imgTmpAlignX` | `'left' \| 'right' \| 'center' \| 'stretch' \| 'cover'` | `'center'` | Horizontal image positioning |
| `imgTmpAlignY` | `'top' \| 'bottom' \| 'center' \| 'stretch' \| 'cover'` | `'center'` | Vertical image positioning |
| `contentAlignY` | `'top' \| 'bottom' \| 'center'` | `'center'` | Vertical alignment of text content |

## Height Options

| Value | Min Height |
|-------|------------|
| `full` | 40rem (640px) |
| `prominent` | 28rem (448px) |
| `medium` | 21rem (336px) |
| `mini` | 14rem (224px) |

## Slots

### Default Slot
The main text content slot. Place your text, headings, buttons, etc. here.

```vue
<TextImage imgTmp="path/to/image.jpg">
  <Prose>
    <h1>Your Heading</h1>
    <p>Your content...</p>
  </Prose>
</TextImage>
```

### Media Slot (Optional)
Custom media content slot. If provided, overrides the `imgTmp` prop.

```vue
<TextImage>
  <template #default>
    <Prose>
      <h1>Your Heading</h1>
    </Prose>
  </template>
  
  <template #media>
    <div class="custom-media">
      <!-- Your custom media content -->
    </div>
  </template>
</TextImage>
```

## Usage Examples

### Example 1: Basic Usage
```vue
<TextImage
  heightTmp="prominent"
  imgTmp="https://example.com/image.jpg"
  imgTmpAlignX="center"
  imgTmpAlignY="center"
  contentAlignY="center"
>
  <Prose>
    <h1><strong>Your Title</strong></h1>
    <p>Your description text goes here.</p>
    <Button size="small" variant="plain">Call to Action</Button>
  </Prose>
</TextImage>
```

### Example 2: Top-Aligned Content
```vue
<TextImage
  heightTmp="medium"
  imgTmp="https://example.com/logo.png"
  contentAlignY="top"
>
  <Prose>
    <h2><strong>Top Aligned Title</strong></h2>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
    </ul>
  </Prose>
</TextImage>
```

### Example 3: Custom Media Slot
```vue
<TextImage
  heightTmp="prominent"
  contentAlignY="bottom"
>
  <template #default>
    <Prose>
      <h1>Custom Media Example</h1>
      <p>Using the media slot for custom content.</p>
    </Prose>
  </template>
  
  <template #media>
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <h2 style="color: white; font-size: 3rem;">Custom Content</h2>
    </div>
  </template>
</TextImage>
```

## Responsive Behavior

### Desktop (> 767px)
- **Grid**: 2 columns (50% / 50%)
- **Text**: Left column
- **Media**: Right column
- **Order**: Text first, media second

### Mobile (≤ 767px)
- **Grid**: 1 column (stacked)
- **Media**: Top (order: 1)
- **Text**: Bottom (order: 2)
- **Media Height**: Minimum 16rem
- **Padding**: Reduced to 1.5rem

## Image Positioning

### Horizontal Alignment (`imgTmpAlignX`)
- `left`: Image aligns to the left
- `right`: Image aligns to the right
- `center`: Image centered horizontally
- `stretch`: Image stretches to fill width
- `cover`: Image covers entire area (may crop)

### Vertical Alignment (`imgTmpAlignY`)
- `top`: Image aligns to the top
- `bottom`: Image aligns to the bottom
- `center`: Image centered vertically
- `stretch`: Image stretches to fill height
- `cover`: Image covers entire area (may crop)

### Background Size Logic
```typescript
// Cover: Fills container, may crop
imgTmpAlignX === 'cover' || imgTmpAlignY === 'cover' → backgroundSize: 'cover'

// Stretch: Fills container exactly
imgTmpAlignX === 'stretch' || imgTmpAlignY === 'stretch' → backgroundSize: '100% 100%'

// Default: Maintains aspect ratio
default → backgroundSize: 'contain'
```

## Styling

### CSS Variables Used
The component respects the theme system's CSS variables:
- `--color-card-bg` - Used in settings panel
- `--color-border` - Used in settings panel
- `--color-card-contrast` - Used in settings panel

### Custom Styling
The component uses scoped styles but exposes these classes for customization:
- `.text-image` - Root container
- `.text-image-grid` - Grid container
- `.text-image-content` - Text column
- `.text-image-media` - Media column
- `.text-image-media-inner` - Image background container

## Demo Page

A demo page with interactive controls is available at:
**File**: `packages/ui/src/views/text-image.vue`

The demo includes:
- 3 different examples
- Interactive settings panel
- Real-time prop adjustments:
  - Height selection
  - Image alignment X/Y
  - Content alignment Y

## Integration

### Import
```typescript
import { TextImage } from '@crearis/ui'
```

### Export
The component is exported from `packages/ui/src/index.ts`:
```typescript
export { default as TextImage } from './components/TextImage.vue'
```

## Design Decisions

### Why Text Left, Media Right?
- Standard Western reading pattern (left to right)
- Text is primary content, should be encountered first
- Media serves as visual support

### Why Media on Top (Mobile)?
- Visual interest above the fold
- Images load faster with priority
- Better engagement on small screens

### Why Fixed Heights?
- Predictable layout behavior
- Prevents content jumping during image load
- Consistent visual rhythm across pages

### No Overlay Logic
Unlike `CardHero`, this component doesn't include overlay functionality:
- Simpler use case (side-by-side content)
- Media column can use custom slot for overlays if needed
- Keeps component focused and maintainable

## Comparison with CardHero

| Feature | CardHero | TextImage |
|---------|----------|-----------|
| Layout | Single column | Two columns |
| Content over image | Yes | No |
| Overlay support | Yes | No |
| Responsive | Vertical only | Horizontal → Vertical |
| Use case | Hero banners | Content sections |
| Max width | 21rem | Full width |

## Browser Support
- Modern browsers with CSS Grid support
- Flexbox for content alignment
- CSS `background-position` and `background-size`
- Media queries for responsive design

---

**File**: `packages/ui/src/components/TextImage.vue`  
**Demo**: `packages/ui/src/views/text-image.vue`  
**Date**: October 3, 2025  
**Type**: New Component - 2-Column Text/Media Layout