# Section-Component: props, attributes, features 
WE DO NOT IMPLEMENT THINGS IN PARANTHESES `()` > these are more like wishlists/nice2have

We use the terms 'content' and 'context':
- "content" is mostly text but can be other foreground-elements as well
- "context" is implemented using bg-elements: image, color, gradient, video, svg

## GENERAL, POSITIONING, DIMENSIONS, PARALLAX

### role / is
- header
- footer
- div
- ... article?

### ytype

- "none/default": Content decides
- "2/3"
- "slide" > make lower (upper) neighbours accessible
- "1/2"
- ("1/3")
- ("screen")
- ("double")

### xtype

- "none/default": Content decides
- "max"
- "left"
- "right"
- "slide" > toggles aside if in viewport
- ("small")
- ("canvas")

### z-0 / z-10 / z-20 / z-30 / z-40 / z-50 / z-auto 
we could directly take the tw-utilities: z-0 / z-10 / z-20 / z-30 / z-40 / z-50 / z-auto 
> should alway control content + context

### scroll (Text-Parallax)
is a vue-prop and integrates different parallax-related things
- "default" no scroll-behaviour
- "sticky"
- "zoom": minimize=true falls außerhalb range 70-30
- "pin": minimize=true falls 0-20% unterhalb position, ab 0% sticky (cards kommen groß rein und werden klein 'angeheftet')
- "fade", "fade-early", "fade-late": fade-away-variants related to position in viewport
- "appear", "appear-early", "appear-late": fade-in-variants related to position in viewport

## Foreground / Background-Colors + Overlays
### color-mode: default (inherit), inverted
We should have an option to tell that in light-mode the section should be rendered as `dark` with all CONTENT automatically following

### bg-color: primary, bg-primary, secondary, bg-secondary ... 

### bg-fade: sky, earth, horizon, left, right (sky-primary, earth-primary ... right-primary)


## CONTEXT

### bg-image: path / url

### bg-scroll: sticky, default, options

### (bg-svg)
### (bg-vid / bg-obj)


## CONTENT
### border: none, default, box, card, top, top-primary (see DAS Ei > top-line in primary 16px)
### elements: flex-xyz / list-xyz
### tw: tailwind-classes (kommagetrennt, ohne Leerzeichen)
