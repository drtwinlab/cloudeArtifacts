# Contextual Design-to-Code Engine

A Claude Code / Cowork plugin that turns Claude into an **autonomous UI/UX architect and Senior Frontend Engineer**. It runs a strict **4-phase design-to-code pipeline** for premium **React + Tailwind CSS** interfaces, driven by an always-on system prompt, web search for references, and two lightweight MCP servers (icons + a browser for validation).

The whole point: instead of one-shot "generate me a landing page" prompts that produce generic, average AI output, this plugin forces a disciplined flow — research and lock the art direction first, gather icons second, write code that strictly inherits from the spec third, and validate the result in a real browser fourth.

---

## What makes it different (key advantages)

- **Anti-template by design.** Phase 1 uses **web search** to pull real, current references from Awwwards / SiteInspire / Godly / CSS Design Awards and deliberately avoids the overused AI look (identical cards, purple glows). It opens the results to verify they're real — never invents URLs.
- **A single source of truth.** Everything downstream inherits from `DESIGN_SPEC.md`. No inline hardcoded colors, no `bg-red-500` that isn't in the spec — only custom Tailwind tokens defined up front.
- **Real assets, never hallucinated.** Icons come from a single Iconify pack via `iconify-mcp` (no hand-written SVG paths). No stock-photo dependency — the output leans on icons, CSS, and the design's own visual system, so there are no broken image links.
- **Built-in runtime validation.** Phase 4 opens the result in a real browser through `chrome-devtools`, clears React/JS console warnings, and audits the layout at Desktop (1440px) and Mobile (375px) before handing off.
- **Autonomous where it should be.** Only Phase 1 is interactive. Once the spec is approved, Phases 2–4 run end-to-end without pestering the user for approvals.
- **Always-on, but scoped.** The orchestrator is injected at the start of every session, yet it only activates for web UI / site / landing / dashboard tasks and stays out of the way otherwise.

---

## How it works

The **orchestrator is a system prompt** (`context/system-prompt.md`) that is injected at the start of **every** session through the `SessionStart` hook (`hooks/hooks.json` runs `cat context/system-prompt.md`). It carries the "Karpathy Hacks 2026" rules and the strict phase protocol. The pipeline activates only when the user describes a site / UI / landing page; for anything else Claude works normally.

**Each phase is a separate skill,** loaded in turn by the orchestrator:

| Phase | Skill | Mode | Output |
| ----- | ----- | ---- | ------ |
| 1. Art direction | `phase-1-art-direction` | Interactive | `DESIGN_SPEC.md` |
| 2. Icon sync | `phase-2-resource-sync` | Autonomous | Icon pack |
| 3. Code production | `phase-3-code-production` | Autonomous | React + Tailwind |
| 4. Runtime validation | `phase-4-runtime-validation` | Autonomous | Clean console + layout |

---

## Components

- **Hook (`SessionStart`)** — injects the orchestrator system prompt.
- **4 skills** — one per pipeline phase.
- **Web search** (built-in) — finds real design references in Phase 1; no connector to set up.
- **2 MCP servers** (`.mcp.json`), both keyless and run via `npx`:
  - `iconify-mcp` — the SVG icon registry.
  - `chrome-devtools` — browser control and rendering audits.

---

## The orchestrator system prompt (step 1 → step 4)

This is the exact prompt injected at session start. It is what walks the agent from Phase 1 through Phase 4:

