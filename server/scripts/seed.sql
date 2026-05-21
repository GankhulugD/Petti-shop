DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;

INSERT INTO categories (id, slug, name, sort_order, is_active) VALUES
  ('cat-food', 'food', 'Хоол', 1, 1),
  ('cat-litter', 'litter', 'Элс', 2, 1),
  ('cat-toys', 'toys', 'Тоглоом', 3, 1),
  ('cat-supplies', 'supplies', 'Хэрэгсэл', 4, 1);

INSERT INTO products (
  id, category_id, slug, sku, name, description, brand, price_mnt, rating_tenths,
  status, badge, target_animals, images, image_alt, details
) VALUES
  (
    'orijen-adult-dog-11kg', 'cat-food', 'orijen-adult-dog-11kg', 'ORIJEN-11',
    'Orijen Adult нохойн хоол 11.4 кг',
    'Шинэ мах, шувуу, загас — хөлдөөгүйгээр хүргэгддэг орц найрлага.',
    'Orijen', 485000, 45, 'active', 'best', '["dog"]',
    '["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"]',
    'Нохойн чийглэг хоолны уут',
    '{"ingredients":"Шинэ мах, шувуу, загас","usage":"Өдөрт 2–3 удаа.","shipping":"Улаанбаатар 24–48 цаг."}'
  ),
  (
    'ever-clean-litter-10l', 'cat-litter', 'ever-clean-litter-10l', 'EC-10L',
    'Ever Clean муурны элс 10L', 'Бентонит шавар, хүчиллэг үнэр дарагч.', 'Ever Clean',
    62000, 45, 'active', 'new', '["cat"]',
    '["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"]',
    'Муурны чийггүй элс',
    '{"ingredients":"Бентонит шавар","usage":"Өдөр бүр шавхуур авах.","shipping":"Хотын хүргэлт."}'
  ),
  (
    'tetramin-fish-food-1l', 'cat-food', 'tetramin-fish-food-1l', 'TETRA-1L',
    'TetraMin загасны хоол 1L', 'Загасны гурил, спирулина.', 'Tetra',
    28500, 45, 'active', 'best', '["fish"]',
    '["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"]',
    'Загасны хоол',
    '{"usage":"Өдөрт 2–3 удаа."}'
  ),
  (
    'vitakraft-bird-treat-800g', 'cat-food', 'vitakraft-bird-treat-800g', 'VITA-800',
    'Vitakraft шувуун амттан 800г', 'Тарианы үр, жимс.', 'Vitakraft',
    34000, 45, 'active', NULL, '["bird"]',
    '["https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80"]',
    'Шувуун амттан', '{}'
  ),
  (
    'auto-water-bowl-2-5l', 'cat-supplies', 'auto-water-bowl-2-5l', 'BOWL-25',
    'Автомат усны сав 2.5л', 'BPA-free хуванцар сав.', 'Petkit',
    89000, 45, 'active', 'new', '["dog","cat"]',
    '["https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80"]',
    'Усны сав', '{}'
  ),
  (
    'plush-bottle-toy', 'cat-toys', 'plush-bottle-toy', 'KONG-PLUSH',
    'Plush тоглоом (лонх хэлбэртэй)', 'Полиэстер даавуу.', 'KONG',
    24900, 45, 'active', NULL, '["dog"]',
    '["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80"]',
    'Нохойн тоглоом', '{}'
  ),
  (
    'cat-scratching-post-72', 'cat-toys', 'cat-scratching-post-72', 'POST-72',
    'Муурны самарын мод (72см)', 'Сизалийн утас, плюш.', 'Petfun',
    179000, 45, 'active', 'best', '["cat"]',
    '["https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80"]',
    'Самарын мод', '{}'
  ),
  (
    'kaytee-small-animal-bedding', 'cat-litter', 'kaytee-small-animal-bedding', 'KAY-25',
    'Kaytee жижиг амьтны элс 2.5кг', 'Модны үртэн.', 'Kaytee',
    42000, 45, 'active', NULL, '["small"]',
    '["https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80"]',
    'Жижиг амьтны элс', '{}'
  );

INSERT INTO product_variants (id, product_id, label, sku, price_mnt, stock_qty, is_default) VALUES
  ('v-orijen-1', 'orijen-adult-dog-11kg', '1 кг', 'ORIJEN-1', 52000, 50, 0),
  ('v-orijen-2', 'orijen-adult-dog-11kg', '5 кг', 'ORIJEN-5', 245000, 30, 0),
  ('v-orijen-3', 'orijen-adult-dog-11kg', '11.4 кг', 'ORIJEN-11', 485000, 20, 1),
  ('v-ec-1', 'ever-clean-litter-10l', '4 L', 'EC-4', 28000, 40, 0),
  ('v-ec-2', 'ever-clean-litter-10l', '10 L', 'EC-10', 62000, 25, 1),
  ('v-tetra-1', 'tetramin-fish-food-1l', '1 L', 'TETRA-1', 28500, 60, 1),
  ('v-bowl-1', 'auto-water-bowl-2-5l', '2.5 л', NULL, 89000, 15, 1),
  ('v-toy-1', 'plush-bottle-toy', 'Дунд', NULL, 24900, 35, 1),
  ('v-post-1', 'cat-scratching-post-72', '72 см', NULL, 179000, 10, 1),
  ('v-kay-1', 'kaytee-small-animal-bedding', '2.5 кг', NULL, 42000, 45, 1);

INSERT INTO orders (
  id, order_number, customer_email, customer_name, customer_phone,
  shipping_address, subtotal_mnt, shipping_mnt, total_mnt, status, payment_status
) VALUES (
  'demo-order-1', 'ORD-DEMO-001', 'customer@petti.mn', 'Батбаяр', '99119911',
  '{"city":"Улаанбаатар","district":"Сүхбаатар","line1":"1-р хороо"}',
  485000, 0, 485000, 'confirmed', 'paid'
);

INSERT INTO order_items (
  id, order_id, product_id, variant_id, product_name, variant_label,
  image_url, unit_price_mnt, quantity, line_total_mnt
) VALUES (
  'demo-line-1', 'demo-order-1', 'orijen-adult-dog-11kg', 'v-orijen-3',
  'Orijen Adult нохойн хоол 11.4 кг', '11.4 кг',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
  485000, 1, 485000
);
