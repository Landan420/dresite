-- Step-instruction text leaked into title
UPDATE recipes SET title = 'Rye Wheat Sourdough' WHERE id = 7;

-- Section-header fragments leaked into title
UPDATE recipes SET title = 'Doughnut Sugar Glaze' WHERE id = 38;

-- Duplicated component names (page header repeated before each component's table)
UPDATE recipes SET title = 'Buche De Noel: Roulade Biscuit, Swiss Meringue Buttercream, Marzipan' WHERE id = 61;
UPDATE recipes SET title = 'Smoked Almond Financier, Goat Cheese Fondant, Red Wine Caramel, Caramelized Cherry' WHERE id = 71;
UPDATE recipes SET title = 'Biscuit Cuillere: Espresso Syrup, Zabaione Filling' WHERE id = 81;
UPDATE recipes SET title = 'Biscuit Jaconde: Coffee Syrup, Coffee Buttercream, Chocolate Ganache' WHERE id = 141;
UPDATE recipes SET title = 'Basque Cake: Basque Cake Batter, Pastry Cream' WHERE id = 234;
UPDATE recipes SET title = 'Chocolate & Summer Berry Coulis Dome: Lime Dacquoise Cake, Summer Berry Coulis Insert, Chocolate Mousse, Vanilla Mousseline' WHERE id = 239;
UPDATE recipes SET title = 'Crepe Layers: Pastry Cream' WHERE id = 250;
UPDATE recipes SET title = 'Lemon Raspberry Roulade: Biscuit Layer, Lemon Curd Buttercream' WHERE id = 266;
UPDATE recipes SET title = 'Lemon Strawberry Pistachio Cake: Pistachio Pain De Gene, Lemon Ricotta Sponge, Strawberry Gelee, Lemon Cream, Lemon Mousse' WHERE id = 267;
UPDATE recipes SET title = 'Tres Leches Cake: Tres Leches Cake Layer, Tres Leches Syrup, Whipped Cream' WHERE id = 288;
UPDATE recipes SET title = 'Yogurt Panna Cotta' WHERE id = 295;
UPDATE recipes SET title = 'Cooked Apple Filling' WHERE id = 336;
UPDATE recipes SET title = 'Frozen Ginger Parfait, Passion Fruit Sorbet, Meringue' WHERE id = 389;
UPDATE recipes SET title = 'Bourbon Mille Feuille, Lemon, Vanilla Ice Cream, Vanilla Pastry Cream' WHERE id = 424;
UPDATE recipes SET title = 'Coffee & Pecan Petit Gateaux: Pecan Dacquoise, Pecan Caramel, Coffee Crème, Coffee Mousse' WHERE id = 455;
UPDATE recipes SET title = 'Charlotte Royale: Biscuit Layers, Raspberry Mousse' WHERE id = 482;
UPDATE recipes SET title = 'Banana, Chocolate and Walnut Dome: Walnut Biscuit, Praline Krispy, Chocolate Cream Insert, Banana Mousse, Caramel Bananas' WHERE id = 540;
UPDATE recipes SET title = 'Milk Chocolate Coconut: Chocolate Genoise Mousseline, Coconut Caramel, Pressed Coconut, Caramelized Cashews, Milk Chocolate Mousse' WHERE id = 556;
UPDATE recipes SET title = 'Pecan Maple Petit Gateaux (Gluten Free, Dairy Free): Pecan Biscuit, Pecan Dacquoise Layer, Maple Panna Cotta, Chocolate Glacage' WHERE id = 559;

-- Garbled OCR text ("Fffff Fill Fil") in title
UPDATE recipes SET title = 'German Chocolate Cake Filling (Genoise)' WHERE id = 153;

-- ALL-CAPS with garbled punctuation; actual ingredients captured are just the sponge component
UPDATE recipes SET title = 'Strawberry Fraisier: Plain Sponge Cake (Genoise)' WHERE id = 286;

-- "RECIPES and EXECRCISES" worksheet header leaked into title (+ typo)
UPDATE recipes SET title = 'Basic Granite' WHERE id = 411;
UPDATE recipes SET title = 'White Base (6% Milk Fat)' WHERE id = 412;

-- Column-header units ("g oz") leaked into title
UPDATE recipes SET title = 'White Base (14% Milk Fat)' WHERE id = 416;

-- Continuation of the Baklava recipe (next page, same module/course) with corrupted ingredient parsing
UPDATE recipes SET title = 'Baklava (Assembly, cont''d)' WHERE id = 535;

-- Course-worksheet label leaked into title
UPDATE recipes SET title = 'Blueberry Muffins' WHERE id = 567;

-- Instructor joke-typo in source PDF, cleaned up for readability
UPDATE recipes SET title = 'Cranberry Orange Crumb Muffins' WHERE id = 573;

-- Inconsistent possessive capitalization ('S -> 's)
UPDATE recipes SET title = 'Decorator''s Buttercream' WHERE id IN (51, 52);
UPDATE recipes SET title = 'Chef Dalia''s Coconut Macaroons' WHERE id = 119;
UPDATE recipes SET title = 'Chef Jenny''s Sprinkle Doodles' WHERE id = 120;
UPDATE recipes SET title = 'Chef Jenny''s Sprinkledoodle Cookies' WHERE id = 215;
UPDATE recipes SET title = 'Chef Scott''s Crinkle Cookies' WHERE id = 216;
UPDATE recipes SET title = 'Nick Malgieri''s Supernatural Brownies' WHERE id IN (223, 224);
UPDATE recipes SET title = 'Shirley O. Corriher''s Biscuits' WHERE id = 581;
