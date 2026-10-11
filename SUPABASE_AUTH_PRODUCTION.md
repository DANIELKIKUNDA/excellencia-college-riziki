# Authentification Supabase en production

## Configuration obligatoire du tableau de bord

Dans **Authentication → URL Configuration** :

- Site URL : `https://excellenciariziki.com`
- Redirect URLs :
  - `https://excellenciariziki.com/auth/callback/`
  - `https://excellenciariziki.com/admin/`
  - `http://localhost:3000/auth/callback/` uniquement pour le développement local

Ne pas utiliser de joker large en production. Les URL HTTPS doivent conserver leur barre oblique finale, conformément à l’export statique GitHub Pages.

## Invitation administrateur

Pour une nouvelle invitation ou le renvoi d’une invitation expirée :

1. Ouvrir **Authentication → Users**.
2. Sélectionner `danielngwej75@gmail.com`.
3. Utiliser **Resend invitation** si l’action est proposée.
4. Sinon, utiliser **Send password recovery** : le parcours de récupération termine également la définition sécurisée du mot de passe, sans supprimer le compte ni son profil.
5. Le lien doit aboutir à `https://excellenciariziki.com/auth/callback/`.

Le profil lié doit être actif et porter le rôle `admin_systeme`. Vérification en lecture seule dans SQL Editor :

```sql
select u.id, u.email, u.email_confirmed_at, p.full_name, p.role, p.active
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) = lower('danielngwej75@gmail.com');
```

Résultat attendu : `role = 'admin_systeme'` et `active = true`. Ne jamais placer la clé `service_role` dans GitHub, dans une variable `NEXT_PUBLIC_*` ou dans le navigateur.

## Modèles d’e-mail

Les modèles Supabase peuvent conserver `{{ .ConfirmationURL }}` : Supabase y injecte la redirection autorisée. Si un modèle personnalisé construit lui-même l’URL, utiliser une URL Supabase de vérification avec `redirect_to=https://excellenciariziki.com/auth/callback/`, encodée correctement. Ne jamais écrire `localhost` dans un modèle de production.
