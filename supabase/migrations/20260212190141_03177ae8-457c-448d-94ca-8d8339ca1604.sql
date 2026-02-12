
-- Fix financial_metrics: drop restrictive, create permissive
DROP POLICY IF EXISTS "Authenticated users can read financial metrics" ON public.financial_metrics;
DROP POLICY IF EXISTS "Service role can manage financial metrics" ON public.financial_metrics;

CREATE POLICY "Authenticated users can read financial metrics"
ON public.financial_metrics FOR SELECT
USING (true);

CREATE POLICY "Service role can manage financial metrics"
ON public.financial_metrics FOR ALL
USING (auth.role() = 'service_role'::text);

-- Fix warehouse_categories
DROP POLICY IF EXISTS "Authenticated users can read warehouse categories" ON public.warehouse_categories;
DROP POLICY IF EXISTS "Deny delete on warehouse_categories" ON public.warehouse_categories;
DROP POLICY IF EXISTS "Deny insert on warehouse_categories" ON public.warehouse_categories;
DROP POLICY IF EXISTS "Deny update on warehouse_categories" ON public.warehouse_categories;

CREATE POLICY "Authenticated users can read warehouse categories"
ON public.warehouse_categories FOR SELECT
USING (true);

CREATE POLICY "Deny delete on warehouse_categories"
ON public.warehouse_categories FOR DELETE
USING (false);

CREATE POLICY "Deny insert on warehouse_categories"
ON public.warehouse_categories FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny update on warehouse_categories"
ON public.warehouse_categories FOR UPDATE
USING (false);

-- Fix warehouse_products
DROP POLICY IF EXISTS "Authenticated users can read warehouse products" ON public.warehouse_products;
DROP POLICY IF EXISTS "Deny delete on warehouse_products" ON public.warehouse_products;
DROP POLICY IF EXISTS "Deny insert on warehouse_products" ON public.warehouse_products;
DROP POLICY IF EXISTS "Deny update on warehouse_products" ON public.warehouse_products;

CREATE POLICY "Authenticated users can read warehouse products"
ON public.warehouse_products FOR SELECT
USING (true);

CREATE POLICY "Deny delete on warehouse_products"
ON public.warehouse_products FOR DELETE
USING (false);

CREATE POLICY "Deny insert on warehouse_products"
ON public.warehouse_products FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny update on warehouse_products"
ON public.warehouse_products FOR UPDATE
USING (false);

-- Fix client_chats
DROP POLICY IF EXISTS "Authenticated users can read client chats" ON public.client_chats;
DROP POLICY IF EXISTS "Deny delete on client_chats" ON public.client_chats;
DROP POLICY IF EXISTS "Deny insert on client_chats" ON public.client_chats;
DROP POLICY IF EXISTS "Deny update on client_chats" ON public.client_chats;

CREATE POLICY "Authenticated users can read client chats"
ON public.client_chats FOR SELECT
USING (true);

CREATE POLICY "Deny delete on client_chats"
ON public.client_chats FOR DELETE
USING (false);

CREATE POLICY "Deny insert on client_chats"
ON public.client_chats FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny update on client_chats"
ON public.client_chats FOR UPDATE
USING (false);
