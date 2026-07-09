---
name: email-template-from-reference
description: "Generate a coded, cross-client HTML email template from a visual reference — an uploaded image/screenshot of a design or a Figma link — then self-check it by rendering the result and comparing it back to the original reference. The email coding rules are built into this skill (master template, module library, dark-mode and accessibility rules), so it always outputs table-based, Outlook-safe HTML. Use whenever the user wants to turn a design mockup, screenshot, photo, or Figma frame into a working email (.html) template, recreate an email design as code, or says things like 'code this email from the design' or 'make an email from this Figma'. After generating, it verifies fidelity against the reference with the paired email-reference-qa parity loop (render, region-by-region diff, targeted fixes) until the build matches. Trigger even if HTML, screenshots, or comparison are not mentioned explicitly."
---

# Email Template From Reference

Turn a visual design reference into a working, coded HTML email — then prove it matches by rendering it and comparing the render back to the original. The value is the closed feedback loop: instead of generating HTML and hoping it looks right, you *see* your own output through a real browser and correct it against the source until it's close enough.

The email coding rules are **built in** (see `references/email_coding_guidelines.md`). You do not need the user to supply rules — every email follows that house standard.

## When to use this

Use this whenever someone hands you a design and wants it as an email template: an uploaded screenshot/photo of a mockup, a Figma frame or link, or "recreate this newsletter as HTML." The defining trait is a **visual target to match** and a deliverable that is an **email `.html` file**.

This is *not* for general web pages, PDFs, or editing an existing email's copy without a reference to match.

## Inputs

1. **A visual reference**, one of:
   - an **image** (uploaded screenshot/photo of the design), or
   - a **Figma URL** (`figma.com/design/...`, ideally pointing at a specific frame/node).
2. **The built-in coding rules** — `references/email_coding_guidelines.md`, bundled with this skill. **Read it in full before generating.** It defines the master template, the module library, the mandatory rules, dark-mode handling, and a preflight checklist. It is the single source of truth for *how* to code.

If the reference is missing, ask for it — don't invent a design you can't see. Any extra instructions the user gives in conversation (specific copy, colors, links) layer on top of the built-in rules.

## The loop at a glance

```
1. Gather inputs        → reference image/Figma + read built-in guidelines
2. Acquire reference    → a concrete reference IMAGE you can look at, saved to a file
3. Generate HTML        → follow email_coding_guidelines.md → save email_template_v1.html
4. Verify (QA loop)     → run the email-reference-qa parity loop: render, region-by-region diff vs the ORIGINAL reference, targeted fixes, repeat until the diff list is empty
5. Deliver              → final .html + its render + the QA diff report (empty)
```

Always compare against the **original** reference (the user's image or the Figma export), never against a previous render. The reference is ground truth for every iteration.

## Step 1 — Gather inputs

Determine whether the reference is an image or a Figma link. Then **read `references/email_coding_guidelines.md` completely** so the generation in Step 3 follows the master template, module structures, and mandatory rules exactly.

## Step 2 — Acquire the reference image

End this step with a concrete image you can visually inspect and re-inspect across iterations. Save it to the working folder (e.g. `reference.png`) so every comparison uses the identical source.

**If the reference is an uploaded image:** use it directly. Note its overall dimensions/orientation (tall newsletter vs. wide layout vs. mobile) — this drives the render width in Step 4.

**If the reference is a Figma link:** use the Figma MCP tools to pull both a picture and the exact design data — far more accurate than eyeballing.
- Parse the URL into `fileKey` and `nodeId`. In `figma.com/design/:fileKey/:name?node-id=:nodeId`, convert the node id's `-` to `:` (e.g. `123-456` becomes `123:456`).
- Call `get_screenshot` for the frame → this image is your **reference** for comparison. Save it.
- Call `get_design_context` and `get_variable_defs` to extract precise colors, font sizes/weights, spacing, and the actual text content. Feed these into generation so values are exact.
- `get_metadata` helps confirm section order/structure on complex frames.

If Figma access fails (no auth, bad node id), say so and ask the user to fix the link or paste a screenshot instead — don't try to fetch the URL another way.

**Note on imagery:** the built-in rules require image `src` to be `placehold.co` placeholders sized to the asset (not real photos), so do **not** embed real images from Figma. Use the reference only to size and place those placeholders correctly.

## Step 3 — Generate the email HTML

Build the email strictly per `references/email_coding_guidelines.md`:
- Start from the **master template**; replace the `#body#` placeholder with your modules.
- Assemble from the **module library** (full-width image, text, button, two-column, header/footer, bullet points, spacer), reproducing each module's mandatory structure and inline styles.
- Honor the global rules: tables only (no `div` for layout), hex colors with white `#fffffe` / black `#000001` (buttons excepted), inline styles for desktop with mobile overrides in the `@media (max-width:600px)` block, and `placehold.co` placeholders sized to each image.
- Use the reference (and Figma tokens) for layout, colors, type sizes, copy, and the number/order of modules.

Save as `email_template_v1.html` (increment per iteration: `_v2`, `_v3`). Make the first version a serious, complete attempt — real structure, colors, and copy — not a rough sketch. The loop corrects deviations; it isn't a substitute for a strong first pass.

## Step 4 — Verify with the QA parity loop

Hand the build off to the **email-reference-qa** skill (bundled in this plugin) together with the saved original reference. That skill owns verification: it renders the build full-page (via the html-to-screenshot skill), decomposes the reference into regions, diffs every region against the reference across a fixed design-axis checklist, applies *targeted* fixes, and repeats until the diff list is empty. Render every breakpoint that matters (at minimum desktop and mobile). Every fix must still obey `references/email_coding_guidelines.md`.

Run that loop to completion — the email is not done while any diff remains. Save each corrected version as the next `email_template_vN.html`.

## Step 5 — Preflight and deliver

With the QA diff list empty, run the email through the **preflight checklist** in `references/email_coding_guidelines.md` (`#body#` replaced; hex colors with the off-by-one white/black; no layout `div`s; images have `width`+`max-width` and no `height`; every `td` has explicit padding; mandatory text styles present; mobile classes in the media query; columns stack image → content → CTA; buttons carry `msoButtonFix`; straight quotes; total HTML under ~100 KB). Fix anything that fails — these protect Outlook/Gmail/dark-mode rendering.

Then hand back:
1. the final `email_template_vN.html`,
2. its render (desktop and mobile), and
3. the QA diff report (now empty), with a one-line note of the regions checked.

Present the HTML and render with `present_files`. Keep the written summary brief — the files speak for themselves.

**Optional — real-client preview.** If the user wants to see how the email renders in real inboxes (Outlook, Gmail, Apple Mail, iOS, Android), offer the `email-client-screenshots` skill (Email on Acid). It is a paid, on-request step — don't run it automatically.

## Notes and gotchas

- **Original reference is ground truth.** Anchor every QA pass to the same saved reference; never let the target drift to a previous render.
- **Don't read-and-describe instead of rendering.** The point is seeing real browser output — the QA loop always renders through html-to-screenshot.
- **Placeholders are intentional.** Images are `placehold.co` boxes by rule; judge their placement and size, not their pixels.
- **The rules are built in.** Don't ask the user for coding rules; follow the bundled guidelines. Do ask for the reference and any content specifics (copy, links, brand colors).
- **Parity, not "close enough."** Verification exits only when the QA diff list is empty — see the `email-reference-qa` skill.
