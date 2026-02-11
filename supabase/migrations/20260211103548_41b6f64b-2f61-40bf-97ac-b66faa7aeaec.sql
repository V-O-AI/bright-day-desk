
-- 1. Add user_id to user_profiles linked to auth.users
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- 2. Add user_id to chat_messages
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Drop all old permissive policies

-- user_profiles
DROP POLICY IF EXISTS "Anyone can read user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can insert user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can update user profiles" ON public.user_profiles;

-- chat_messages
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;

-- client_chats
DROP POLICY IF EXISTS "Anyone can read client chats" ON public.client_chats;

-- financial_metrics (keep service role policy)
DROP POLICY IF EXISTS "Financial metrics are viewable by everyone" ON public.financial_metrics;

-- warehouse
DROP POLICY IF EXISTS "Anyone can read warehouse categories" ON public.warehouse_categories;
DROP POLICY IF EXISTS "Anyone can read warehouse products" ON public.warehouse_products;

-- 4. Create new authenticated-only policies

-- user_profiles: owner access only
CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- chat_messages: authenticated users
CREATE POLICY "Authenticated users can read chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert chat messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- client_chats: authenticated read
CREATE POLICY "Authenticated users can read client chats"
  ON public.client_chats FOR SELECT
  TO authenticated
  USING (true);

-- financial_metrics: authenticated read
CREATE POLICY "Authenticated users can read financial metrics"
  ON public.financial_metrics FOR SELECT
  TO authenticated
  USING (true);

-- warehouse: authenticated read
CREATE POLICY "Authenticated users can read warehouse categories"
  ON public.warehouse_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read warehouse products"
  ON public.warehouse_products FOR SELECT
  TO authenticated
  USING (true);

-- 5. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
