# Design System Document

## 1. Overview & Creative North Star: The Alpine Curator

This design system is built to bridge the gap between high-adrenaline adventure and premium Swiss precision. Our Creative North Star is **"The Alpine Curator"**—a visual language that feels as authentic as a handheld social story, yet as structured as a luxury editorial. 

The system rejects the "template" look of standard mobile apps. Instead, it utilizes **intentional asymmetry**, heavy typographic contrast, and layered visual depth to create a signature "Premium Instagram" feel. We move away from rigid, boxed-in grids toward a more fluid, high-energy layout where elements overlap and breathe, mimicking the layered peaks and valleys of the Swiss landscape.

---

## 2. Colors & Surface Philosophy

The palette is anchored in **Swiss Blue (#002F6C)** for authority and depth, energized by high-visibility accents that demand attention.

### Color Tokens (Material Selection)
*   **Primary:** `#001B44` (Deep Swiss Blue)
*   **Primary Container:** `#002F6C` (Signature Brand Blue)
*   **Secondary:** `#006971` (Alpine Turquoise Dark)
*   **Secondary Container:** `#76F1FF` (Turquoise Highlight)
*   **Tertiary (Accent 1):** `#6A001A` (Deep Pink)
*   **On-Tertiary Container:** `#FF6675` (Bright Pink / #FF2D55 transition)
*   **Surface:** `#FAF9FF` (Ice White)

### The "No-Line" Rule
To maintain a high-end feel, **do not use 1px solid borders for sectioning.** Structural boundaries must be defined solely through:
1.  **Background Color Shifts:** Use `surface-container-low` sections sitting on a `surface` background.
2.  **Tonal Transitions:** Define hierarchy by nesting containers of slightly different tonal values.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface`
*   **Floating Cards:** `surface-container-lowest` (The brightest white)
*   **Embedded Sections:** `surface-container-high` (Slightly deeper)

### The Glass & Gradient Rule
Standard flat colors feel static. To inject "soul," use **Glassmorphism** for floating headers or navigation bars (utilizing `surface` with 80% opacity and a `20px` backdrop blur). For primary Call-to-Actions (CTAs), apply a subtle linear gradient from `primary` to `primary-container` to create a sense of tactile volume.

---

## 3. Typography: Editorial Impact

The typography scale is designed for high-contrast storytelling. We use **Inter Black** (or Satoshi) for a "Brutalist" editorial feel in headers, paired with the clarity of **Inter** for utility text.

*   **Display (Display-LG/MD):** Inter Black. Used for "hero" travel statistics or punchy headlines. Tight letter-spacing (-0.02em).
*   **Headlines (Headline-LG/MD):** Inter Black. Used for destination names. These should feel heavy, energetic, and authoritative.
*   **Body (Body-LG/MD):** Inter Regular. Open tracking (0) and generous line-height (1.5) for maximum legibility against photographic backgrounds.
*   **Labels (Label-MD/SM):** Inter Bold. Always uppercase when used in "Large Colorful Badges" to mimic the high-energy Instagram sticker style.

---

## 4. Elevation & Depth: Tonal Layering

Shadows are secondary; layering is primary. We convey importance through "stacking" rather than "lifting."

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural edge without the "dirtiness" of heavy shadows.
*   **Ambient Shadows:** When a floating effect is vital (e.g., a floating book button), use an extra-diffused shadow: `Y: 8px, Blur: 24px, Color: On-Surface (8% opacity)`. The shadow must be tinted slightly by the `primary` color to feel natural.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline-variant` token at **10% opacity**. Never use 100% opaque borders.
*   **Backdrop Blur:** Floating elements (like the navigation bar or category tags over images) must use a blur to let the "Swiss scenery" bleed through, making the UI feel integrated into the content.

---

## 5. Components

### Large Colorful Badges (The "Instagram" Element)
The signature component of this system. These are not standard chips; they are "plates."
*   **Styling:** Bold background (`Accent 1` or `Accent 2`), 8px corner radius (`lg`), and `Headline-SM` typography. 
*   **Usage:** Used for price tags, "Top 1" callouts, and urgent alerts.

### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`. High contrast white text. 8px radius.
*   **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
*   **Tertiary:** Transparent background with `primary` text, bold weight.

### Cards & Lists
*   **Forbid Dividers:** Do not use horizontal lines. Use 24px (`6`) or 32px (`8`) vertical spacing from the Spacing Scale to separate list items.
*   **Image Cards:** Images should use a subtle inner glow (`outline-variant` at 10%) to separate them from dark backgrounds.

### Action Plates
Floating action buttons should be rectangular with slightly rounded corners (8px), breaking the traditional "circular FAB" trope to maintain the editorial aesthetic.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** overlap elements. Let a badge half-sit on an image and half-sit on a white surface to create depth.
*   **Do** use high-contrast color pairings (e.g., Acid Green text on Swiss Blue).
*   **Do** prioritize mobile-first thumb zones. Use large hit targets (min 48px).
*   **Do** use "Editorial White Space." Don't be afraid of large gaps between sections to signify a change in topic.

### Don't:
*   **Don't** use 1px solid borders to define boxes.
*   **Don't** use generic grey shadows. Use soft, tinted, ambient glows.
*   **Don't** use standard sans-serif weights for headlines; if it’s not Bold or Black, it’s not a headline in this system.
*   **Don't** center-align everything. Use left-aligned "Brutalism" for headlines to feel modern and authentic.

### Accessibility Note:
While we use high-energy accent colors like Acid Green (`#00FF9D`), always ensure the "On-Color" text (the text sitting on top) meets WCAG AA contrast ratios by using `on-primary-fixed` or `on-secondary-fixed` deep blues for maximum readability.