-- =====================================================================================
-- Portfolio admin page: database and picture folder for Supabase.
--
-- HOW TO USE: Supabase dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- It is safe to run again. Then add your login (see README, "Admin page: setting it up").
-- =====================================================================================

-- ---------- The content (one row holding everything the portfolio says) ----------
create table if not exists public.portfolio (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.portfolio (id) values (1) on conflict (id) do nothing;
alter table public.portfolio enable row level security;

-- ---------- Who may edit: the emails in this list ----------
-- Nobody can read or change this list through the website; only here in the SQL Editor.
create table if not exists public.portfolio_admins (
  email text primary key
);
alter table public.portfolio_admins enable row level security;

create or replace function public.is_portfolio_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.portfolio_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Everyone can read the portfolio (it is your public website); only admins can change it.
drop policy if exists "portfolio is public" on public.portfolio;
create policy "portfolio is public" on public.portfolio for select using (true);
drop policy if exists "admins edit the portfolio" on public.portfolio;
create policy "admins edit the portfolio" on public.portfolio for update to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- ---------- Picture folder ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins upload portfolio pictures" on storage.objects;
create policy "admins upload portfolio pictures" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());
drop policy if exists "admins change portfolio pictures" on storage.objects;
create policy "admins change portfolio pictures" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());
drop policy if exists "admins delete portfolio pictures" on storage.objects;
create policy "admins delete portfolio pictures" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin());

-- ---------- Your email as the admin ----------
-- Change the email if you log in with a different one. To add another person, run this line with their email.
insert into public.portfolio_admins (email) values ('cashiousofori123@gmail.com') on conflict do nothing;
