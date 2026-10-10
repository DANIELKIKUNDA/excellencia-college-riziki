-- EXCELLENCIA COLLÈGE RIZIKI — finalisation dynamique et rôles
-- Script réexécutable dans Supabase SQL Editor.

alter table public.profiles add column if not exists active boolean not null default true;
alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'admin_systeme' where role = 'system_admin';
update public.profiles set role = 'gestionnaire' where role = 'manager';
alter table public.profiles add constraint profiles_role_check check (role in (
  'admin_systeme','direction','gestionnaire','prefecture','directeur_etudes',
  'discipline','secretariat','direction_primaire','communication'
));

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path=public
as $$ select role from public.profiles where id=auth.uid() and active=true $$;

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  school_name text not null,
  motto text not null,
  address text not null,
  email text not null,
  website text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.school_services (
  id text primary key,
  label text not null,
  person_name text not null,
  phone text,
  whatsapp text,
  alternate_phone text,
  sort_order integer not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  platform text primary key check (platform in ('youtube','facebook','tiktok','instagram')),
  url text,
  active boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_type text not null check (media_type in ('photo','youtube','tiktok','video_link')),
  url text not null,
  service text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages add column if not exists student_name text;
alter table public.contact_messages add column if not exists student_class text;

insert into public.site_settings(id,school_name,motto,address,email,website) values
  (true,'EXCELLENCIA COLLÈGE RIZIKI','Discipline, Travail, Excellence','Avenue College Masombo n°23, quartier Hewa Bora, commune Kampempa','excellenciacollegeriziki@gmail.com','https://excellenciariziki.com')
on conflict (id) do nothing;

insert into public.school_services(id,label,person_name,phone,whatsapp,alternate_phone,sort_order) values
 ('direction','Directeur','Kito','0978054238','243978054238',null,10),
 ('secretariat','Secrétaire','Fanny','0977872797','243977872797',null,20),
 ('prefecture','Préfet','Kikunda Ngwej Daniel','0977712959','243977712959',null,30),
 ('directeur-etudes','Directeur des études','Yumba Wa Nkulu Alphonse','0853888405','243853888405',null,40),
 ('administration','Gestionnaire de l’école','Fofana Chansa','0961247956','243961247956',null,50),
 ('discipline','Directeur de discipline','Katumbe Élisée','0976869675','243976869675',null,60),
 ('coordonnateur','Coordonnateur','Abbé Jean','+393208455568','393208455568','0834760032',70)
on conflict (id) do nothing;

insert into public.social_links(platform,url,active) values
 ('youtube',null,false),('facebook',null,false),('tiktok',null,false),('instagram',null,false)
on conflict (platform) do nothing;

alter table public.site_settings enable row level security;
alter table public.school_services enable row level security;
alter table public.social_links enable row level security;
alter table public.media_items enable row level security;

drop policy if exists "public reads site settings" on public.site_settings;
create policy "public reads site settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "public reads active services" on public.school_services;
create policy "public reads active services" on public.school_services for select to anon, authenticated using (active or public.current_user_role() = 'admin_systeme');
drop policy if exists "public reads active socials" on public.social_links;
create policy "public reads active socials" on public.social_links for select to anon, authenticated using (active or public.current_user_role() = 'admin_systeme');
drop policy if exists "public reads published media" on public.media_items;
create policy "public reads published media" on public.media_items for select to anon, authenticated using (published or public.current_user_role() in ('admin_systeme','communication','direction','gestionnaire'));

drop policy if exists "admin manages settings" on public.site_settings;
create policy "admin manages settings" on public.site_settings for all to authenticated using (public.current_user_role()='admin_systeme') with check (public.current_user_role()='admin_systeme');
drop policy if exists "admin manages services" on public.school_services;
create policy "admin manages services" on public.school_services for all to authenticated using (public.current_user_role()='admin_systeme') with check (public.current_user_role()='admin_systeme');
drop policy if exists "admin manages socials" on public.social_links;
create policy "admin manages socials" on public.social_links for all to authenticated using (public.current_user_role()='admin_systeme') with check (public.current_user_role()='admin_systeme');
drop policy if exists "authorized staff manages media" on public.media_items;
create policy "authorized staff manages media" on public.media_items for all to authenticated using (public.current_user_role() in ('admin_systeme','communication','direction','gestionnaire')) with check (public.current_user_role() in ('admin_systeme','communication','direction','gestionnaire'));

-- Messages : chaque service ne voit que son propre courrier ; direction et admin voient tout.
drop policy if exists "staff can read messages" on public.contact_messages;
create policy "staff can read messages" on public.contact_messages for select to authenticated using (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire') or
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.active and p.service=contact_messages.service)
);
drop policy if exists "staff can update messages" on public.contact_messages;
create policy "staff can update messages" on public.contact_messages for update to authenticated using (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire') or
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.active and p.service=contact_messages.service)
) with check (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire') or
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.active and p.service=contact_messages.service)
);

drop policy if exists "staff manages news" on public.news;
create policy "staff manages news" on public.news for all to authenticated using (public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication')) with check (public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication'));
drop policy if exists "staff manages announcements" on public.announcements;
create policy "staff manages announcements" on public.announcements for all to authenticated using (public.current_user_role() in ('admin_systeme','direction','gestionnaire','prefecture','directeur_etudes','discipline','secretariat','direction_primaire','communication')) with check (public.current_user_role() in ('admin_systeme','direction','gestionnaire','prefecture','directeur_etudes','discipline','secretariat','direction_primaire','communication'));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('school-media','school-media',true,10485760,array['image/jpeg','image/png','image/webp','video/mp4'])
on conflict (id) do nothing;
drop policy if exists "public reads school media" on storage.objects;
create policy "public reads school media" on storage.objects for select using (bucket_id='school-media');
drop policy if exists "authorized staff uploads school media" on storage.objects;
create policy "authorized staff uploads school media" on storage.objects for insert to authenticated with check (bucket_id='school-media' and public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication'));
drop policy if exists "authorized staff updates school media" on storage.objects;
create policy "authorized staff updates school media" on storage.objects for update to authenticated using (bucket_id='school-media' and public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication'));
drop policy if exists "authorized staff deletes school media" on storage.objects;
create policy "authorized staff deletes school media" on storage.objects for delete to authenticated using (bucket_id='school-media' and public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication'));
