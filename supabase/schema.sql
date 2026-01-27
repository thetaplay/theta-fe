-- Supabase schema for events
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  slug text unique,
  title text not null,
  category text not null,
  date text,
  question text,
  impact text,
  icon text,
  why_it_matters jsonb default '[]'::jsonb,
  description text,
  end_at timestamptz,
  photo_url text,
  status text check (status in ('ongoing','completed','draft')) default 'ongoing',
  created_at timestamptz default now()
);

-- Example seed data
insert into public.events (slug, title, category, date, question, impact, icon, why_it_matters)
values
('fomc-rate-decision', 'Federal Reserve Rate Decision', 'Economic Events', 'Jan 29, 2:00 PM EST', 'Will the Fed raise interest rates?', 'High', 'ChartLineUptrendXyaxis', '["Affects mortgage rates and borrowing costs","Could impact stock and bond markets","Inflation control policy indicator","Global economic sentiment driver"]'),
('bitcoin-halving', 'Bitcoin Halving Event', 'Crypto Events', 'Feb 15, 12:00 AM UTC', 'How will Bitcoin price react?', 'High', 'BoltFill', '["Supply of new Bitcoin will be cut in half","Historical catalyst for price movements","Impact on mining economics","Broader crypto market sentiment"]'),
('apple-q1-earnings', 'Apple Q1 Earnings Report', 'Web3', 'Jan 30, 4:30 PM EST', 'Will Apple beat earnings estimates?', 'Medium', 'DollarsignCircleFill', '["Major indicator of tech sector health","Affects AAPL stock and market indices","Consumer spending trends signal","Guidance for next quarter important"]')
on conflict (slug) do nothing;
