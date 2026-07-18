-- Exact duplicates: identical ingredients, amounts, and step-by-step instructions,
-- extracted from two overlapping source PDFs (PA_Mod_01_Instructor.pdf duplicates
-- content also present in the per-course PDFs, or the same lesson repeated within
-- one PDF at two page numbers). Keeping the entry that traces to the user's actual
-- current source file where applicable.
DELETE FROM recipes WHERE id = 453; -- Coconut Souffle, dup of 454
DELETE FROM recipes WHERE id = 396; -- Honey Semifreddo, dup of 395
DELETE FROM recipes WHERE id = 224; -- Nick Malgieri's Supernatural Brownies, dup of 223
DELETE FROM recipes WHERE id = 468; -- Pistachio Souffle, dup of 469
DELETE FROM recipes WHERE id = 470; -- Praline Souffle, dup of 471
