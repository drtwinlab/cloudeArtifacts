---
name: phase-1-art-direction
description: >
  PHASE 1 of the Contextual Design-to-Code Engine pipeline — art direction and
  concept alignment. Should be used when a new web UI / website / landing / interface
  design task begins and the direction must be defined and fixed into DESIGN_SPEC.md.
  Triggers: "new site", "interface design", "build a landing page", "start phase 1",
  "phase 1", "art direction", "design spec", "DESIGN_SPEC.md".
metadata:
  version: "0.1.0"
  phase: "1"
---

# PHASE 1: ALIGNMENT & ART DIRECTION

## GOAL:
Understand the project concept, run deep research through MCP, surface unique design techniques (anomalies), and lock them into a concise technical document. No boilerplate code at this stage.

---

## INTERACTION TACTICS (UX):

### 1. Natural dialogue (instead of questionnaires)
When the user writes what kind of site they want to build, don't hand them a list of multiple-choice questions. Talk to them architect to architect. Ask 2-3 deep questions that make them think about the product:
* What is the main feeling the interface should evoke (expensive minimalism, brutalist chaos, hard engineering structure)?
* Which overused AI patterns (like identical cards or purple glows) do we want to avoid in this project in order to stand out?

### 2. Presenting findings (instead of dry cards)

**You MUST call the `design-inspiration` MCP in this session. Never invent references from memory — take ONLY what the tool returned just now.** If the tool is unavailable, say so honestly and do not fabricate URLs.

The `design-inspiration` tools return deterministic curated lists: the same call = the same results. To make references differ from session to session, follow three rules:

**a) Parameters tuned to the vibe, not defaults.** Translate the feeling from step 1 into concrete call parameters:
* "expensive minimalism / luxury" → `browse_siteinspire(style="luxury")` or `style="editorial"`
* "brutalist chaos / experiment" → `browse_siteinspire(style="experimental")` + `browse_css_awards(style="experimental")`
* "hard engineering structure" → `browse_siteinspire(style="industrial")`
* "lots of motion / WebGL / scroll storytelling" → `browse_godly(motion_type=...)` with a fitting type (`webgl`, `scroll-storytelling`, `page-transition`, `micro-interaction`)
* "not sure what fits" → `search_inspiration(query="...")` with a short phrase assembled from the user's brief (e.g. `"dark editorial fintech"`).

**b) Pull a wide pool and pick randomly.** Call with `limit: 12` (not the default 5), then **randomly** pick 3 from the returned list — not the top 3. That is the source of variety on a deterministic API.

**c) Rotate sources.** Don't fixate on two tools. For motion projects — `browse_godly` + `browse_css_awards`; for editorial/content ones — `browse_siteinspire` + `browse_behance`; in ambiguous cases — `search_inspiration`. Each session the combination of sources should differ.

From the collected pool, pick 3 sites that not only fit the theme but also have interesting engineering or visual solutions.
Describe them in plain, professional language:
* **Project name** (real URL from MCP)
* **Engineering hack:** Which specific solution there deserves attention? (For example: *"They dropped classic scrolling in favor of horizontal section offset, while keeping native mobile responsiveness via CSS Snap"*).
* **Palette and type specifics:** Which contrasts and pairings create that feeling.
Ask the user which of these techniques we should expand into a full structure.

### 3. Locking it into DESIGN_SPEC.md
Once the user has settled on a direction, produce a concise `DESIGN_SPEC.md`. Use Claude's standard Artifacts tool.
The document must be as compact as possible (a coding cheat sheet):
* **Core Idea:** The essence and a link to the main reference.
* **Tailwind Configuration:** A clean JSON block for `tailwind.config.js` (only new custom colors and animation timings, without duplicating defaults).
* **Layout & Type Rules:** Concrete rules for fonts and spacing (`tracking-tight`, `leading-none`, `rounded-none`).
* **Micro-interactions:** A description of hover and transition logic.
When done, simply write: "The spec is locked into DESIGN_SPEC.md. When you're ready, say so and we'll move on to selecting graphics and icons for this config."
