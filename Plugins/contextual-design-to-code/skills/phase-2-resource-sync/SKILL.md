---
name: phase-2-resource-sync
description: >
  PHASE 2 of the Contextual Design-to-Code Engine pipeline — autonomous resource
  gathering: icons via iconify-mcp and photos/videos via pixabay-mcp for the approved
  DESIGN_SPEC.md. Should be used right after Phase 1 once the design spec is fixed.
  Triggers: "gather resources", "pick icons and media", "phase 2", "resource sync",
  "gather assets", "icons and media".
metadata:
  version: "0.1.0"
  phase: "2"
---

# SUB-SKILL: PHASE 2 — RESOURCE SYNCHRONIZATION

## GOAL:
Fully autonomously, with no questions to the user, gather the icon pack and media assets for the created `DESIGN_SPEC.md`.

## ACTION ALGORITHM:
1. Read the context: Read `DESIGN_SPEC.md`. Determine the chosen visual style and the locked HEX palette codes.
2. Icon synchronization (Anti-Slop):
   - Based on the style, choose ONE specific pack in `iconify-mcp` (for example, `lucide` for minimalism, `carbon` for techno, `ph` for soft design). Mixing packs is forbidden.
   - Call `iconify-mcp` and find the exact SVG icons for all interface elements (navigation, buttons, carts, arrows).
   - Inventing or generating the SVG `path` yourself is forbidden. Use only the official clean strings from the tool.
3. Media synchronization (Pixabay):
   - Run a search query through `pixabay-mcp` using keywords from the site concept.
   - If the style calls for premium interactivity, look first for short looping VIDEOS (`type: "video"`) for Hero-section backgrounds.
   - Select only real, working high-resolution URLs that match the tone of the HEX palette from the spec.
4. Output the result: Give the user a short, dry report that the resources are gathered, and automatically move on to Phase 3. Do not ask for approval.
