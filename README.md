# Kartik — Personal Profile

Personal portfolio website for **Kartik** — AI Automation & Full-Stack Developer (FTB Hustle, Zidio Development, Christ University).

- **Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · lucide-react
- **Design:** Premium creative-studio vibe ("Viktor Oddy" inspired), white/`#051A24` palette, PP Neue Montreal + PP Mondwest fonts, scroll-triggered animations.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server -> http://localhost:5173
npm run build    # typecheck + production build
npm run lint     # oxlint
npm run preview  # preview production build
```

## Structure

```
src/
  components/    # Button, Hero, Marquee, QuoteSection, ServicesSection,
                 # TestimonialCarousel, ProjectsSection, PartnerSection,
                 # Footer, BottomNav
  hooks/         # useInViewAnimation (IntersectionObserver)
  index.css      # Tailwind theme tokens, fonts, keyframes
AI_CONTEXT.md    # single source of truth for AI agents working here
```

## Notes

- Add `PPMondwest-Regular.woff2` to `public/` to enable the serif display font (falls back to Playfair Display/Georgia meanwhile).
- Real profile links: [GitHub](https://github.com/kartik691004) · [LinkedIn](https://linkedin.com/in/kartik-kartik-3248a1231)