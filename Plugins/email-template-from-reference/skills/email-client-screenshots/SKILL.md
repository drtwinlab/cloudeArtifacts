---
name: email-client-screenshots
description: "Render an HTML email across real email clients (Outlook, Gmail, Apple Mail, iOS, Android) via the Email on Acid API and show the actual client screenshots as images. Use when the user wants to see how a finished email looks in real inboxes, asks to 'test in Outlook/Gmail', 'run it through Email on Acid', 'show client previews', 'check how it renders across clients', or wants proof-of-rendering before sending. Drives a real browser (chrome-devtools) to call the API, which is the method that works inside Cowork where the code sandbox has no outbound internet. Asks the user for their Email on Acid API key and password (or reads them locally); nothing secret is stored in the repo. PAID API that consumes test credits, so run only when the user explicitly asks. Not for coding or QA-diffing; pair it with email-template-from-reference."
---

# Email Client Screenshots (Email on Acid)

Submit a finished HTML email to Email on Acid, wait for the real clients to render, and show the user the actual per-client screenshots **as images** (not links).

Two facts that shape how this works:

- **The Cowork code sandbox has no outbound internet** (npm, GitHub, Email on Acid are all blocked from `bash`/Node there). The bundled Node script `scripts/emailonacid_test.js` therefore only runs on the user's own machine/terminal.
- **A connected browser does have internet.** So inside Cowork, drive the browser (chrome-devtools) to call the API. That is the primary method (A) below.

This is a **paid** service that spends test credits, so **only run it when the user explicitly asks.** Never as an automatic build step.

## Credentials (resolve in this order; never commit or log them)

1. `scripts/credentials.json` next to the bundled script — shape `{ "api_key": "...", "api_password": "..." }` — gitignored, for a user who saved theirs locally.
2. Env vars `EMAILONACID_API_KEY` / `EMAILONACID_API_PASSWORD` (check with `printenv`).
3. Otherwise **ask the user** to paste their Email on Acid API key and password, and use them only for this run.

Never write pasted keys into a committed file and never echo them into logs. If the user pasted their key, remind them at the end that they can rotate it.

## Clients — use exactly these (do not invent others)

Default set, unless the user explicitly asks for a different one:

```
outlook19
outlook2021_win11_lm_dt
o365_w10_lm_dt
m365_w11_lm_dt
gmailcom-lm_chrcurrent_win10
android14_gmailapp_pixel8_lm
android12_outlookapp_pixel6_lm
iphone13ol_15
iphone15plus_17
```

## Method A — inside Cowork: drive the browser (primary)

Uses `chrome-devtools` tools (load if deferred: `list_pages`, `navigate_page`, `evaluate_script`, `take_screenshot`).

1. **Check a browser is connected** (`list_pages`). If none, ask the user to connect Chrome and stop.
2. **Get credentials** (order above). Build `const auth = 'Basic ' + btoa(key + ':' + pass)`.
3. **Land on the API origin** to avoid CORS and the native auth popup: navigate to `https://api.emailonacid.com/docs/latest/email-testing` (a public page on the same host). Do NOT navigate straight to a `/v5/...` endpoint — that triggers the browser's Basic-auth dialog. In `fetch`, always use the ABSOLUTE `https://api.emailonacid.com/v5/...` URL — relative URLs fail to parse in the evaluate context.
4. **Create the test.** Read the email HTML file, then `evaluate_script` a POST to `https://api.emailonacid.com/v5/email/tests` with headers `Content-Type: application/json` and `Authorization: auth`, and a JSON body: `subject`, `html` (the file's contents, JSON-encoded), `transfer_encoding: "8bit"`, `charset: "utf-8"`, `clients` (the 9 above), `image_blocking: false`. Read `id` from the `{ "id": "..." }` response.
5. **Poll results.** Every ~10s, `evaluate_script` a GET to `https://api.emailonacid.com/v5/email/tests/<id>/results` with the `Authorization` header. For each client key read `status` and `screenshots.default`. Stop when every client is `Complete` (case-insensitive) or after a ~5 min timeout (return partial).
6. **Show screenshots as images.** Navigate to `about:blank` (the docs page is a SPA and wipes injected DOM; about:blank does not). `evaluate_script` to set `document.body.innerHTML` to one labeled `<img src="<screenshots.default>">` per client and `await` every image's `onload`. Then `take_screenshot({ fullPage: true, filePath: "<uploads-folder>/eoa_clients.png" })` — the browser tool cannot write to the outputs/deliverables root, so save into the uploads folder, then `cp` it to the outputs folder via a shell command. `present_files` the copied PNG.
7. **Summarize.** How many clients Complete, and any that timed out or errored. Screenshot URLs stay valid ~90 days, so results can be re-fetched later.

## Method B — local terminal (alternative; has its own internet)

If the user would rather run it on their machine, use the bundled script:

```
node scripts/emailonacid_test.js <email.html> --download
```

It reads creds from `credentials.json`/env, submits the test, polls, and saves screenshots to `./eoa_results/`. Same default client set.

## Notes

- **Paid / credits** — on-request only.
- **Images, not links** — always show the rendered screenshots; fall back to URLs only if capture fails.
- **Rotate pasted keys** — if the user pasted a key into chat, remind them to rotate it afterward.
- **Not a coder/QA** — this only previews. Build with `email-template-from-reference`; pixel-diff against a reference with `email-reference-qa`.
