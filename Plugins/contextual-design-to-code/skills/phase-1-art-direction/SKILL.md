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
Understand the project concept, research real references via web search, surface unique design techniques (anomalies), and lock them into a concise technical document. No boilerplate code at this stage.

---

## INTERACTION TACTICS (UX):

### 1. Natural dialogue (instead of questionnaires)
When the user writes what kind of site they want to build, don't hand them a list of multiple-choice questions. Talk to them architect to architect. Ask 2-3 deep questions that make them think about the product:
* What is the main feeling the interface should evoke (expensive minimalism, brutalist chaos, hard engineering structure)?
* Which overused AI patterns (like identical cards or purple glows) do we want to avoid in this project in order to stand out?

### 2. Presenting findings (via web search)

**Use your web search to find REAL, CURRENT references — never invent URLs or projects from memory.** Translate the feeling from step 1 into concrete searches across design galleries, then open the most promising results to confirm they exist and read the details.

* "expensive minimalism / luxury" → search SiteInspire / Awwwards for `luxury` or `editorial` sites
* "brutalist chaos / experiment" → search Awwwards / CSS Design Awards for `experimental` / `brutalist`
* "hard engineering structure" → search SiteInspire for `industrial` / `technical`
* "lots of motion / WebGL / scroll storytelling" → search Godly / Awwwards for motion / WebGL sites
* "not sure what fits" → a direct query assembled from the brief (e.g. `dark editorial fintech landing site`)

Run a couple of different queries and **pick 3 sites that genuinely fit and have interesting engineering or visual solutions** — not just the first hits. Open them with web fetch to verify they're real and to read specifics. Describe each in plain, professional language:
* **Project name** (real, working URL from the search)
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
When done, simply write: "The spec is locked into DESIGN_SPEC.md. When you're ready, say so and we'll move on to selecting icons for this config."
