---
name: phase-2-resource-sync
description: >
  PHASE 2 of the Contextual Design-to-Code Engine pipeline — autonomous resource
  gathering: icons via iconify-mcp and openly-licensed photos via the openverse MCP
  for the approved DESIGN_SPEC.md. Should be used right after Phase 1 once the design spec is fixed.
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
3. Media synchronization (Openverse):
   - Search photos through the `openverse` MCP (`search_images`, or `search_images_for_essay` for content imagery) using keywords from the site concept.
   - Prefer permissive licenses (`cc0`, or `license_type: "commercial"`) and pick high-resolution, on-tone images that match the HEX palette from the spec.
   - Use only real URLs returned by the tool. Keep the attribution the tool returns (creator + license) so it can be credited in the footer when the license requires it. Note: Openverse serves photos, not video.
4. Output the result: Give the user a short, dry report that the resources are gathered, and automatically move on to Phase 3. Do not ask for approval.
