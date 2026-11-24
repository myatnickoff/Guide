-- Stage 9 (2026-11-24): schema rev 4.7 — additive: creates new tables/views/policies; does NOT alter or drop public.guide_feedback.
-- Source: moveexploregrow deliverables/supabase-schema-draft.sql (tested on local PG17). Apply via Supabase SQL editor or CLI after owner approval.
-- =====================================================================
-- MoveExploreGrow Phuket Guide 16+: черновик схемы Supabase (этап 3)
-- Дата: 2026-11-24, редакция 4 (реестр партнёрок этапа 5: поля владельца; промо с утверждением владельца); ранее редакция 3 (8 районов, slug mai-khao-nai-yang, waitlist 21+, closed-места + purge через 6 мес., district_bottom). Статус: DRAFT. НЕ ПРИМЕНЯТЬ без согласия владельца.
-- Существующая таблица public.guide_feedback НЕ меняется.
-- RLS: публичное чтение (anon/authenticated) только опубликованных строк;
--      запись только service_role (обходит RLS, явных политик записи нет).
-- Проверено 2026-11-24 на локальном PostgreSQL 17 (роли anon/authenticated/service_role созданы вручную):
-- Ред. 4.7 (этап 8, t59u): practical_sources.source_type (official|secondary|owner), url необязателен только для owner; program_key owner_exchange; подпись «Партнёр». Проверено на PG17 24.11.
-- Ред. 4.6 (этап 8): practical_topics.direction/summary_ru/sections/verification_status, публикация только с verified_at и без needs_check, pub_read только 16plus; practical_sources.source_key. Проверено на PG17 24.11 с practical-16plus-seed.sql.
-- Ред. 4.5 (этап 7): routes.direction/theme/sort_order + защита остановок 16+; affiliate_placements (+ v_affiliate_placements_public); top5_sets.district_id; tours скрыта. Проверено на PG17 24.11 с stage-07-affiliate-routes-seed.sql.
-- Ред. 4.4 (этап 6, проверено на PG17 24.11: схема + places-16plus-seed.sql, 48 мест; 21+ на карте 16+ и публикация без фото отклоняются; 6b: 60 мест, wellness/services в меню — проверено): place_directions (16plus|nomad|21plus), categories.directions/menu_group, places.verification_status, v_map_places; фото обязательно только при публикации.
-- Ред. 4.3: affiliate_links.scope_name для строк уровня программы (реестр из Notion владельца); юр. проверка не проводится (owner_approved_no_legal_review, 24.11 14:15).
-- Ред. 4.2: promo_blocks.locale (ru|en, unique(placement, locale)); concierge_waitlist.lang уже есть; версии текстов вида legal-21plus-ru-vX.
-- Ред. 4.1: waitlist — раздельные согласия (terms_accepted, marketing_opt_in) по legal-21plus-draft.md.
-- Ред. 4 повторно проверена 2026-11-24: схема применяется без ошибок; 4 промо из seed (is_active=false, не утверждены); активация без approved_by_owner отклоняется;
--   affiliate_links: not_provided по умолчанию, active без url/last_verified и url при not_provided отклоняются; anon не читает commission и v_affiliate_registry; v_affiliate_links_public отдаёт только active.
--   схема применяется без ошибок; anon видит только опубликованное; запись anon запрещена;
--   affiliate_programs и guide_feedback для anon закрыты; check-ограничения срабатывают.
--   Редакция 3 перепроверена 2026-11-24 13:15: 8 районов (mai-khao-nai-yang), 19 связей; purge_closed_places(6)
--   удаляет только закрытые > 6 мес., ставит 308 на преемника, схлопывает цепочки редиректов, маршрут → needs_verification;
--   anon не может вызвать purge и читать waitlist. Редакция 2: 8 районов, 19 связей соседства, 4 промо-плейсхолдера;
--   closed видна в v_place_pages и исключена из списков; closed_alternatives/nearby_places работают;
--   concierge_waitlist: anon без доступа, consent/age/контакт/интересы/дубликаты проверяются.
--   На реальном Supabase прогнать сначала на branch/staging.
-- =====================================================================

create extension if not exists pgcrypto;  -- gen_random_uuid()

-- ---------- Общие типы (через check, чтобы проще мигрировать) ----------
-- status: verified | needs_verification | seasonal | closed
-- age_rating: all | 16+ | 21+   (21+ никогда не отдаётся публично в гиде 16+)

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- ---------- Районы ----------
create table public.districts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),  -- patong, kamala-surin, bangtao, mai-khao-nai-yang, karon-kata, rawai-nai-harn, chalong, phuket-town
  name          text not null,
  name_ru       text,
  tagline       text,
  intro         text,
  atmosphere    text,
  audience      text,
  hero_photo_url     text,
  hero_photo_credit  text,
  hero_photo_license text,
  center_lat    double precision check (center_lat between -90 and 90),
  center_lng    double precision check (center_lng between -180 and 180),
  sort_order    int not null default 0,
  is_published  boolean not null default false,
  last_verified date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.district_neighbors (
  district_id  uuid not null references public.districts(id) on delete cascade,
  neighbor_id  uuid not null references public.districts(id) on delete cascade,
  rank         int not null default 1,           -- 1 = ближайший
  note         text,                             -- без расстояний, пока нет расчёта
  primary key (district_id, neighbor_id),
  check (district_id <> neighbor_id)
);

-- ---------- Категории (20) ----------
create table public.categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]+$'),
  label_ru     text not null,
  label_en     text not null,
  group_key    text,                             -- nature, food, stay, see, do, buy, evening, wellness, practical, route
  icon         text,
  sort_order   int not null default 0,
  field_schema jsonb not null default '{}'::jsonb, -- категорийные поля (этап 4)
  is_published boolean not null default true
);

