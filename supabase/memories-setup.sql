create table if not exists public.travel_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  photo_url text not null,
  taken_on date not null,
  location text not null check (char_length(location) between 1 and 80),
  comment text check (comment is null or char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.travel_memories
  alter column taken_on drop not null,
  alter column location drop not null;

alter table public.travel_memories
  add column if not exists author_name text;

alter table public.travel_memories
  add column if not exists thumbnail_path text;

update public.travel_memories t
set author_name = u.email
from auth.users u
where t.user_id = u.id
  and t.author_name is null;

create index if not exists travel_memories_user_taken_on_idx
  on public.travel_memories (user_id, taken_on desc);

create or replace function public.set_travel_memories_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_travel_memories_updated_at on public.travel_memories;
create trigger set_travel_memories_updated_at
before update on public.travel_memories
for each row execute function public.set_travel_memories_updated_at();

alter table public.travel_memories enable row level security;

drop policy if exists "Users can view their own memories" on public.travel_memories;
drop policy if exists "Authenticated users can view memories" on public.travel_memories;
create policy "Authenticated users can view memories"
on public.travel_memories for select
to authenticated
using (true);

drop policy if exists "Users can create their own memories" on public.travel_memories;
create policy "Users can create their own memories"
on public.travel_memories for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own memories" on public.travel_memories;
create policy "Users can update their own memories"
on public.travel_memories for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own memories" on public.travel_memories;
create policy "Users can delete their own memories"
on public.travel_memories for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.travel_memories to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memories', 'memories', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can view their own memory photos" on storage.objects;
drop policy if exists "Authenticated users can view memory photos" on storage.objects;
create policy "Authenticated users can view memory photos"
on storage.objects for select
to authenticated
using (bucket_id = 'memories');

drop policy if exists "Users can upload their own memory photos" on storage.objects;
create policy "Users can upload their own memory photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can update their own memory photos" on storage.objects;
create policy "Users can update their own memory photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can delete their own memory photos" on storage.objects;
create policy "Users can delete their own memory photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'memories'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);