-- EXCELLENCIA COLLÈGE RIZIKI — industrialisation v1
-- Réexécutable dans Supabase SQL Editor, sans suppression de données.

create table if not exists public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 70),
  body text not null check (char_length(body) between 1 and 180),
  audience text not null default 'public' check (audience in ('public','maternelle','primaire','secondaire')),
  url text not null default '/communiques/',
  status text not null default 'scheduled' check (status in ('scheduled','processing','sent','failed','cancelled')),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  sent_count integer,
  error_message text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_jobs enable row level security;
drop policy if exists "authorized staff reads notification jobs" on public.notification_jobs;
create policy "authorized staff reads notification jobs" on public.notification_jobs for select to authenticated using (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication')
);
drop policy if exists "authorized staff creates notification jobs" on public.notification_jobs;
create policy "authorized staff creates notification jobs" on public.notification_jobs for insert to authenticated with check (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication') and created_by=auth.uid()
);
drop policy if exists "authorized staff cancels notification jobs" on public.notification_jobs;
create policy "authorized staff cancels notification jobs" on public.notification_jobs for update to authenticated using (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication')
) with check (
  public.current_user_role() in ('admin_systeme','direction','gestionnaire','communication')
);

create index if not exists notification_jobs_due_idx on public.notification_jobs(status,scheduled_for);

-- Les abonnements existants « public » signifient « toutes les informations ».
update public.push_subscriptions set audience='public' where audience is null or audience='';

-- Autoriser des vidéos Web raisonnablement compressées (50 Mo maximum).
update storage.buckets
set file_size_limit=52428800,
    allowed_mime_types=array['image/jpeg','image/png','image/webp','video/mp4']
where id='school-media';

