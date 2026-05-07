#!/usr/bin/env python3
"""
KILIMO AI — Comprehensive brand color fixer.
Rule: ONLY #2E7D32, white, and gray-* classes.
All other colors (blue, cyan, teal, emerald, purple, pink, orange, amber, yellow,
indigo, violet, sky, rose, lime, fuchsia) must be converted.
Red is kept ONLY for true error states.
Brand-green gradients (from-[#2E7D32] to-[#1B5E20]) → solid bg-[#2E7D32].
Gray/white gradients are acceptable and untouched.
"""

import re
import os
import glob

BRAND = "#2E7D32"

# Tailwind shade → gray shade for backgrounds
BG_SHADE_MAP = {
    "50": "gray-50",
    "100": "gray-100",
    "200": "gray-200",
    "300": "gray-300",
    "400": "gray-400",
    "500": "gray-600",
    "600": "gray-700",
    "700": "gray-800",
    "800": "gray-900",
    "900": "gray-950",
    "950": "gray-950",
}

# Tailwind shade → gray shade for text (slightly lighter reads better)
TEXT_SHADE_MAP = {
    "50": "gray-100",
    "100": "gray-200",
    "200": "gray-300",
    "300": "gray-400",
    "400": "gray-500",
    "500": "gray-600",
    "600": "gray-600",
    "700": "gray-700",
    "800": "gray-800",
    "900": "gray-900",
    "950": "gray-900",
}

# Colors to convert to gray
COLORS_TO_GRAY = {
    "blue", "cyan", "teal", "purple", "pink", "orange", "amber", "yellow",
    "indigo", "violet", "sky", "rose", "fuchsia", "lime",
}

# Colors to convert to brand green
COLORS_TO_BRAND = {"emerald", "green"}


def bg_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}bg-{BG_SHADE_MAP.get(shade, 'gray-600')}"
    if color in COLORS_TO_BRAND:
        s = int(shade)
        if s <= 50:
            return f"{prefix}bg-[{BRAND}]/5"
        elif s <= 100:
            return f"{prefix}bg-[{BRAND}]/10"
        elif s <= 200:
            return f"{prefix}bg-[{BRAND}]/20"
        elif s >= 500:
            return f"{prefix}bg-[{BRAND}]"
        else:
            return f"{prefix}bg-[{BRAND}]/30"
    return f"{prefix}bg-{color}-{shade}"


def text_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}text-{TEXT_SHADE_MAP.get(shade, 'gray-600')}"
    if color in COLORS_TO_BRAND:
        return f"{prefix}text-[{BRAND}]"
    return f"{prefix}text-{color}-{shade}"


def border_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        shade_int = int(shade)
        if shade_int <= 200:
            return f"{prefix}border-gray-200"
        elif shade_int <= 400:
            return f"{prefix}border-gray-300"
        else:
            return f"{prefix}border-gray-400"
    if color in COLORS_TO_BRAND:
        return f"{prefix}border-[{BRAND}]/20"
    return f"{prefix}border-{color}-{shade}"


def ring_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}ring-gray-300"
    if color in COLORS_TO_BRAND:
        return f"{prefix}ring-[{BRAND}]/30"
    return f"{prefix}ring-{color}-{shade}"


def from_replacement(prefix: str, color: str, shade: str) -> str:
    """Convert gradient from-* to appropriate value or remove."""
    if color in COLORS_TO_GRAY:
        return f"{prefix}from-gray-50"
    if color in COLORS_TO_BRAND:
        return f"{prefix}from-[{BRAND}]"
    return f"{prefix}from-{color}-{shade}"


def to_replacement(prefix: str, color: str, shade: str) -> str:
    """Convert gradient to-* to appropriate value or remove."""
    if color in COLORS_TO_GRAY:
        return f"{prefix}to-gray-100"
    if color in COLORS_TO_BRAND:
        return f"{prefix}to-[{BRAND}]"
    return f"{prefix}to-{color}-{shade}"


def via_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}via-gray-50"
    if color in COLORS_TO_BRAND:
        return f"{prefix}via-[{BRAND}]"
    return f"{prefix}via-{color}-{shade}"


def placeholder_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}placeholder-gray-400"
    if color in COLORS_TO_BRAND:
        return f"{prefix}placeholder-[{BRAND}]"
    return f"{prefix}placeholder-{color}-{shade}"


def shadow_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY or color in COLORS_TO_BRAND:
        return f"{prefix}shadow-gray-200"
    return f"{prefix}shadow-{color}-{shade}"


def fill_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}fill-gray-600"
    if color in COLORS_TO_BRAND:
        return f"{prefix}fill-[{BRAND}]"
    return f"{prefix}fill-{color}-{shade}"


def stroke_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}stroke-gray-400"
    if color in COLORS_TO_BRAND:
        return f"{prefix}stroke-[{BRAND}]"
    return f"{prefix}stroke-{color}-{shade}"


