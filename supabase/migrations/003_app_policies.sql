-- Drop existing policies first to make this script re-runnable
DROP POLICY IF EXISTS "Authenticated can read animals" ON public.animals;
DROP POLICY IF EXISTS "Anyone can read animals" ON public.animals;
DROP POLICY IF EXISTS "Farmer can insert own animals" ON public.animals;
DROP POLICY IF EXISTS "Farmer can update own animals" ON public.animals;
DROP POLICY IF EXISTS "Investor can read own investments" ON public.investments;
DROP POLICY IF EXISTS "Farmer can read investments on own animals" ON public.investments;

-- RLS: anyone (including guests) can read animal listings — public marketplace
CREATE POLICY "Anyone can read animals"
  ON public.animals FOR SELECT
  USING (true);

-- RLS: farmer can insert animals linked to their farmer record
CREATE POLICY "Farmer can insert own animals"
  ON public.animals FOR INSERT
  WITH CHECK (farmer_id = (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

-- RLS: farmer can update their own animals (status changes etc.)
CREATE POLICY "Farmer can update own animals"
  ON public.animals FOR UPDATE
  USING (farmer_id = (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

-- RLS: investor can read their own investments
CREATE POLICY "Investor can read own investments"
  ON public.investments FOR SELECT
  USING (investor_id = auth.uid());

-- RLS: farmer can read investments on animals they own (for future stats)
CREATE POLICY "Farmer can read investments on own animals"
  ON public.investments FOR SELECT
  USING (
    animal_id IN (
      SELECT id FROM public.animals
      WHERE farmer_id = (SELECT id FROM public.farmers WHERE user_id = auth.uid())
    )
  );

-- Atomic investment transaction: checks balance + slots, inserts record, deducts balance
CREATE OR REPLACE FUNCTION public.create_investment(
  p_animal_id UUID,
  p_amount    NUMERIC
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_investor_id     UUID    := auth.uid();
  v_balance         NUMERIC;
  v_slots_filled    INT;
  v_slots_total     INT;
  v_status          TEXT;
  v_return_pct      NUMERIC;
  v_expected_return NUMERIC;
  v_inv_id          UUID;
BEGIN
  -- Lock the animal row to prevent simultaneous over-booking
  SELECT slots_filled, slots_total, status, expected_return_pct
  INTO   v_slots_filled, v_slots_total, v_status, v_return_pct
  FROM   public.animals
  WHERE  id = p_animal_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Animal not found');
  END IF;

  IF v_status != 'available' THEN
    RETURN json_build_object('error', 'Animal is not available for investment');
  END IF;

  IF v_slots_filled >= v_slots_total THEN
    RETURN json_build_object('error', 'No slots remaining');
  END IF;

  -- Lock investor profile row
  SELECT balance INTO v_balance
  FROM   public.profiles
  WHERE  id = v_investor_id
  FOR UPDATE;

  IF v_balance < p_amount THEN
    RETURN json_build_object('error', 'Insufficient balance');
  END IF;

  v_expected_return := p_amount * (1 + v_return_pct / 100.0);

  INSERT INTO public.investments
    (investor_id, animal_id, amount, profit_share_pct, status, expected_return)
  VALUES
    (v_investor_id, p_animal_id, p_amount, 70, 'active', v_expected_return)
  RETURNING id INTO v_inv_id;

  UPDATE public.profiles
  SET    balance = balance - p_amount
  WHERE  id = v_investor_id;

  UPDATE public.animals
  SET    slots_filled = slots_filled + 1
  WHERE  id = p_animal_id;

  RETURN json_build_object('success', true, 'investment_id', v_inv_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_investment TO authenticated;
