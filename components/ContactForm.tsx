'use client';

import { FormEvent, useState } from 'react';
import { SERVICES } from '@/lib/config';
import { hasSupabase, supabase } from '@/lib/supabase-browser';

export default function ContactForm() {
  const [state, setState] = useState<'idle'|'sending'|'ok'|'error'>('idle');
  const [note, setNote] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending'); setNote('');
    if (!hasSupabase) { setState('error'); setNote('Le service de messagerie sera activé à la mise en ligne.'); return; }
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      service: String(fd.get('service') || '').trim(),
      subject: String(fd.get('subject') || '').trim(),
      message: String(fd.get('message') || '').trim(),
    };
    const { error } = await supabase.from('contact_messages').insert(payload);
    if (!error) { setState('ok'); setNote('Votre message a bien été transmis au service concerné.'); form.reset(); }
    else { setState('error'); setNote("Le message n'a pas pu être envoyé. Vous pouvez utiliser Appeler ou WhatsApp."); }
  }

  return <form className="contactForm" onSubmit={submit}>
    <label>Nom complet<input name="name" required maxLength={120} type="text" placeholder="Votre nom" /></label>
    <label>Téléphone<input name="phone" required maxLength={30} type="tel" inputMode="tel" placeholder="Ex. 09xxxxxxxx" /></label>
    <label>Service<select name="service" required defaultValue=""><option value="" disabled>Choisir un service</option>{SERVICES.map((s)=><option value={s.id} key={s.id}>{s.label}</option>)}</select></label>
    <label>Objet<input name="subject" required maxLength={180} type="text" placeholder="Objet du message" /></label>
    <label className="full">Message<textarea name="message" required maxLength={4000} rows={6} placeholder="Votre message" /></label>
    <button className="btn primary fullBtn" disabled={state==='sending'} type="submit">{state==='sending' ? 'Envoi…' : 'Envoyer le message'}</button>
    {note && <p className={`formStatus ${state}`} role="status">{note}</p>}
  </form>;
}
