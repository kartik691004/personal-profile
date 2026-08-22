# Kartik's Personal Profile — AI Context & Project Brief

> **This file is the single source of truth for any AI agent (like OpenCode) working on THIS project.**
> Read this file completely before making any changes.
> **Project root:** `C:\Users\kartik\OneDrive\Documents\personal profile` (do NOT touch `C:\Users\kartik\job dashboard\portfolio` — that is a different, separate project).

---

## 1. Project Overview & Architecture

This is a **personal portfolio website** for **Kartik**, rebuilt on the **MotionSites "Pulse 3D" prompt** (`https://motionsites.ai/?prompt=pulse-3d`) — a single-screen, scroll-driven, custom-gesture landing page. There is **no native browser scrolling**: `overflow: hidden` on `html`/`body`, and a wheel/touch controller drives one `scrollProgress` value (0 → 3.5) from which every animation is derived.

- **Stack:** Vite + React 19 + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react` (Menu/X icons only). **No animation library** — GSAP was removed (see §2); all motion is plain math + imperative DOM writes.
- **Fonts:** Manrope (body, Google Fonts) + Michroma (display, Google Fonts) — `<link>`ed in `index.html` (NOT `@import`ed in CSS, which would serialise the request behind the CSS bundle)
- **Palette:** Hero background `#FF005E` (magenta), second screen `#11010a` (near-black wine), accents `#ea1f63` / `pink-500` / `#ff5c93`, white text. **No purple/indigo anywhere.**
- **GitHub (verified via API):** `kartik691004` · **LinkedIn:** `kartik-kartik-3248a1231` (scraping blocked — use resume details)
- **Contact:** Bengaluru, India · +91 98861 20863 · kartik@bcah.christuniversity.in

---

## 2. Scroll Controller (`src/scroll.ts`) — READ THIS BEFORE TOUCHING ANY ANIMATION

All scroll state lives in a **module-level store outside React**, because driving 60fps
animation through `setState` re-rendered the entire component tree on every frame.

- **One rAF loop** in `scroll.ts` owns everything. Subscribe with `onFrame(fn)`; the callback
  receives `(smoothedProgress, rawProgress)` and writes styles **imperatively via refs**.
- **The loop self-idles.** A callback returns `true` to request another frame and `false`/
  `undefined` when it has nothing left to do. When every subscriber is settled the loop stops
  calling `requestAnimationFrame` entirely, so a stationary page costs **zero** CPU.
- **Never render an animated value into JSX.** Animated elements take className only and are
  wrapped in `memo()` — a `style` prop would let React clobber the imperative writes.
- **Wheel:** `deltaY * 0.0014`. **Touch:** `deltaY * 0.003`. Smoothing lerp `0.16`.
  (All three were slower before; the page felt laggy, not just janky.)
- **Nav animation:** `animateTo(target, 850)` — `easeInOutCubic`. `window.__kartikNavigate` still exposed.
- **Active section** (drives header highlight): `<0.18` hero · `<0.45` projects · `<0.68` expertise · `<1.15` about · else contact. `setActiveSectionId` is called **only when the value changes**.
- **Keyboard:** PageUp/PageDown/Space `±0.45`, Arrow Up/Down `±0.12`, Home/End.
- **`prefers-reduced-motion`** is honoured: smoothing becomes instant and the marquee stops.
- **`quantizeBlur(px, step)`** — snaps `filter: blur()` to integer steps. A fractional blur that
  changes every frame forces a full re-rasterisation of the layer every frame; snapping lets the
  browser reuse the raster. **Always quantize a scroll-driven blur, and clear it (`filter = ''`)
  when it reaches 0** rather than leaving `blur(0px)` alive.
- Exported constants (`MAX_PROGRESS 3.5`, `SECOND_SCREEN_START 1.15`, `HERO_COVERED_AT 1.65`,
  `DRUM_START 1.45`, `DRUM_END 3.5`) are the single definition of the timeline — import them
  instead of re-hardcoding the magic numbers.
