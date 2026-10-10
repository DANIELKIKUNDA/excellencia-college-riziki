# RIZIKI — rapport de certification fonctionnelle

Date du contrôle : 10 octobre 2026 (Africa/Kinshasa)  
Domaine : https://excellenciariziki.com  
Référentiel contrôlé : branche `main`

## Résultat exécutif

Le site public, son domaine, son export statique et sa PWA restent opérationnels. La finition mobile et le code du back-office dynamique sont livrés. La certification complète du back-office reste **FAIL** tant que `supabase/finalization.sql` n’a pas été exécuté et que les trois Edge Functions n’ont pas été déployées avec leurs secrets. Les quatre nouvelles tables renvoient actuellement HTTP 404 sur le projet Supabase public.

## Contrôle par exigence

| Point | État | Preuve / résultat |
|---|---|---|
| Barre mobile Appeler | PASS | Lien natif `tel:` vers la direction, issu des données dynamiques avec repli local. |
| Barre mobile WhatsApp | PASS | Lien `https://wa.me/` avec numéro international et message prérempli. |
| Barre mobile Écrire | PASS | Accès direct à `/contact/?service=direction#message`. |
| Écrire depuis une carte | PASS | Le service est transporté dans l’URL puis présélectionné dans le formulaire. |
| Retour en haut flottant | PASS | Bouton circulaire après 500 px, défilement doux et prise en charge de `prefers-reduced-motion`. |
| Accès personnel public | PASS | Lien discret dans le footer vers `/admin/`; connexion Supabase Auth existante. |
| Messages parents | PASS | Lecture par RLS, statuts nouveau/en traitement/clôturé et affichage élève/classe. |
| Actualités | PASS | Création, modification, publication/dépublication et suppression dans l’interface. |
| Communiqués | PASS | Création, modification, publication/dépublication et suppression dans l’interface. |
| Photos et vidéos | FAIL | Interface, stockage et affichage codés, mais table/bucket Supabase non créés en production. |
| Notifications push | FAIL | Code présent ; fonctions Edge/VAPID non certifiés comme déployés en production. |
| Rôles détaillés et RLS | FAIL | Migration SQL prête ; non appliquée au projet Supabase en ligne. |
| Gestion des comptes | FAIL | Interface et fonction Edge mises à jour ; fonction `manage-users` non certifiée déployée. |
| Coordonnées dynamiques | FAIL | Lecture/édition avec repli sûr codées ; table `site_settings` absente en production. |
| Responsables dynamiques | FAIL | Lecture/édition avec repli sûr codées ; table `school_services` absente en production. |
| Réseaux sociaux dynamiques | FAIL | Lecture/édition codées ; table `social_links` absente en production. |
| YouTube/TikTok | FAIL | Ajout et cartes publiques codés ; table `media_items` absente en production. |
| Formulaire enrichi | FAIL | Code validé ; colonnes `student_name` et `student_class` restent à migrer en production. |
| UX mobile structurelle | PASS | Centrage des héros, images visibles, contrôles ≥44 px, champs à 16 px et protection contre le scroll horizontal. |
| Audit visuel 320/360/390/412 | FAIL | Aucun navigateur automatisé avec simulation de viewport n’est disponible dans cet environnement. |
| Audit tablette/desktop | FAIL | Compilation et CSS validés, mais pas de certification visuelle automatisée par viewport. |
| SEO | PASS | Métadonnées, canonical, Open Graph, sitemap et robots générés. |
| PWA | PASS | Manifeste, icônes, service worker, HTTPS et stratégie réseau prioritaire présents. |
| Build de production | PASS | `npm run typecheck` et `npm run build` réussis, 12 routes statiques générées. |
| Sécurité des secrets | PASS | Aucune clé service-role ajoutée au frontend ; seules les variables publiques sont consommées côté navigateur. |

## Changements réalisés

- Actions téléphoniques natives et routage direct du formulaire par service.
- Bouton flottant de retour en haut et suppression du lien collé au footer.
- Lien « Espace personnel / Administration » dans le footer.
- Champs facultatifs nom de l’élève et classe.
- Données publiques dynamiques avec repli sûr : école, responsables, numéros et réseaux.
- Back-office pour les contenus, médias, paramètres, responsables, réseaux et comptes.
- Ajout/modification/suppression de photos et de liens YouTube/TikTok.
- Rôles détaillés, activation des comptes et politiques RLS préparés.
- Bucket public `school-media` avec écritures limitées aux rôles autorisés.
- Numéro du gestionnaire Fofana Chansa : `0961247956` / WhatsApp `243961247956`.

## Tests exécutés

- `npm.cmd run typecheck` : PASS.
- `npm.cmd run build` : PASS.
- Export statique : 12 routes générées.
- `git diff --check` : aucune erreur d’espace ou de patch.
- Contrôle des liens `tel:`, `wa.me`, formulaire ciblé et inscription du service worker : PASS par inspection du build/source.
- Vérification REST Supabase en lecture seule :
  - `site_settings` : HTTP 404;
  - `school_services` : HTTP 404;
  - `social_links` : HTTP 404;
  - `media_items` : HTTP 404.

## Actions indispensables pour lever les FAIL Supabase

1. Exécuter intégralement `supabase/finalization.sql` dans Supabase SQL Editor.
2. Déployer `manage-users`, `subscribe-push` et `send-push`.
3. Configurer les secrets VAPID et la clé service-role uniquement dans les secrets des Edge Functions.
4. Créer le premier compte `admin_systeme` de manière sécurisée dans Supabase Auth, puis son profil actif.
5. Tester chaque rôle avec un compte réel et refaire les tests visuels sur appareils/émulateurs.

## État final

Le site public est publiable sans régression grâce aux données de repli. Le back-office avancé ne doit pas être déclaré exploitable en production avant l’application de la migration et le déploiement des Edge Functions. Ce rapport utilise volontairement **FAIL** pour les éléments non prouvés, même lorsque leur code est livré.
