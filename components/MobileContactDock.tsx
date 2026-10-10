'use client';

import { SCHOOL } from '@/lib/config';
import { useSchoolServices } from '@/lib/use-site-data';

export default function MobileContactDock(){
  const services=useSchoolServices();
  const director=services.find(service=>service.id==='direction');
  const phone=director?.phone||SCHOOL.director.phone;
  const wa=director?.whatsapp||SCHOOL.director.whatsapp;
  const name=director?.person||SCHOOL.director.name;
  const text=encodeURIComponent(`Bonjour Monsieur ${name}, je contacte EXCELLENCIA COLLÈGE RIZIKI depuis le site officiel.`);
  return <div className="mobileContactDock" aria-label="Contacts rapides">
    <a href={`tel:${phone}`} aria-label={`Appeler ${name} au ${phone}`}><span>☎</span><small>Appeler</small></a>
    <a className="wa" href={`https://wa.me/${wa}?text=${text}`} target="_blank" rel="noreferrer" aria-label={`Écrire à ${name} sur WhatsApp`}><span>◉</span><small>WhatsApp</small></a>
    <a href="/contact/?service=direction#message" aria-label="Écrire un message officiel à la direction"><span>✎</span><small>Écrire</small></a>
  </div>
}
