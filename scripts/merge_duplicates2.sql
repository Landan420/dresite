-- Same recipe reprinted across two consecutive lessons in the source PDFs (made in one
-- lesson, referenced/reused in the next) — identical or near-identical ingredients and
-- steps with only wording/naming variance. Kept whichever copy had the more complete
-- steps or ingredient list.
DELETE FROM recipes WHERE id = 93;  -- Coconut Cake, dup of 92
DELETE FROM recipes WHERE id = 106; -- Red Velvet Cake, dup of 107 (107 has the missing bake step)
DELETE FROM recipes WHERE id = 149; -- Ganache Center, dup of 148
DELETE FROM recipes WHERE id = 219; -- Chocolate Chip Cookies, dup of 218
DELETE FROM recipes WHERE id = 257; -- Goat Cheese Cream, dup of 258 (258 has the gelatin ingredient 257 was missing)
DELETE FROM recipes WHERE id = 285; -- Raspberry Cremeux, dup of 284
DELETE FROM recipes WHERE id = 303; -- Cocoa Sablee, dup of 302
DELETE FROM recipes WHERE id = 316; -- Pate Sucree, dup of 315
DELETE FROM recipes WHERE id = 319; -- Raspberry Sablee, dup of 318
DELETE FROM recipes WHERE id = 398; -- Honey-Lemon Semifreddo Lemon Sorbet, dup of 397
DELETE FROM recipes WHERE id = 264; -- Lemon Curd, dup of 263 (263 has "reserve for next lesson" note)
DELETE FROM recipes WHERE id = 279; -- Pastry Cream, dup of 278 (278 has bonus chocolate/coffee/praline variations)

-- Preserve the parfait-mold sizing note from the deleted Pate Sucree duplicate (id 316)
UPDATE recipes SET notes = '["For parfait bases: cut with a round or oval cutter slightly smaller than the silicone mold, and bake about 10 minutes instead of 12."]' WHERE id = 315;
