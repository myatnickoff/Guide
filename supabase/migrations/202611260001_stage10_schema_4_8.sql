-- =====================================================================
-- MoveExploreGrow Phuket Guide 16+: схема 4.8 (этап 10.3)
-- Дата: 2026-11-26. Аддитивная миграция поверх 4.7.
-- Статус: ЧЕРНОВИК. НЕ ПРИМЕНЯТЬ к production / живому Supabase без явного
-- согласия владельца. Не удаляет существующие таблицы и функции.
-- Не заполняет координаты, телефоны, соцсети, фото и штрафы — только структура.
-- Существующая public.guide_feedback не меняется.
-- =====================================================================

-- ---------- Операционный статус: temporarily_closed ----------
-- PG переписывает IN (...) как = ANY (ARRAY[...]); снимаем check по имени и по определению.
do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public' and t.relname = 'places' and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ~* 'needs_verification'
      and pg_get_constraintdef(c.oid) ~* 'seasonal'
      and pg_get_constraintdef(c.oid) !~* 'temporarily_closed'
      and pg_get_constraintdef(c.oid) !~* 'verification_status'
      and pg_get_constraintdef(c.oid) !~* 'owner_approved'
      and pg_get_constraintdef(c.oid) !~* 'is_published'
      and pg_get_constraintdef(c.oid) !~* 'closed_at'
  loop
    execute format('alter table public.places drop constraint %I', r.conname);
  end loop;
end $$;
alter table public.places drop constraint if exists places_status_check;
alter table public.places
  add constraint places_status_check
  check (status in ('verified','needs_verification','seasonal','closed','temporarily_closed'));

do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public' and t.relname = 'routes' and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ~* 'needs_verification'
      and pg_get_constraintdef(c.oid) ~* 'seasonal'
      and pg_get_constraintdef(c.oid) !~* 'temporarily_closed'
  loop
    execute format('alter table public.routes drop constraint %I', r.conname);
  end loop;
end $$;
alter table public.routes drop constraint if exists routes_status_check;
alter table public.routes
  add constraint routes_status_check
  check (status in ('verified','needs_verification','seasonal','closed','temporarily_closed'));

-- Временно закрытые места публично читаются (как seasonal/closed).
-- Списки на сайте исключают только status = 'closed'.
create or replace function public.is_place_public(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.places
                 where id = p
                   and is_published
                   and status in ('verified','seasonal','closed','temporarily_closed')
                   and age_rating <> '21+');
$$;

-- ---------- Двухуровневая проверка ----------
-- Уровень 1 (источник): verification_status + last_verified.
--   Значения мест приведены к снимку и practical: verified | needs_verification | needs_check | partially_verified.
-- Уровень 2 (владелец): owner_approved + owner_approved_at.
--   Уровни независимы. Карточка показывает оба отдельно (UI — этап 10.4).
do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public' and t.relname = 'places' and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ~* 'verification_status'
  loop
    execute format('alter table public.places drop constraint %I', r.conname);
  end loop;
end $$;
alter table public.places drop constraint if exists places_verification_status_check;
alter table public.places
  add constraint places_verification_status_check
  check (verification_status in ('verified','needs_verification','needs_check','partially_verified'));

alter table public.places
  add column if not exists owner_approved boolean not null default false,
  add column if not exists owner_approved_at date;
alter table public.places
  drop constraint if exists places_owner_approved_has_date,
  add constraint places_owner_approved_has_date
    check (owner_approved = (owner_approved_at is not null));

alter table public.routes
  add column if not exists owner_approved boolean not null default false,
  add column if not exists owner_approved_at date;
alter table public.routes
  drop constraint if exists routes_owner_approved_has_date,
  add constraint routes_owner_approved_has_date
    check (owner_approved = (owner_approved_at is not null));

alter table public.top5_sets
  add column if not exists owner_approved boolean not null default false,
  add column if not exists owner_approved_at date;
alter table public.top5_sets
  drop constraint if exists top5_sets_owner_approved_has_date,
  add constraint top5_sets_owner_approved_has_date
    check (owner_approved = (owner_approved_at is not null));

alter table public.practical_topics
  add column if not exists owner_approved boolean not null default false,
  add column if not exists owner_approved_at date;
alter table public.practical_topics
  drop constraint if exists practical_topics_owner_approved_has_date,
  add constraint practical_topics_owner_approved_has_date
    check (owner_approved = (owner_approved_at is not null));

alter table public.districts
  add column if not exists owner_approved boolean not null default false,
  add column if not exists owner_approved_at date;
alter table public.districts
  drop constraint if exists districts_owner_approved_has_date,
  add constraint districts_owner_approved_has_date
    check (owner_approved = (owner_approved_at is not null));

-- ---------- Поля места: подкатегория, соцсети, телефон ----------
-- Координаты lat/lng уже есть в 4.7; в 4.8 не заполняются (только из источника, этап 10.6).
alter table public.places
  add column if not exists subcategory text,
  add column if not exists socials jsonb not null default '[]'::jsonb,
  add column if not exists phone text,
  add column if not exists phone_checked_at date;

alter table public.places
  drop constraint if exists places_socials_is_array,
  add constraint places_socials_is_array check (jsonb_typeof(socials) = 'array');

alter table public.places
  drop constraint if exists places_phone_has_date,
  add constraint places_phone_has_date check (phone is null or phone_checked_at is not null);

comment on column public.places.socials is
  'Официальные соцсети: [{network, url, source_url, accessed_at}]. Пустой массив, пока нет источника.';
