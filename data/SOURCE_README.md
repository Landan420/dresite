# Pastry Course Recipe Dataset

**581 recipes** extracted from 8 ICE Career Pastry & Baking course PDFs (Modules 1–4, Courses 1–8, lessons 1–100, ~1,540 pages).

Files:
- `pastry_recipes.json` — the data
- `parse3.py` + `build.py` — the extraction pipeline, if you ever want to re-run or tweak it

---

## Schema

`pastry_recipes.json` is a flat array of recipe objects, sorted by category then title:

```json
{
  "title": "Yellow Buttermilk Cake",
  "module": "Module 3",
  "course": "Course 5",
  "course_name": "Cakes, Fillings & Icings Pt 1",
  "lesson": 95,
  "category": "Cakes & Sponges",
  "yield": "Yield 2,372 grams 9,488 grams 37,952 grams",
  "yield_num": "2,372 grams",
  "batch_cols": ["quart mixer", "quart mixer", "quart mixer"],
  "ingredients": [
    {
      "name": "sugar",
      "amounts": [["570", "grams"], ["2280", "grams"], ["9120", "grams"]],
      "bakers_pct": null,
      "component": null
    }
  ],
  "total": null,
  "steps": ["Cream the butter and sugar.", "..."],
  "notes": ["Utilize the Creaming Mixing Method"],
  "source_pdf": "Pastry_Module_3_Course_5.pdf",
  "source_page": 60
}
```

### Field notes

| Field | Notes |
|---|---|
| `ingredients[].amounts` | **Array of `[amount, unit]` pairs.** Usually length 1. Length 2–3 means the source printed multiple batch sizes side by side — see below. `amount` is a numeric string with commas stripped (`"2280"`). |
| `ingredients[].bakers_pct` | Baker's percentage as a string (`"64.30"`), on 32 bread formulas. `null` elsewhere. |
| `ingredients[].component` | Sub-component label for multi-part recipes (e.g. `"Mousse"`, `"Nappage"`). Group by this to render sections. `null` for flat recipes. |
| `yield` | Raw yield line from the PDF, warts and all. |
| `yield_num` | First parsed number+unit from it — **use this as the scaling base.** `null` on ~380 recipes that had no yield line. |
| `batch_cols` | Column headers when `amounts` has >1 entry. |
| `total` | The formula's Total row where present, same `[amount, unit]` shape. |
| `steps` | Ordered array. Continuation text from wrapped lines is already joined. |
| `source_pdf` / `source_page` | 1-indexed page in the original PDF, for spot-checking. |

---

## Things to know before you build

**1. Multi-batch recipes (20 of them).** When `amounts` has 2–3 pairs, they're Small / Medium / Large batch columns keyed to `batch_cols` (7-, 20-, and 60-quart mixers). Your renderer needs to pick one column or show a toggle — don't assume `amounts[0]` is the only value.

**2. These are professional-scale formulas.** White French Bread is ~15.9 kg of dough. Yellow Buttermilk Cake's large batch is ~38 kg. Scaling isn't optional for home use.

**3. Scale by weight, not servings.** Everything is gram-based, which is the good news — scaling is a single multiplier. Suggested approach:
```js
const factor = targetGrams / parseFloat(yield_num.replace(/,/g, ''));
```
For the ~380 recipes with no `yield_num`, sum the ingredient amounts to get a gross weight and scale against that instead. For bread formulas with `bakers_pct`, scaling off the flour weight is more idiomatic.

**4. Units are mostly `grams`,** with some `sheets` (gelatin), `each`, and `as needed` (encoded as `["", "as needed"]` — guard for the empty amount string when you multiply).

**5. Category is derived, not from the source.** I assigned it by keyword-matching the title. It's good but not perfect — a handful of Module 3 plated-dessert components and a few Course 5 cookies land in fallback buckets named after their course. Easy to re-map; the rules live in `RULES` in `build.py`.

**6. What's excluded.** Homework worksheets, math exercises, unit-conversion tables, and syllabus/rubric content. Also excluded: technique-only pages with no ingredient table (dough shaping 1-2-3-4, chocolate tempering, the Module 4 final-cake criteria and cake-costing sheets). Those are still in the PDFs if you want them later.

**7. Known source typos preserved** where I didn't catch them — the PDFs themselves contain things like `VANILLA CUPCAKESS` and `MMMMMMMUFFMUFFINS`. I fixed the ones I found; there may be more.

---

## Categories

| Category | Recipes |
|---|---|
| Custards & Creams | 62 |
| Frozen Desserts | 57 |
| Chocolate & Bonbons | 47 |
| Cakes & Sponges | 43 |
| Fillings, Sauces & Garnishes | 41 |
| Breads & Yeast Doughs | 37 |
| Pies & Tarts | 31 |
| Laminated & Phyllo Doughs | 29 |
| Plated Dessert Components | 28 |
| Meringues & Soufflés | 27 |
| Mousses & Entremets | 27 |
| Doughs & Crusts | 27 |
| Confections & Sugar Work | 26 |
| Cookies & Bars | 22 |
| Quick Breads & Scones | 19 |
| Buttercreams & Icings | 15 |
| Cake Decorating | 14 |
| Cheesecakes | 7 |
| *(5 small fallback buckets)* | 22 |

Totals: 3,602 ingredient rows, 2,443 steps, 80 lessons.

---

## Re-running the pipeline

```bash
pip install --break-system-packages pdftotext  # or: apt install poppler-utils
mkdir txt && for f in *.pdf; do pdftotext -layout "$f" "txt/${f%.pdf}.txt"; done
python3 build.py   # imports parse3.py, writes pastry_recipes.json
```

`parse3.py` handles the four different layouts the source uses: standard right-aligned gram tables, multi-column batch tables, baker's-percentage bread formulas, and multi-component entremets. `build.py` does dedupe, category assignment, title cleanup, and junk filtering.

## Validation

Module 4 Course 8 was checked field-by-field against the original PDF — Marzipan, White Chocolate Plastiq, Basic Sugar Cookie, Royal Icing, Quick Gumpaste, Swiss Meringue Buttercream, Yellow Buttermilk Cake, and Vanilla Buttercream all match exactly, including multi-column batch amounts. Other modules were spot-checked but not exhaustively verified — `source_pdf` + `source_page` are on every record so you can check anything that looks off.
