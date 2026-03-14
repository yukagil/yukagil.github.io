# Visual Design System: Yuta Kanehara Portfolio

## 1. Aesthetic Direction

### Moving AWAY from
- **Neobrutalism**: 4px black hard shadows, thick black borders on everything, chunky box-shadow offsets
- **Neon synthwave dark mode**: cyan/pink/purple glows, `shadow-[0_0_30px]` effects, dark mode that feels like a different site
- **Visual clutter**: grid-dot backgrounds, orbiting animated icons, 8+ colors competing for attention, colored header bars on cards
- **Aggressive weight**: everything bold/black/heavy, borders-on-borders, multiple visual layers stacked

### Moving TOWARD: **"Game Menu Minimal"**
Inspired by: Nintendo Switch home screen, Nintendo.co.jp product pages, Animal Crossing UI, Wii menu

The feeling: You open a beautifully made game and the menu screen is so clean it almost feels empty — but every element is placed with care, and one small thing moves or responds and you think "oh, that's nice." Generous white space. Rounded, friendly shapes. Soft surfaces that invite touch. Color used like seasoning — sparingly, precisely.

Key Nintendo qualities to embody:
- **Approachable geometry**: rounded corners, pill shapes, circles — nothing sharp
- **One accent, not a palette explosion**: Nintendo product pages often use just white + one color
- **Weight through spacing, not borders**: elements breathe; density comes from proximity, not from drawn borders
- **Responses that feel physical**: things press in, bounce back — not float/glow
- **Joy in small details**: a micro-animation, a color shift, a small surprise — never a spectacle

---

## 2. Typography

### Font Stack

```css
:root {
  /* Display: Rounded, warm, slightly playful — works for JP headlines too */
  --font-display: 'Zen Maru Gothic', 'Rounded Mplus 1c', system-ui, sans-serif;

  /* Body: Clean, excellent JP rendering, modern but warm */
  --font-body: 'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif;

  /* Mono: For dates, metadata, small labels */
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
}
```

### Google Fonts Load

```html
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Why These Fonts
- **Zen Maru Gothic** (丸ゴシック): Rounded terminals give it a soft, approachable quality that echoes Nintendo's typography sensibility. The "Maru" (round) quality is inherently Japanese and inherently playful without being childish. Works beautifully for both Latin and Japanese headlines.
- **Zen Kaku Gothic New**: The angular counterpart in the same Zen family — clean, modern, highly readable for body text in both languages. Pairs perfectly with Zen Maru Gothic because they share the same skeletal structure.
- **JetBrains Mono**: Retained from current site. Clean monospace for dates and metadata.

### Type Scale

```css
:root {
  --text-xs: 0.75rem;      /* 12px — dates, metadata labels */
  --text-sm: 0.875rem;     /* 14px — body small, list items */
  --text-base: 1rem;       /* 16px — body default */
  --text-lg: 1.125rem;     /* 18px — section body intro */
  --text-xl: 1.25rem;      /* 20px — card titles */
  --text-2xl: 1.5rem;      /* 24px — section titles */
  --text-3xl: 1.875rem;    /* 30px — hero sub elements */
  --text-hero: clamp(2.5rem, 8vw, 4.5rem); /* responsive hero name */
}
```

### Typography Hierarchy Rules
- **Hero name** (`text-hero`): Zen Maru Gothic, weight 900, tracking -0.03em, leading 0.95
- **Section titles** (`text-2xl`): Zen Maru Gothic, weight 700, tracking -0.01em
- **Card/item titles** (`text-xl` or `text-sm`): Zen Kaku Gothic New, weight 700
- **Body text**: Zen Kaku Gothic New, weight 400 or 500, leading 1.7 (generous for JP readability)
- **Metadata/dates**: JetBrains Mono, weight 400, `text-xs`, uppercase for English labels
- **One-liner/subtitle**: Zen Kaku Gothic New, weight 500, `text-lg`

---

## 3. Color Palette

### Design Principle
Like a Nintendo product page: predominantly neutral with ONE signature color that does the talking. The accent color is "Yuta Red" — a warm, slightly orange-red that feels energetic and Japanese (think: Nintendo red, torii gate red, hanko stamp red). It appears sparingly: the visual signature stamp, active states, the most important CTA.

### Light Mode

```css
:root {
  /* Surface */
  --color-bg:            #FAFAF8;    /* warm off-white, like quality paper */
  --color-surface:       #FFFFFF;    /* cards, elevated elements */
  --color-surface-hover: #F5F5F0;    /* subtle hover state */
  --color-surface-alt:   #F0EDE6;    /* alternate surface for variety */

  /* Text */
  --color-text-primary:   #1A1A1A;  /* near-black, not pure black */
  --color-text-secondary: #6B6B6B;  /* descriptions, metadata */
  --color-text-tertiary:  #9B9B9B;  /* dates, hints */

  /* Accent — "Yuta Red" */
  --color-accent:         #E8433E;  /* warm red — the signature */
  --color-accent-hover:   #D03A35;  /* slightly deeper on hover */
  --color-accent-subtle:  #FEF0EF;  /* very soft red tint for backgrounds */

  /* Functional */
  --color-border:         #E5E2DB;  /* soft warm border */
  --color-border-hover:   #D0CCC3;  /* border on hover */
  --color-link:           #1A1A1A;  /* links same as text, underlined */
  --color-link-hover:     #E8433E;  /* links turn red on hover */

  /* Shadow (used very sparingly) */
  --shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md:   0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-lg:   0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-press: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* for pressed/active states */
}
```

### Dark Mode

```css
[data-theme="dark"] {
  /* Surface — warm dark, not cold gray */
  --color-bg:            #1C1B19;   /* dark warm charcoal */
  --color-surface:       #262520;   /* elevated cards */
  --color-surface-hover: #302F28;   /* hover state */
  --color-surface-alt:   #2A2924;   /* alternate surface */

  /* Text */
  --color-text-primary:   #E8E6E1;  /* warm white */
  --color-text-secondary: #9B9890;  /* muted warm gray */
  --color-text-tertiary:  #6B6860;  /* dates, hints */

  /* Accent — same red, slightly lighter for contrast */
  --color-accent:         #F05E59;
  --color-accent-hover:   #F47570;
  --color-accent-subtle:  rgba(240, 94, 89, 0.1);

  /* Functional */
  --color-border:         #3A3830;
  --color-border-hover:   #4A4840;
  --color-link:           #E8E6E1;
  --color-link-hover:     #F05E59;

  /* Shadow — subtle, no glows */
  --shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md:   0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-lg:   0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-press: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}
