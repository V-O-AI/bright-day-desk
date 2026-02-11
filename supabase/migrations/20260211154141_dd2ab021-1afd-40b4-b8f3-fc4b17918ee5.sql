-- Tighten chat message privacy and enforce ownership

-- 1) Ensure any legacy rows without ownership are removed (they would become unreadable anyway)
DELETE FROM public.chat_messages
WHERE user_id IS NULL;

-- 2) Enforce that every message has an owner
ALTER TABLE public.chat_messages
  ALTER COLUMN user_id SET NOT NULL;

-- 3) Replace cross-user read policy with owner-only read
DROP POLICY IF EXISTS "Authenticated users can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;

CREATE POLICY "Users can read own chat messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4) Helpful index for common access pattern
CREATE INDEX IF NOT EXISTS chat_messages_user_id_created_at_idx
  ON public.chat_messages (user_id, created_at);
