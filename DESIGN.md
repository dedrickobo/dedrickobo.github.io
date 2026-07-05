# Design

## Concept: The Journey

The site is a place, not a page. A Dark Souls-inspired nightscape rendered in a
single fixed WebGL canvas behind the DOM: scrolling walks the camera down a dead
pilgrim road; each section is a station you arrive at. Content (DOM) overlays the
world and stays fully readable and accessible.

## The world (`src/three/`)

- **`road.ts`** — the world-space contract: one station per DOM section, marching
  down -Z (`SEGMENT` apart). A future "Hub" navigation model can fly the rig to
  any station pose directly.
- **`Rig.tsx`** — scroll-driven camera: walks the road with a soft gait weave and
  damped mouse-look.
- **`Journey.tsx`** — the world: gradient sky, **eclipsed sun** (shader corona),
  fog + fog gates at area boundaries, jagged crag instances, broken arch with
  tattered banners (cloth shader) and sagging chains, broken colonnade,
  grave-blades, soul orbs, candle clusters, ground mist, drifting ash motes, and
  a camera-following **Lothric skyline** with circling crows that never gets closer.
- **`Bonfire.tsx`** — the true bonfire: procedural **coiled sword** (twisted-ribbon
  geometry, heat-emissive base), ash mound piled with femurs/ribs/skulls, layered
  fire (volumetric flame sheets + noise-eroded particles + smoke + embers),
  flickering light. One at the hero, one at Contact.
- **`Brand.tsx`** — the Brand of Sacrifice extruded from `public/brandofsacrifice.svg`,
  breathing above the hero fire (scale pulse + bob, never spinning).
- **`Scene.tsx`** — composer: fog, lights, **Bloom + Vignette** post (full tier),
  4x MSAA.
- **`tier.ts`** — `full` / `lite` / `off`: reduced-motion or no-WebGL gets the CSS
  backdrop only; weak/coarse-pointer devices get reduced counts and no post.
- Textures: CC0 ambientCG PBR maps (`public/textures/`, compressed to ~320KB total):
  Rock058 on crags/arch/monoliths, Ground081 on the road. Everything else procedural.
- The whole 3D layer is lazy-loaded after first paint (`React.lazy`).

## Color

OKLCH custom properties in `src/styles/global.css`. Black-and-white ink system
with **blood red as the single accent**; the warm fire/dusk palette lives only
inside the WebGL world.

Key tokens: `--ink-*` (near-black surfaces), `--bone` (primary text),
`--ash` / `--ash-dim` (secondary text), `--blood` / `--blood-bright` (the accent),
`--line` (hairlines). Body text ≥4.5:1 on ink.

## Typography

Self-hosted via `@fontsource`.

- **Display: Cinzel** — engraved Souls-style capitals for the name and section titles.
- **Body: Hanken Grotesk** — 400/500 body, 600–700 subheads.
- **Mono: JetBrains Mono** — technical content only (status line, dates, chips, labels).
- Fluid `clamp()` scale; `text-wrap: balance` on headings, `pretty` on prose.

## Components & layout

- Panels: flat near-black with 1px hairline borders; hover sharpens the border to blood.
- Featured case studies (aform, procal-infra) carry custom SVG architecture diagrams.
- Grain, halftone, and crosshatch textures overlay the page; a custom blood
  dot + trailing-ring cursor (fine pointers only).
- Responsive grids via `repeat(auto-fit, minmax(280px, 1fr))`; no horizontal overflow
  at 375px.

## Motion

- Lenis smooth scroll, synced to GSAP ScrollTrigger; the same scroll drives the
  WebGL camera.
- Framer Motion reveals enhance already-visible content; `useReducedMotion`
  collapses everything to instant, and the reduced-motion tier disables the
  entire WebGL layer.

## Signature elements

- "Mediocrity is a sin." as the recurring signature line.
- The Brand of Sacrifice above the first bonfire and as favicon.
- Mono status line in the hero (`● Open to DevOps/Cloud/SRE roles · Batam, ID · UTC+7`).
