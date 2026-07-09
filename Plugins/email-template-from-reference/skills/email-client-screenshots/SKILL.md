---
name: email-client-screenshots
description: "Render an HTML email across real email clients (Outlook, Gmail, Apple Mail, iOS, Android, etc.) via the Email on Acid API and return the actual client screenshots as images. Use when the user wants to see how a finished email looks in real inboxes, asks to 'test in Outlook/Gmail', 'run it through Email on Acid', 'show client previews', 'check how it renders across clients', or wants proof-of-rendering before sending. Runs the bundled Node script, downloads each client's screenshot, and shows them as real images labeled by client. This is a PAID API that consumes test credits, so run it only when the user explicitly asks. Not for coding or QA-diffing the email — pair it with the email-template-from-reference builder."
---

# Email Client Screenshots (Email on Acid)

Take a finished HTML email and see how it *actually* renders in real clients — Outlook (Word engine), Gmail, Apple Mail, iOS, Android — by submitting it to Email on Acid and pulling back per-client screenshots. Show those screenshots to the user as real images, not links.

This is a **paid** service that spends test credits. **Only run it when the user explicitly asks** for a client preview / real-inbox test. Don't run it automatically as part of a build.

## Prerequisites

- **Node.js** and network access to `api.emailonacid.com`. If the sandbox can't reach it, tell the user to run the script locally in their terminal.
- **Credentials.** The script (`scripts/emailonacid_test.js`) reads them from, in order:
  1. env vars `EMAILONACID_API_KEY` / `EMAILONACID_API_PASSWORD`, or
  2. `scripts/credentials.json` next to the script.

  If neither is present, tell the user: copy `scripts/credentials.example.json` to `scripts/credentials.json` and fill in `api_key` / `api_password` (one time — `credentials.json` is gitignored and never committed). Then stop and wait; don't ask them to paste the key into chat.

## Inputs

- The **HTML email file** to test (e.g. the `email_template_vN.html` from the builder, or any `.html` the user points at).

## Steps

1. **Locate the script** at `scripts/emailonacid_test.js` inside this skill; resolve its absolute path in the installed plugin.
2. **Confirm credentials** exist (env or `scripts/credentials.json`). If not, guide the user through the one-time `credentials.json` setup above and stop.
3. **Run it** on the email, with `--download` so screenshots are saved locally:

   ```
   node <abs>/scripts/emailonacid_test.js <abs>/email_template_vN.html --download --out <abs>/eoa_results
   ```

   Optional flags: `--image-blocking` (see how clients that block images render it), `--clients a,b,c` (override the default client set), `--subject "…"`, `--max-wait 300`, `--interval 8`.
4. **Parse the result.** The script prints ONE JSON line to stdout:
   `{ testId, complete, results:[{client,status,screenshotUrl,noImagesUrl,localPath}], screenshots:[...] }`. Everything else (progress) is on stderr.
5. **Show the screenshots as images.** For each result with a `localPath`, present the PNG with `present_files` so the user sees the actual render, labeled by `client` (and note its `status`). If a client has no `localPath` (download failed or no network to the CDN), fall back to giving its `screenshotUrl` link.
6. **Summarize briefly**: how many clients completed, and call out any that timed out or errored. If `complete` is false, say the test timed out and offer to re-poll (screenshot URLs stay valid ~90 days, so results can be fetched again later).

## Notes

- **Paid / credits.** Every run consumes Email on Acid test credits — that's why this is on-request only.
- **Images, not links.** The goal is to hand the user real screenshots; always prefer downloaded `localPath` images over URLs.
- **This skill does not code or fix the email.** It only previews it in real clients. For building and for pixel-parity QA against a reference, use the `email-template-from-reference` and `email-reference-qa` skills.
