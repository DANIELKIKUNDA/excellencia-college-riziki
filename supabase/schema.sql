-- EXCELLENCIA COLLÈGE RIZIKI — schéma Supabase v5
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  service text,
  role text not null default 'staff' check (role in ('staff','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','in_progress','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  image_path text,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'public',
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  audience text not null default 'public',
  user_agent text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.contact_messages enable row level security;
alter table public.news enable row level security;
alter table public.announcements enable row level security;
alter table public.push_subscriptions enable row level security;

-- Un membre du personnel ne peut lire que son propre profil.
drop policy if exists "staff reads own profile" on public.profiles;
create policy "staff reads own profile" on public.profiles for select to authenticated using (id = auth.uid());

-- Les visiteurs peuvent uniquement envoyer un message public.
drop policy if exists "public can send messages" on public.contact_messages;
create policy "public can send messages" on public.contact_messages for insert to anon with check (true);

-- Les responsables voient seulement leur service ; l'administrateur voit tout.
drop policy if exists "staff can read messages" on public.contact_messages;
create policy "staff can read messages" on public.contact_messages for select to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.service = contact_messages.service)
  )
);

drop policy if exists "staff can update messages" on public.contact_messages;
create policy "staff can update messages" on public.contact_messages for update to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.service = contact_messages.service)
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.service = contact_messages.service)
  )
);

-- Contenus publiés visibles publiquement.
drop policy if exists "public reads published news" on public.news;
create policy "public reads published news" on public.news for select to anon using (published = true);
drop policy if exists "public reads published announcements" on public.announcements;
create policy "public reads published announcements" on public.announcements for select to anon using (published = true);

-- Seuls les administrateurs publient les communications officielles.
drop policy if exists "staff manages news" on public.news;
create policy "staff manages news" on public.news for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "staff manages announcements" on public.announcements;
create policy "staff manages announcements" on public.announcements for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- push_subscriptions n'est jamais lu directement par le navigateur.
-- Le serveur utilise uniquement SUPABASE_SERVICE_ROLE_KEY pour l'enregistrement et l'envoi.

-- V8: les fonctions Edge utilisent la service_role pour les abonnements Push.
-- Les navigateurs n'ont aucune politique directe sur push_subscriptions.
