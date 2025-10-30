-- Fix 1: Remove public read access to profiles table
-- This fixes PUBLIC_DATA_EXPOSURE and SECRETS_EXPOSED issues
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Fix 2: Add search_path to all SECURITY DEFINER functions
-- First drop the existing function to allow parameter name changes

DROP FUNCTION IF EXISTS public.debit_tool_credits(uuid, integer, text, jsonb, text);

-- Recreate with search_path protection
CREATE FUNCTION public.debit_tool_credits(
  p_user uuid,
  p_amount integer,
  p_tool_name text,
  p_meta jsonb DEFAULT '{}'::jsonb,
  p_idempotency_key text DEFAULT NULL
)
RETURNS TABLE(ok boolean, new_balance integer, tx_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  cur_balance int;
  existing_tx uuid;
begin
  if p_amount <= 0 then
    raise exception 'Debit amount must be positive';
  end if;

  -- Idempotency check
  if p_idempotency_key is not null then
    select id into existing_tx from public.wallet_tx
    where user_id = p_user and idempotency_key = p_idempotency_key limit 1;
    if existing_tx is not null then
      select tool_credits into cur_balance from public.user_profiles where user_id = p_user;
      return query select true, cur_balance, existing_tx; 
      return;
    end if;
  end if;

  -- Check balance & update atomically
  update public.user_profiles
     set tool_credits = tool_credits - p_amount,
         updated_at = now()
   where user_id = p_user
     and tool_credits >= p_amount
  returning tool_credits into cur_balance;

  if cur_balance is null then
    return query select false, null::int, null::uuid;
    return;
  end if;

  insert into public.wallet_tx (user_id, amount, purpose, tool_name, meta, idempotency_key)
  values (p_user, -p_amount, 'tool', p_tool_name, p_meta, p_idempotency_key)
  returning id into existing_tx;

  return query select true, cur_balance, existing_tx;
end $$;

-- Fix credit_wallet function
DROP FUNCTION IF EXISTS public.credit_wallet(uuid, integer, text, jsonb);

CREATE FUNCTION public.credit_wallet(
  p_user uuid,
  p_amount integer,
  p_purpose text DEFAULT 'bonus',
  p_meta jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(new_balance integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare cur_balance int;
begin
  if p_amount <= 0 then
    raise exception 'Credit amount must be positive';
  end if;

  update public.user_profiles
     set tool_credits = tool_credits + p_amount,
         updated_at = now()
   where user_id = p_user
  returning tool_credits into cur_balance;

  insert into public.wallet_tx (user_id, amount, purpose, meta)
  values (p_user, p_amount, p_purpose, p_meta);

  return query select cur_balance;
end $$;

-- Fix consume_free_chat function
DROP FUNCTION IF EXISTS public.consume_free_chat(uuid);

CREATE FUNCTION public.consume_free_chat(p_user uuid)
RETURNS TABLE(ok boolean, remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare rem int;
begin
  update public.user_profiles
     set free_chat_used = free_chat_used + 1,
         updated_at = now()
   where user_id = p_user
     and free_chat_used < free_chat_quota
  returning (free_chat_quota - free_chat_used) into rem;

  if rem is null then
    return query select false, 0;
  end if;

  return query select true, rem;
end $$;

-- Fix add_credits function
DROP FUNCTION IF EXISTS public.add_credits(uuid, integer, text);

CREATE FUNCTION public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_source text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INT;
BEGIN
  SELECT current_credits INTO v_balance FROM wallets WHERE user_id = p_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    INSERT INTO wallets (user_id, current_credits) VALUES (p_user_id, p_amount);
    v_balance := 0;
  ELSE
    UPDATE wallets SET current_credits = current_credits + p_amount, last_updated = now() WHERE user_id = p_user_id;
  END IF;

  INSERT INTO transactions (user_id, action_type, credits_used, balance_after) VALUES (p_user_id, p_source, -p_amount, v_balance + p_amount);
END;
$$;

-- Fix deduct_credits function
DROP FUNCTION IF EXISTS public.deduct_credits(uuid, text, integer);

CREATE FUNCTION public.deduct_credits(
  p_user_id uuid,
  p_action_type text,
  p_cost integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INT;
BEGIN
  IF p_action_type = 'chat_free' THEN
    INSERT INTO transactions (user_id, action_type, credits_used, balance_after)
    VALUES (p_user_id, 'chat_free', 0, (SELECT COALESCE(current_credits, 0) FROM wallets WHERE user_id = p_user_id));
    RETURN;
  END IF;

  SELECT current_credits INTO v_balance FROM wallets WHERE user_id = p_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    INSERT INTO wallets (user_id, current_credits) VALUES (p_user_id, 200);
    v_balance := 200;
  END IF;

  IF v_balance < p_cost THEN
    RAISE EXCEPTION 'Insufficient credits. Current: %, Required: %', v_balance, p_cost;
  END IF;

  UPDATE wallets SET current_credits = current_credits - p_cost, last_updated = now() WHERE user_id = p_user_id;
  INSERT INTO transactions (user_id, action_type, credits_used, balance_after) VALUES (p_user_id, p_action_type, p_cost, v_balance - p_cost);
END;
$$;

-- Update_conversation_timestamp already has search_path set correctly
-- Handle_new_user already has search_path set correctly