```

### Color Usage Rules
1. **Backgrounds**: `--color-bg` everywhere. `--color-surface` for cards/elevated content only.
2. **Accent red**: Max 3 instances visible on any screen at once. Used for: the hanko stamp, primary CTA button, active/selected states. Never as background fill for large areas.
3. **No colored section backgrounds**. Sections differentiate through spacing, not color.
4. **Borders**: 1px, `--color-border`. No thick borders. Border appears on hover or to define cards, never both simultaneously.
5. **No box-shadow offsets**. Shadows are soft and ambient only.

---

## 4. Spacing Scale

```css
:root {
  --space-1:   0.25rem;   /*  4px */
  --space-2:   0.5rem;    /*  8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */

  /* Layout-specific */
  --card-padding:       var(--space-5);        /* 20px — compact */
  --card-gap:           var(--space-3);        /* 12px — between list items */
  --section-gap:        var(--space-20);       /* 80px — between Zone 2 sections */
  --zone-transition:    var(--space-24);       /* 96px — between Zone 1 and Zone 2 */
  --page-max-width:     640px;                 /* narrower than current 896px — more compact, more focused */
  --page-padding-x:     var(--space-5);        /* 20px side padding on mobile */

  /* Border radius */
  --radius-sm:  6px;       /* small elements, tags */
  --radius-md:  12px;      /* cards, buttons */
  --radius-lg:  20px;      /* large cards, sections */
  --radius-full: 9999px;   /* pills, circles */
}
```

### Spacing Philosophy
- **Zone 1 (The Card)**: Tight, compact. Everything fits in a single mobile viewport. Internal spacing uses `space-3` to `space-5`. The card itself has `card-padding`.
- **Zone 2 (The Depth)**: Generous breathing room. `section-gap` (80px) between sections. List items use `card-gap` (12px) for a compact scannable feel.
- **The 3 breathing dots** occupy the full `zone-transition` (96px) height, centered vertically.
- **Page width reduced to 640px** from current 896px. This is deliberate — it creates more white space on desktop and makes the content feel curated, like reading a well-set book. On mobile, the single-column layout is unchanged.

---

## 5. Motion Vocabulary

### Core Timing

```css
:root {
  /* Durations */
  --duration-instant:  100ms;   /* micro-interactions: button press */
  --duration-fast:     180ms;   /* hover states, color changes */
  --duration-normal:   300ms;   /* card flip, section transitions */
  --duration-slow:     500ms;   /* page-level animations */

  /* Easing */
  --ease-out:     cubic-bezier(0.22, 0.61, 0.36, 1);      /* general exits/settles */
  --ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);      /* Nintendo-style spring */
  --ease-in-out:  cubic-bezier(0.45, 0, 0.55, 1);         /* symmetric, for flip */
}
```

### What Animates

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| **Buttons/links** | hover | scale to 1.02, color shift | `instant` | `ease-out` |
| **Buttons/links** | press/active | scale to 0.97, shadow becomes `shadow-press` | `instant` | `ease-out` |
| **List items** | hover | background fades to `surface-hover`, slight translateY(-1px) | `fast` | `ease-out` |
| **Card flip** | click on trigger | 3D Y-axis rotation, 0deg to 180deg | `normal` | `ease-in-out` |
| **Section entrance** | scroll into view | opacity 0 to 1, translateY(12px) to 0 | `slow` | `ease-out` |
| **Breathing dots** | continuous | scale pulse 1.0 to 1.3, opacity 0.3 to 0.7 | 2000ms | `ease-in-out` |
| **SNS icons** | hover | scale 1.08, color shifts to `--color-accent` | `fast` | `ease-bounce` |
| **Dark mode toggle** | click | icon rotates 180deg, colors crossfade | `normal` | `ease-bounce` |
| **Page background** | theme change | color crossfade | `slow` | `ease-in-out` |

### What Stays Still
- Text (never animated except on initial page load)
- Profile photo (static — let the face be steady and human)
- Section titles (no entrance animation — they anchor the scroll)
- Borders and dividers

### Breathing Dots Spec

```css
.breathing-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: var(--zone-transition);  /* 96px */
}

