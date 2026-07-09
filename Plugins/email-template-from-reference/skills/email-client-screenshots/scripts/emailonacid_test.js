#!/usr/bin/env node
"use strict";
/**
 * Email on Acid — cross-client render test.
 *
 * Submits an HTML email to Email on Acid, waits for the clients to render,
 * and returns screenshot URLs (optionally downloading them locally so they
 * can be shown as real images in the chat).
 *
 * Credentials (never hard-coded, never committed) are read in this order:
 *   1. Env vars  EMAILONACID_API_KEY / EMAILONACID_API_PASSWORD
 *   2. A JSON file: --creds <path>, or $EMAILONACID_CREDS, or ./credentials.json
 *      next to this script. Copy credentials.example.json -> credentials.json
 *      and fill it in once. (credentials.json is gitignored.)
 *
 * Usage:
 *   node emailonacid_test.js <email.html> \
 *     [--subject "Subject"] [--clients a,b,c] [--out ./eoa_results] \
 *     [--download] [--image-blocking] [--max-wait 300] [--interval 8] [--creds path]
 *
 * Output: prints ONE JSON line to stdout and writes <out>/results.json:
 *   { testId, complete, results:[{client,status,screenshotUrl,noImagesUrl,localPath?}], screenshots:[url,...] }
 * Progress goes to stderr, so stdout stays machine-parseable.
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://api.emailonacid.com/v5";

const DEFAULT_CLIENTS = [
  "outlook19",
  "outlook2021_win11_lm_dt",
  "o365_w10_lm_dt",
  "m365_w11_lm_dt",
  "gmailcom-lm_chrcurrent_win10",
  "android14_gmailapp_pixel8_lm",
  "android12_outlookapp_pixel6_lm",
  "iphone13ol_15",
  "iphone15plus_17"
];

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) args[key] = true;
      else { args[key] = next; i++; }
    } else {
      args._.push(a);
    }
  }
  return args;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function loadCreds(args) {
  let key = process.env.EMAILONACID_API_KEY;
  let pass = process.env.EMAILONACID_API_PASSWORD;

  if (!key || !pass) {
    const credPath = args.creds || process.env.EMAILONACID_CREDS || path.join(__dirname, "credentials.json");
    try {
      if (fs.existsSync(credPath)) {
        const c = JSON.parse(fs.readFileSync(credPath, "utf8"));
        key = key || c.api_key || c.EMAILONACID_API_KEY;
        pass = pass || c.api_password || c.EMAILONACID_API_PASSWORD;
      }
    } catch (e) {
      console.error(`Could not read credentials file (${credPath}): ${e.message}`);
    }
  }

  if (!key || !pass) {
    console.error(
      "No credentials found. Either set EMAILONACID_API_KEY and EMAILONACID_API_PASSWORD,\n" +
      "or copy credentials.example.json to credentials.json (next to this script) and fill it in."
    );
    process.exit(1);
  }
  return { key, pass };
}

async function api(method, url, headers, body) {
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) { /* non-JSON error body */ }
  if (!res.ok) {
    throw new Error(`${method} ${url} -> ${res.status} ${res.statusText}\n${text.slice(0, 500)}`);
  }
  return json;
}

async function main() {
  const args = parseArgs(process.argv);

  const htmlPath = args._[0];
  if (!htmlPath) {
    console.error("Usage: node emailonacid_test.js <email.html> [--subject ...] [--clients a,b] [--out dir] [--download] [--image-blocking] [--max-wait 300] [--interval 8] [--creds path]");
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  const subject = args.subject || `Render test — ${path.basename(htmlPath)}`;
  const clients = args.clients
    ? String(args.clients).split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_CLIENTS;
  const outDir = args.out || "./eoa_results";
  const download = Boolean(args.download);
  const imageBlocking = Boolean(args["image-blocking"]);
  const maxWait = Number(args["max-wait"] || 300) * 1000;
  const interval = Number(args.interval || 8) * 1000;

  const { key, pass } = loadCreds(args);
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + Buffer.from(`${key}:${pass}`).toString("base64")
  };

  fs.mkdirSync(outDir, { recursive: true });

  // 1) Create the test
  console.error("Creating Email on Acid test…");
  const created = await api("POST", `${BASE_URL}/email/tests`, headers, {
    subject,
    html,
    transfer_encoding: "8bit",
    charset: "utf-8",
    clients,
    image_blocking: imageBlocking
  });
  const testId = created && (created.id || created.test_id);
  if (!testId) throw new Error(`Could not read test id from create response: ${JSON.stringify(created)}`);
  console.error(`Test created: ${testId}`);

  // 2) Poll results until every client is Complete or we hit max-wait.
  //    Re-fetch each pass — EoA refreshes screenshot URLs on every call.
  const started = Date.now();
  let results = [];
  let complete = false;

  while (Date.now() - started < maxWait) {
    await delay(interval);

    let data;
    try {
      data = await api("GET", `${BASE_URL}/email/tests/${testId}/results`, headers);
    } catch (e) {
      console.error(`Results fetch failed, retrying: ${e.message}`);
      continue;
    }

    // Response can be a flat map of clients or wrapped in { results: {...} }.
    const clientsObj = data && data.results ? data.results : data;
    const keys = Object.keys(clientsObj || {});

    results = [];
    let done = 0;
    for (const clientKey of keys) {
      const c = clientsObj[clientKey] || {};
      const status = c.status || c.Status || "Unknown";
      const shots = c.screenshots || {};
      const screenshotUrl = shots.default || shots.Default || null;
      const noImagesUrl = shots.no_images || null;
      if (String(status).toLowerCase() === "complete") done++;
      results.push({ client: clientKey, status, screenshotUrl, noImagesUrl });
    }

    console.error(`Rendered ${done}/${keys.length} clients…`);
    if (keys.length > 0 && done === keys.length) { complete = true; break; }
  }

  if (!complete) console.error("Timed out before all clients finished — returning partial results.");

  // 3) Optionally download the default screenshots so they can be displayed.
  if (download) {
    for (const r of results) {
      if (!r.screenshotUrl) continue;
      try {
        const resp = await fetch(r.screenshotUrl);
        if (!resp.ok) { console.error(`Download failed ${r.client}: ${resp.status}`); continue; }
        const buf = Buffer.from(await resp.arrayBuffer());
        const safe = r.client.replace(/[^a-z0-9_-]/gi, "_");
        const file = path.join(outDir, `${safe}.png`);
        fs.writeFileSync(file, buf);
        r.localPath = file;
      } catch (e) {
        console.error(`Download error ${r.client}: ${e.message}`);
      }
    }
  }

  const screenshots = results.map((r) => r.screenshotUrl).filter(Boolean);
  const out = { testId, complete, results, screenshots };
  fs.writeFileSync(path.join(outDir, "results.json"), JSON.stringify(out, null, 2));

  // Machine-readable result for the caller (Claude) — the ONLY thing on stdout.
  process.stdout.write(JSON.stringify(out) + "\n");
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
