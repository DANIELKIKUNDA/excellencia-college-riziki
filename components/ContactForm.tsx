'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSchoolServices } from '@/lib/use-site-data';
import { hasSupabase, supabase } from '@/lib/supabase-browser';

export default function ContactForm() {
  const services=useSchoolServices();
  const [state, setState] = useState<'idle'|'sending'|'ok'|'error'>('idle');
  const [note, setNote] = useState('');
  const [selectedService,setSelectedService]=useState('');
  useEffect(()=>{const value=new URLSearchParams(window.location.search).get('service');if(value)setSelectedService(value)},[]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending'); setNote('');
    if (!hasSupabase) { setState('error'); setNote('Le service de messagerie sera activé à la mise en ligne.'); return; }
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      student_name: String(fd.get('student_name') || '').trim() || null,
      student_class: String(fd.get('student_class') || '').trim() || null,
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
    <label>Service<select name="service" required value={selectedService} onChange={event=>setSelectedService(event.target.value)}><option value="" disabled>Choisir un service</option>{services.map((s)=><option value={s.id} key={s.id}>{s.label}</option>)}</select></label>
    <label>Objet<input name="subject" required maxLength={180} type="text" placeholder="Objet du message" /></label>
    <label>Nom de l’élève <span>(facultatif)</span><input name="student_name" maxLength={120} type="text" placeholder="Nom de l’élève" /></label>
    <label>Classe <span>(facultatif)</span><input name="student_class" maxLength={80} type="text" placeholder="Ex. 6e primaire" /></label>
    <label className="full">Message<textarea name="message" required maxLength={4000} rows={6} placeholder="Votre message" /></label>
    <button className="btn primary fullBtn" disabled={state==='sending'} type="submit">{state==='sending' ? 'Envoi…' : 'Envoyer le message'}</button>
    {note && <p className={`formStatus ${state}`} role="status">{note}</p>}
  </form>;
}
