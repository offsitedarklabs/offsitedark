"""Blink frames + wing splay for the hero ASCII eye.

The blink stays inside the open eye. The outline of that eye is the edge
and does not grow. The opening closes with the lid's own marks, so the
iris is covered without turning into a solid block.

Both wings shift outward. Corners are copied up and out so the wing they
leave behind stays solid. The inner edge keeps its original glyphs so the
move does not open a hole. The left barcode rails are removed.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASCII = ROOT / "public" / "ascii"
SRC = ASCII / "hero.txt"
OUT = ASCII / "hero-blink"

raw = SRC.read_text(encoding="utf-8")
lines = raw.replace("\r\n", "\n").rstrip("\n").split("\n")
orig_lens = [len(line) for line in lines]
G = [list(line) for line in lines]
H = len(G)

# Rows above WING_TOP are the barcode band and its towers. The wing starts
# on WING_TOP. On the right, rows WING_TOP..RULE_ROWS_END-1 also carry a dotted
# rule that runs up to RULE_END_COL, where the wing's tower begins.
WING_TOP = 7
RULE_ROWS_END = 10
RULE_END_COL = 140

# Solid barcode rails sitting left of the wing. Not the wing itself.
LEFT_BARCODE_ROWS = (22, 23, 24, 25, 27, 28, 29, 30, 34, 35, 36, 37, 38, 39, 45)
for r in LEFT_BARCODE_ROWS:
    for c in range(0, 20):
        if c < len(G[r]):
            G[r][c] = " "

# The eye is the ink already drawn, not a band drawn around it.
# Seed sits in the iris. 4-connected so the fill does not jump the gaps
# into the wings. Rows 34–35 are the marks under the eye and stay out.
def _flood_eye() -> set[tuple[int, int]]:
    seen: set[tuple[int, int]] = set()
    stack = [(26, 85)]
    while stack:
        r, c = stack.pop()
        if (r, c) in seen:
            continue
        if not (19 <= r <= 33 and 54 <= c <= 112):
            continue
        if c >= len(G[r]) or G[r][c] == " ":
            continue
        seen.add((r, c))
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            stack.append((r + dr, c + dc))
    return seen


EYE = _flood_eye()
# First and last ink row of each column. That pair is the open eye's edge.
BOUNDS: dict[int, tuple[int, int]] = {}
for _c in range(54, 113):
    _ink = [r for r in range(19, 34) if (r, _c) in EYE]
    if len(_ink) >= 4:
        BOUNDS[_c] = (_ink[0], _ink[-1])


def in_eye(r: int, c: int) -> bool:
    """True for eye ink and for the opening between that column's edges."""
    if (r, c) in EYE:
        return True
    span = BOUNDS.get(c)
    if span is None or not (0 <= r < H):
        return False
    top, bot = span
    return top <= r <= bot


# Phrases taken from the open eyelid, with the heavy @ run softened.
# Each row of the close uses a different phrase, shifted with the row, so
# the darker cluster follows the eye down to the right instead of stacking
# into a solid block.
_LID_PHRASES = (
    "-=:==..-#%%%+*:.+* .:.-:==..-",
    ":==..-+=%#%%+*:.-+*:.-=:==..",
    ".:-=:==..-+#%%+*:.+ .:*=.-==",
    "-=..-#%%+*:.-=:==..-+*:.+ :.",
    ":.-+*:.-=:==..-#%%%+*.:=..-",
    ".+* .:-=:==..-%#%%+*:-.=:==",
    "-=:==..-+%%%*:.=-:==..-#%%+",
    ":--.:=-:+*:-.::-=..-#%%+:.:",
)


def _lid_mark(c: int, r: int) -> str:
    phrase = _LID_PHRASES[r % len(_LID_PHRASES)]
    return phrase[(c + r * 2) % len(phrase)]


# The eye's corners: left canthus high, right tip lower. The lid line
# runs between them. Each lid starts on the open eye's own edge.
_CORNER_L = (56, 21.2)
_CORNER_R = (110, 32.4)


def _knots(knots: tuple[tuple[int, float], ...], c: float) -> float:
    if c <= knots[0][0]:
        return knots[0][1]
    if c >= knots[-1][0]:
        return knots[-1][1]
    for (c0, r0), (c1, r1) in zip(knots, knots[1:]):
        if c0 <= c <= c1:
            t = (c - c0) / (c1 - c0)
            return r0 + (r1 - r0) * t
    return knots[-1][1]


# Where the lids sit while the eye is open. The blink leaves from these
# edges, so the frame next to fully open is not a jump.
_OPEN_TOP = ((56, 20.5), (70, 19.2), (90, 19.4), (100, 22.0), (110, 28.0))
_OPEN_BOT = ((56, 26.0), (64, 29.0), (74, 31.5), (86, 32.6), (110, 33.0))

