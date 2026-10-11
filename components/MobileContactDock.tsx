'use client';

import { usePathname } from 'next/navigation';

export default function MobileContactDock(){
  const pathname=usePathname();
  const items=[
    {href:'/',icon:'⌂',label:'Accueil'},
    {href:'/actualites/',icon:'◫',label:'Actualités'},
    {href:'/communiques/',icon:'●',label:'Communiqués'},
    {href:'/contact/',icon:'☎',label:'Services'},
    {href:'/contact/#message',icon:'✎',label:'Écrire'},
  ];
  return <nav className="mobileContactDock" aria-label="Navigation rapide des parents">{items.map(item=><a className={!item.href.includes('#')&&pathname===item.href?'active':''} href={item.href} key={item.label} aria-label={item.label}><span aria-hidden="true">{item.icon}</span><small>{item.label}</small></a>)}</nav>
}
