-- Extend role check constraint to include admin
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('investor', 'farmer', 'admin'));

-- Security-definer helper avoids RLS infinite recursion when policies check role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin: read all profiles (to list users)
CREATE POLICY "Admin can read all profiles"
  ON public.profiles FOR SELECT
  USING (get_my_role() = 'admin');

-- Admin: update any profile (to change roles)
CREATE POLICY "Admin can update profiles"
  ON public.profiles FOR UPDATE
  USING (get_my_role() = 'admin');

-- Admin: read all farmers (to verify)
CREATE POLICY "Admin can read all farmers"
  ON public.farmers FOR SELECT
  USING (get_my_role() = 'admin');

-- Admin: update any farmer (toggle verified)
CREATE POLICY "Admin can update farmers"
  ON public.farmers FOR UPDATE
  USING (get_my_role() = 'admin');

-- Admin: read all animals
CREATE POLICY "Admin can read all animals"
  ON public.animals FOR SELECT
  USING (get_my_role() = 'admin');

-- Admin: delete any animal listing
CREATE POLICY "Admin can delete animals"
  ON public.animals FOR DELETE
  USING (get_my_role() = 'admin');

-- Admin: read all investments
CREATE POLICY "Admin can read all investments"
  ON public.investments FOR SELECT
  USING (get_my_role() = 'admin');