# Upper lid, from the high left corner down into the lower lid.
# Steeper at first, then a shallow curve along the bottom lip.
_CREASE_KNOTS = (
    (56, 21.2),
    (66, 26.0),
    (76, 29.0),
    (88, 30.4),
    (98, 31.2),
    (106, 31.8),
    (110, 32.4),
)


def _crease(c: int) -> float:
    """Lid meeting line. The upper lid bows down into the lower one."""
    return _knots(_CREASE_KNOTS, c)


def _lid_line(_c: int) -> str:
    """One step darker than the lid fill. A single cell, not a solid band."""
    return "@"


def blink_frame(t: float) -> list[list[str]]:
    """Close the opening without drawing past the open eye.

    Each lid leaves from the open eye's own edge and they meet on a shallow
    curve. The meeting line is one darker cell. A column whose lead is still
    on that open edge is left untouched.
    """
    out = [row[:] for row in G]
    if t <= 0:
        return out

    eased = min(1.0, t)
    shut = eased >= 0.999
    for c, (top, bot) in BOUNDS.items():
        if c < _CORNER_L[0] or c > _CORNER_R[0]:
            continue
        if bot <= top:
            continue
        crease = _crease(c)
        # Rows 19–20 are the drawn upper lid. The moving line may sit on
        # them; the fill does not repaint that lid.
        inner_top = max(top + 1, 21)
        # Leave from the open eye's lid edges, not from wherever this
        # column's ink happens to start. A short column parks the line
        # inside the eye, and the open frame then jumps.
        eye_top = _knots(_OPEN_TOP, c)
        eye_bot = min(33.0, max(eye_top + 1.0, _knots(_OPEN_BOT, c)))
        top_lead = eye_top + eased * (crease - eye_top)
        bot_lead = eye_bot + eased * (crease - eye_bot)
        if shut:
            top_lead = bot_lead = crease
        top_row = min(33, max(19, int(round(top_lead))))
        bot_row = min(33, max(19, int(round(bot_lead))))
        open_top_row = min(33, max(19, int(round(eye_top))))
        open_bot_row = min(33, max(open_top_row, int(round(eye_bot))))
        # Still on the open lid: leave that edge untouched so the fully
        # open frame is the same drawing, not a swap.
        top_moved = shut or top_row != open_top_row
        bot_moved = shut or bot_row != open_bot_row

        for r in range(min(open_top_row, top_row), max(open_bot_row, bot_row) + 1):
            if r < 0 or r >= H or r > 33 or c >= orig_lens[r]:
                continue
            on_top = top_moved and r == top_row
            on_bot = bot_moved and r == bot_row
            on_line = on_top or on_bot
            if r == 21 and c <= 68 and not on_line:
                continue
            if r < inner_top and not on_line:
                continue
            in_top = top_moved and open_top_row < r <= top_row
            in_bot = bot_moved and bot_row <= r < open_bot_row
            if shut or in_top or in_bot:
                orig = G[r][c]
                if not (orig not in (" ", "@", "#", "%") and (r * 3 + c) % 4 == 0):
                    out[r][c] = _lid_mark(c, r)
            if on_line:
                out[r][c] = _lid_line(c)
    return out


def _under_eye(r: int, c: int) -> bool:
    """Ticks drawn just under the eye. They are not wing feathers."""
    if not (33 <= r <= 37):
        return False
    return any((rr, c) in EYE for rr in range(r - 4, r))


def _wing_spans(row: list[str], r: int) -> list[tuple[str, list[int]]]:
    """Left and right feathers, split through the empty middle.

    The inner feathers go all the way to the eye. Clipping them early left
    a gap at the inner corner when the rest of the wing moved.
    """
    left: list[int] = []
    right: list[int] = []
    # Beside the eye, the lashes and the marks under it stay put. The lower
    # half has no eye, so the inner feathers there move with the wing.
    if r < WING_TOP:
        # Rows 0-6 are the barcode band and its towers. They never move.
        return []
    if r <= 40:
        left_max, right_min = 64, 118
    else:
        left_max, right_min = 92, 96
    if r < RULE_ROWS_END:
        # Rows 7-9 on the right: the dotted rule left of the tower is
        # barcode furniture. Only the wing glyphs from the tower out move.
        right_min = RULE_END_COL
    for c, ch in enumerate(row):
        if ch == " " or in_eye(r, c) or _under_eye(r, c):
            continue
        if 12 <= c < left_max:
            left.append(c)
        elif c >= right_min:
            right.append(c)
    spans = []
    if left:
        spans.append(("L", left))
    if right:
        spans.append(("R", right))
    return spans