- **Derived values:** `secondScreenProgress = clamp01((p - 1.15) / 0.5)`, `easedRisingProgress = 1 - (1-p)^3`, `smoothBlurAmount = sin(p·π/2) * 64` (quantized to 4px steps).

---

## 3. Screens & Components

### First screen (magenta, `z-10`, blurs up to 64px as panel rises)
- `VideoScrubber.tsx` — hero video scrub (`https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4`). rAF seek with lerp `0.22`, guard `!video.seeking && diff > 0.02`. Mouse parallax `±40px` via the shared pointer lerp in `scroll.ts` (was a GSAP tween allocated per frame). Early-outs once `progress >= HERO_COVERED_AT`. Loader: `animate-ping` pink ring + spinner, label "LOADING SCROLL STREAM...".
- `ScrollExitSplitText.tsx` — splits "KARTIK" into chars and scrubs their exit with plain math (chars exit down: `yPercent 300, y 25vh, scaleY 1.2, scaleX 0.9, stagger 0.03`, `easeInOutCubic` per char). This was a GSAP timeline that allocated a **new tween every frame**; the replacement is bit-identical (verified over 66k samples). Chars carry `origin-top`. Pinned bottom, `text-[10.4vw]`, Michroma, `letterSpacing -0.07em`.
- `SoapTiles.tsx` — 3 white pill tiles (AI & Automation / Full-Stack Development / Open to Opportunities) slide in when `progress > 0.75` (ease over 0.22 range, blur 12→0, quantized). Desktop hover: hovered tile scales 1.2, neighbors shift `±13.8px`. Offsets 120/180/240 (×0.25 on mobile), delays 0/100/200ms. **The scroll transform and the hover transform live on two different elements** — sharing one element made the CSS transition fight the per-frame JS write. `matchMedia` is read once into a ref, never during render.

### Header (`Header.tsx` + `Logo.tsx`)
- Logo: "K" monogram SVG (stroke path) + 3-line tagline (hidden < sm). Click → navigate to 0.
- Desktop nav (≥ md): 4 items (Projects 0.25 · Expertise 0.50 · About 0.95 · Contact 3.50), pill hover, active = white bg.
- Mobile: burger → fullscreen overlay (`bg-[#11010a]/98 backdrop-blur-xl`), active item `text-[#FF005E]`.

### Second screen (dark, `z-40`, rounded-t-[48px], rises at progress > 1.15)
- `SecondVideoScrubber.tsx` — same scrub pattern for `https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/2026060218225-v_kcy5rl.mp4`, but mapped to 1.45 → 3.50. **`src` is not set until `progress >= 0.6`**, so it no longer competes with the hero video for bandwidth during first paint. Loader "LOADING DRUM STREAM...". Rendered at `opacity-40` under the text.
- `CylindricalTextDrum.tsx` — 32 personal lines (`DRUM_LINES` in `src/data.ts`; `[brackets]` = highlighted segments). Geometry: `R = 380`, `lineHeight = 32`, `perspective 1000px`, `perspectiveOrigin 25% 50%`. Per line: `translateZ = cos(θ)R - R`, `scale = 0.78 + cos(θ)*0.22`, `opacity = max(0,(cosθ-0.2)/0.8)`, depth blur `( |idxDiff| - 1.5 ) * 0.75` capped at 8, **quantized to 2px steps and dropped below 1px**. Empty line at index 15 renders a spacer. This is the single most expensive component on the page: it writes to 33 elements per frame, so every write is cached per line and compared before touching the CSSOM, fully-transparent lines get `visibility: hidden` to leave the render path, and the whole callback early-outs while `progress < SECOND_SCREEN_START`.
- `Marquee.tsx` + `Logos.tsx` — bottom-left logo strip (border-t, pt-6), infinite marquee (`25s`, mask fade 15/85%) of Kartik brand wordmarks: FTB Hustle, Zidio, Christ University, GitHub, LinkedIn, Automation, Full-Stack (inline SVG text wordmarks).

