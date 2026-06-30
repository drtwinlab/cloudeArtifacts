---
name: phase-3-code-production
description: >
  PHASE 3 of the Contextual Design-to-Code Engine pipeline — production generation of
  React + Tailwind code based on DESIGN_SPEC.md and the resources gathered in Phase 2.
  Should be used after assets are gathered, to produce the actual components.
  Triggers: "generate the code", "assemble the components", "phase 3",
  "code production", "build components", "generate code".
metadata:
  version: "0.1.0"
  phase: "3"
---

# SUB-SKILL: PHASE 3 — PRODUCTION & CODE GENERATION

## GOAL:
Assemble production-ready frontend code based on the gathered artifacts.

## ACTION ALGORITHM:
1. Architectural control (Karpathy's protection against Orthogonal Damage):
   - The code must inherit strictly from `DESIGN_SPEC.md`.
   - Using inline colors (for example, `bg-red-500`) that are not in the spec is forbidden. Use the custom tokens (for example, `bg-brand-bg`) that you defined for the Tailwind configuration.
2. Component assembly:
   - Generate clean, responsive, modular code (React + Tailwind CSS).
   - Integrate the exact SVG strings obtained from Iconify in Phase 2.
   - Replace all placeholders with the real image URLs obtained from Openverse in Phase 2. No broken link or placeholder image should remain in the code.
3. Animation control: Implement micro-interactions (hovers, focuses, transitions) strictly with the timings and physics described in the spec.
4. Delivery: Output the finished code. When done, write a concise: "Components assembled based on the spec and the media library. Pipeline completed successfully."