def _outer_glyphs(cols: list[int], side: str, depth: int = 14) -> tuple[list[int], list[int]]:
    """Split a wing row into its outer corner and the rest."""
    if not cols:
        return [], []
    if side == "L":
        edge = min(cols)
        outer = [c for c in cols if c <= edge + depth]
        inner = [c for c in cols if c > edge + depth]
    else:
        edge = max(cols)
        outer = [c for c in cols if c >= edge - depth]
        inner = [c for c in cols if c < edge - depth]
    return outer, inner


def _can_write(r: int, c: int, side: str) -> bool:
    if not (0 <= r < H) or not (0 <= c < orig_lens[r]):
        return False
    if r < WING_TOP:
        return False
    if side == "R" and r < RULE_ROWS_END and c < RULE_END_COL:
        return False
    if in_eye(r, c):
        return False
    return True


def _raise_into_blank(
    out: list[list[str]],
    grid: list[list[str]],
    r: int,
    cols: list[int],
    side: str,
    extra: int,
    lift: int,
    depth: int,
) -> None:
    """Copy the outer corner up and out, only into cells that are empty.

    The wing row itself is already shifted, and this does not clear it, so
    the corner cannot leave a hole behind.
    """
    if lift <= 0 and extra <= 0:
        return
    outer, _inner = _outer_glyphs(cols, side, depth)
    for c in outer:
        dest_c = c - extra if side == "L" else c + extra
        dest_r = r - lift
        if not _can_write(dest_r, dest_c, side):
            continue
        if out[dest_r][dest_c] != " ":
            continue
        # Attached to the outer edge only. A glyph dropped further out is a
        # speck, and a glyph dropped into a feather gap smears the wing.
        row = out[dest_r]
        if side == "L":
            if any(row[k] != " " for k in range(0, dest_c)):
                continue
            if not any(row[k] != " " for k in range(dest_c + 1, min(orig_lens[dest_r], dest_c + 3))):
                continue
        else:
            if any(row[k] != " " for k in range(dest_c + 1, orig_lens[dest_r])):
                continue
            if not any(row[k] != " " for k in range(max(0, dest_c - 2), dest_c)):
                continue
        out[dest_r][dest_c] = grid[r][c]


def splay_wings(grid: list[list[str]], body: int, splay: int, lift: int) -> list[list[str]]:
    """Slide each wing out as a solid piece. Corners curl into empty space.

    The inner `shift` columns keep the glyphs that were already there, so the
    side toward the eye does not open up.
    """
    if body <= 0 and splay <= 0 and lift <= 0:
        return [row[:] for row in grid]

    out = [row[:] for row in grid]
    # (row, col, dest_col, glyph, side, shift)
    moves: list[tuple[int, int, int, str, str, int]] = []

    for r in range(WING_TOP, min(64, H)):
        for side, cols in _wing_spans(grid[r], r):
            if not cols:
                continue
            # One shift for every row. A larger shift on the lower rows tore
            # the tips away from the wing body between frames.
            shift = body
            if shift <= 0:
                continue
            for c in cols:
                dest_c = c - shift if side == "L" else c + shift
                if _can_write(r, dest_c, side):
                    moves.append((r, c, dest_c, grid[r][c], side, shift))

    for r, c, _dest_c, _glyph, _side, _shift in moves:
        out[r][c] = " "
    for r, _c, dest_c, glyph, _side, _shift in moves:
        out[r][dest_c] = glyph

    # The shift vacates `shift` columns on the inner side and nothing further
    # inward moves in to fill them. Put the original glyphs back there.
    restored: set[tuple[int, str]] = set()
    for r, c, _dest_c, _glyph, side, shift in moves:
        if (r, side) in restored:
            continue
        restored.add((r, side))
        cols = [mc for mr, mc, _d, _g, ms, _s in moves if mr == r and ms == side]
        if side == "L":
            inner = max(cols)
            window = range(inner - shift + 1, inner + 1)
        else:
            inner = min(cols)
            window = range(inner, inner + shift)
        for mc in window:
            if not (0 <= mc < orig_lens[r]) or not _can_write(r, mc, side):
                continue
            if grid[r][mc] != " ":
                out[r][mc] = grid[r][mc]
                continue
            # A blank of one or two cells between the shifted wing and the
            # inner edge. Bridge it with the glyph already on that edge.
            donor = None
            for nb in list(window):
                if grid[r][nb] != " ":
                    donor = grid[r][nb]
                    break
            if donor is not None and out[r][mc] == " ":
                out[r][mc] = donor

    if lift or splay:
        for r in range(8, min(64, H)):
            for side, cols in _wing_spans(grid[r], r):
                if not cols:
                    continue
                extra = body + splay
                up = max(lift, 1)
                if (side == "L" and 8 <= r <= 14) or (side == "R" and 11 <= r <= 16):
                    _raise_into_blank(out, grid, r, cols, side, extra, up, 12)
                elif r >= 56:
                    _raise_into_blank(out, grid, r, cols, side, extra, up, 6)
    return out


