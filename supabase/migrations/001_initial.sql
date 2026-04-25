-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles: extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('investor', 'farmer', 'admin')),
  balance     NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Farmers: one-to-one with profiles where role = 'farmer'
CREATE TABLE IF NOT EXISTS public.farmers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_name   TEXT NOT NULL,
  location    TEXT NOT NULL,
  description TEXT,
  verified    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;

-- Animals: livestock listings
CREATE TABLE IF NOT EXISTS public.animals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id           UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('cow', 'sheep', 'horse', 'goat', 'camel')),
  price               NUMERIC NOT NULL CHECK (price > 0),
  expected_return_pct NUMERIC NOT NULL CHECK (expected_return_pct BETWEEN 1 AND 100),
  duration_months     INTEGER NOT NULL CHECK (duration_months BETWEEN 1 AND 240),
  status              TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'growing', 'ready', 'sold')),
  image_url           TEXT,
  description         TEXT,
  slots_total         INTEGER NOT NULL CHECK (slots_total BETWEEN 1 AND 100),
  slots_filled        INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

-- Investments: investor <-> animal link
CREATE TABLE IF NOT EXISTS public.investments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  animal_id        UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  amount           NUMERIC NOT NULL CHECK (amount > 0),
  profit_share_pct NUMERIC NOT NULL DEFAULT 70,
  status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  expected_return  NUMERIC NOT NULL,
  actual_return    NUMERIC,
  invested_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'investor')
  );
  IF new.raw_user_meta_data->>'role' = 'farmer' THEN
    INSERT INTO public.farmers (user_id, farm_name, location)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'My Farm'), 'Kazakhstan');
  END IF;
  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Base RLS policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Farmer can read own record"
  ON public.farmers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Farmer can insert own animals"
  ON public.animals FOR INSERT
  WITH CHECK (
    farmer_id = (SELECT id FROM public.farmers WHERE user_id = auth.uid())
  );

CREATE POLICY "Farmer can update own animals"
  ON public.animals FOR UPDATE
  USING (
    farmer_id = (SELECT id FROM public.farmers WHERE user_id = auth.uid())
  );
