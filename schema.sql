-- ============================================================
-- LOG HORIZON — schéma Supabase
-- À coller en entier dans Supabase > SQL Editor > Run.
-- Peut être relancé sans danger (idempotent) : à relancer après
-- chaque mise à jour du site pour ajouter les nouvelles colonnes.
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  status      text not null default 'En réflexion'
              check (status in ('En cours','Standby','En réflexion','Lancement')),
  tag         text not null default '',
  icon        text not null default '✨',
  description text not null default '',
  details     text[] not null default '{}',
  logo_url    text,
  image_url   text,
  site_url    text,
  position    int  not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.site_content (
  id            int primary key check (id = 1),   -- une seule ligne
  logo_url      text,
  tagline       text,
  vision        text,
  manifesto     text,
  cookie_policy text,
  theme         text not null default 'cyber'
);

-- Journal RGPD des choix cookies (preuve de consentement)
create table if not exists public.consents (
  id         uuid primary key default gen_random_uuid(),
  visitor_id text,
  choice     text not null check (choice in ('all','essential')),
  created_at timestamptz not null default now()
);

-- ---------- Mise à jour d'une base créée avec une version précédente ----------
alter table public.projects     add column if not exists logo_url text;
alter table public.site_content add column if not exists logo_url text;
alter table public.site_content add column if not exists theme text not null default 'cyber';

alter table public.site_content drop constraint if exists site_content_theme_check;
alter table public.site_content add constraint site_content_theme_check
  check (theme in ('cyber','gold','emerald','sunset'));

-- ---------- Sécurité (Row Level Security) ----------
alter table public.projects     enable row level security;
alter table public.site_content enable row level security;
alter table public.consents     enable row level security;

-- projects : le public lit les projets visibles ; l'admin connecté fait tout
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select to anon, authenticated using (visible = true);

drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects
  for all to authenticated using (true) with check (true);

-- site_content : lecture publique, écriture admin
drop policy if exists "content_public_read" on public.site_content;
create policy "content_public_read" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "content_admin_write" on public.site_content;
create policy "content_admin_write" on public.site_content
  for all to authenticated using (true) with check (true);

-- consents : les visiteurs peuvent seulement ajouter ; seul l'admin lit
drop policy if exists "consents_public_insert" on public.consents;
create policy "consents_public_insert" on public.consents
  for insert to anon, authenticated with check (choice in ('all','essential'));

drop policy if exists "consents_admin_read" on public.consents;
create policy "consents_admin_read" on public.consents
  for select to authenticated using (true);

-- ---------- Storage : bucket public pour les images ----------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'project-images');

drop policy if exists "images_admin_insert" on storage.objects;
create policy "images_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-images');

drop policy if exists "images_admin_update" on storage.objects;
create policy "images_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'project-images');

drop policy if exists "images_admin_delete" on storage.objects;
create policy "images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'project-images');

-- ---------- Données de départ (insérées une seule fois) ----------
insert into public.site_content (id, tagline, vision, manifesto, cookie_policy, theme)
values (
  1,
  $$L'entreprise polyvalente qui évolue avec les tendances. Chaque projet d'aujourd'hui est une brique de l'architecture de demain.$$,
  $$Log Horizon est la destination finale d'un parcours entrepreneurial construit étape par étape. Polyvalente dans tous les secteurs, l'entreprise crée de nouvelles sections en fonction des tendances, en mobilisant plusieurs corps de métier. Les projets actuels ne sont pas des fins en soi : ce sont des bains d'entraînement où chaque euro gagné, chaque ligne de code écrite et chaque compétence commerciale acquise posent directement les fondations de Log Horizon.$$,
  $$Chaque euro gagné, chaque ligne de code, chaque client conquis : une brique de plus vers l'horizon.$$,
  $$Log Horizon utilise des cookies essentiels au fonctionnement du site (préférences, sécurité). Avec ton accord, des cookies de mesure d'audience permettent d'améliorer l'expérience. Tu peux changer ton choix à tout moment via « Gestion des cookies » en bas de page.$$,
  'cyber'
)
on conflict (id) do nothing;

insert into public.projects (name, status, tag, icon, description, details, position)
select * from (values
  ($$Sneaker Wash 28$$, 'En cours', $$Services locaux · Cash-flow$$, '👟',
   $$Nettoyage, désinfection, rénovation et déjaunissement UV de sneakers sur Chartres et Courville-sur-Eure. Le moteur de cash-flow immédiat et le laboratoire grandeur nature.$$,
   array['Pack Fresh — 15 €','Pack Deep Clean — 25 €','Pack Premium — 40 €','Offre Starter : 3 premiers clients gratuits, puis de 1 € à 9 €']::text[], 1),
  ($$Silicon Harvest$$, 'Standby', $$Écologie · Tech$$, '♻️',
   $$Récupération d'appareils électroniques obsolètes ou cassés par démarchage et porte-à-porte, démontage de précision et revente des composants clés (GPU, RAM, puces) et des métaux précieux.$$,
   array['Valorisation matérielle intelligente','Démarche écoresponsable','Sourcing terrain : porte-à-porte']::text[], 2),
  ($$Black Silk$$, 'En réflexion', $$E-commerce · Arbitrage$$, '🛒',
   $$Arbitrage commercial automatisé à forte marge : sourcing et importation de produits à forte valeur perçue auprès de grossistes en Chine, revente sur le marché européen.$$,
   array['Marges visées : x3 à x5','Financé par la trésorerie des premiers business','Import Chine → Europe']::text[], 3),
  ($$Clout Lab$$, 'En réflexion', $$SaaS · Créateurs de contenu$$, '🚀',
   $$Application SaaS et plateforme de croissance pour créateurs de contenu et streamers (Twitch, TikTok, Kick). L'actif numérique hautement scalable du portefeuille.$$,
   array['Boost d''audience et de visibilité','Outils pour streamers','Scalabilité long terme']::text[], 4)
) as v(name, status, tag, icon, description, details, position)
where not exists (select 1 from public.projects);
