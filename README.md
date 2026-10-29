# Log Horizon — site officiel

Next.js 14 + Supabase (base de données, connexion admin, images) + Vercel (hébergement).

## Ce que contient le site

**Vue publique (`/`)**
- Hero géant « LOG HORIZON » + accroche + 4 chiffres clés
- Vision (3 piliers), Projets (cartes avec image, logo du sous-projet, statut coloré, « En savoir plus », bouton « Visiter le site ↗ »), Manifeste, Méthode en 4 étapes illustrées
- Pied de page : projets, mentions légales, « Gestion des cookies »
- Bannière cookies RGPD (« Tout accepter », « Essentiels uniquement », politique consultable)
- Pages : `/mentions` (mentions légales et confidentialité), `/sitemap.xml`, `/robots.txt`
- Données par défaut si Supabase est injoignable : le site ne plante jamais

**Admin (`/admin`)** — connexion Supabase Auth, 6 onglets :
- **Projets** : statut, étiquette, description, détails, logo du sous-projet, image de couverture, lien du site, ordre, visible/masqué, ajout, suppression
- **Contenu** : logo Log Horizon (navigation, pied de page, admin), accroche, Vision, Manifeste
- **Apparence** : 4 palettes (Cyber stratégique, Or noir luxueux, Émeraude performance, Sunset ambition), aperçu en direct puis enregistrement
- **Cookies** : texte de la politique, journal des consentements (nombre de choix), réinitialisation
- **Sécurité** : changement de mot de passe (ancien mot de passe demandé, 6 caractères minimum), « mot de passe oublié » par e-mail
- **Infrastructure** : tests en direct de la connexion Supabase (tables, colonnes, stockage d'images, variables)

Tout ce que tu modifies est enregistré dans Supabase et visible tout de suite sur le site public.

## Déployer ou mettre à jour

### 1. Supabase
1. **SQL Editor** → colle tout `supabase/schema.sql` → **Run**. Le script peut être relancé sans danger : refais-le à chaque mise à jour du site pour ajouter les nouvelles colonnes.
2. **Authentication → Users → Add user → Create new user** : ton e-mail + un mot de passe solide, coche **Auto Confirm User**.
3. **Authentication → Sign In / Providers** : désactive **Allow new users to sign up** (sinon n'importe qui pourrait créer un compte admin).
4. **Authentication → URL Configuration** : *Site URL* = l'adresse de ton site ; *Redirect URLs* = `https://TON-SITE/admin`.
5. **Project Settings → API** : copie l'**URL** et la clé **anon public**. Jamais la clé `service_role`.

### 2. Vercel
1. **Settings → Environment Variables** (cocher Production, Preview et Development) :
   - `NEXT_PUBLIC_SUPABASE_URL` = l'URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = la clé anon public
   - `NEXT_PUBLIC_SITE_URL` = l'adresse du site, par exemple `https://log-horizon-one.vercel.app`
2. Mets le code à jour : pousse ce dossier sur GitHub puis **Connect Git** dans Vercel (chaque modification se redéploie ensuite toute seule), ou envoie à nouveau le dossier.
3. **Deployments → ⋯ → Redeploy** si tu as seulement changé des variables d'environnement.

### 3. Vérifier
Ouvre `/admin`, connecte-toi, onglet **Infrastructure** : toutes les lignes doivent être vertes. Puis règle l'**Apparence**, envoie le **logo** (Contenu) et les **images** + le lien du site de Sneaker Wash 28 (Projets).

## À compléter avant de communiquer le site
- `lib/legal.js` : ton nom, statut, ville, e-mail (page Mentions légales). Modèle non juridique.
- Les 7 photos de `public/images/` : vérifie que tu as le droit de les utiliser publiquement.
- Aucun outil de mesure d'audience n'est installé : le choix « Tout accepter » est enregistré mais ne déclenche rien. Adapte le texte de la politique si besoin.

## Si quelque chose ne marche pas
| Symptôme | Cause probable |
|---|---|
| L'admin dit « Supabase n'est pas branché » | Variables absentes sur Vercel → les ajouter puis Redeploy |
| Connexion refusée | Utilisateur non créé, ou non confirmé (Auto Confirm) |
| Palette, logo ou image qui ne s'enregistre pas | Relancer `schema.sql` (colonnes ou bucket manquants) |
| Le site affiche les projets par défaut | Clés incorrectes ou `schema.sql` non exécuté : l'onglet Infrastructure le dit |
| « Mot de passe oublié » ne redirige pas | `https://TON-SITE/admin` absent des Redirect URLs |

## Sécurité
Seuls les utilisateurs connectés peuvent écrire (règles RLS dans `schema.sql`). Les visiteurs lisent les projets visibles et peuvent seulement ajouter un choix de cookies. La clé `anon` est publique par conception.

## En local (optionnel)
```
cp .env.example .env.local     # remplis les variables
npm install
npm run dev                    # http://localhost:3000
```

## Structure
```
app/            pages : accueil, admin, mentions, sitemap, robots, styles (palettes dans globals.css)
components/     interface publique + components/admin/ (6 onglets)
lib/            client Supabase, lecture des données, thèmes, upload d'images, textes par défaut
public/images/  7 visuels (cartes et méthode)
supabase/       schema.sql
```