.breathing-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: var(--color-text-tertiary);
  animation: breathe 2s var(--ease-in-out) infinite;
}

.breathing-dot:nth-child(2) { animation-delay: 400ms; }
.breathing-dot:nth-child(3) { animation-delay: 800ms; }

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.7;
  }
}
```

### Card Flip Spec

```css
.card-container {
  perspective: 1000px;
}

.card-flipper {
  position: relative;
  transition: transform var(--duration-normal) var(--ease-in-out);
  transform-style: preserve-3d;
}

.card-flipper.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
}

.card-back {
  transform: rotateY(180deg);
}
```

The flip trigger: a small "?" icon (pill-shaped, `--color-accent` background) in the bottom-right corner of the card. On hover, it gently rocks side-to-side (rotate -3deg to 3deg, 600ms loop) to invite interaction. After flip, the "?" becomes "x" to flip back.

### Section Entrance

```css
.section-enter {
  opacity: 0;
  transform: translateY(12px);
}

.section-enter.visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}
```

Use IntersectionObserver with `threshold: 0.1` and `rootMargin: "0px 0px -40px 0px"`. Each section animates once. No stagger between child elements within a section — the whole section fades in as one unit. This is cleaner and more confident than staggered children.

---

## 6. Component Visual Specs

### Zone 1: The Card

```
Layout: centered, max-width 640px, single column
Background: --color-surface
Border: 1px solid --color-border
Border-radius: --radius-lg (20px)
Shadow: --shadow-md
Padding: --space-8 (32px) on desktop, --space-5 (20px) on mobile
```

**Interior layout (top to bottom):**
1. Profile photo: 96px circle, 2px border `--color-border`, no shadow
2. Name: `text-hero`, Zen Maru Gothic 900, `--color-text-primary`
3. One-liner: `text-base`, Zen Kaku Gothic New 500, `--color-text-secondary`
4. Title pills: inline-flex, `--radius-full`, background `--color-surface-alt`, `text-xs` mono, `--color-text-secondary`
5. SNS row: icon buttons 40x40px, `--radius-md`, border 1px `--color-border`, centered icons 18px. Hover: border becomes `--color-accent`, icon color becomes `--color-accent`, `ease-bounce`
6. Handle: `text-xs`, mono, `--color-text-tertiary`

**Card back (hobby/casual side):**
Same dimensions. Background: `--color-surface-alt`. Contains: a casual photo or illustration placeholder, 2-3 hobby tags as pills, a short playful sentence in Japanese ("キャンプとコーヒーが好きです"), location with small icon. All in `--color-text-secondary`. Relaxed, friendly.

### Zone 2: Section List Items (Interviews, Speaking, Writings)

All three follow the same visual pattern — consistency is key.

```
Layout: horizontal row
Background: transparent (no card background by default)
Border: none by default
Border-radius: --radius-md on hover
Padding: --space-3 (12px) vertical, --space-4 (16px) horizontal
Gap between items: --space-1 (4px) — tight, scannable
Hover: background fades to --color-surface-hover, translateY(-1px)
Active: translateY(0), --shadow-press background
```

**Interior layout (left to right):**
1. **Thumbnail**: 48x48px rounded square (`--radius-sm`), `object-cover`. If no image, show placeholder with subtle icon centered on `--color-surface-alt` background.
2. **Content stack** (flex-col, gap-1):
   - Source/event name: `text-xs`, `--color-text-tertiary`, Zen Kaku Gothic New 500
   - Title: `text-sm`, `--color-text-primary`, Zen Kaku Gothic New 700, line-clamp-2
   - Date: `text-xs`, mono, `--color-text-tertiary`
3. **Arrow indicator**: hidden by default, fades in on hover. A simple `>` chevron, 14px, `--color-text-tertiary`.

**No borders on items. No shadows on items.** The hover background change is the only state indicator. This is the Nintendo way — clean until interaction reveals depth.

### Zone 2: Section Titles

```
Font: Zen Maru Gothic, weight 700, text-2xl
Color: --color-text-primary
Margin-bottom: --space-6 (24px)
No icon boxes. No colored backgrounds behind icons.
Optional: a small inline icon (18px) before the text, same color as text, no background.
```

### Zone 2: Experience Timeline

```
Layout: vertical timeline, left-aligned
Line: 1px solid --color-border, positioned 12px from left
Dots on line: 8px circles, --color-accent fill for current, --color-border for past
Company name: text-lg, Zen Maru Gothic 700
Role title: text-sm, Zen Kaku Gothic New 700
Period: text-xs, mono, --color-text-tertiary
Description: text-sm, Zen Kaku Gothic New 400, --color-text-secondary, leading 1.7
Cards: No background, no border. Just content next to the timeline.
```

### Zone 2: Services Teaser

```
A single quiet block:
Background: --color-surface
Border: 1px solid --color-border
Border-radius: --radius-lg
Padding: --space-8
Text: one sentence description, text-base, --color-text-secondary
CTA: pill-shaped button, background --color-accent, text white, --radius-full
     Hover: scale 1.02, --color-accent-hover
     Active: scale 0.97, --shadow-press