insert into public.categories (slug, label_ru, label_en, group_key, sort_order) values
 ('beaches','Пляжи','Beaches','nature',1),
 ('food','Еда и рестораны','Food & Restaurants','food',2),
 ('breakfast','Лучшие завтраки','Best Breakfast','food',3),
 ('dinner','Лучшие ужины','Best Dinner','food',4),
 ('unique-hotels','Уникальные отели','Unique Hotels','stay',5),
 ('coffee','Кофейни','Coffee Shops','food',6),
 ('attractions','Достопримечательности','Attractions','see',7),
 ('instagrammable','Фотогеничные места','Instagrammable Places','see',8),
 ('activities','Активности','Activities','do',9),
 ('kids-family','Детям и семьям','Kids & Family','do',10),
 ('nature-viewpoints','Природа и смотровые','Nature & Viewpoints','nature',11),
 ('sports-fitness','Спорт и фитнес','Sports & Fitness','do',12),
 ('shopping','Шопинг','Shopping','buy',13),
 ('nightlife','Вечерняя жизнь (16+)','Nightlife','evening',14),
 ('wellness','Wellness, SPA, массаж','Wellness','wellness',15),
 ('markets','Рынки','Markets','buy',16),
 ('services','Полезные сервисы','Services','practical',17),
 ('routes','Маршруты','Routes','route',18),
 ('extreme','Экстрим','Extreme','do',19),
 ('tours','Экскурсии и туры','Tours & Excursions','do',20);

