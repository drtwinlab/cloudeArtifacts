# Email Template From Reference

A Cowork plugin that turns a design reference into a working, cross-client HTML email — and rigorously checks it against the design before you ship.

## What's in the plugin (three skills)

- **email-template-from-reference** — the builder. Generates a table-based, Outlook-safe HTML email from a reference (uploaded image or Figma link), following built-in coding rules.
- **email-reference-qa** — the QA parity loop. Renders a built email, decomposes the reference into regions, diffs every region against the reference across a fixed design-axis checklist, and drives targeted fixes until nothing differs. Reference-agnostic — usable on its own to QA any email against any mockup.
- **email-client-screenshots** — real-client preview. Submits the finished HTML to the Email on Acid API and shows the actual screenshots from Outlook, Gmail, Apple Mail, iOS, Android as images. Inside Cowork it drives a connected browser to call the API (the code sandbox has no outbound internet); it asks you for your Email on Acid key/password, or reads them locally. Paid API, run on request.

The builder runs the QA loop automatically before delivering; you can invoke the QA skill on its own for an email someone else built, and run the client-screenshots skill when you want a real-inbox preview.

## What it does (end to end)

1. Reads the built-in email coding rules (master template, module library, dark-mode and accessibility rules — bundled, nothing to attach per project).
2. Generates the HTML email from your reference.
3. Renders it in a real browser (desktop and mobile) and inspects the actual pixels.
4. Compares region-by-region against the original reference and lists every discrepancy (element, current value, reference value, fix).
5. Applies targeted fixes and re-checks, looping until the discrepancy list is empty — then runs a preflight checklist and delivers.

## How to use it

Describe the task and provide the reference, e.g.:

- "Code this email from the attached mockup." (attach the image)
- "Make an email template from this Figma: `https://figma.com/design/...`"
- "QA this email against the reference." / "Does it match the design?"

Content specifics (copy, links, brand colors) are applied on top of the built-in rules.

## Requirements

- **html-to-screenshot skill** — renders the HTML and captures screenshots (included with Cowork's standard skills).
- **Figma connector** — only when the reference is a Figma link (for image + design tokens). Not needed if you upload an image.
- **Email on Acid account + a connected browser** — only for the `email-client-screenshots` skill. The skill asks for your API key/password at run time. To avoid re-entering them, save them locally: copy `skills/email-client-screenshots/scripts/credentials.example.json` to `credentials.json` (gitignored, never committed) or set env vars `EMAILONACID_API_KEY` / `EMAILONACID_API_PASSWORD`. Inside Cowork the skill reaches the API through a connected Chrome browser.

## What's inside

- `skills/email-template-from-reference/` — the builder (`SKILL.md` + `references/email_coding_guidelines.md`, the built-in coding standard).
- `skills/email-reference-qa/` — the QA parity loop (`SKILL.md`).
- `skills/email-client-screenshots/` — real-client preview via Email on Acid (`SKILL.md` + `scripts/emailonacid_test.js` + `scripts/credentials.example.json`).

## Customizing the rules

The coding standard is the bundled `email_coding_guidelines.md`. Edit it to change house rules (colors, modules, fonts, checklist) for everyone who uses the plugin.