---

## 4. File Structure

```
src/
  App.tsx                      # gesture controller + dual-screen composition
  scroll.ts                    # SCROLL STORE: single rAF loop, onFrame(), easing, quantizeBlur
  main.tsx
  index.css                    # palette, scrollbar, marquee keyframes (fonts are in index.html)
  types.ts                     # NavigationItem, Project, ExpertiseItem
  data.ts                      # NAVIGATION_ITEMS, PROJECTS_DATA, EXPERTISE_DATA, DRUM_LINES
  components/
    Header.tsx                 # logo + desktop nav + mobile burger overlay
    Logo.tsx                   # "K" monogram SVG
    Logos.tsx                  # wordmark SVGs (Github, Linkedin, FTB Hustle, Zidio, etc.)
    Marquee.tsx                # infinite marquee (duplicated track, -50% keyframe)
    VideoScrubber.tsx          # hero scrub video + loader
    SecondVideoScrubber.tsx    # drum scrub video + loader (lazy src)
    ScrollExitSplitText.tsx    # char-level exit scrub (plain math)
    SoapTiles.tsx              # reveal pill tiles + hover physics
    CylindricalTextDrum.tsx    # 3D cylinder text drum
public/favicon.svg             # brand "K" monogram
```

## 5. Build & Verify
- Dev server: `npm run dev` (port 5173) · Build: `npm run build` (`tsc -b && vite build`) · Lint: `npm run lint` (oxlint)
- **Note:** `lucide-react` v1.x has NO brand icons — wordmarks are inline SVGs in `Logos.tsx`.
- **There is no animation library.** GSAP and framer-motion were both removed. Do not add one back to
  solve a motion problem — the `onFrame` store in §2 is the mechanism, and a library that allocates
  tweens per frame is what made this page slow in the first place.
- Bundle budget: **212 kB raw / 67 kB gzip.** If a change pushes this materially higher, question it.

## 6. Performance Contract (measured, do not regress)

The animation layer was rebuilt for speed in Aug 2026. Benchmarked in headless Chrome over CDP,
production builds, driven wheel input, with `Emulation.setCPUThrottlingRate` to stand in for a
mid-range phone — which is where the page was genuinely unusable:

| CPU throttle | Phase | fps before → after | frames over 20ms, before → after |
| --- | --- | --- | --- |
| 6× | drum scroll | **17 → 52** | **100% → 30%** |
| 6× | hero scroll | **27 → 50** | 94% → 33% |
| 4× | drum scroll | **31 → 56** | 84% → 21% |
| 4× | hero scroll | 44 → 53 | 37% → 27% |
| 1× | both | ~60 → ~60 | already fine on desktop |

Simultaneous blur layers at rest went **35 → 14**. Note the new build also travels ~2.3× further
per wheel tick, so it is doing *more* animation work per second at these frame rates.

**The four rules that produced this — break them and the page gets slow again:**
1. No React state on the per-frame path. Subscribe via `onFrame`, write through refs.
2. Return `false` from `onFrame` when idle, and early-out when off-screen.
3. Quantize every scroll-driven blur; clear the filter at 0; `visibility: hidden` invisible layers.
4. `useEffect` deps for a frame subscription must be `[]`. Both video scrubbers previously had
   `[scrollProgress]`, which tore down and rebuilt the rAF loop and window listener *every frame*.

## 7. Known Remaining Items
- [ ] Hero videos stream from Cloudflare R2 (public URLs from the Pulse 3D prompt) — swap for Kartik's own videos when available.
- [ ] Replace "Open to Opportunities" tile / drum copy when job status changes.
- [ ] Real profile links: GitHub `https://github.com/kartik691004` · LinkedIn `https://linkedin.com/in/kartik-kartik-3248a1231`
- [x] Build + lint green (scrub, drum, marquee, gesture nav verified)
- [x] Animation layer rebuilt for performance — see §6 before changing any motion code