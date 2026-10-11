'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { hasSupabase, supabase } from '@/lib/supabase-browser';

type Stage = 'loading' | 'password' | 'success' | 'error';

export default function AuthCallback() {
  const [stage, setStage] = useState<Stage>('loading');
  const [message, setMessage] = useState('Validation du lien sécurisé…');

  useEffect(() => {
    let mounted = true;
    async function establishSession() {
      if (!hasSupabase) { setMessage('Le service d’authentification n’est pas configuré.'); setStage('error'); return; }
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const tokenHash = url.searchParams.get('token_hash');
        const type = url.searchParams.get('type') as 'invite' | 'recovery' | 'signup' | 'email_change' | null;
        const hash = new URLSearchParams(url.hash.slice(1));
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        const authError = url.searchParams.get('error_description') || hash.get('error_description');
        if (authError) throw new Error(authError);
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Le lien est invalide, incomplet ou expiré.');
        if (!mounted) return;
        window.history.replaceState({}, document.title, '/auth/callback/');
        setMessage(type === 'recovery' ? 'Choisissez votre nouveau mot de passe.' : 'Invitation validée. Définissez maintenant votre mot de passe.');
        setStage('password');
      } catch (error) {
        if (!mounted) return;
        setMessage(error instanceof Error ? error.message : 'Impossible de valider ce lien.');
        setStage('error');
      }
    }
    establishSession();
    return () => { mounted = false; };
  }, []);

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmation = String(form.get('confirmation') || '');
    if (password.length < 10) return setMessage('Utilisez au moins 10 caractères.');
    if (password !== confirmation) return setMessage('Les deux mots de passe ne correspondent pas.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMessage(error.message);
    setMessage('Votre mot de passe est enregistré. Vous pouvez accéder à l’administration.');
    setStage('success');
  }

  return <div className="authCard">
    <div className="authMark" aria-hidden="true">✓</div>
    <p className="sectionKicker">ACCÈS SÉCURISÉ</p><h1>Activation du compte</h1>
    <p className={stage === 'error' ? 'formStatus error' : 'formStatus'} role="status">{message}</p>
    {stage === 'password' && <form onSubmit={savePassword}>
      <label>Nouveau mot de passe<input name="password" type="password" minLength={10} autoComplete="new-password" required /></label>
      <label>Confirmer le mot de passe<input name="confirmation" type="password" minLength={10} autoComplete="new-password" required /></label>
      <button className="btn primary" type="submit">Enregistrer et continuer</button>
    </form>}
    {stage === 'success' && <Link className="btn primary" href="/admin/">Ouvrir l’administration</Link>}
    {stage === 'error' && <><p>Demandez une nouvelle invitation ou un nouveau lien de récupération.</p><Link className="btn light" href="/admin/">Retour à la connexion</Link></>}
  </div>;
}
