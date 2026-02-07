
-- Create user_profiles table for storing account details
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  date_of_birth TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- For now, allow public read/write since there's no auth
CREATE POLICY "Anyone can read user profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert user profiles"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update user profiles"
  ON public.user_profiles
  FOR UPDATE
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default profile
INSERT INTO public.user_profiles (first_name, last_name, date_of_birth, phone, email, city)
VALUES ('', '', '', '', '', '');
