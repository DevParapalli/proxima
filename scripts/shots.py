#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["playwright==1.63.0"]
# ///
"""Check the stacked bar demo in docs.html across themes, accents and widths, and screenshot it.

Fails if a part above zero is narrower than 3px, a part at zero takes space, the parts and gaps
overflow the track, or the page scrolls sideways.

Usage:
    uv run scripts/shots.py                 # check only
    uv run scripts/shots.py --out DIR       # check and save one PNG per case into DIR
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

DOCS = (Path(__file__).resolve().parent.parent / "docs.html").as_uri()

MEASURE = """() => {
  const bar = document.querySelector('.stackbar');
  bar.closest('.card').scrollIntoView({block: 'center'});
  const parts = [...bar.children].map(i => ({w: parseFloat(i.style.getPropertyValue('--w')), px: i.getBoundingClientRect().width, gap: parseFloat(getComputedStyle(i).marginLeft)}));
  return {parts, inner: bar.clientWidth, pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth};
}"""

CASES = [
    (t, a, 1280) for t in ("dark", "light") for a in ("indigo", "teal", "ember", "lime")
]
CASES += [("dark", "indigo", 375), ("light", "indigo", 375)]


def problems(m: dict) -> list[str]:
    """What is wrong with one measurement, if anything."""
    out = []
    for n, p in enumerate(m["parts"]):
        if p["w"] > 0 and p["px"] < 2.99:
            out.append(
                f"part {n} at {p['w']}% is {p['px']:.1f}px wide, under the 3px floor"
            )
        if p["w"] == 0 and (p["px"] > 0 or p["gap"] > 0):
            out.append(f"part {n} at 0% takes {p['px'] + p['gap']:.1f}px")
    used = sum(p["px"] + p["gap"] for p in m["parts"])
    # half a pixel of slack for subpixel rounding
    if used > m["inner"] + 0.5:
        out.append(f"parts and gaps take {used:.1f}px of a {m['inner']}px track")
    if m["pageOverflow"] > 0:
        out.append(f"page scrolls sideways by {m['pageOverflow']}px")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, help="directory for screenshots")
    args = ap.parse_args()
    if args.out:
        args.out.mkdir(parents=True, exist_ok=True)

    failed = False
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for theme, accent, width in CASES:
            page = browser.new_page(
                viewport={"width": width, "height": 900}, device_scale_factor=2
            )
            # the docs head script reads these to set the theme and accent classes before paint
            page.add_init_script(
                f"localStorage.setItem('proxima-theme', '{theme}'); localStorage.setItem('proxima-accent', '{accent}');"
            )
            page.goto(DOCS)
            name = f"{theme}-{accent}-{width}"
            found = problems(page.evaluate(MEASURE))
            if args.out:
                page.locator(".stackbar").locator("xpath=..").screenshot(
                    path=args.out / f"{name}.png"
                )
            print(f"{'FAIL' if found else 'ok  '} {name}")
            for f in found:
                print(f"     {f}")
            failed = failed or bool(found)
            page.close()
        browser.close()
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
