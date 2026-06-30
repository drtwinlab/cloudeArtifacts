---
name: phase-2-resource-sync
description: >
  PHASE 2 of the Contextual Design-to-Code Engine pipeline — autonomous icon
  gathering via iconify-mcp for the approved DESIGN_SPEC.md. Should be used right
  after Phase 1 once the design spec is fixed.
  Triggers: "gather resources", "pick icons", "phase 2", "resource sync",
  "gather assets", "icons".
metadata:
  version: "0.1.0"
  phase: "2"
---

# SUB-SKILL: PHASE 2 — ICON SYNCHRONIZATION

## GOAL:
Fully autonomously, with no questions to the user, gather the icon pack for the created `DESIGN_SPEC.md`.

## ACTION ALGORITHM:
1. Read the context: Read `DESIGN_SPEC.md`. Determine the chosen visual style.
2. Icon synchronization (Anti-Slop):
   - Based on the style, choose ONE specific pack in `iconify-mcp` (for example, `lucide` for minimalism, `carbon` for techno, `ph` for soft design). Mixing packs is forbidden.
   - Call `iconify-mcp` and find the exact SVG icons for all interface elements (navigation, buttons, carts, arrows).
   - Inventing or generating the SVG `path` yourself is forbidden. Use only the official clean strings from the tool.
3. Output the result: Give the user a short, dry report that the icons are gathered, and automatically move on to Phase 3. Do not ask for approval.
