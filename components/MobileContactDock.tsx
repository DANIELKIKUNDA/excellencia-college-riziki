'use client';

export default function MobileContactDock(){
  const phone='0961247956';
  const wa='243961247956';
  const text=encodeURIComponent('Bonjour, je contacte EXCELLENCIA COLLÈGE RIZIKI depuis le site officiel.');
  return <div className="mobileContactDock" aria-label="Contacts rapides">
    <a href={`tel:${phone}`}><span>☎</span><small>Appeler</small></a>
    <a className="wa" href={`https://wa.me/${wa}?text=${text}`} target="_blank" rel="noreferrer"><span>◉</span><small>WhatsApp</small></a>
    <a href="#message"><span>✎</span><small>Écrire</small></a>
  </div>
}
