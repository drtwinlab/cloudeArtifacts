---
name: email-reference-qa
description: >-
  Verify a coded email against its visual reference and loop until they match
  1:1. Use after building or editing an email/newsletter from any visual
  reference (screenshot, mockup, Figma frame, PDF) to QA fidelity before
  shipping. Renders the build, decomposes it into regions, compares each region
  against the reference across a fixed design-axis checklist, writes a
  discrepancy list, and iterates until the list is empty. Trigger on phrases like
  "check it against the reference", "does it match the design", "QA this email",
  "compare to the mockup", "final review before sending", or any time a
  reference exists and parity matters. Scope: verification and diff-driven
  correction — not initial coding rules.
---
# Email Reference QA — Parity Loop
Confirm that a coded email reproduces its visual reference **exactly**, then correct and re-check until nothing differs. This skill is about *seeing* your own output through a real render and measuring it against ground truth — not trusting that it "should" look right.
It is reference-agnostic (any brand, any layout, any client) and makes no assumptions about the specific design. Everything below is a principle or a repeatable procedure; there are no per-email special cases.
## Prime directive: the reference is ground truth
Where the reference answers a question — a colour, an alignment, a gap, a size, a wording, how things are distributed — **copy it exactly**. You have no design opinion in those places. Deviating from a visible reference is a *defect*, not a style choice. Do not "improve", "simplify", "clean up", or "normalise to typical". If the reference shows it, it is a requirement.
## The root failure mode this skill exists to kill: **defaulting**
Almost every fidelity bug comes from one habit: when a detail wasn't decided by you but *was* decided by the reference, filling it with a convention/assumption instead of reading the reference. Defaulting shows up as a small family of recurring mistakes — check yourself against each every pass:
- **Assumed-uniform fill** — treating backgrounds as all-the-same when adjacent bands differ; or getting the figure/ground of separators backwards (line colour vs. background colour inverted). *Read each band's fill and each rule's colour off the reference.*
- **Assumed-default alignment** — centering (or left-aligning) a block because that's "normal", when the reference aligns it otherwise. Utility lines, nav, headings, prices, CTAs each have their own alignment.
- **Assumed-clustered vs. distributed** — bunching repeated elements (icons, nav items, columns) in the centre when the reference spreads them across the full width (or vice-versa).
- **Collapsed segmentation** — merging text that the reference breaks into separate lines/paragraphs into one run, or vice-versa; changing wording, punctuation, numerals, footnote markers, or special characters.
- **Normalised sizing** — snapping element sizes to "typical" values instead of the reference's actual relative scale (e.g. text-vs-icon, heading-vs-body, image aspect).
- **Guessed colour** — eyeballing a hex from a thumbnail instead of sampling.
- **Unverified render** — declaring done from a screenshot you didn't actually inspect, or from the wrong environment (e.g. a stale viewport silently showing the mobile layout).
- **Premature exit** — stopping with known differences still on the list.
If you catch yourself about to *decide* something the reference already shows — stop and read the reference instead.
## Inputs
1. The **reference**, as a concrete image you can inspect and re-inspect (save it; for a Figma source, export the frame to an image and also pull exact tokens). If the reference is a tall/long design, treat it explicitly as multi-region.
2. The **build** to verify (the HTML/rendered email).
If the reference is missing, stop and ask for it — never QA against an imagined design.
## The parity loop (run every time; exit only when the diff list is empty)
1. **Acquire & anchor** the reference image. Always compare against this original — never against a previous render of your own.
2. **Decompose** the reference into an explicit region inventory (see below). Long references *will* have regions you'll otherwise skim past.
3. **Render** the current build full-page. **First verify the environment**: confirm the viewport width is the one you intend (query it — don't trust the tool's reported resize), because a stale/duplicate view can pin you at a narrow width and show the mobile layout while you think you're on desktop. Render **every breakpoint that matters** (at minimum desktop and mobile), each once, at a fixed width so passes stay comparable.
4. **Compare region-by-region.** For each region, walk the full **design-axis checklist** (below) and write a concrete, itemised diff: name the element, its current value, and the reference value.
5. **Decide.** Empty diff list → pass. Otherwise apply *targeted* fixes for the listed diffs (don't rebuild what already matches) and return to step 3.
6. Never exit on an unexamined screenshot, and never exit with known diffs remaining.
## Region inventory (decompose before comparing)
Split the email into its stacked regions and check each as its own unit. A generic email tends to include, top to bottom: preheader / utility line, header & logo, navigation, promo/announcement bar, hero, body copy blocks, primary CTA, section headings, each content/product row (check rows individually), feature/benefit lists (check each item), legal/fine-print, social row, app/store badges, newsletter/unsubscribe, and legal footer/imprint. Use this only as a prompt — **add every region actually present** and drop those that aren't. The point is to force per-region attention instead of a single gestalt glance.
## Design-axis checklist — verify these for EVERY region, EVERY loop
This is the core. For each region, compare across all axes; a "looks about right" glance is not a pass.
1. **Presence, order & count** — is the region there, in the right sequence, with the right number of items (columns, rows, icons, links)?
2. **Structure** — columns vs. stacked; grouping and nesting; what sits beside vs. below what.
3. **Background / fill** — the region's background colour or image; gradients; and for any separator, the relationship between line colour and background (which is lighter/darker — do not assume).
4. **Alignment** — horizontal (left / centre / right) and vertical of the block, and of each element within it. Verify per element, not per section.
5. **Spacing & indentation** — outer padding of the region, gaps between elements, and indents; and whether sibling sections share consistent side margins / a common grid.
6. **Distribution** — how repeated elements occupy the available width: evenly spread / edge-to-edge vs. centred cluster vs. left-packed.
7. **Typography** — family feel, size, weight, case (is it uppercase?), letter-spacing, line-height, and colour; plus the *relative* hierarchy between heading, body, and captions.
8. **Non-text sizing** — image/icon dimensions and aspect ratios, and their scale *relative to* nearby text and to each other.
9. **Colour precision** — exact values for text, backgrounds, buttons, borders, and accents (sample the reference; don't guess).
10. **Content fidelity** — exact wording, line breaks / paragraph segmentation, punctuation, numerals, dates, footnote markers, and special characters.
11. **Separators, borders & rules** — presence, thickness, colour, full-bleed vs. inset, and *where* they occur (e.g. under a heading, between rows).
12. **Interactive affordances** — buttons and links: fill, border, radius, underline, and label.
### Cross-cutting checks (whole email, once per pass)
- Overall content width and centering/containment.
- Shared side margins across sections — do blocks align to one grid, or drift?
- Vertical rhythm — consistent spacing between sections vs. the reference's cadence.
- Every breakpoint independently (a fix on desktop can break mobile and vice-versa).
## Reporting each pass
Emit a per-region diff table with columns: Region | Axis | Current | Reference | Fix. Keep entries specific and actionable ("element X value A → should be B"), never vague ("colours a bit off"). The diff list is the worklist for the next iteration; when it's empty, and only then, the email passes.
## Notes & discipline
- **Placeholders are expected.** If images are stand-ins, judge their size, aspect, and placement — not their pixel content.
- **Anchor to the original** every pass; don't let the target drift to a prior render.
- **Verify before you trust.** Inspect the actual rendered pixels and confirm the environment (viewport/breakpoint) before recording any result.
- This skill verifies fidelity; it does not define how to code the email. Pair it with your email-coding rules for the build itself.
