# TextImage Component Integration into Header.vue

## Overview
Successfully integrated the new `TextImage` component into `Header.vue` to support the 'columns' header type, providing a 2-column text/image layout alternative to the Hero component.

## Changes Made

### 1. Import Statement
```typescript
import TextImage from '~/packages/ui/src/components/TextImage.vue'
```
- Added to script section alongside other component imports
- Uses Nuxt workspace path pattern `~/packages/ui/src/components/`

### 2. Template Integration
Added TextImage component with conditional rendering:
```vue
<TextImage
  v-else-if="showTextImage"
  :heightTmp="headerprops.headerSize"
  :imgTmp="imgTmp"
  :imgTmpAlignY="headerprops.imgTmpAlignY"
  :contentAlignY="headerprops.contentAlignY"
>
  <!-- Content slots -->
</TextImage>
```

**Position:** Between `<Hero>` component and first `<SectionContainer>` fallback
**Conditional Logic:** `v-else-if="showTextImage"` (computed: `headerprops.name === 'columns' && props.imgTmp`)

### 3. Props Mapping
| TextImage Prop | Source | Description |
|---------------|--------|-------------|
| `heightTmp` | `headerprops.headerSize` | Height preset (mini/medium/prominent/full) |
| `imgTmp` | `imgTmp` | Image URL from header props |
| `imgTmpAlignX` | `headerprops.imgTmpAlignX` | Horizontal image alignment |
| `imgTmpAlignY` | `headerprops.imgTmpAlignY` | Vertical image alignment |
| `contentAlignY` | `headerprops.contentAlignY` | Vertical content alignment |

### 4. Content Slots
Replicated the same content structure as Hero component:
- **Logo Banner Mode:** Shows `<Logo extended />` when `showLogoBanner` is true
- **Standard Mode:** 
  - Heading (`<Heading :content="heading" is="h1">`)
  - Teaser text (`<MdBlock :content="teaser" htag="h3">`)
  - CTA buttons (when `showCta` is true)
    - Primary button (`<ButtonTmp>`)
    - Secondary link (`<NuxtLink>` when `showLink` is true)

## Computed Logic Flow

```javascript
// Header.vue computed values (lines 285-301)
showHero = headerprops.name !== 'simple' && headerprops.name !== 'columns' && props.imgTmp
showTextImage = headerprops.name === 'columns' && props.imgTmp
showCta = headerprops.name !== 'simple' && props.cta?.link
showLink = headerprops.name !== 'simple' && props.link?.link
```

**Rendering Priority:**
1. If `showHero === true` → Render `<Hero>` (cover/banner/bauchbinde types)
2. Else if `showTextImage === true` → Render `<TextImage>` (columns type with image)
3. Else → Render simple `<SectionContainer>` (simple type or no image)

## Header Types Mapping

| Header Type | Component Used | Condition |
|-------------|---------------|-----------|
| `simple` | SectionContainer | Always (no Hero or TextImage) |
| **`columns`** | **TextImage** | When `imgTmp` exists |
| `cover` | Hero | When `imgTmp` exists |
| `banner` | Hero | When `imgTmp` exists |
| `bauchbinde` | Hero | When `imgTmp` exists |

## Usage Example

To use the columns layout in a Pruvious page:

```typescript
// In CMS settings or page configuration
{
  headerType: 'columns',
  headerSize: 'prominent', // mini | medium | prominent | full
  imgTmp: '/uploads/hero-image.jpg',
  imgTmpAlignX: 'center',
  imgTmpAlignY: 'center',
  contentAlignY: 'center',
  heading: 'Your Main Heading',
  teaser: 'Your teaser text with **markdown** support',
  cta: {
    title: 'Call to Action',
    link: '/some-page'
  }
}
```

## Responsive Behavior

The TextImage component provides automatic responsive layout:
- **Desktop (≥768px):** 2-column grid with text left, image right
- **Mobile (<768px):** Stacked layout with image on top, text below

Content maintains the same positioning controls as Hero component for consistent UX.

## Testing Checklist

- [x] Component imports without TypeScript errors
- [x] No compilation errors in Header.vue
- [x] Props correctly mapped from headerprops
- [x] Content slots replicate Hero structure
- [x] Conditional rendering logic preserved
- [ ] Visual testing: headerType='columns' renders TextImage
- [ ] Visual testing: Other header types still render correctly
- [ ] Visual testing: Mobile responsive layout works
- [ ] Visual testing: CTA buttons display correctly

## Related Files

- `/components/Header.vue` - Main integration point
- `/packages/ui/src/components/TextImage.vue` - Component implementation
- `/packages/ui/src/views/text-image.vue` - Demo page with examples
- `/docs/TEXTIMAGE_COMPONENT.md` - Full component documentation

## Next Steps

1. Test the 'columns' header type in a live page
2. Verify responsive behavior on mobile devices
3. Ensure theme colors apply correctly to TextImage content
4. Consider adding custom slot for media content (videos, galleries, etc.)

---

**Author:** GitHub Copilot  
**Date:** 2025  
**Branch:** 1.0_beta/userpage
