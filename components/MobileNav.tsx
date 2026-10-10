'use client';
import { useState } from 'react';

const links = [
  ['L’école', '/ecole/'], ['Formations', '/formations/'], ['Vie scolaire', '/vie-scolaire/'],
  ['Actualités', '/actualites/'], ['Communiqués', '/communiques/'], ['Contact', '/contact/']
];

export default function MobileNav(){
  const [open,setOpen]=useState(false);
  return <div className="mobileNav">
    <button className="menuBtn" aria-label="Ouvrir le menu" aria-expanded={open} onClick={()=>setOpen(!open)}>
      <span/><span/><span/>
    </button>
    {open && <div className="mobileMenu">
      {links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}
    </div>}
  </div>
}
