-- USERS PROFILE (attach to your auth.users via user_id UUID)
create table if not exists public.user_profiles (
  user_id uuid primary key,
  tool_credits int not null default 200,             -- wallet for tools/research
  free_chat_quota int not null default 20,           -- total free chats
  free_chat_used int not null default 0,             -- consumed free chats
  onboarding_bonus_given boolean not null default true,  -- already seeded at signup
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- WALLET TRANSACTIONS (auditable; positive=credit, negative=debit)
create table if not exists public.wallet_tx (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  amount int not null,                     -- +100 credit, -10 debit
  purpose text not null,                   -- 'topup' | 'tool' | 'adjustment' | 'refund' | 'bonus'
  tool_name text,                          -- e.g., 'hybrid_retrieval', 'pdf_ingest'
  meta jsonb default '{}'::jsonb,
  idempotency_key text,                    -- to prevent double-charging
  created_at timestamptz not null default now()
);

create unique index if not exists wallet_tx_idem_idx on public.wallet_tx(user_id, idempotency_key) where idempotency_key is not null;

-- TOOL USAGE LOG (what ran, cost, latency, model costs if you track)
create table if not exists public.tool_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  tool_name text not null,
  credits_charged int not null default 0,
  input_tokens int default 0,
  output_tokens int default 0,
  latency_ms int default 0,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- RLS (simplest: readable by owner; wallet updates via RPC only)
alter table public.user_profiles enable row level security;
alter table public.wallet_tx enable row level security;
alter table public.tool_usage enable row level security;

create policy "profiles_owner_read" on public.user_profiles
for select using (auth.uid() = user_id);

create policy "usage_owner_read" on public.tool_usage
for select using (auth.uid() = user_id);

create policy "tx_owner_read" on public.wallet_tx
for select using (auth.uid() = user_id);

-- SAFE DEBIT RPC (atomic, idempotent)
create or replace function public.debit_tool_credits(
  p_user uuid,
  p_amount int,
  p_tool_name text,
  p_meta jsonb default '{}'::jsonb,
  p_idempotency_key text default null
) returns table (ok boolean, new_balance int, tx_id uuid)
language plpgsql
security definer
as $$
declare
  cur_balance int;
  existing_tx uuid;
begin
  if p_amount <= 0 then
    raise exception 'Debit amount must be positive';
  end if;

  -- Idempotency: if a tx with same key exists, return success with current balance
  if p_idempotency_key is not null then
    select id into existing_tx from public.wallet_tx
    where user_id = p_user and idempotency_key = p_idempotency_key limit 1;
    if existing_tx is not null then
      select tool_credits into cur_balance from public.user_profiles where user_id = p_user;
      return query select true, cur_balance, existing_tx; 
      return;
    end if;
  end if;

  -- check balance & update atomically
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

-- CREDIT RPC (topups/bonuses/refunds)
create or replace function public.credit_wallet(
  p_user uuid, p_amount int, p_purpose text default 'bonus', p_meta jsonb default '{}'::jsonb
) returns table (new_balance int)
language plpgsql
security definer
as $$
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

-- FREE CHAT CONSUMPTION RPC (enforce trial chats)
create or replace function public.consume_free_chat(p_user uuid)
returns table (ok boolean, remaining int)
language plpgsql
security definer
as $$
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