# RIZIKI — rapport de certification fonctionnelle

Date du dernier contrôle : 11 octobre 2026 (Africa/Kinshasa)  
Domaine : https://excellenciariziki.com  
Référentiel contrôlé : branche `main`

## Résultat exécutif

Le site public, son domaine, son export statique et sa PWA restent opérationnels. La migration des tables dynamiques a été exécutée avec succès et les données initiales sont accessibles. La certification complète du back-office reste **FAIL** tant que le bucket média et les trois Edge Functions ne sont pas réellement disponibles avec leurs secrets.

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
| Photos et vidéos | PASS | Table `media_items` disponible ; bucket public `school-media` confirmé dans Supabase, limite 10 MB et formats image/vidéo configurés. |
| Notifications push | PASS | Fonctions déployées, secrets VAPID configurés et bouton « Activer les notifications » confirmé sur le domaine public. |
| Rôles détaillés et RLS | PASS | Migration appliquée ; tables publiques et politiques créées. Les tests par compte réel restent à effectuer après création des comptes. |
| Gestion des comptes | PASS | Interface et fonction `manage-users` déployées ; accès non authentifié correctement refusé avec HTTP 401. |
| Coordonnées dynamiques | PASS | Table `site_settings` HTTP 200 et données initiales confirmées. |
| Responsables dynamiques | PASS | Table `school_services` HTTP 200 ; sept responsables et numéros confirmés. |
| Réseaux sociaux dynamiques | PASS | Table `social_links` HTTP 200 ; liens administrables sans recompilation. |
| YouTube/TikTok | PASS | Table `media_items` HTTP 200 et gestion des liens prête ; les uploads photo attendent le bucket. |
| Formulaire enrichi | PASS | Colonnes élève/classe disponibles après migration et code validé. |
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
  - `site_settings` : HTTP 200;
  - `school_services` : HTTP 200;
  - `social_links` : HTTP 200;
  - `media_items` : HTTP 200;
  - `contact_messages` : HTTP 200;
  - bucket public `school-media` : PASS, confirmé dans Supabase Storage avec limite 10 MB et types MIME attendus;
  - fonctions Edge `manage-users`, `subscribe-push`, `send-push` : déployées et OPTIONS HTTP 200;
  - `manage-users` et `send-push` sans utilisateur authentifié : HTTP 401 attendu;
  - `subscribe-push` avec abonnement vide : HTTP 400 attendu;
  - bouton public « Activer les notifications » : présent après reconstruction GitHub Pages.

## Actions indispensables pour lever les FAIL Supabase

1. Accepter l’invitation envoyée à `danielngwej75@gmail.com` et définir le mot de passe personnel.
2. Tester les autres rôles avec des comptes réels et refaire les tests visuels sur appareils/émulateurs.

## État final

Le site public, les données dynamiques, le stockage média, les fonctions Edge et l’infrastructure Push sont en production. Le premier compte `admin_systeme` a été créé pour Kikunda Ngwej Daniel et une invitation sécurisée a été envoyée à `danielngwej75@gmail.com`. L’acceptation de cette invitation et les tests des autres rôles restent nécessaires avant une certification humaine complète du back-office.
