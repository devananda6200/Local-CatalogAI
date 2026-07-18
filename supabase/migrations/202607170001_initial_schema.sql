create extension if not exists pgcrypto;

create type public.catalog_theme as enum ('minimal', 'cafe', 'boutique');
create type public.ai_job_status as enum ('pending', 'processing', 'completed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null,
  description text not null default '',
  logo_url text,
  cover_image_url text,
  phone text,
  whatsapp text,
  instagram_url text,
  address text not null default '',
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  opening_hours jsonb not null default '{}'::jsonb,
  theme public.catalog_theme not null default 'minimal',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(12,2) check (price >= 0),
  currency char(3) not null default 'INR',
  category text not null default 'Other',
  image_url text not null default '',
  tags text[] not null default '{}',
  dietary_labels text[] not null default '{}',
  available boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  status public.ai_job_status not null default 'pending',
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index businesses_owner_id_idx on public.businesses(owner_id);
create unique index businesses_one_per_owner_idx on public.businesses(owner_id);
create index businesses_published_slug_idx on public.businesses(slug) where published = true;
create index products_business_sort_idx on public.products(business_id, sort_order);
create index products_public_idx on public.products(business_id, available) where available = true;
create index ai_jobs_owner_created_idx on public.ai_generation_jobs(owner_id, created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger businesses_updated_at before update on public.businesses for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', '')); return new; end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.products enable row level security;
alter table public.ai_generation_jobs enable row level security;

create policy "profiles own select" on public.profiles for select using (auth.uid() = id);
create policy "profiles own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "businesses public read published" on public.businesses for select using (published or auth.uid() = owner_id);
create policy "businesses owner insert" on public.businesses for insert with check (auth.uid() = owner_id);
create policy "businesses owner update" on public.businesses for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "businesses owner delete" on public.businesses for delete using (auth.uid() = owner_id);
create policy "products public read available" on public.products for select using (
  available and exists (select 1 from public.businesses b where b.id = business_id and b.published)
  or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);
create policy "products owner insert" on public.products for insert with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "products owner update" on public.products for update using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())) with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "products owner delete" on public.products for delete using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "ai jobs owner all" on public.ai_generation_jobs for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-images', 'catalog-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "catalog images public read" on storage.objects for select using (bucket_id = 'catalog-images');
create policy "catalog images owner insert" on storage.objects for insert to authenticated with check (bucket_id = 'catalog-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "catalog images owner update" on storage.objects for update to authenticated using (bucket_id = 'catalog-images' and owner_id = auth.uid()::text);
create policy "catalog images owner delete" on storage.objects for delete to authenticated using (bucket_id = 'catalog-images' and owner_id = auth.uid()::text);
