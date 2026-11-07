"""Dependency-light QR code generator (byte mode, ECC level M) used for the demo QR.

Usage (from the repository root):
    pip install pillow
    python src/qr/make_qr.py https://shentonyan.github.io/cathay-meal-forecast/

Writes:
    docs/assets/demo-qr-plain.png  plain QR used by the poster and the pitch deck
    media/demo-qr.png              branded QR card for printing or sharing
"""
import sys
from PIL import Image, ImageDraw, ImageFont

ECC_CODEWORDS = {
    "L": [-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
    "M": [-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],
}
NUM_BLOCKS = {
    "L": [-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],
    "M": [-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],
}
FORMAT_BITS = {"L": 1, "M": 0}


def _gf_mul(x, y):
    z = 0
    for i in range(7, -1, -1):
        z = (z << 1) ^ ((z >> 7) * 0x11D)
        z ^= ((y >> i) & 1) * x
    return z & 0xFF


def _rs_divisor(degree):
    result = [0] * (degree - 1) + [1]
    root = 1
    for _ in range(degree):
        for j in range(len(result)):
            result[j] = _gf_mul(result[j], root)
            if j + 1 < len(result):
                result[j] ^= result[j + 1]
        root = _gf_mul(root, 2)
    return result


def _rs_remainder(data, divisor):
    result = [0] * len(divisor)
    for b in data:
        factor = b ^ result.pop(0)
        result.append(0)
        for i, coef in enumerate(divisor):
            result[i] ^= _gf_mul(coef, factor)
    return result


def _raw_modules(ver):
    result = (16 * ver + 128) * ver + 64
    if ver >= 2:
        n = ver // 7 + 2
        result -= (25 * n - 10) * n - 55
        if ver >= 7:
            result -= 36
    return result


def _data_codewords(ver, ecl):
    return _raw_modules(ver) // 8 - ECC_CODEWORDS[ecl][ver] * NUM_BLOCKS[ecl][ver]


def _bit(x, i):
    return ((x >> i) & 1) != 0


def make_qr(text, ecl="M"):
    """Return (matrix, version, mask) for `text` encoded in byte mode."""
    data = text.encode("utf-8")
    for ver in range(1, 41):
        cc_bits = 8 if ver < 10 else 16
        if 4 + cc_bits + 8 * len(data) <= _data_codewords(ver, ecl) * 8:
            break
    else:
        raise ValueError("Text too long for a QR code")

    bits = []
    def append(val, n):
        bits.extend((val >> i) & 1 for i in range(n - 1, -1, -1))
    append(4, 4)
    append(len(data), cc_bits)
    for b in data:
        append(b, 8)
    capacity = _data_codewords(ver, ecl) * 8
    append(0, min(4, capacity - len(bits)))
    append(0, (-len(bits)) % 8)
    pad = 0xEC
    while len(bits) < capacity:
        append(pad, 8)
        pad ^= 0xEC ^ 0x11
    codewords = [int("".join(map(str, bits[i:i + 8])), 2) for i in range(0, len(bits), 8)]

    # Error correction and interleaving
    nblocks = NUM_BLOCKS[ecl][ver]
    ecc_len = ECC_CODEWORDS[ecl][ver]
    raw = _raw_modules(ver) // 8
    nshort = nblocks - raw % nblocks
    short_len = raw // nblocks
    divisor = _rs_divisor(ecc_len)
    blocks, k = [], 0
    for i in range(nblocks):
        dat = codewords[k:k + short_len - ecc_len + (0 if i < nshort else 1)]
        k += len(dat)
        ecc = _rs_remainder(dat, divisor)
        if i < nshort:
            dat = dat + [0]
        blocks.append(dat + ecc)
    stream = []
    for i in range(len(blocks[0])):
        for j, blk in enumerate(blocks):
            if i != short_len - ecc_len or j >= nshort:
                stream.append(blk[i])

    size = ver * 4 + 17
    M = [[False] * size for _ in range(size)]
    F = [[False] * size for _ in range(size)]
    def setf(x, y, dark):
        M[y][x] = dark
        F[y][x] = True

    for i in range(size):
        setf(6, i, i % 2 == 0)
        setf(i, 6, i % 2 == 0)
    def finder(cx, cy):
        for dy in range(-4, 5):
            for dx in range(-4, 5):
                x, y = cx + dx, cy + dy
                if 0 <= x < size and 0 <= y < size:
                    setf(x, y, max(abs(dx), abs(dy)) not in (2, 4))
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4)
    if ver > 1:
        n = ver // 7 + 2
        step = (ver * 8 + n * 3 + 5) // (n * 4 - 4) * 2
        pos = list(reversed([size - 7 - i * step for i in range(n - 1)] + [6]))
        for i in range(n):
            for j in range(n):
                if (i, j) in ((0, 0), (0, n - 1), (n - 1, 0)):
                    continue
                for dy in range(-2, 3):
                    for dx in range(-2, 3):
                        setf(pos[i] + dx, pos[j] + dy, max(abs(dx), abs(dy)) != 1)

    def format_bits(mask):
        d = FORMAT_BITS[ecl] << 3 | mask
        r = d
        for _ in range(10):
            r = (r << 1) ^ ((r >> 9) * 0x537)
        return (d << 10 | r) ^ 0x5412
    def draw_format(mask):
        b = format_bits(mask)
        for i in range(6): setf(8, i, _bit(b, i))
        setf(8, 7, _bit(b, 6)); setf(8, 8, _bit(b, 7)); setf(7, 8, _bit(b, 8))
        for i in range(9, 15): setf(14 - i, 8, _bit(b, i))
        for i in range(8): setf(size - 1 - i, 8, _bit(b, i))
        for i in range(8, 15): setf(8, size - 15 + i, _bit(b, i))
        setf(8, size - 8, True)
    draw_format(0)
    if ver >= 7:
        r = ver
        for _ in range(12):
            r = (r << 1) ^ ((r >> 11) * 0x1F25)
        b = ver << 12 | r
        for i in range(18):
            a, c = size - 11 + i % 3, i // 3
            setf(a, c, _bit(b, i)); setf(c, a, _bit(b, i))

    i, right = 0, size - 1
    while right >= 1:
        if right == 6:
            right = 5
        for vert in range(size):
            for j in range(2):
                x = right - j
                upward = ((right + 1) & 2) == 0
                y = size - 1 - vert if upward else vert
                if not F[y][x] and i < len(stream) * 8:
                    M[y][x] = _bit(stream[i >> 3], 7 - (i & 7))
                    i += 1
        right -= 2

    masks = [lambda x, y: (x + y) % 2 == 0, lambda x, y: y % 2 == 0, lambda x, y: x % 3 == 0,
             lambda x, y: (x + y) % 3 == 0, lambda x, y: (x // 3 + y // 2) % 2 == 0,
             lambda x, y: x * y % 2 + x * y % 3 == 0, lambda x, y: (x * y % 2 + x * y % 3) % 2 == 0,
             lambda x, y: ((x + y) % 2 + x * y % 3) % 2 == 0]
    def apply_mask(m):
        f = masks[m]
        for y in range(size):
            for x in range(size):
                if not F[y][x] and f(x, y):
                    M[y][x] = not M[y][x]

    def add_history(run, hist):
        if hist[0] == 0:
            run += size
        hist.insert(0, run); hist.pop()
    def count_patterns(h):
        n = h[1]
        core = n > 0 and h[2] == h[4] == h[5] == n and h[3] == n * 3
        return (1 if core and h[0] >= n * 4 and h[6] >= n else 0) + (1 if core and h[6] >= n * 4 and h[0] >= n else 0)
    def terminate(color, run, hist):
        if color:
            add_history(run, hist); run = 0
        run += size
        add_history(run, hist)
        return count_patterns(hist)
    def penalty():
        score = 0
        for lines in (M, [list(c) for c in zip(*M)]):
            for row in lines:
                color, run, hist = False, 0, [0] * 7
                for c in row:
                    if c == color:
                        run += 1
                        if run == 5: score += 3
                        elif run > 5: score += 1
                    else:
                        add_history(run, hist)
                        if not color:
                            score += count_patterns(hist) * 40
                        color, run = c, 1
                score += terminate(color, run, hist) * 40
        for y in range(size - 1):
            for x in range(size - 1):
                if M[y][x] == M[y][x + 1] == M[y + 1][x] == M[y + 1][x + 1]:
                    score += 3
        dark = sum(sum(r) for r in M)
        total = size * size
        score += ((abs(dark * 20 - total * 10) + total - 1) // total - 1) * 10
        return score

    best = None
    for m in range(8):
        apply_mask(m); draw_format(m)
        p = penalty()
        if best is None or p < best[0]:
            best = (p, m)
        apply_mask(m)
    apply_mask(best[1]); draw_format(best[1])
    return M, ver, best[1]


def render(matrix, color=(11, 59, 60), scale=16, quiet=4):
    n = len(matrix)
    img = Image.new("RGB", ((n + 2 * quiet) * scale,) * 2, "white")
    d = ImageDraw.Draw(img)
    for y in range(n):
        for x in range(n):
            if matrix[y][x]:
                d.rectangle([(x + quiet) * scale, (y + quiet) * scale,
                             (x + quiet + 1) * scale - 1, (y + quiet + 1) * scale - 1], fill=color)
    return img


def branded_card(matrix, url):
    qr = render(matrix, color=(0, 101, 100), scale=max(16, 720 // (len(matrix) + 8)))
    w = qr.width
    card = Image.new("RGB", (w + 80, w + 220), "white")
    card.paste(qr, (40, 40))
    d = ImageDraw.Draw(card)
    try:
        f1 = ImageFont.truetype("DejaVuSans-Bold.ttf", 40)
        f2 = ImageFont.truetype("DejaVuSans.ttf", 24)
        f3 = ImageFont.truetype("DejaVuSans.ttf", 20)
    except OSError:
        f1 = f2 = f3 = ImageFont.load_default()
    def ctext(t, y, f, col):
        d.text(((card.width - d.textlength(t, font=f)) / 2, y), t, font=f, fill=col)
    ctext("Scan to try the demo", w + 50, f1, (0, 101, 100))
    ctext("Cathay Meal Forecast · Hackathon 2026", w + 110, f2, (140, 109, 53))
    ctext(url.replace("https://", "").rstrip("/"), w + 150, f3, (91, 107, 107))
    d.rectangle([0, 0, card.width - 1, card.height - 1], outline=(184, 149, 90), width=6)
    return card


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "https://shentonyan.github.io/cathay-meal-forecast/"
    M, ver, mask = make_qr(url)
    render(M, scale=max(16, 720 // (len(M) + 8))).save("docs/assets/demo-qr-plain.png")
    branded_card(M, url).save("media/demo-qr.png")
    print(f"QR version {ver}, mask {mask}: wrote docs/assets/demo-qr-plain.png and media/demo-qr.png")
