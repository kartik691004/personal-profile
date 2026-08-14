# Kartik's Personal Profile — AI Context & Project Brief

> **This file is the single source of truth for any AI agent (like OpenCode) working on THIS project.**
> Read this file completely before making any changes.
> **Project root:** `C:\Users\kartik\OneDrive\Documents\personal profile` (do NOT touch `C:\Users\kartik\job dashboard\portfolio` — that is a different, separate project).

---

## 1. Project Overview & Architecture

This is a **personal portfolio website** for **Kartik**, rebuilt on the **MotionSites "Pulse 3D" prompt** (`https://motionsites.ai/?prompt=pulse-3d`) — a single-screen, scroll-driven, custom-gesture landing page. There is **no native browser scrolling**: `overflow: hidden` on `html`/`body`, and a wheel/touch controller drives one `scrollProgress` value (0 → 3.5) from which every animation is derived.

- **Stack:** Vite + React 19 + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), **GSAP 3.15** (char split + parallax), `lucide-react` (Menu/X icons only)
- **Fonts:** Manrope (body, Google Fonts) + Michroma (display, Google Fonts) — loaded in `src/index.css`
- **Palette:** Hero background `#FF005E` (magenta), second screen `#11010a` (near-black wine), accents `#ea1f63` / `pink-500` / `#ff5c93`, white text. **No purple/indigo anywhere.**
- **GitHub (verified via API):** `kartik691004` · **LinkedIn:** `kartik-kartik-3248a1231` (scraping blocked — use resume details)
- **Contact:** Bengaluru, India · +91 98861 20863 · kartik@bcah.christuniversity.in

---

## 2. Scroll Controller (in `src/App.tsx`)

- `progressRef` holds raw scroll progress 0 → 3.5; `lerpedScrollProgress` state is the smoothed copy (rAF lerp `0.08`, threshold `0.0001`).
- **Wheel:** `preventDefault()` (passive: false), `deltaY * 0.0006`. **Touch:** `deltaY * 0.0015`.
- **Nav animation:** `handleNavigateToSection` — 1200ms `easeInOutCubic` lerp to a target ratio (`window.__kartikNavigate` is exposed for components).
- **Active section** (drives header highlight): `<0.18` hero · `<0.45` projects · `<0.68` expertise · `<1.15` about · else contact.
- **Derived values:** `secondScreenProgress = clamp01((lerped - 1.15) / 0.5)`, `easedRisingProgress = 1 - (1-p)^3`, `smoothBlurAmount = sin(p·π/2) * 64`.

---

## 3. Screens & Components

### First screen (magenta, `z-10`, blurs up to 64px as panel rises)
- `VideoScrubber.tsx` — hero video scrub (`https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4`). rAF seek with lerp `0.15`, guard `!video.seeking && diff > 0.01`. GSAP mouse parallax `±40px` / 1.2s `power2.out`. Loader: `animate-ping` pink ring + spinner, label "LOADING SCROLL STREAM...".
- `ScrollExitSplitText.tsx` — splits "KARTIK" into chars; GSAP timeline scrubbed to scroll progress (chars exit down: `yPercent 300, y 25vh, scaleY 1.2, scaleX 0.9, stagger 0.03`). Pinned bottom, `text-[10.4vw]`, Michroma, `letterSpacing -0.07em`.
- `SoapTiles.tsx` — 3 white pill tiles (AI & Automation / Full-Stack Development / Open to Opportunities) slide in when `progress > 0.75` (ease over 0.22 range, blur 12→0). Desktop hover: hovered tile scales 1.2, neighbors shift `±13.8px`. Offsets 120/180/240 (×0.25 on mobile), delays 0/100/200ms.

### Header (`Header.tsx` + `Logo.tsx`)
- Logo: "K" monogram SVG (stroke path) + 3-line tagline (hidden < sm). Click → navigate to 0.
- Desktop nav (≥ md): 4 items (Projects 0.25 · Expertise 0.50 · About 0.95 · Contact 3.50), pill hover, active = white bg.
- Mobile: burger → fullscreen overlay (`bg-[#11010a]/98 backdrop-blur-xl`), active item `text-[#FF005E]`.

### Second screen (dark, `z-40`, rounded-t-[48px], rises at progress > 1.15)
- `SecondVideoScrubber.tsx` — same scrub pattern for `https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/2026060218225-v_kcy5rl.mp4`, but mapped to 1.45 → 3.50. Loader "LOADING DRUM STREAM...". Rendered at `opacity-40` under the text.
- `CylindricalTextDrum.tsx` — 32 personal lines (`DRUM_LINES` in `src/data.ts`; `[brackets]` = highlighted segments). Geometry: `R = 380`, `lineHeight = 32`, `perspective 1000px`, `perspectiveOrigin 25% 50%`. Per line: `translateZ = cos(θ)R - R`, `scale = 0.78 + cos(θ)*0.22`, `opacity = max(0,(cosθ-0.2)/0.8)`, depth blur `( |idxDiff| - 1.5 ) * 0.75` capped at 8. Empty line at index 15 renders a spacer.
- `Marquee.tsx` + `Logos.tsx` — bottom-left logo strip (border-t, pt-6), infinite marquee (`25s`, mask fade 15/85%) of Kartik brand wordmarks: FTB Hustle, Zidio, Christ University, GitHub, LinkedIn, Automation, Full-Stack (inline SVG text wordmarks).

---

## 4. File Structure

```
src/
  App.tsx                      # gesture controller + dual-screen composition
  main.tsx
  index.css                    # fonts (Manrope/Michroma), palette, scrollbar, marquee keyframes
  types.ts                     # NavigationItem, Project, ExpertiseItem
  data.ts                      # NAVIGATION_ITEMS, PROJECTS_DATA, EXPERTISE_DATA, DRUM_LINES
  components/
    Header.tsx                 # logo + desktop nav + mobile burger overlay
    Logo.tsx                   # "K" monogram SVG
    Logos.tsx                  # wordmark SVGs (Github, Linkedin, FTB Hustle, Zidio, etc.)
    Marquee.tsx                # infinite marquee (duplicated track, -50% keyframe)
    VideoScrubber.tsx          # hero scrub video + loader
    SecondVideoScrubber.tsx    # drum scrub video + loader
    ScrollExitSplitText.tsx    # GSAP char-level exit scrub
    SoapTiles.tsx              # reveal pill tiles + hover physics
    CylindricalTextDrum.tsx    # 3D cylinder text drum
public/favicon.svg             # brand "K" monogram
```

## 5. Build & Verify
- Dev server: `npm run dev` (port 5173) · Build: `npm run build` (`tsc -b && vite build`) · Lint: `npm run lint` (oxlint)
- **Note:** `lucide-react` v1.x has NO brand icons — wordmarks are inline SVGs in `Logos.tsx`.
- GSAP is a dependency; framer-motion was removed in the redesign.

## 6. Known Remaining Items
- [ ] Hero videos stream from Cloudflare R2 (public URLs from the Pulse 3D prompt) — swap for Kartik's own videos when available.
- [ ] Replace "Open to Opportunities" tile / drum copy when job status changes.
- [ ] Real profile links: GitHub `https://github.com/kartik691004` · LinkedIn `https://linkedin.com/in/kartik-kartik-3248a1231`
- [x] Build + lint green (GSAP scrub, drum, marquee, gesture nav verified)