```

### Zone 2: Contact/Footer Section

```
No bordered card. Just centered text.
Heading: text-2xl, Zen Maru Gothic 700
Body: text-base, --color-text-secondary
SNS icons: same treatment as Zone 1 — row of icon buttons
Footer: text-xs, mono, --color-text-tertiary, top border 1px --color-border
```

---

## 7. The "One Thing Someone Will Remember"

### The Hanko Stamp (判子)

Yuta's visual signature is a small **hanko-style stamp** — a circular red seal rendered in the style of a Japanese personal stamp. It contains a simplified version of the kanji 「金」(from 金原/Kanehara) in white, set inside a circle with `--color-accent` (#E8433E) background.

**Specifications:**
- Size: 32px diameter (Zone 1), 24px diameter (footer)
- Shape: perfect circle with a very subtle rough/textured edge (achieved with a slight SVG filter or a hand-drawn SVG path, not a programmatic circle — this matters)
- Interior: the kanji 「金」in white, slightly irregular as if actually stamped
- Rotation: tilted 3-7 degrees (not perfectly straight — stamps are never perfectly straight)
- Placement in Zone 1: next to the name, slightly overlapping the text baseline like a real hanko stamp on a document
- Placement in footer: next to copyright text

**Why this works:**
- It is unmistakably Japanese and unmistakably personal (hanko stamps are your identity)
- It is small, quiet, and easy to miss at first — then once you see it, you can't unsee it
- It is the ONE use of red that anchors the entire color system
- It connects to the "card" metaphor (business cards in Japan carry hanko stamps)
- It follows the Nintendo principle: one playful detail in an otherwise minimal space
- It is not generatable by AI — it requires a specific hand-drawn SVG, making it feel human and authored

The stamp should be implemented as an inline SVG, not a font glyph or image, for crisp rendering at all sizes. The subtle imperfection in the edge and character is load-bearing — a perfect circle with a perfect character would lose the charm entirely.

---

## 8. Dark Mode Strategy

### Philosophy: Same Room, Lights Dimmed

The current site's dark mode feels like a different website (neon synthwave). The new dark mode should feel like the same room with the lights turned low. Same warmth, same personality, just quieter.

### Transformation Rules

| Property | Light | Dark | Principle |
|----------|-------|------|-----------|
| Background | warm off-white `#FAFAF8` | warm dark charcoal `#1C1B19` | Warm undertone preserved |
| Surface | pure white `#FFFFFF` | dark warm `#262520` | Never cold gray |
| Text primary | near-black `#1A1A1A` | warm white `#E8E6E1` | Never pure white |
| Accent red | `#E8433E` | `#F05E59` | Slightly lighter for contrast, same hue |
| Borders | `#E5E2DB` | `#3A3830` | Same warm undertone |
| Shadows | subtle ambient | slightly deeper ambient | NO glows. NO colored shadows. |

