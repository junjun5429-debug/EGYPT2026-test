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

create table if not exists public.travel_members (
  nickname text primary key check (lower(nickname) in ('junpei', 'kazuki', 'takuya')),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.travel_members enable row level security;
revoke all on public.travel_members from anon, authenticated;

create or replace function public.is_travel_member_registered(member_nickname text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when lower(member_nickname) in ('junpei', 'kazuki', 'takuya') then exists (
      select 1 from public.travel_members where nickname = lower(member_nickname)
    )
    else false
  end;
$$;

create or replace function public.claim_travel_member()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  member_nickname text := lower(auth.jwt() -> 'user_metadata' ->> 'name');
begin
  if auth.uid() is null or member_nickname not in ('junpei', 'kazuki', 'takuya') then
    return false;
  end if;

  insert into public.travel_members (nickname, user_id)
  values (member_nickname, auth.uid())
  on conflict (nickname) do nothing;

  return exists (
    select 1
    from public.travel_members
    where nickname = member_nickname and user_id = auth.uid()
  );
end;
$$;

revoke all on function public.is_travel_member_registered(text) from public;
revoke all on function public.claim_travel_member() from public;
grant execute on function public.is_travel_member_registered(text) to anon, authenticated;
grant execute on function public.claim_travel_member() to authenticated;

create or replace function public.current_travel_member_nickname()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select nickname
  from public.travel_members
  where user_id = auth.uid();
$$;

revoke all on function public.current_travel_member_nickname() from public;
grant execute on function public.current_travel_member_nickname() to authenticated;

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
using ((select public.current_travel_member_nickname()) is not null);

drop policy if exists "Users can create their own memories" on public.travel_memories;
create policy "Users can create their own memories"
on public.travel_memories for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and lower(author_name) = (select public.current_travel_member_nickname())
);

drop policy if exists "Users can update their own memories" on public.travel_memories;
create policy "Users can update their own memories"
on public.travel_memories for update
to authenticated
using (
  lower(author_name) = (select public.current_travel_member_nickname())
)
with check (
  lower(author_name) = (select public.current_travel_member_nickname())
);

drop policy if exists "Users can delete their own memories" on public.travel_memories;
create policy "Users can delete their own memories"
on public.travel_memories for delete
to authenticated
using (
  lower(author_name) = (select public.current_travel_member_nickname())
);

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
using (
  bucket_id = 'memories'
  and (select public.current_travel_member_nickname()) is not null
);

drop policy if exists "Users can upload their own memory photos" on storage.objects;
create policy "Users can upload their own memory photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'memories'
  and (select public.current_travel_member_nickname()) is not null
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can update their own memory photos" on storage.objects;
create policy "Users can update their own memory photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'memories'
  and (select public.current_travel_member_nickname()) is not null
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or exists (
      select 1
      from public.travel_memories m
      where lower(m.author_name) = (select public.current_travel_member_nickname())
        and (m.storage_path = name or m.thumbnail_path = name)
    )
  )
)
with check (
  bucket_id = 'memories'
  and (select public.current_travel_member_nickname()) is not null
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or exists (
      select 1
      from public.travel_memories m
      where lower(m.author_name) = (select public.current_travel_member_nickname())
        and (m.storage_path = name or m.thumbnail_path = name)
    )
  )
);

drop policy if exists "Users can delete their own memory photos" on storage.objects;
create policy "Users can delete their own memory photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'memories'
  and (select public.current_travel_member_nickname()) is not null
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or exists (
      select 1
      from public.travel_memories m
      where lower(m.author_name) = (select public.current_travel_member_nickname())
        and (m.storage_path = name or m.thumbnail_path = name)
    )
  )
);