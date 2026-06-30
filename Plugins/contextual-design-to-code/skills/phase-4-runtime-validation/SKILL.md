---
name: phase-4-runtime-validation
description: >
  PHASE 4 of the Contextual Design-to-Code Engine pipeline — autonomous runtime
  validation of the generated code via chrome-devtools: a console and visual audit at
  Desktop 1440px and Mobile 375px resolutions. Should be used after Phase 3 code is generated.
  Triggers: "check the rendering", "test the layout", "phase 4",
  "runtime validation", "devtools audit", "check rendering".
metadata:
  version: "0.1.0"
  phase: "4"
---

# SUB-SKILL: PHASE 4 — CHROME DEVTOOLS VALIDATION

## GOAL:
Fully autonomously test the generated code in a real browser and eliminate rendering and console errors before the final handoff to the user.

## ACTION ALGORITHM:
1. Session initialization: Use `chrome-devtools` to open the local dev server or the HTML file with the generated code.
2. Console audit (Runtime Check):
   - Check the Chrome console logs for React warnings (for example, invalid props, `key` issues in lists) or JS syntax errors.
   - On finding errors — instantly rewrite the problematic code section. The user must not see logs with errors.
3. Visual audit (Layout & Responsiveness):
   - Take a screenshot of the page through DevTools at Desktop (1440px) and Mobile (375px) resolutions.
   - Analyze the resulting images yourself: is text overlapping, do the paddings work correctly, does the mobile menu collapse.
   - Verify that the real grid matches the rules locked in `DESIGN_SPEC.md`.
4. Closing the session: Once the layout and console are perfectly clean, close the browser session and deliver the final verdict.