-- ---------- Партнёрский реестр (ПЛЕЙСХОЛДЕРЫ, наполняется на этапе 5) ----------
create table public.affiliate_programs (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,               -- напр. Travelpayouts / GetYourGuide / Viator (только реально зарегистрированные)
  network            text,
  account_ref        text,                        -- внутренний идентификатор, НЕ секрет и НЕ пароль
  status             text not null default 'pending' check (status in ('pending','active','paused','rejected')),
  disclosure_text    text,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.affiliate_links (
  -- Реестр партнёрских ссылок (этап 5). Поля владельца: place_id, place_name, affiliate_network, affiliate_url,
  -- affiliate_status, regular_url, booking_url, commission, disclosure_required, last_verified.
  -- place_name не хранится, а берётся из places (вьюха v_affiliate_registry). Ссылки только от владельца, не выдумывать.
  id                  uuid primary key default gen_random_uuid(),
  place_id            uuid,                       -- FK на places добавляется ниже (places создаётся позже)
  scope_name          text,                       -- для строк уровня программы (place_id пусто до этапа 6), напр. 'Klook — Phuket'
  program_id          uuid references public.affiliate_programs(id) on delete set null,
  affiliate_network   text,                       -- напр. Travelpayouts / GetYourGuide / Viator — только реальные программы владельца
  affiliate_url       text,                       -- ТОЛЬКО из реестра владельца, tracking-параметры не менять
  affiliate_status    text not null default 'not_provided'
                      check (affiliate_status in ('not_provided','pending','active','paused','broken','expired')),
  regular_url         text,                       -- официальный сайт места (без трекинга), отдельно от booking_url
  booking_url         text,                       -- обычная ссылка бронирования (без трекинга)
  commission          text,                       -- как указал владелец/программа, напр. '8% (по данным программы на дату)'; не выдумывать
  disclosure_required boolean not null default true,
  last_verified       date,
  added_by            text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (affiliate_url is null or affiliate_url ~ '^https://'),
  check (regular_url is null or regular_url ~ '^https?://'),
  check (booking_url is null or booking_url ~ '^https?://'),
  check (affiliate_status <> 'active' or (affiliate_url is not null and last_verified is not null)),
  check (affiliate_status <> 'not_provided' or affiliate_url is null)
);

-- ---------- Места ----------
create table public.places (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name                text not null,
  district_id         uuid not null references public.districts(id),
  primary_category_id uuid references public.categories(id),
  short_description   text,
  why_visit           text,
  address             text,
  lat                 double precision check (lat between -90 and 90),
  lng                 double precision check (lng between -180 and 180),
  google_maps_url     text,
  main_photo_url      text,
  main_photo_credit   text,
  main_photo_license  text,                       -- напр. 'Unsplash License'
  main_photo_source   text,
  price_level         smallint check (price_level between 0 and 4),  -- 0 = бесплатно
  price_note          text,
  price_checked_at    date,
  opening_hours       jsonb,
  hours_checked_at    date,
  official_url        text,
  booking_url         text,
  affiliate_link_id   uuid references public.affiliate_links(id) on delete set null,
  category_fields     jsonb not null default '{}'::jsonb,
  uniqueness_reason   text,                       -- обязательно для unique-hotels (проверка в валидаторе/этапе 4)
  age_rating          text not null default 'all' check (age_rating in ('all','16+','21+')),
  status              text not null default 'needs_verification'
                      check (status in ('verified','needs_verification','seasonal','closed')),
  season_note         text,
  closed_at           date,
  closed_note         text,
  replaced_by_place_id uuid references public.places(id) on delete set null,
  is_published        boolean not null default false,
  is_editor_pick      boolean not null default false,
  sort_order          int not null default 0,
  last_verified       date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- обязательные поля модуля 01 для опубликованного verified-места
  constraint places_required_when_verified check (
    status <> 'verified' or (
      short_description is not null and why_visit is not null and address is not null
      and google_maps_url is not null and main_photo_url is not null and last_verified is not null
      and primary_category_id is not null
    )
  ),
  constraint places_no_adult_published check (not (is_published and age_rating = '21+')),
  constraint places_closed_has_date check (status <> 'closed' or closed_at is not null)
);
create index places_district_idx on public.places(district_id);
alter table public.affiliate_links add constraint affiliate_links_place_fk
  foreign key (place_id) references public.places(id) on delete cascade;
create index affiliate_links_place_idx on public.affiliate_links(place_id);
create index places_status_idx   on public.places(status, is_published);

create table public.place_categories (
  place_id    uuid not null references public.places(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  is_primary  boolean not null default false,
  sort_order  int not null default 0,
  primary key (place_id, category_id)
);
create index place_categories_cat_idx on public.place_categories(category_id);

create table public.place_photos (
  id          uuid primary key default gen_random_uuid(),
  place_id    uuid not null references public.places(id) on delete cascade,
  url         text not null,
  credit      text,
  license     text,
  source_url  text,
  alt         text,
  sort_order  int not null default 0
);

create table public.place_sources (
  id          uuid primary key default gen_random_uuid(),
  place_id    uuid not null references public.places(id) on delete cascade,
  url         text not null,
  title       text,
  source_type text check (source_type in ('official','social','tourism_gov','directory','map','review','other')),
  accessed_at date not null
);

create table public.slug_redirects (
  old_path    text primary key,
  new_path    text not null,
  created_at  timestamptz not null default now()
);

-- ---------- Маршруты ----------
create table public.routes (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title         text not null,
  district_id   uuid references public.districts(id),
  summary       text,
  duration_note text,
  transport     text,
  best_time     text,
  budget_note   text,
  map_url       text,
  hero_photo_url text,
  hero_photo_credit text,
  status        text not null default 'needs_verification'
                check (status in ('verified','needs_verification','seasonal','closed')),
  is_published  boolean not null default false,
  last_verified date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.route_stops (
  id           uuid primary key default gen_random_uuid(),
  route_id     uuid not null references public.routes(id) on delete cascade,
  stop_order   int not null,
  place_id     uuid references public.places(id) on delete set null,
  label        text,                              -- если точка не является местом из базы
  lat          double precision,
  lng          double precision,
  stay_minutes int,
  note         text,
  unique (route_id, stop_order),
  check (place_id is not null or label is not null)
);

-- ---------- TOP 5 PHUKET (MEG Selection) ----------
create table public.top5_sets (
  id           uuid primary key default gen_random_uuid(),
  theme_slug   text not null unique,              -- beaches, restaurants, breakfast, unique-hotels, viewpoints, activities, wellness, nightlife
  category_id  uuid references public.categories(id),
  title        text not null,
  subtitle     text default 'Editor''s Picks / MEG Selection',
  shortfall_note text,                            -- почему мест меньше пяти
  sort_order   int not null default 0,
  is_published boolean not null default false,
  updated_at   timestamptz not null default now()
);

create table public.top5_items (
  set_id      uuid not null references public.top5_sets(id) on delete cascade,
  position    smallint not null check (position between 1 and 5),
  place_id    uuid not null references public.places(id) on delete cascade,
  reason      text,                               -- редакционная причина, не рейтинг
  primary key (set_id, position),
  unique (set_id, place_id)
);

-- ---------- Промо-блоки 21+ ----------
create table public.promo_blocks (
  id          uuid primary key default gen_random_uuid(),
  placement   text not null check (placement in ('home_top','home_middle','home_bottom','district_bottom')),
  locale      text not null default 'ru' check (locale in ('ru','en')),  -- MVP: только ru; en — с EN-версией сайта
  variant     text not null check (variant in ('banner','card','compact')),
  headline    text not null,
  body        text,
  cta_label   text not null,
  cta_href    text not null default '/21-plus' check (cta_href in ('/21-plus','/21-plus#waitlist','https://t.me/MEGteam_bot')),
  approved_by_owner boolean not null default false,  -- публикация только после утверждения владельца
  approved_at timestamptz,
  image_url   text,
  image_credit text,
  is_active   boolean not null default false,
  updated_at  timestamptz not null default now(),
  unique (placement, locale),
  constraint promo_active_requires_approval check (not is_active or approved_by_owner)
);

-- ---------- Практика / закон / SOS (этап 8) ----------
create table public.practical_topics (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,             -- weather, money, connectivity, transport, rules, cannabis, vapes, hookah, medical, sos
  title         text not null,
  body_md       text,
  legal_flag    boolean not null default false,
  sort_order    int not null default 0,
  is_published  boolean not null default false,
  verified_at   date,
  updated_at    timestamptz not null default now(),
  constraint practical_legal_needs_date check (not (is_published and legal_flag and verified_at is null))
);

create table public.practical_sources (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid not null references public.practical_topics(id) on delete cascade,
  url         text not null,
  title       text,
  is_official boolean not null default false,
  accessed_at date not null
);

-- ---------- Лист ожидания 21+ (форма /21-plus) ----------
-- Запись только через POST /api/waitlist с service_role. anon/authenticated доступа не имеют.
create table public.concierge_waitlist (
  id                   bigint generated always as identity primary key,
  name                 text check (name is null or char_length(name) <= 100),
  email                text check (email is null or (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')),
  telegram             text check (telegram is null or telegram ~ '^@?[A-Za-z0-9_]{5,32}$'),
  interests            text[] not null default '{}'
                       check (interests <@ array['nightlife','wellness','lgbtq_friendly','etiquette_safety','private_tours','other']::text[]),
  lang                 text check (lang in ('ru','en')),
  message              text check (message is null or char_length(message) <= 1000),
  age_confirmed        boolean not null check (age_confirmed),        -- чекбокс «мне 21+»
  consent_given        boolean not null check (consent_given),        -- галочка 3: согласие на уведомление о запуске (legal-21plus-draft A6)
  consent_text_version text not null,                                  -- версия текста согласия с языком, напр. 'legal-21plus-ru-v0.2'
  terms_accepted       boolean not null check (terms_accepted),       -- галочка 2: Terms of Use (отдельно)
  terms_version        text not null,
  privacy_notice_version text not null,                                -- версия показанного Privacy Notice (не согласие)
  marketing_opt_in     boolean not null default false,                 -- галочка 4: необязательная рассылка
  marketing_opt_in_at  timestamptz,
  source               text not null default '21-plus-page',
  status               text not null default 'new' check (status in ('new','contacted','unsubscribed')),
  created_at           timestamptz not null default now(),
  check (email is not null or telegram is not null)
);
create unique index concierge_waitlist_email_uq on public.concierge_waitlist (lower(email)) where email is not null;
create unique index concierge_waitlist_tg_uq    on public.concierge_waitlist (lower(ltrim(telegram,'@'))) where telegram is not null;

-- ---------- updated_at триггеры ----------
do $$ declare t text; begin
  foreach t in array array['districts','places','routes','affiliate_programs','affiliate_links','top5_sets','promo_blocks','practical_topics'] loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop; end $$;

-- ---------- Публичные вьюхи ----------
-- security_invoker: вьюха подчиняется RLS вызывающего (anon)
-- Страницы мест (включая закрытые: страница «закрыто» с альтернативами)
create view public.v_place_pages with (security_invoker = true) as
  select p.*, d.slug as district_slug, d.name as district_name, c.slug as primary_category_slug
  from public.places p
  join public.districts d on d.id = p.district_id
  left join public.categories c on c.id = p.primary_category_id;

-- Списки, TOP 5, «Рядом с вами», маршруты: без закрытых
create view public.v_published_places with (security_invoker = true) as
  select * from public.v_place_pages where status <> 'closed';

create view public.v_district_category_counts with (security_invoker = true) as
  select d.slug as district_slug, c.slug as category_slug, count(p.id) as places_count
  from public.place_categories pc
  join public.places p on p.id = pc.place_id
  join public.districts d on d.id = p.district_id
  join public.categories c on c.id = pc.category_id
  where p.status <> 'closed'
  group by d.slug, c.slug;

-- Публичное представление партнёрской ссылки (без внутренних полей)
create view public.v_affiliate_links_public with (security_invoker = true) as
  select id, place_id, affiliate_url, regular_url, booking_url, disclosure_required
  from public.affiliate_links;

-- Реестр в формате владельца (экспорт в deliverables/affiliate-registry.csv); только для service_role
create view public.v_affiliate_registry as
  select a.place_id, coalesce(p.name, a.scope_name) as place_name, a.affiliate_network, a.affiliate_url, a.affiliate_status,
         a.regular_url, a.booking_url, a.commission, a.disclosure_required, a.last_verified
  from public.affiliate_links a left join public.places p on p.id = a.place_id;

-- «Рядом с вами»: 2–3 места категории у соседних районов (без расстояний)
create or replace function public.nearby_places(p_district text, p_category text, p_limit int default 3)
returns setof public.v_published_places
language sql stable security invoker as $$
  select vp.*
  from public.v_published_places vp
  join public.place_categories pc on pc.place_id = vp.id
  join public.categories c on c.id = pc.category_id and c.slug = p_category
  join public.districts src on src.slug = p_district
  join public.district_neighbors dn on dn.district_id = src.id and dn.neighbor_id = vp.district_id
  order by dn.rank, vp.is_editor_pick desc, vp.sort_order
  limit greatest(1, least(p_limit, 3));
$$;

-- Альтернативы для закрытого места: преемник → та же категория в том же районе → соседи
create or replace function public.closed_alternatives(p_slug text, p_limit int default 3)
returns table (slug text, name text, district_slug text, reason text)
language sql stable security invoker as $$
  with src as (select * from public.v_place_pages where slug = p_slug and status = 'closed'),
  cand as (
    select vp.slug, vp.name, vp.district_slug, 'replacement'::text as reason, 0 as prio, 0 as r, vp.sort_order
      from public.v_published_places vp join src on vp.id = src.replaced_by_place_id
    union all
    select vp.slug, vp.name, vp.district_slug, 'same_district', 1, 0, vp.sort_order
      from public.v_published_places vp
      join src on vp.district_id = src.district_id and vp.id <> src.id
      join public.place_categories pc on pc.place_id = vp.id and pc.category_id = src.primary_category_id
    union all
    select vp.slug, vp.name, vp.district_slug, 'nearby', 2, dn.rank, vp.sort_order
      from public.v_published_places vp
      join src on true
      join public.district_neighbors dn on dn.district_id = src.district_id and dn.neighbor_id = vp.district_id
      join public.place_categories pc on pc.place_id = vp.id and pc.category_id = src.primary_category_id
  )
  select distinct on (prio, r, sort_order, slug) slug, name, district_slug, reason
  from cand order by prio, r, sort_order, slug
  limit greatest(1, least(p_limit, 5));
$$;

-- Очистка закрытых мест через 6 месяцев (решение владельца 24.11): 308-редирект и удаление.
-- Вызывает только service_role (ежемесячный скрипт). Возвращает число удалённых мест.
create or replace function public.purge_closed_places(p_months int default 6)
returns int language plpgsql security invoker as $$
declare r record; n int := 0; target text;
begin
  for r in select p.id, p.slug, p.replaced_by_place_id, d.slug as dslug, c.slug as cslug
           from public.places p
           join public.districts d on d.id = p.district_id
           left join public.categories c on c.id = p.primary_category_id
           where p.status = 'closed' and p.closed_at <= current_date - make_interval(months => p_months)
  loop
    select '/place/' || slug into target from public.places
      where id = r.replaced_by_place_id and status <> 'closed';
    target := coalesce(target, '/phuket/' || r.dslug || coalesce('/' || r.cslug, ''));
    insert into public.slug_redirects(old_path, new_path) values ('/place/' || r.slug, target)
      on conflict (old_path) do update set new_path = excluded.new_path;
    update public.slug_redirects set new_path = target where new_path = '/place/' || r.slug;  -- без цепочек
    update public.routes set status = 'needs_verification'
      where id in (select route_id from public.route_stops where place_id = r.id);
    delete from public.route_stops where place_id = r.id;
    delete from public.top5_items  where place_id = r.id;
    delete from public.places where id = r.id;
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.purge_closed_places(int) from public, anon, authenticated;

-- ---------- RLS ----------
alter table public.districts          enable row level security;
alter table public.district_neighbors enable row level security;
alter table public.categories         enable row level security;
alter table public.places             enable row level security;
alter table public.place_categories   enable row level security;
alter table public.place_photos       enable row level security;
alter table public.place_sources      enable row level security;
alter table public.slug_redirects     enable row level security;
alter table public.routes             enable row level security;
alter table public.route_stops        enable row level security;
alter table public.top5_sets          enable row level security;
alter table public.top5_items         enable row level security;
alter table public.affiliate_programs enable row level security;
alter table public.affiliate_links    enable row level security;
alter table public.promo_blocks       enable row level security;
alter table public.practical_topics   enable row level security;
alter table public.practical_sources  enable row level security;
alter table public.concierge_waitlist enable row level security;

-- Права: anon/authenticated только SELECT; запись только service_role
revoke insert, update, delete, truncate on all tables in schema public from anon, authenticated;
grant select on public.districts, public.district_neighbors, public.categories, public.places,
  public.place_categories, public.place_photos, public.place_sources, public.slug_redirects,
  public.routes, public.route_stops, public.top5_sets, public.top5_items,
  public.promo_blocks, public.practical_topics, public.practical_sources,
  public.v_place_pages, public.v_published_places, public.v_district_category_counts, public.v_affiliate_links_public
  to anon, authenticated;
revoke all on public.affiliate_programs from anon, authenticated;   -- реестр программ не публичен
revoke all on public.v_affiliate_registry from anon, authenticated; -- полный реестр (комиссии) не публичен
revoke all on public.concierge_waitlist from anon, authenticated;   -- лист ожидания: только service_role
revoke all on sequence public.concierge_waitlist_id_seq from anon, authenticated;
-- guide_feedback: оставить как есть (revoke all from anon/authenticated, insert только service_role)
revoke all on public.guide_feedback from anon, authenticated;

-- Хелпер: опубликованное место?
create or replace function public.is_place_public(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.places
                 where id = p and is_published and status in ('verified','seasonal','closed') and age_rating <> '21+');
$$;

create policy pub_read on public.districts          for select to anon, authenticated using (is_published);
create policy pub_read on public.district_neighbors for select to anon, authenticated using (true);
create policy pub_read on public.categories         for select to anon, authenticated using (is_published);
-- closed читается публично (страница «закрыто»); списки исключают closed на уровне вьюх
create policy pub_read on public.places             for select to anon, authenticated
  using (is_published and status in ('verified','seasonal','closed') and age_rating <> '21+');
create policy pub_read on public.place_categories   for select to anon, authenticated using (public.is_place_public(place_id));
create policy pub_read on public.place_photos       for select to anon, authenticated using (public.is_place_public(place_id));
create policy pub_read on public.place_sources      for select to anon, authenticated using (public.is_place_public(place_id));
create policy pub_read on public.slug_redirects     for select to anon, authenticated using (true);
create policy pub_read on public.routes             for select to anon, authenticated
  using (is_published and status in ('verified','seasonal'));
create policy pub_read on public.route_stops        for select to anon, authenticated
  using (exists (select 1 from public.routes r where r.id = route_id and r.is_published and r.status in ('verified','seasonal')));
create policy pub_read on public.top5_sets          for select to anon, authenticated using (is_published);
create policy pub_read on public.top5_items         for select to anon, authenticated
  using (public.is_place_public(place_id)
         and exists (select 1 from public.places pl where pl.id = place_id and pl.status <> 'closed')
         and exists (select 1 from public.top5_sets s where s.id = set_id and s.is_published));
-- affiliate_links: anon читает только колонки без комиссии и только active
grant select (id, place_id, affiliate_url, regular_url, booking_url, disclosure_required, affiliate_status) on public.affiliate_links to anon, authenticated;
create policy pub_read on public.affiliate_links    for select to anon, authenticated using (affiliate_status = 'active');
create policy pub_read on public.promo_blocks       for select to anon, authenticated using (is_active);
create policy pub_read on public.practical_topics   for select to anon, authenticated using (is_published);
create policy pub_read on public.practical_sources  for select to anon, authenticated
  using (exists (select 1 from public.practical_topics t where t.id = topic_id and t.is_published));
-- affiliate_programs, concierge_waitlist: политик нет → anon ничего не видит; service_role обходит RLS.

-- ---------- Seed: 8 районов MVP (решение владельца 2026-11-24), черновик, не опубликованы ----------
-- Тексты/координаты заполняются на этапе 6. Slug утверждены владельцем 24.11 13:08. Big Buddha → chalong, Layan → bangtao.
insert into public.districts (slug, name, sort_order, is_published) values
 ('mai-khao-nai-yang','Север: Mai Khao / Nai Yang',1,false),
 ('bangtao','Bangtao / Cherngtalay',2,false),
 ('kamala-surin','Kamala / Surin',3,false),
 ('patong','Patong',4,false),
 ('karon-kata','Karon & Kata',5,false),
 ('rawai-nai-harn','Rawai & Nai Harn',6,false),
 ('chalong','Chalong & Big Buddha',7,false),
 ('phuket-town','Phuket Town',8,false);

-- Соседство (stage-03 §2.1, требует проверки). Направленное: район → сосед, rank 1 = ближайший.
insert into public.district_neighbors (district_id, neighbor_id, rank)
select a.id, b.id, v.rank
from (values
 ('patong','kamala-surin',1),('patong','karon-kata',2),('patong','phuket-town',3),
 ('kamala-surin','patong',1),('kamala-surin','bangtao',2),
 ('bangtao','kamala-surin',1),('bangtao','mai-khao-nai-yang',2),
 ('mai-khao-nai-yang','bangtao',1),('mai-khao-nai-yang','kamala-surin',2),
 ('karon-kata','patong',1),('karon-kata','rawai-nai-harn',2),('karon-kata','chalong',3),
 ('rawai-nai-harn','karon-kata',1),('rawai-nai-harn','chalong',2),
 ('chalong','rawai-nai-harn',1),('chalong','phuket-town',2),('chalong','karon-kata',3),
 ('phuket-town','chalong',1),('phuket-town','patong',2)
) as v(src, dst, rank)
join public.districts a on a.slug = v.src
join public.districts b on b.slug = v.dst;

-- Промо (deliverables/promo-21plus-drafts.md): блоки 1–3 утверждены 24.11 13:58, блок 4 (консьерж) — 14:04; ВСЕ is_active=false до этапа запуска; блок 4 активировать только когда бот реально даёт бесплатную консультацию (pre-launch-legal-checklist D). locale='ru' по умолчанию. Нумерация владельца: 1=home_top, 2=home_middle, 3=home_bottom (гайд), 4=district_bottom (консьерж 21+); для 3 и 4 — вариант A.
insert into public.promo_blocks (placement, variant, headline, body, cta_label, cta_href, approved_by_owner, approved_at) values
 ('home_top','banner','Отдых 21+ в Таиланде','Если в Тае тебя интересует легальный и откровенный отдых 21+ — у нас есть отдельный гайд для взрослых развлечений и досуга.','Открыть гайд 21+','/21-plus', true, '2026-11-24 13:58+07'),
 ('home_middle','card','За чем на самом деле едут в Таиланд','В Таиланд ездят за тем, что во многих странах недоступно. Вся информация об этом — в нашем гайде 21+.','Узнать в гайде 21+','/21-plus', true, '2026-11-24 13:58+07'),
 ('home_bottom','compact','Готов к взрослой стороне Пхукета?','Легальная ночная жизнь и свобода 21+ — без цензуры и туристических ловушек.','Открыть гайд 21+','/21-plus', true, '2026-11-24 13:58+07'),
 ('district_bottom','compact','Приватный отдых другого уровня','Твой личный консьерж: поможет спланировать твой дневной и ночной досуг на Пхукете.','Записаться на бесплатную консультацию','https://t.me/MEGteam_bot', true, '2026-11-24 14:04+07');

-- =====================================================================
-- Редакция 4.4 (этап 6, 24.11.2026): три направления платформы и карты
-- Цель: 01 PHUKET 16+ (сейчас), 02 NOMAD & EXPAT и 03 PHUKET 21+ (позже).
-- Место хранится один раз и может показываться на нескольких картах (направлениях).
-- =====================================================================
-- Направления: справочник через check (дешевле отдельной таблицы)
create table public.place_directions (
  place_id   uuid not null references public.places(id) on delete cascade,
  direction  text not null check (direction in ('16plus','nomad','21plus')),
  sort_order int not null default 0,
  primary key (place_id, direction)
);
create index place_directions_dir_idx on public.place_directions(direction);
-- В какие направления входит категория и в какую группу меню 16+ (категории владельца)
alter table public.categories add column directions text[] not null default '{16plus}'
  check (directions <@ array['16plus','nomad','21plus']::text[]);
alter table public.categories add column menu_group text;  -- группа меню владельца (см. category-field-schema.json → owner_menu_16plus)
-- Источник проверки места (кроме place_sources): статус исследования этапа 6
alter table public.places add column verification_status text not null default 'needs_check'
  check (verification_status in ('verified','needs_check'));
-- Фото обязательно только для публикации (изображения не генерируются; сток — только как иллюстрация)
alter table public.places drop constraint places_required_when_verified;
alter table public.places add constraint places_required_when_verified check (
  status <> 'verified' or (
    short_description is not null and why_visit is not null and address is not null
    and google_maps_url is not null and last_verified is not null and primary_category_id is not null));
alter table public.places add constraint places_photo_required_when_published check (
  not is_published or status = 'closed' or main_photo_url is not null);
-- 21+ место не может быть на карте 16+ (и наоборот проверяется приложением)
create or replace function public.place_direction_guard() returns trigger language plpgsql as $$
begin
  if new.direction = '16plus' and exists (select 1 from public.places where id = new.place_id and age_rating = '21+') then
    raise exception 'place with age_rating 21+ cannot be on the 16plus map';
  end if;
  return new;
end $$;
create trigger place_directions_guard before insert or update on public.place_directions
  for each row execute function public.place_direction_guard();

alter table public.place_directions enable row level security;
grant select on public.place_directions to anon, authenticated;
-- 21plus и nomad пока не публикуются (направления запаркованы)
create policy pub_read on public.place_directions for select to anon, authenticated
  using (direction = '16plus' and public.is_place_public(place_id));

-- Слой карты: место + направление (одна запись места на нескольких картах)
create view public.v_map_places with (security_invoker = true) as
  select d.direction, p.id, p.slug, p.name, p.lat, p.lng, p.google_maps_url, p.status, p.last_verified,
         di.slug as district_slug, c.slug as category_slug, c.menu_group
  from public.place_directions d
  join public.places p on p.id = d.place_id
  join public.districts di on di.id = p.district_id
  left join public.categories c on c.id = p.primary_category_id
  where p.status <> 'closed';
grant select on public.v_map_places to anon, authenticated;

-- Категории: подписи и группы меню владельца для 16+ (24.11 15:39)
update public.categories set label_ru='Рестораны и кафе', label_en='Restaurants & Cafes' where slug='food';
update public.categories set label_ru='Отели и уникальное жильё', label_en='Hotels & Unique Stays' where slug='unique-hotels';
update public.categories set label_en='Attractions & Sightseeing' where slug='attractions';
update public.categories set label_ru='Активности и приключения', label_en='Activities & Adventures' where slug='activities';
update public.categories set label_ru='Семьям и детям', label_en='Family & Kids' where slug='kids-family';
update public.categories set label_ru='Инстаграм-места', label_en='Instagram Spots' where slug='instagrammable';
update public.categories set label_en='Nightlife (general, 16+)' where slug='nightlife';
update public.categories set menu_group = case slug
  when 'beaches' then 'beaches'
  when 'food' then 'restaurants-cafes' when 'coffee' then 'restaurants-cafes'
  when 'breakfast' then 'breakfast-dinner' when 'dinner' then 'breakfast-dinner'
  when 'unique-hotels' then 'hotels-stays'
  when 'attractions' then 'attractions-sightseeing'
  when 'nature-viewpoints' then 'nature-viewpoints'
  when 'activities' then 'activities-adventures' when 'extreme' then 'activities-adventures'
  when 'sports-fitness' then 'sports-fitness'
  when 'shopping' then 'shopping' when 'markets' then 'shopping'
  when 'kids-family' then 'family-kids'
  when 'tours' then 'tours-excursions'
  when 'instagrammable' then 'instagram-spots'
  when 'nightlife' then 'nightlife-general'
  else null end;   -- wellness, services, routes: решение владельца (вне списка 16+)
update public.categories set directions='{16plus,nomad}' where slug in ('sports-fitness','services','shopping','markets','food','coffee');
create or replace function public.place_age_direction_guard() returns trigger language plpgsql as $$
begin
  if new.age_rating = '21+' and exists (select 1 from public.place_directions where place_id = new.id and direction = '16plus') then
    raise exception 'place on the 16plus map cannot get age_rating 21+';
  end if;
  return new;
end $$;
create trigger places_age_direction_guard before update of age_rating on public.places
  for each row execute function public.place_age_direction_guard();
-- 6b (24.11 18:25, решения владельца): wellness и services входят в меню 16+; nightlife = общая вечерняя жизнь без 21+.
update public.categories set menu_group = 'wellness', label_ru = 'Wellness: спа, массаж, йога', label_en = 'Wellness (spa, massage, yoga)' where slug = 'wellness';
update public.categories set menu_group = 'services', label_ru = 'Полезные сервисы', label_en = 'Services' where slug = 'services';

-- =====================================================================
-- Ред. 4.7 (этап 8, t59u): practical_sources.source_type (official|secondary|owner), url необязателен только для owner; program_key owner_exchange; подпись «Партнёр». Проверено на PG17 24.11.
-- Ред. 4.6 (этап 8): practical_topics.direction/summary_ru/sections/verification_status, публикация только с verified_at и без needs_check, pub_read только 16plus; practical_sources.source_key. Проверено на PG17 24.11 с practical-16plus-seed.sql.
-- Ред. 4.5 (этап 7): маршруты 16+ (direction/theme/sort_order, защита остановок), affiliate_placements (где показывать партнёрки),
-- top5_sets.district_id (необязательно, топ-5 района), категория tours скрыта до появления ссылок GYG/Viator.
-- =====================================================================
alter table public.routes
  add column direction  text not null default '16plus' check (direction in ('16plus','nomad','21plus')),
  add column theme      text not null default 'district'
                        check (theme in ('district','beaches','viewpoints','family','evening','old-town','nature','food')),
  add column sort_order int not null default 0;

-- Остановка маршрута 16+ должна быть местом с карты 16+ (и не 21+)
create or replace function public.route_stop_direction_guard() returns trigger language plpgsql as $$
declare v_dir text;
begin
  if new.place_id is null then return new; end if;
  select direction into v_dir from public.routes where id = new.route_id;
  if not exists (select 1 from public.place_directions where place_id = new.place_id and direction = v_dir) then
    raise exception 'route stop must be a place on the % map', v_dir;
  end if;
  return new;
end $$;
create trigger route_stops_direction_guard before insert or update on public.route_stops
  for each row execute function public.route_stop_direction_guard();

-- Где показывается партнёрский блок. Ссылка берётся только из affiliate_links (реестр владельца).
create table public.affiliate_placements (
  id                uuid primary key default gen_random_uuid(),
  slot_key          text not null unique,          -- напр. 'district:patong:klook', 'route:south-viewpoints-sunset:localrent'
  program_key       text not null check (program_key in ('klook','airalo','localrent','gyg','viator','booking','agoda','tripcom','tiqets','insurance')),
  placement_type    text not null check (placement_type in ('district_block','place_card','route','practical_page','category_page')),
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  district_id       uuid references public.districts(id) on delete cascade,
  place_id          uuid references public.places(id) on delete cascade,
  route_id          uuid references public.routes(id) on delete cascade,
  practical_slug    text,                          -- connectivity, transport, insurance, stay …
  category_slug     text,
  direction         text not null default '16plus' check (direction in ('16plus','nomad','21plus')),
  title_ru          text not null,
  body_ru           text,
  cta_ru            text not null,
  disclosure_label_ru text not null default 'Партнёрская ссылка',
  disclosure_ru     text not null,
  sort_order        int not null default 0,
  is_active         boolean not null default false,  -- pending/not_provided → всегда false (скрыт)
  updated_at        timestamptz not null default now(),
  check (placement_type <> 'district_block' or district_id is not null),
  check (placement_type <> 'place_card'     or place_id is not null),
  check (placement_type <> 'route'          or route_id is not null),
  check (placement_type <> 'practical_page' or practical_slug is not null),
  check (placement_type <> 'category_page'  or category_slug is not null)
);
create index affiliate_placements_link_idx on public.affiliate_placements(affiliate_link_id);

-- Активен только при активной ссылке; при отключении ссылки блоки гаснут
create or replace function public.affiliate_placement_guard() returns trigger language plpgsql as $$
begin
  if new.is_active and not exists (select 1 from public.affiliate_links l where l.id = new.affiliate_link_id and l.affiliate_status = 'active') then
    raise exception 'placement % can be active only with an active affiliate link', new.slot_key;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger affiliate_placements_guard before insert or update on public.affiliate_placements
  for each row execute function public.affiliate_placement_guard();

create or replace function public.affiliate_link_status_cascade() returns trigger language plpgsql as $$
begin
  if new.affiliate_status <> 'active' then
    update public.affiliate_placements set is_active = false where affiliate_link_id = new.id and is_active;
  end if;
  return new;
end $$;
create trigger affiliate_links_status_cascade after update of affiliate_status on public.affiliate_links
  for each row execute function public.affiliate_link_status_cascade();

alter table public.affiliate_placements enable row level security;
grant select on public.affiliate_placements to anon, authenticated;
create policy pub_read on public.affiliate_placements for select to anon, authenticated
  using (is_active and direction = '16plus'
         and exists (select 1 from public.affiliate_links l where l.id = affiliate_link_id and l.affiliate_status = 'active')
         -- блок виден только вместе с опубликованной страницей, к которой он привязан
         and (district_id is null or exists (select 1 from public.districts d where d.id = district_id and d.is_published))
         and (route_id is null or exists (select 1 from public.routes r where r.id = route_id and r.is_published and r.status in ('verified','seasonal')))
         and (place_id is null or public.is_place_public(place_id))
         and (practical_slug is null or exists (select 1 from public.practical_topics t where t.slug = practical_slug and t.is_published)));

-- Публичная выдача: блок + URL (rel="sponsored noopener" ставит фронт)
create view public.v_affiliate_placements_public with (security_invoker = true) as
  select ap.slot_key, ap.program_key, ap.placement_type, d.slug as district_slug, p.slug as place_slug, r.slug as route_slug,
         ap.practical_slug, ap.category_slug, ap.title_ru, ap.body_ru, ap.cta_ru, ap.disclosure_label_ru, ap.disclosure_ru,
         l.affiliate_url, ap.sort_order
  from public.affiliate_placements ap
  join public.affiliate_links l on l.id = ap.affiliate_link_id
  left join public.districts d on d.id = ap.district_id
  left join public.places p on p.id = ap.place_id
  left join public.routes r on r.id = ap.route_id;
grant select on public.v_affiliate_placements_public to anon, authenticated;

-- Топ-5 района (необязательно): district_id null = общий топ острова
alter table public.top5_sets add column district_id uuid references public.districts(id) on delete cascade;
alter table public.top5_sets drop constraint top5_sets_theme_slug_key;
alter table public.top5_sets add constraint top5_sets_theme_district_key unique nulls not distinct (theme_slug, district_id);

-- Экскурсии скрыты, пока владелец не добавит ссылки GYG/Viator
update public.categories set is_published = false where slug = 'tours';

-- =====================================================================
-- Ред. 4.7 (этап 8, t59u): practical_sources.source_type (official|secondary|owner), url необязателен только для owner; program_key owner_exchange; подпись «Партнёр». Проверено на PG17 24.11.
-- Ред. 4.6 (этап 8): практические страницы 16+ (повторно используем practical_topics/practical_sources)
-- =====================================================================
alter table public.practical_topics
  add column direction text not null default '16plus' check (direction in ('16plus','nomad','21plus')),
  add column summary_ru text,
  add column sections jsonb not null default '[]'::jsonb,   -- [{heading_ru, items:[{text_ru, sources[], verification}]}]
  add column verification_status text not null default 'needs_check'
    check (verification_status in ('verified','partially_verified','needs_check'));
-- публикация только с датой проверки и без статуса needs_check (пункты «требует проверки» помечены в тексте)
alter table public.practical_topics add constraint practical_publish_needs_check
  check (not is_published or (verified_at is not null and verification_status <> 'needs_check'));
alter table public.practical_sources add column source_key text;
create unique index practical_sources_topic_url on public.practical_sources(topic_id, url);
-- гид 16+ показывает только страницы направления 16plus (Nomad&Expat/21+ отдельно)
drop policy pub_read on public.practical_topics;
create policy pub_read on public.practical_topics for select to anon, authenticated using (is_published and direction = '16plus');
drop policy pub_read on public.practical_sources;
create policy pub_read on public.practical_sources for select to anon, authenticated
  using (exists (select 1 from public.practical_topics t where t.id = topic_id and t.is_published and t.direction = '16plus'));
comment on column public.practical_topics.slug is
  '16+: sos, visa-entry, money, connectivity, transport, scooter, sea-safety, health-insurance, safety, laws-etiquette, scams, apps';

-- =====================================================================
-- Ред. 4.7 (этап 8, t59u): источник «владелец», owner-direct партнёр (обмен валюты)
-- =====================================================================
alter table public.practical_sources
  add column source_type text not null default 'official' check (source_type in ('official','secondary','owner')),
  alter column url drop not null;
-- URL обязателен для всех, кроме подтверждений владельца
alter table public.practical_sources add constraint practical_sources_url_required check (url is not null or source_type = 'owner');
alter table public.affiliate_placements drop constraint affiliate_placements_program_key_check;
alter table public.affiliate_placements add constraint affiliate_placements_program_key_check
  check (program_key in ('klook','airalo','localrent','gyg','viator','booking','agoda','tripcom','tiqets','insurance','owner_exchange'));
-- подпись для прямых партнёров владельца — «Партнёр», для сетей — «Партнёрская ссылка»
alter table public.affiliate_placements add constraint affiliate_placements_disclosure_label_check
  check (disclosure_label_ru in ('Партнёрская ссылка','Партнёр'));