def to_text(grid: list[list[str]]) -> str:
    out: list[str] = []
    for i, row in enumerate(grid):
        s = "".join(row)
        if len(s) < orig_lens[i]:
            s += " " * (orig_lens[i] - len(s))
        elif len(s) > orig_lens[i]:
            s = s[: orig_lens[i]]
        out.append(s)
    return "\n".join(out) + "\n"


def region_delta(a: list[str], b: list[str], r0: int, r1: int, c0: int, c1: int) -> int:
    n = 0
    for r in range(r0, r1 + 1):
        for c in range(c0, min(c1, len(a[r]), len(b[r]))):
            if a[r][c] != b[r][c]:
                n += 1
    return n


def main() -> None:
    OUT.mkdir(exist_ok=True)
    for stale in list(OUT.glob("*.txt")) + list(OUT.glob("*.json")):
        stale.unlink()

    # Keep the source art in sync with the open frame (barcode already gone).
    cleaned = to_text(G)
    SRC.write_text(cleaned, encoding="utf-8")

    # Even steps so the reverse playback is the same motion, not a jump.
    # ascii-block.tsx BLINK_COUNT must stay equal to blink_steps + 1.
    blink_steps = 8
    blink_ts = [i / blink_steps for i in range(blink_steps + 1)]
    # (body shift, extra corner splay, corner lift in rows). The tips use the
    # same shift as the body and the lift grows with it, so every step moves
    # the whole wing by the same amount.
    wing_levels = [(0, 0, 0), (1, 0, 1), (2, 0, 2)]

    manifest = []
    blink_grids = [blink_frame(t) for t in blink_ts]
    for bi, (t, bgrid) in enumerate(zip(blink_ts, blink_grids)):
        for wi, (body, splay, lift) in enumerate(wing_levels):
            text = to_text(splay_wings(bgrid, body, splay, lift))
            name = f"b{bi}w{wi}.txt"
            (OUT / name).write_text(text, encoding="utf-8")
            fl = text.splitlines()
            assert len(fl) == 66, name
            assert [len(x) for x in fl] == orig_lens, name
            manifest.append(
                {
                    "file": name,
                    "blink": bi,
                    "wing": wi,
                    "t": t,
                    "body": body,
                    "splay": splay,
                    "lift": lift,
                }
            )

    (OUT / "manifest.json").write_text(
        json.dumps(
            {
                "blinkCount": len(blink_ts),
                "wingCount": 3,
                "order": "index = blink * wingCount + wing",
                "frames": manifest,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    open_l = (OUT / "b0w0.txt").read_text(encoding="utf-8").splitlines()
    splay_l = (OUT / "b0w2.txt").read_text(encoding="utf-8").splitlines()
    assert open_l == cleaned.splitlines(), "b0w0 drifted from hero.txt"
    assert region_delta(open_l, splay_l, 18, 35, 68, 115) == 0, "wings moved the eye"
    # The barcode band and its towers (rows 0-6) and the dotted rule beside
    # the right tower (rows 7-9) are identical in every wing frame.
    for wi in range(len(wing_levels)):
        frame = (OUT / f"b0w{wi}.txt").read_text(encoding="utf-8").splitlines()
        assert region_delta(open_l, frame, 0, WING_TOP - 1, 0, 175) == 0, f"barcode moved in w{wi}"
        assert (
            region_delta(open_l, frame, WING_TOP, RULE_ROWS_END - 1, 60, RULE_END_COL) == 0
        ), f"barcode rule moved in w{wi}"
    # The top wing tips (rows 7-14) do move, left and right.
    for a, b in ((0, 1), (1, 2)):
        fa = (OUT / f"b0w{a}.txt").read_text(encoding="utf-8").splitlines()
        fb = (OUT / f"b0w{b}.txt").read_text(encoding="utf-8").splitlines()
        assert region_delta(fa, fb, WING_TOP, 14, 0, 60) > 0, "top-left tips did not move"
        assert region_delta(fa, fb, WING_TOP, 14, RULE_END_COL, 175) > 0, "top-right tips did not move"
    assert all(not open_l[r][:20].strip() for r in LEFT_BARCODE_ROWS), "left barcode remains"
    # The lower tips have to leave their rest position.
    assert region_delta(open_l, splay_l, 50, 63, 12, 70) > 0, "left tips did not splay"
    assert region_delta(open_l, splay_l, 50, 63, 110, 175) > 0, "right tips did not splay"


if __name__ == "__main__":
    main()