```markdown
# GLOBAL SYSTEM PROMPT: CONTEXTUAL DESIGN-TO-CODE ENGINE

> This document is injected automatically at the start of every session (the `SessionStart` hook).
> ACTIVATE the pipeline WHEN the user describes a web interface, website, landing page,
> dashboard, or UI component. For tasks unrelated to frontend design, ignore this
> protocol and work in normal mode.

You are an autonomous lead UI/UX architect and Senior Frontend Engineer. Your goal is to
build premium, one-of-a-kind web interfaces in React + Tailwind CSS, using the connected
tools strictly phase by phase.

## TOOLS:
- web search — find REAL, current design references in Phase 1 (never invent URLs from memory).
- `iconify-mcp` — the official SVG icon registry.
- `chrome-devtools` — browser control, console reading, and rendering audits.

## CONTEXT-MANAGEMENT RULES (KARPATHY HACKS 2026):
1. Anti-Template: Avoid generic, average AI designs. Hunt for visual anomalies.
2. Principle of Conciseness: Don't write 1000 lines of code where 100 are enough.
   No inline hardcoding.
3. Autonomy in routine: Phase 1 requires a dialogue with the user. Phases 2, 3, and 4
   run FULLY AUTONOMOUSLY. Do not ask unnecessary questions once the spec is approved.

## STRICT PHASE PROTOCOL:
You must follow the pipeline strictly. You advance to the next phase only after the
previous one is complete. At each phase, load and run the corresponding skill:

- [PHASE 1: ALIGNMENT & ART DIRECTION]  → skill `phase-1-art-direction`     → Produce DESIGN_SPEC.md (Interactive, references via web search).
- [PHASE 2: AUTONOMOUS ICON SYNC]       → skill `phase-2-resource-sync`     → Find the icon pack via iconify-mcp (Autonomous).
- [PHASE 3: PRODUCTION & CODING]        → skill `phase-3-code-production`   → Generate pixel-perfect code (Autonomous).
- [PHASE 4: RUNTIME VALIDATION & DEBUG] → skill `phase-4-runtime-validation`→ Verify rendering via Chrome DevTools (Autonomous).

Start the process from Phase 1 as soon as the user describes the task.
```

### What each step does

1. **Phase 1 — Alignment & Art Direction (interactive).** Talks to the user architect-to-architect, asks 2–3 deep questions about the desired feeling, uses **web search** to find and verify real references, and locks the direction into a concise `DESIGN_SPEC.md` (core idea, Tailwind config tokens, layout/type rules, micro-interactions).
2. **Phase 2 — Icon Sync (autonomous).** Reads `DESIGN_SPEC.md`, picks one Iconify pack matching the style, and fetches the exact SVG icons via `iconify-mcp`.
3. **Phase 3 — Code Production (autonomous).** Generates clean, responsive React + Tailwind that strictly inherits from the spec and wires in the real icons. No external stock photos — imagery comes from icons, CSS, and the design system.
4. **Phase 4 — Runtime Validation (autonomous).** Opens the result via `chrome-devtools`, clears console/React warnings, screenshots Desktop 1440px and Mobile 375px, checks the layout against the spec, then delivers the final verdict.

---

## Setup

**No configuration, no API keys.** Both MCP servers (`iconify-mcp`, `chrome-devtools`) run via `npx` and start automatically. Design references in Phase 1 use the assistant's built-in web search — nothing to set up. Just install the plugin and go (the first launch of each `npx` server is a little slower while npm fetches it).

---

## Usage

Just describe what you want to build:

> "Build a landing page for a fintech startup — the feel of expensive engineering minimalism."

Claude automatically starts **Phase 1** (dialogue + web-search references + `DESIGN_SPEC.md`), and after your approval runs **Phases 2–4** autonomously.

You can also trigger a single phase directly: "start phase 2", "check the rendering", and so on.

---

## Folder structure

```
contextual-design-to-code/
├── .claude-plugin/
│   └── plugin.json                 # Plugin manifest
├── .mcp.json                       # 2 MCP servers (iconify + chrome-devtools, keyless via npx)
├── hooks/
│   └── hooks.json                  # SessionStart → injects the system prompt
├── context/
│   └── system-prompt.md            # The orchestrator (step 1 → step 4)
├── skills/
│   ├── phase-1-art-direction/      # Interactive — produces DESIGN_SPEC.md (web-search refs)
│   ├── phase-2-resource-sync/      # Autonomous — icons via iconify-mcp
│   ├── phase-3-code-production/    # Autonomous — React + Tailwind
│   └── phase-4-runtime-validation/ # Autonomous — Chrome DevTools audit
└── README.md
```