def outline_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY:
        return f"{prefix}outline-gray-300"
    if color in COLORS_TO_BRAND:
        return f"{prefix}outline-[{BRAND}]"
    return f"{prefix}outline-{color}-{shade}"


def divide_replacement(prefix: str, color: str, shade: str) -> str:
    if color in COLORS_TO_GRAY or color in COLORS_TO_BRAND:
        return f"{prefix}divide-gray-200"
    return f"{prefix}divide-{color}-{shade}"


# All tailwind color names we care about
ALL_COLORS = "|".join(sorted(COLORS_TO_GRAY | COLORS_TO_BRAND))

# Variant prefixes like hover:, focus:, active:, group-hover:, dark:, etc.
VARIANT_PREFIX = r'(?:(?:hover|focus|active|group-hover|focus-within|focus-visible|disabled|checked|selected|open|peer-focus|aria-selected|data-\[.*?\]|lg|md|sm|xl|2xl|dark|print|motion-safe|motion-reduce):)*'

SHADE = r'(?:50|100|200|300|400|500|600|700|800|900|950)'

PROPERTY_HANDLERS = {
    "bg": bg_replacement,
    "text": text_replacement,
    "border": border_replacement,
    "ring": ring_replacement,
    "from": from_replacement,
    "to": to_replacement,
    "via": via_replacement,
    "placeholder": placeholder_replacement,
    "shadow": shadow_replacement,
    "fill": fill_replacement,
    "stroke": stroke_replacement,
    "outline": outline_replacement,
    "divide": divide_replacement,
}

PROP_PATTERN = "|".join(PROPERTY_HANDLERS.keys())

TOKEN_RE = re.compile(
    rf'({VARIANT_PREFIX})({PROP_PATTERN})-({ALL_COLORS})-({SHADE})\b'
)


def replace_token(match: re.Match) -> str:
    prefix = match.group(1)
    prop = match.group(2)
    color = match.group(3)
    shade = match.group(4)

    handler = PROPERTY_HANDLERS.get(prop)
    if handler:
        return handler(prefix, color, shade)
    return match.group(0)


# ---------- Special multi-token gradient patterns ----------

# 1. bg-gradient-to-* from-[#2E7D32] to-[#1B5E20] → bg-[#2E7D32]
BRAND_GRADIENT_RE = re.compile(
    r'bg-gradient-to-\w+\s+from-\[#2E7D32\](?:\s+via-\[#[0-9A-Fa-f]+\])?\s+to-\[#[0-9A-Fa-f]+\]'
)

# 2. from-[non-tailwind-color] to-[non-tailwind-color] arbitrary value gradients
ARBITRARY_FROM_RE = re.compile(r'from-\[(?!#2E7D32)[^\]]+\]')
ARBITRARY_TO_RE = re.compile(r'to-\[(?!#1B5E20)[^\]]+\]')
ARBITRARY_VIA_RE = re.compile(r'via-\[(?!#2E7D32)[^\]]+\]')

# 3. bg-gradient-to-* when paired with non-brand colors (after token replacement, all from/to will be gray/brand)
# After running the main replacements, from-gray-50 to-gray-100 is fine. But bg-gradient-to-* + from/to-[#2E7D32] 
# should become solid brand bg.


def process_file(path: str) -> tuple[int, str]:
    with open(path, "r", encoding="utf-8") as f:
        original = f.read()

    content = original

    # Step 1: Replace brand green gradients with solid brand bg
    content = BRAND_GRADIENT_RE.sub(f"bg-[{BRAND}]", content)

    # Step 2: Replace token-based color classes
    content = TOKEN_RE.sub(replace_token, content)

    # Step 3: Remove arbitrary-value gradient tokens for non-brand colors
    content = ARBITRARY_FROM_RE.sub("from-gray-50", content)
    content = ARBITRARY_TO_RE.sub("to-gray-100", content)
    content = ARBITRARY_VIA_RE.sub("via-gray-50", content)

    changes = sum(1 for a, b in zip(original, content) if a != b)
    return changes, content


def main():
    patterns = [
        "src/**/*.tsx",
        "src/**/*.ts",
        "src/**/*.jsx",
        "src/**/*.js",
    ]

    files = []
    for pattern in patterns:
        files.extend(glob.glob(pattern, recursive=True))

    files = [f for f in files if ".test." not in f and "node_modules" not in f]

    total_changed = 0
    files_changed = 0

    for path in sorted(files):
        changes, new_content = process_file(path)
        if changes > 0:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            files_changed += 1
            total_changed += changes
            print(f"  ✓  {path}  ({changes} chars changed)")

    print(f"\n✅ Done. {files_changed} files updated, ~{total_changed} char-level changes.")


if __name__ == "__main__":
    main()
