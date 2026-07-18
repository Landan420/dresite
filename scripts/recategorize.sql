-- Chocolate 'Shell' — chocolate coating, fits alongside other chocolate sprays/glazes
UPDATE recipes SET category = 'Chocolate & Bonbons' WHERE id = 1;

-- Souffle flavor additions
UPDATE recipes SET category = 'Meringues & Soufflés' WHERE id IN (2, 3, 4, 5, 6);

-- Course 5 cookies/bars
UPDATE recipes SET category = 'Cookies & Bars' WHERE id IN (117, 118, 119, 120, 121, 124, 125);

-- Base component (flour blend)
UPDATE recipes SET category = 'Doughs & Crusts' WHERE id = 122;

-- Sauce/topping
UPDATE recipes SET category = 'Fillings, Sauces & Garnishes' WHERE id = 123;

-- Quick breads
UPDATE recipes SET category = 'Quick Breads & Scones' WHERE id IN (126, 128);

-- Entremet assembly / insert
UPDATE recipes SET category = 'Mousses & Entremets' WHERE id IN (127, 129);

-- Plated garnish
UPDATE recipes SET category = 'Plated Dessert Components' WHERE id = 130;

-- Cake
UPDATE recipes SET category = 'Cakes & Sponges' WHERE id = 131;

-- Phyllo/syrup assembly (baklava-style technique, content confirms phyllo + syrup + diamond scoring)
UPDATE recipes SET category = 'Laminated & Phyllo Doughs' WHERE id = 535;
