'use client';

import { SCHOOL } from '@/lib/config';

export default function MobileContactDock(){
  const phone=SCHOOL.director.phone;
  const wa=SCHOOL.director.whatsapp;
  const text=encodeURIComponent(`Bonjour Monsieur ${SCHOOL.director.name}, je contacte EXCELLENCIA COLLÈGE RIZIKI depuis le site officiel.`);
  return <div className="mobileContactDock" aria-label="Contacts rapides">
    <a href={`tel:${phone}`} aria-label={`Appeler le directeur Kito au ${phone}`}><span>☎</span><small>Appeler</small></a>
    <a className="wa" href={`https://wa.me/${wa}?text=${text}`} target="_blank" rel="noreferrer" aria-label="Écrire au directeur Kito sur WhatsApp"><span>◉</span><small>WhatsApp</small></a>
    <a href="/contact/#message" aria-label="Écrire un message officiel à l’école"><span>✎</span><small>Écrire</small></a>
  </div>
}
