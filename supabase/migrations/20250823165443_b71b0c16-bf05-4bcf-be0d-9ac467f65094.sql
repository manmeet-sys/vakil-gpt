-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_credits INT NOT NULL DEFAULT 200, -- Start with 200 free credits
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT CHECK (
    action_type IN ('chat_free', 'doc_analysis', 'case_law', 'drafting', 'research', 'bulk_export', 'topup', 'subscription')
  ),
  credits_used INT NOT NULL,
  balance_after INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_name TEXT UNIQUE NOT NULL,
  monthly_credits INT NOT NULL,
  price_in_inr INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Default subscription plans
INSERT INTO subscription_plans (plan_name, monthly_credits, price_in_inr)
VALUES
  ('Free', 200, 0),
  ('Intro', 5000, 50),
  ('Basic', 15000, 299),
  ('Pro', 75000, 1499)
ON CONFLICT (plan_name) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallet" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON wallets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" ON wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscription plans (public read)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
  FOR SELECT USING (true);

-- RPC Function: Deduct Credits
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_action_type TEXT,
  p_cost INT
)
RETURNS VOID AS $$
DECLARE
  v_balance INT;
BEGIN
  -- Skip deduction if action is free chatbot
  IF p_action_type = 'chat_free' THEN
    INSERT INTO transactions (user_id, action_type, credits_used, balance_after)
    VALUES (p_user_id, 'chat_free', 0, (SELECT current_credits FROM wallets WHERE user_id = p_user_id));
    RETURN;
  END IF;

  -- Get current balance
  SELECT current_credits INTO v_balance FROM wallets WHERE user_id = p_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;

  IF v_balance < p_cost THEN
    RAISE EXCEPTION 'Insufficient credits. Current balance: %, required: %', v_balance, p_cost;
  END IF;

  -- Deduct credits
  UPDATE wallets
  SET current_credits = current_credits - p_cost,
      last_updated = now()
  WHERE user_id = p_user_id;

  -- Insert transaction log
  INSERT INTO transactions (user_id, action_type, credits_used, balance_after)
  VALUES (p_user_id, p_action_type, p_cost, v_balance - p_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Add Credits
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INT,
  p_source TEXT
)
RETURNS VOID AS $$
DECLARE
  v_balance INT;
BEGIN
  -- Get current balance
  SELECT current_credits INTO v_balance FROM wallets WHERE user_id = p_user_id FOR UPDATE;

  IF v_balance IS NULL THEN
    -- Create wallet if it doesn't exist
    INSERT INTO wallets (user_id, current_credits)
    VALUES (p_user_id, p_amount)
    ON CONFLICT (user_id) DO UPDATE SET 
      current_credits = wallets.current_credits + p_amount,
      last_updated = now();
    
    v_balance := 0;
  ELSE
    -- Add credits
    UPDATE wallets
    SET current_credits = current_credits + p_amount,
        last_updated = now()
    WHERE user_id = p_user_id;
  END IF;

  -- Log transaction
  INSERT INTO transactions (user_id, action_type, credits_used, balance_after)
  VALUES (p_user_id, p_source, -p_amount, v_balance + p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize wallet for new users
CREATE OR REPLACE FUNCTION initialize_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id, current_credits)
  VALUES (NEW.id, 200)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallet when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_wallet();