comment on column public.places.phone is
  'Телефон только вместе с phone_checked_at и источником; не выдумывать.';
comment on column public.places.owner_approved is
  'Уровень 2: одобрено владельцем (синхронизация с чекбоксом Notion — отдельным этапом).';

-- Проверенное место: ссылка Google Maps может быть сгенерирована из координат или названия+адреса.
alter table public.places drop constraint if exists places_required_when_verified;
alter table public.places add constraint places_required_when_verified check (
  status <> 'verified' or (
    short_description is not null and why_visit is not null and address is not null
    and last_verified is not null and primary_category_id is not null
    and (
      google_maps_url is not null
      or (lat is not null and lng is not null)
    )
  )
);

-- Публикация без фото разрешена: на карточке — заглушка (решение владельца, этап 10).
-- Фото по-прежнему обязательны по смыслу для «готовых» карточек; конвейер — этап 10.5.
alter table public.places drop constraint if exists places_photo_required_when_published;

-- ---------- Фото: автор, URL лицензии, локальный файл, depicts_place ----------
alter table public.place_photos
  add column if not exists author text,
  add column if not exists license_url text,
  add column if not exists local_path text,
  add column if not exists depicts_place boolean not null default false;

alter table public.place_photos
  drop constraint if exists place_photos_has_file,
  add constraint place_photos_has_file check (url is not null or local_path is not null);

-- url был NOT NULL; локальный файл без внешнего URL допустим (конвейер 10.5).
alter table public.place_photos alter column url drop not null;

comment on column public.place_photos.depicts_place is
  'true только если фото изображает именно это место; иначе нельзя ставить главным / показывать как вид заведения.';
comment on column public.place_photos.author is
  'Автор фото (если известен). credit может оставаться подписью для отображения.';
comment on column public.place_photos.license_url is
  'Ссылка на текст лицензии (Commons / Unsplash / и т.п.).';
comment on column public.place_photos.local_path is
  'Путь к локальной копии в репозитории или хранилище; не генерировать изображения.';

-- Главное фото места: если задано, лицензия/автор желательны (не жёстко — данные ещё пустые).
alter table public.places
  add column if not exists main_photo_license_url text,
  add column if not exists main_photo_author text;

-- ---------- Поиск: tsvector + GIN (клиентский поиск по снимку — этап 10.7) ----------
-- Конфиг 'simple': смешанный RU/EN, словарь 'russian' в Supabase может отсутствовать.
alter table public.places drop column if exists search_vec;
alter table public.places
  add column search_vec tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(name, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(subcategory, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(short_description, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(why_visit, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(address, '')), 'C')
  ) stored;
create index if not exists places_search_vec_idx on public.places using gin (search_vec);

-- ---------- Генератор ссылки Google Maps ----------
-- Приоритет: координаты → сохранённый URL → название + адрес.
create or replace function public.google_maps_search_url(
  p_name text,
  p_address text default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_stored_url text default null
) returns text
language sql immutable parallel safe as $$
  select case
    when p_lat is not null and p_lng is not null then
      'https://www.google.com/maps/search/?api=1&query=' || p_lat::text || ',' || p_lng::text
    when p_stored_url is not null and length(trim(p_stored_url)) > 0 then
      p_stored_url
    else
      'https://www.google.com/maps/search/?api=1&query='
      || replace(regexp_replace(trim(concat_ws(' ', p_name, p_address)), '\s+', ' ', 'g'), ' ', '+')
  end;
$$;

comment on function public.google_maps_search_url(text, text, double precision, double precision, text) is
  'Ссылка Google Maps: координаты, иначе сохранённый URL, иначе название+адрес. Встроенная карта на сайте не используется.';

-- ---------- Штрафы и правовые факты: только официальный источник + дата ----------
-- Таблица пустая: суммы не переносятся из существующих текстов, пока источник не проверен (10.6/10.8).
create table if not exists public.practical_legal_facts (
  id                     uuid primary key default gen_random_uuid(),
  topic_id               uuid not null references public.practical_topics(id) on delete cascade,
  fact_key               text not null,
  text_ru                text not null,
  amount                 numeric,
  currency               text,
  official_source_url    text not null check (official_source_url ~ '^https://'),
  official_source_title  text,
  source_published_at    date,
  accessed_at            date not null,
  created_at             timestamptz not null default now(),
  unique (topic_id, fact_key),
  constraint legal_facts_amount_has_currency check (amount is null or currency is not null)
);
comment on table public.practical_legal_facts is
  'Числовые правовые факты (штрафы и т.п.) — только с официальным URL и датой обращения. Не заполнять по памяти.';

create index if not exists practical_legal_facts_topic_idx on public.practical_legal_facts(topic_id);

alter table public.practical_legal_facts enable row level security;
grant select on public.practical_legal_facts to anon, authenticated;
drop policy if exists pub_read on public.practical_legal_facts;
create policy pub_read on public.practical_legal_facts for select to anon, authenticated
  using (exists (
    select 1 from public.practical_topics t
    where t.id = topic_id and t.is_published and t.direction = '16plus'
  ));

-- Партнёрская подпись уже ограничена в 4.7: «Партнёрская ссылка» | «Партнёр». Не меняем.
-- v_map_places сохраняется (слой данных). UI карты нет — только ссылки.

comment on table public.places is
  'Схема 4.8: двухуровневая проверка, подкатегория, соцсети, телефон с датой, поиск, temporarily_closed.';
