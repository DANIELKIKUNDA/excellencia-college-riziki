# EXCELLENCIA COLLÈGE RIZIKI — Site V9

Architecture retenue pour respecter le choix de l'école : **GitHub Pages pour le site public + Supabase pour les données, l'authentification, l'administration et les fonctions sécurisées**.

## Pourquoi cette architecture
GitHub Pages ne peut héberger que des fichiers statiques. La V9 exporte donc Next.js en site statique (`output: export`). Les fonctions dynamiques passent par Supabase : base PostgreSQL, Auth, RLS et Edge Functions.

## Déploiement GitHub Pages
1. Créer un dépôt GitHub et pousser ce projet sur `main`.
2. Dans `Settings > Pages`, choisir **GitHub Actions** comme source.
3. Dans `Settings > Secrets and variables > Actions > Variables`, créer :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_YOUTUBE_URL`
   - `NEXT_PUBLIC_FACEBOOK_URL`
   - `NEXT_PUBLIC_TIKTOK_URL`
4. Le workflow `.github/workflows/deploy-pages.yml` publie automatiquement le dossier `out/`.

## Supabase
1. Créer un projet Supabase séparé dans l'organisation existante.
2. Exécuter `supabase/schema.sql` dans SQL Editor.
3. Créer les comptes du personnel dans Authentication > Users.
4. Insérer leur profil dans `public.profiles` avec le même UUID.
5. Déployer les fonctions : `subscribe-push`, `send-push` et `manage-users`.
6. Définir les secrets VAPID dans Supabase Edge Functions.

## Administration
`/admin/` reste une page du site GitHub Pages, mais l'authentification et les droits sont gérés par Supabase Auth + RLS. Aucune clé `service_role` n'est exposée dans GitHub Pages.

### Rôles
- `staff` : voit et traite uniquement les messages de son service.
- `manager` : gestionnaire scolaire ; traite tous les messages et publie les actualités et communiqués.
- `system_admin` : administrateur technique ; possède les droits du gestionnaire et gère les comptes du personnel.

Le directeur des études reçoit provisoirement le rôle `system_admin`. Le titulaire du titre « administrateur » de l'école reçoit le rôle `manager`.

## Médias
Uniquement les vraies photos fournies par EXCELLENCIA COLLÈGE RIZIKI. Aucun visuel fictif ne doit être ajouté.


## Nouveautés V9
- Domaine officiel préconfiguré : `https://excellenciariziki.com`.
- SEO renforcé : canonical, Open Graph avec vraie photo du campus, GoogleBot, sitemap et robots configurés pour le domaine final.
- Finition UI/UX institutionnelle : badge « Site officiel », repères du parcours, section d’engagement, barre de domaine officielle et navigation affinée.
- Accessibilité : lien d’évitement et respect renforcé de `prefers-reduced-motion`.
- Aucune photo fictive : uniquement les médias réels fournis par l’école.


## V10 — contact officiel
- Adresse e-mail officielle intégrée au pied de page : `excellenciacollegeriziki@gmail.com`.
- Lien `mailto:` cliquable depuis mobile et ordinateur.
- Domaine officiel rappelé dans le footer.
- Données structurées Schema.org enrichies avec l'adresse e-mail institutionnelle.

## V11 / 1.0.0 — version de finition
- Intégration de 10 photographies réelles de l’établissement, optimisées sans fabrication de contenu (lumière, contraste, netteté, compression WebP).
- Nouvelle galerie premium avec agrandissement au clic et navigation accessible.
- Bloc dédié à la maternelle à partir de la vraie salle équipée d’un écran.
- Avatar social carré/circulaire dérivé du logo fourni, adapté aux profils YouTube/TikTok/Facebook.
- Image Open Graph remplacée par une vraie photo optimisée du campus.
- Texte du formulaire mis à jour pour refléter le branchement Supabase prévu.
- Version applicative portée à 1.0.0.
