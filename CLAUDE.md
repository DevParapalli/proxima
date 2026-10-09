# Working in this repository

Instructions for anyone, person or agent, committing to Proxima. They apply to every branch.

## Commits

- Every commit MUST be authored and committed as `DevParapalli <hey@parapalli.dev>`. Set it locally before the first commit: `git config user.name DevParapalli && git config user.email hey@parapalli.dev`.
- Commit messages MUST NOT carry `Co-Authored-By`, `Claude-Session`, `Generated with` or any other AI attribution trailer or line, whatever the tooling suggests. No model name or identifier appears in a commit message, a pull request, a code comment or any file.
- Messages follow Conventional Commits: `feat(deck): …`, `fix: …`, `docs: …`, `chore: …`. The subject is one line in sentence case; the body, when there is one, says what changed and why in full sentences.
- Trunk is `master`. Work on branches named `feat/…` or `fix/…` and merge with a pull request.

## What is where

- `css/proxima.css`, `js/proxima.js`, `fonts/`: the design system. `tokens.toml` is the canonical copy of the tokens shared with Centauri; after editing it run `uv run scripts/tokens.py` (and `uv run deck/scripts/tokens.py`), never edit the generated blocks by hand.
- `deck/`: `slidev-theme-proxima`, Centauri's decks for the screen. Reference for every layout, component and script: `deck/docs/reference.md`. Usage and the importer for Centauri documents and PDFs: `deck/README.md`.
- `PROXIMA.md`, section 2, lists the rules that do not bend. Read it before writing CSS or a component.

## Checks before a commit

- Proxima: `uv run scripts/tokens.py --check && bash tests/tokens.sh`.
- Deck: `cd deck && pnpm install && bash tests/run.sh`. Needs pnpm, uv, poppler (`pdftotext`, `pdftocairo`, `pdfinfo`) and a Chromium that `playwright-chromium` can launch; set `SLIDEV_CHROME` to a browser executable when it cannot find its own.
- Tests ship with any behaviour change. `deck/docs/reference.md` MUST document every layout, component and script, and the suite checks that it does.

## Releases

Proxima and Centauri share major and minor versions; patch versions move independently. Proxima leads each minor: Centauri `X.Y.0` is released only after Proxima `vX.Y.0`. Only a major or minor release may change a token value in `tokens.toml`; a patch may fix its comments only. A Centauri `X.Y.*` release vendors `tokens.toml` from the latest Proxima `vX.Y.*` tag. `deck/package.json` carries Proxima's full version.
