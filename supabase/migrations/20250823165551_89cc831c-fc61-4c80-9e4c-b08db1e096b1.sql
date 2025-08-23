-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_action_type TEXT,
  p_cost INT
)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INT,
  p_source TEXT
)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;