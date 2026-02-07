
-- Warehouse categories (top-level: Одежда, Обувь, Детские вещи)
CREATE TABLE public.warehouse_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  percentage NUMERIC NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#000000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Warehouse products (items within each category)
CREATE TABLE public.warehouse_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.warehouse_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  percentage NUMERIC NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#000000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Client chats for the dashboard widget
CREATE TABLE public.client_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_type TEXT NOT NULL DEFAULT 'Клиент',
  last_message TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  unread_count INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.warehouse_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_chats ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read warehouse categories" ON public.warehouse_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read warehouse products" ON public.warehouse_products FOR SELECT USING (true);
CREATE POLICY "Anyone can read client chats" ON public.client_chats FOR SELECT USING (true);

-- Seed categories
INSERT INTO public.warehouse_categories (name, percentage, color) VALUES
  ('Детские вещи', 50, 'hsl(45, 90%, 55%)'),
  ('Одежда', 35, 'hsl(258, 90%, 66%)'),
  ('Обувь', 15, 'hsl(330, 80%, 65%)');

-- Seed products for Детские вещи
INSERT INTO public.warehouse_products (category_id, name, percentage, color)
SELECT c.id, p.name, p.percentage, p.color
FROM public.warehouse_categories c
CROSS JOIN (VALUES 
  ('Комбинезоны', 30, 'hsl(45, 90%, 55%)'),
  ('Детские куртки', 25, 'hsl(40, 85%, 50%)'),
  ('Штаны детские', 20, 'hsl(35, 80%, 45%)'),
  ('Футболки детские', 15, 'hsl(50, 85%, 60%)'),
  ('Шапки детские', 10, 'hsl(55, 75%, 50%)')
) AS p(name, percentage, color)
WHERE c.name = 'Детские вещи';

-- Seed products for Одежда
INSERT INTO public.warehouse_products (category_id, name, percentage, color)
SELECT c.id, p.name, p.percentage, p.color
FROM public.warehouse_categories c
CROSS JOIN (VALUES 
  ('Футболки', 28, 'hsl(258, 90%, 66%)'),
  ('Джинсы', 24, 'hsl(250, 80%, 55%)'),
  ('Куртки', 22, 'hsl(265, 85%, 60%)'),
  ('Свитера', 16, 'hsl(270, 75%, 50%)'),
  ('Рубашки', 10, 'hsl(255, 70%, 45%)')
) AS p(name, percentage, color)
WHERE c.name = 'Одежда';

-- Seed products for Обувь
INSERT INTO public.warehouse_products (category_id, name, percentage, color)
SELECT c.id, p.name, p.percentage, p.color
FROM public.warehouse_categories c
CROSS JOIN (VALUES 
  ('Кроссовки', 35, 'hsl(330, 80%, 65%)'),
  ('Ботинки', 25, 'hsl(320, 75%, 55%)'),
  ('Сандалии', 18, 'hsl(340, 70%, 60%)'),
  ('Туфли', 12, 'hsl(335, 65%, 50%)'),
  ('Тапки', 10, 'hsl(325, 60%, 45%)')
) AS p(name, percentage, color)
WHERE c.name = 'Обувь';

-- Seed client chats
INSERT INTO public.client_chats (client_name, client_type, last_message, is_online, unread_count) VALUES
  ('Andreana Viola', 'VIP клиент', 'Hi, How are you today?', true, 2),
  ('Михаил Петров', 'Оптовик', 'Когда будет доставка?', false, 1),
  ('Елена Сидорова', 'Розница', 'Спасибо за помощь!', true, 0);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.warehouse_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.warehouse_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_chats;
