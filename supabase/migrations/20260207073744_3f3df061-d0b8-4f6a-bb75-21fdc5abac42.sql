
-- Create chat_messages table for synced mini-chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL DEFAULT 'user' CHECK (sender_type IN ('user', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read/insert policies (no auth required for now)
CREATE POLICY "Anyone can read chat messages"
  ON public.chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Seed with initial messages
INSERT INTO public.chat_messages (content, sender_type, created_at) VALUES
  ('Добрый день! Чем могу помочь?', 'ai', now() - interval '10 minutes'),
  ('Нужно добавить товары на склад', 'user', now() - interval '9 minutes'),
  ('Конечно, напишите какие товары нужно добавить.', 'ai', now() - interval '8 minutes');
