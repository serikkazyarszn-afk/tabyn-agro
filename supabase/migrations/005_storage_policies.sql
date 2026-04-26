-- Create the animal-images storage bucket (public reads, auth uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-images', 'animal-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to make re-runnable
DROP POLICY IF EXISTS "Public can read animal images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can upload animal images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can delete own animal images" ON storage.objects;

-- Anyone can read (public bucket, but policy is belt-and-suspenders)
CREATE POLICY "Public can read animal images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'animal-images');

-- Authenticated users (farmers) can upload
CREATE POLICY "Farmers can upload animal images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'animal-images');

-- Authenticated users can delete their own uploads
CREATE POLICY "Farmers can delete own animal images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'animal-images' AND auth.uid() = owner);
