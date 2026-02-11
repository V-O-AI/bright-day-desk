
-- 1. Explicit deny UPDATE/DELETE policies on shared read-only tables
-- client_chats
CREATE POLICY "Deny update on client_chats" ON public.client_chats FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Deny delete on client_chats" ON public.client_chats FOR DELETE TO authenticated USING (false);
CREATE POLICY "Deny insert on client_chats" ON public.client_chats FOR INSERT TO authenticated WITH CHECK (false);

-- warehouse_categories
CREATE POLICY "Deny update on warehouse_categories" ON public.warehouse_categories FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Deny delete on warehouse_categories" ON public.warehouse_categories FOR DELETE TO authenticated USING (false);
CREATE POLICY "Deny insert on warehouse_categories" ON public.warehouse_categories FOR INSERT TO authenticated WITH CHECK (false);

-- warehouse_products
CREATE POLICY "Deny update on warehouse_products" ON public.warehouse_products FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Deny delete on warehouse_products" ON public.warehouse_products FOR DELETE TO authenticated USING (false);
CREATE POLICY "Deny insert on warehouse_products" ON public.warehouse_products FOR INSERT TO authenticated WITH CHECK (false);

-- 2. Harden handle_new_user() with email validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  IF NEW.email IS NULL OR NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  INSERT INTO public.user_profiles (user_id, email)
  VALUES (NEW.id, LOWER(TRIM(NEW.email)));

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
END;
$$;
