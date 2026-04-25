import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test.local' });
dotenv.config({ path: '.env.local' });

export default async function globalSetup() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing from .env.test.local\n' +
      'Get it from: Supabase dashboard → Settings → API → service_role'
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Reset investor balance to 2,000,000 before test suite
  const { data: investorProfile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', process.env.TEST_INVESTOR_EMAIL!)
    .single();

  if (error || !investorProfile) {
    throw new Error(
      `Investor test user "${process.env.TEST_INVESTOR_EMAIL}" not found in DB.\n` +
      'Sign up at /en/signup with role=investor first.'
    );
  }

  await supabase
    .from('profiles')
    .update({ balance: 2_000_000 })
    .eq('id', investorProfile.id);

  // Verify farmer exists
  const { data: farmerProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', process.env.TEST_FARMER_EMAIL!)
    .single();

  if (!farmerProfile) {
    throw new Error(
      `Farmer test user "${process.env.TEST_FARMER_EMAIL}" not found in DB.\n` +
      'Sign up at /en/signup with role=farmer first.'
    );
  }

  const { data: farmerRecord } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', farmerProfile.id)
    .single();

  if (!farmerRecord) {
    throw new Error(
      'Farmer profile found in profiles but no row in farmers table.\n' +
      'Run migration 004_role_tables.sql in Supabase SQL Editor.'
    );
  }

  // Clean up any leftover playwright test animals from previous runs
  await supabase
    .from('animals')
    .delete()
    .eq('farmer_id', farmerRecord.id)
    .eq('name', 'PlaywrightTestCow');

  console.log('✓ Global setup: investor balance reset to ₸2,000,000');
  console.log('✓ Global setup: farmer record verified');
}
