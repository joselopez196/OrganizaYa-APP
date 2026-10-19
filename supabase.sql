-- Mi sistema: tabla para sincronizar entre dispositivos.
-- Pégalo en Supabase > SQL Editor > New query > Run. Se puede ejecutar más de una vez sin problema.
create table if not exists public.ms_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state text not null,
  updated_at timestamptz not null default now()
);
alter table public.ms_state enable row level security;
drop policy if exists ms_select on public.ms_state;
drop policy if exists ms_insert on public.ms_state;
drop policy if exists ms_update on public.ms_state;
drop policy if exists ms_delete on public.ms_state;
create policy ms_select on public.ms_state for select to authenticated using (auth.uid() = user_id);
create policy ms_insert on public.ms_state for insert to authenticated with check (auth.uid() = user_id);
create policy ms_update on public.ms_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy ms_delete on public.ms_state for delete to authenticated using (auth.uid() = user_id);
