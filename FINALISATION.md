# EXCELLENCIA COLLÈGE RIZIKI — Finalisation 1.0.0

## État du projet
Le frontend public, l'administration, le contact multicanal, la PWA, le SEO et la base Supabase sont préparés. Les comptes TikTok/YouTube/Facebook restent facultatifs pour le premier déploiement : leurs liens peuvent être ajoutés ensuite via les variables GitHub Actions.

## Avant publication
1. Créer le projet Supabase `excellencia-college-riziki` dans l'organisation existante.
2. Exécuter `supabase/schema.sql` dans SQL Editor.
3. Créer le premier utilisateur dans Authentication > Users, puis insérer son UUID dans `public.profiles` avec `role='admin'`.
4. Ajouter dans GitHub Actions Variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://excellenciariziki.com`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (peut rester vide au premier déploiement si les notifications sont différées)
   - `NEXT_PUBLIC_YOUTUBE_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_TIKTOK_URL` (peuvent rester vides)
5. GitHub Pages > Source : GitHub Actions.
6. Custom domain : `excellenciariziki.com`.
7. Chez Hetzner DNS, créer les enregistrements GitHub Pages demandés par GitHub puis attendre la validation DNS et activer `Enforce HTTPS`.

## Après publication
- Soumettre `https://excellenciariziki.com/sitemap.xml` à Google Search Console et Bing Webmaster Tools.
- Ajouter les liens sociaux quand les comptes officiels sont disponibles.
- Déployer les Edge Functions Supabase `subscribe-push` et `send-push` et leurs secrets VAPID pour activer les notifications Web Push.

## Règle média
Le site n'utilise que des photos réelles fournies par l'établissement. Les 10 photos intégrées à la version 1.0.0 ont uniquement reçu des corrections de présentation Web (orientation, lumière, contraste, netteté et compression) ; aucun bâtiment, élève ou équipement n'a été ajouté.
