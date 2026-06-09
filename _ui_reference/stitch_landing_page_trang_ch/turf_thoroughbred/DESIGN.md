---
name: Turf & Thoroughbred
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404942'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#717971'
  outline-variant: '#c0c9c0'
  surface-tint: '#316948'
  primary: '#002a15'
  on-primary: '#ffffff'
  primary-container: '#004225'
  on-primary-container: '#75af89'
  inverse-primary: '#98d4ac'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#152436'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b394d'
  on-tertiary-container: '#94a3ba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b4f0c7'
  primary-fixed-dim: '#98d4ac'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#165132'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Oswald
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  section-gap: 48px
  stack-sm: 4px
  stack-md: 12px
---

## Brand & Style

This design system is engineered for the high-stakes, prestigious world of competitive horse racing. It strikes a balance between **Modern Corporate** reliability and **High-Energy Sports Editorial** aesthetics. The visual language aims to evoke a sense of heritage, speed, and precision.

The target audience includes tournament organizers, stable owners, and high-volume bettors who require a data-rich environment that doesn't sacrifice clarity. The UI utilizes high-contrast typography and a sophisticated "Racing Green" and "Gold" palette to create an atmosphere of premium athletic competition. 

Key attributes:
- **Prestigious:** Reflecting the "Sport of Kings" through traditional color cues.
- **Dynamic:** Using condensed, slanted-feeling typography to imply forward motion.
- **Analytical:** Structuring complex data—race stats, health charts, and odds—into digestible, professional modules.

## Colors

The color palette is rooted in the tradition of the turf. 

- **Primary (Deep Racing Green):** Used for headers, primary navigation, and heavy branding elements to ground the interface in a professional, established feel.
- **Secondary (Gold):** Reserved for high-priority actions (CTAs), winners' circles, and premium highlights. It must be used sparingly to maintain its impact.
- **Neutral (Slate & White):** The background utilizes a very light gray (#F8FAFC) to reduce eye strain, while cards and containers use Crisp White to pop against the background.
- **Functional Colors:** Clear, high-chroma colors for race statuses:
    - **Success (Green):** Confirmed entry, Passed health check, Finished race.
    - **Warning (Amber):** Pending steward review, Delayed start.
    - **Danger (Red):** Scratched, Failed certificate, Disqualified.

## Typography

The typographic hierarchy uses a "Dual-Tone" approach to separate editorial energy from functional data.

- **Headlines (Oswald):** Utilized in a condensed, uppercase format for race titles, horse names, and section headers. This mimics the look of classic sports broadsheets and creates a sense of urgency.
- **Body & Data (Inter):** A neutral, highly legible sans-serif used for all tabular data, health records, and descriptions. Its utilitarian nature ensures that complex figures remain easy to read at small sizes.
- **Numerical Data:** For odds and timing, use `label-bold` to ensure statistical information stands out within data grids.

## Layout & Spacing

The design system employs a **Fixed-Width Grid** for desktop (1280px max-width) to maintain the density of data tables, while transitioning to a **Fluid Grid** for mobile devices.

- **Rhythm:** An 8px base unit drives all padding and margin decisions. 
- **Density:** Given the data-rich nature of sports management, vertical spacing within lists and tables is kept tight (`stack-sm`), while the gap between major content modules is generous (`section-gap`) to allow the UI to breathe.
- **Breakpoints:**
    - **Desktop (1024px+):** 12-column grid, 24px margins.
    - **Tablet (768px - 1023px):** 8-column grid, 20px margins.
    - **Mobile (Up to 767px):** 4-column grid, 16px margins. Headers scale down to `headline-lg-mobile`.

## Elevation & Depth

To maintain a "Professional/Modern" feel, the system uses **Tonal Layers** rather than heavy shadows. 

- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Content):** Pure white (#FFFFFF) with a very soft, 10% opacity Slate Gray shadow (0px 4px 12px) and a subtle 1px border (#E2E8F0).
- **Level 2 (Modals/Popovers):** Slightly more pronounced shadow (0px 10px 25px) to pull the element forward.
- **Interactive States:** On hover, cards should lift slightly (2px translation) to provide tactile feedback for stable owners navigating large horse rosters.

## Shapes

The shape language is controlled and sophisticated. 

- **Standard Elements:** Buttons, Input Fields, and Cards use a **0.5rem (8px)** corner radius. This is soft enough to feel modern but sharp enough to maintain a professional, data-driven edge.
- **Pills/Badges:** Status indicators (e.g., "In-Gate", "Winner") use a fully rounded/pill shape to distinguish them from structural UI components.
- **Icons:** Use a 2px stroke weight to match the clean lines of the Inter typeface.

## Components

- **Primary Buttons:** Solid Gold (#D4AF37) with Deep Racing Green text for maximum contrast. Use 8px rounded corners and `label-bold` typography.
- **Secondary Buttons:** Ghost style with Deep Racing Green borders and text.
- **Status Badges:** Small, pill-shaped markers with a light background tint of the status color and a dark text shade for high legibility (e.g., Success: #D1FAE5 background with #065F46 text).
- **Data Tables:** Use a "Zebra-stripe" layout for long lists of race entries. Headers should be Deep Racing Green with White text.
- **Health Certificates:** Specially formatted cards with a prominent status icon in the top right and a 4px left-border accent using the functional status color (Green/Amber/Red).
- **Odds Display:** Use a dark-themed container (Deep Racing Green) for live odds to make them feel like a digital scoreboard.