### What Does NOT Change Between Modes
- The hanko stamp red (always red, it is a stamp)
- The typography weights and sizes
- The spacing
- The border-radius values
- The animation timings and easings
- The overall layout and information hierarchy

### What Changes
- Surface colors (warm light to warm dark)
- Text colors (dark to light, maintaining same hierarchy)
- Shadow intensity (slightly more opaque in dark mode)
- Image treatment: thumbnails get a subtle `brightness(0.9)` filter in dark mode to avoid being eye-searing

### Dark Mode Toggle
- Location: top-right corner of Zone 1 card (not in a header bar)
- Icon: sun/moon, 20px, inside a 36x36 button
- No label text, just the icon
- Transition: icon rotates 180deg on `--ease-bounce`; all color properties transition on `--duration-slow`
- The toggle itself uses `--color-text-secondary` for the icon, `--color-surface-hover` for background. No colored background for the toggle button.

---

## Implementation Notes

### CSS Architecture
Define all custom properties at `:root` level. Dark mode overrides via `[data-theme="dark"]` attribute on `<html>`, not via `.dark` class (cleaner, more semantic). All color references in components use `var(--color-*)` — no hardcoded Tailwind color classes for theme-dependent values.

### Tailwind Integration
Create a Tailwind theme extension that maps to the CSS custom properties:
```js
// tailwind.config extension
theme: {
  extend: {
    colors: {
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      'surface-hover': 'var(--color-surface-hover)',
      'text-primary': 'var(--color-text-primary)',
      'text-secondary': 'var(--color-text-secondary)',
      accent: 'var(--color-accent)',
    },
    fontFamily: {
      display: ['var(--font-display)'],
      body: ['var(--font-body)'],
      mono: ['var(--font-mono)'],
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
    }
  }
}
```

### Fonts to Remove
- Bricolage Grotesque (replaced by Zen Maru Gothic)
- Newsreader (currently loaded but appears unused)

### Background
- Remove the grid-dot background pattern entirely
- Background is flat `--color-bg`. Nothing else.

### What to Delete from Current CSS
- All `shadow-[Xpx_Xpx_0_0_#000]` (hard offset shadows)
- All `shadow-[0_0_Xpx_rgba(...)]` (neon glows)
- All `border-2` and `border-4` (replace with `border` i.e. 1px)
- All orbiting icon animation code
- Grid background pattern classes
- The `hoverLift` keyframe
- All neon color variables and their dark-mode glow mappings
- Philosophy card colored headers

### Performance
- Zen Maru Gothic and Zen Kaku Gothic New are Google Fonts with good CJK subsetting via `&subset=japanese`
- Use `font-display: swap` (already set by `display=swap` in Google Fonts URL)
- The hanko SVG is inline, not a network request
- Reduced animation complexity (no requestAnimationFrame loops for orbiting icons)
- Narrower max-width (640px) means smaller layout reflows
