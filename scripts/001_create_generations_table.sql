-- Create generations table to store AI-generated startup ideas
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_input text not null,
  startup_name text not null,
  tagline text not null,
  description text not null,
  target_audience text not null,
  key_features jsonb not null default '[]'::jsonb,
  color_scheme jsonb not null default '{}'::jsonb,
  landing_page_html text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.generations enable row level security;

-- RLS Policies for generations table
create policy "Users can view their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own generations"
  on public.generations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own generations"
  on public.generations for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists generations_user_id_idx on public.generations(user_id);
create index if not exists generations_created_at_idx on public.generations(created_at desc);
