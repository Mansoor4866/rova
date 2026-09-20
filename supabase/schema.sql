-- ==========================================================
-- ROVA PROTOCOL — SUPABASE POSTGRESQL SCHEMA
-- ==========================================================

-- 1. Create Users Table
create table if not exists public.users (
  address text primary key,
  username text not null,
  balance numeric default 1000.0,
  created_at timestamptz default now(),
  last_active timestamptz default now()
);

-- 2. Create Positions / Trade Rounds Table
create table if not exists public.positions (
  id text primary key,
  user_address text references public.users(address) on delete cascade,
  asset_symbol text not null,
  asset_name text not null,
  direction text not null check (direction in ('UP', 'DOWN')),
  amount numeric not null,
  strike_price numeric not null,
  close_price numeric,
  payout_multiplier numeric default 1.90,
  potential_payout numeric not null,
  payout numeric default 0.0,
  duration_seconds integer not null,
  status text default 'ACTIVE' check (status in ('ACTIVE', 'WON', 'LOST')),
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

-- 3. Create Transactions Ledger Table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_address text references public.users(address) on delete cascade,
  type text not null check (type in ('DEPOSIT', 'WITHDRAW', 'TRADE_ENTRY', 'TRADE_PAYOUT')),
  amount numeric not null,
  tx_hash text,
  created_at timestamptz default now()
);

-- 4. Create Daily Leaderboard Table
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  day_date date default current_date,
  user_address text not null,
  username text not null,
  volume numeric default 0.0,
  pnl numeric default 0.0,
  win_rate numeric default 0.0,
  prize numeric default 0.0,
  updated_at timestamptz default now(),
  unique(day_date, user_address)
);

-- 5. Create Platform Stats Table
create table if not exists public.platform_stats (
  key text primary key,
  value numeric not null,
  updated_at timestamptz default now()
);

-- Seed initial platform stats
insert into public.platform_stats (key, value) values
  ('total_positions', 1842),
  ('total_volume', 56420),
  ('total_payouts', 50778),
  ('reward_pool', 1000)
on conflict (key) do nothing;

-- 6. Enable Row Level Security (RLS) & Public Read/Write for demo/testnet
alter table public.users enable row level security;
alter table public.positions enable row level security;
alter table public.transactions enable row level security;
alter table public.leaderboard enable row level security;
alter table public.platform_stats enable row level security;

-- Policies (Allow public access for decentralized protocol demo)
create policy "Allow public all on users" on public.users for all using (true) with check (true);
create policy "Allow public all on positions" on public.positions for all using (true) with check (true);
create policy "Allow public all on transactions" on public.transactions for all using (true) with check (true);
create policy "Allow public all on leaderboard" on public.leaderboard for all using (true) with check (true);
create policy "Allow public all on platform_stats" on public.platform_stats for all using (true) with check (true);

-- Indexes for lightning fast queries
create index if not exists idx_positions_user on public.positions(user_address);
create index if not exists idx_positions_status on public.positions(status);
create index if not exists idx_leaderboard_date on public.leaderboard(day_date);
