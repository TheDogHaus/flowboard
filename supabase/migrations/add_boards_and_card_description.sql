-- Multi-board support: boards table, card description, cards belong to a board.
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index boards_created_by_idx on public.boards (created_by);

alter table public.boards enable row level security;
create policy "Signed-in users can read boards"
  on public.boards for select to authenticated using (true);
create policy "Signed-in users can create boards"
  on public.boards for insert to authenticated with check (created_by = (select auth.uid()));
create policy "Signed-in users can update boards"
  on public.boards for update to authenticated using (true) with check (true);
create policy "Signed-in users can delete boards"
  on public.boards for delete to authenticated using (true);

alter table public.cards
  add column description text not null default '' check (char_length(description) <= 2000),
  add column board_id uuid references public.boards (id) on delete cascade;

-- Back-fill: existing cards move onto a default board.
with b as (insert into public.boards (name) values ('Flowboard') returning id)
update public.cards set board_id = (select id from b);

alter table public.cards alter column board_id set not null;
create index cards_board_id_idx on public.cards (board_id, col, position);

alter publication supabase_realtime add table public.boards;
