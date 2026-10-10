'use client';

import Image from 'next/image';
import MobileNav from '@/components/MobileNav';
import { useSchoolServices, useSiteSettings } from '@/lib/use-site-data';

export const siteLinks = [
  ['L’école','/ecole/'], ['Formations','/formations/'], ['Vie scolaire','/vie-scolaire/'],
  ['Actualités','/actualites/'], ['Communiqués','/communiques/'], ['Contact','/contact/'],
] as const;

export default function SiteHeader(){const settings=useSiteSettings();const services=useSchoolServices();const prefecture=services.find(item=>item.id==='prefecture'),secretariat=services.find(item=>item.id==='secretariat');return <><header className="topbar"><div className="shell topbarInner"><span>{settings.address}</span><span className="topPhones">{prefecture?.phone&&`Préfecture : ${prefecture.phone}`}{prefecture?.phone&&secretariat?.phone?' · ':''}{secretariat?.phone&&`Secrétariat : ${secretariat.phone}`}</span></div></header><nav className="nav"><div className="shell navInner"><a className="brand" href="/" aria-label="Accueil Riziki"><span className="brandLogo"><Image src="/brand/logo-clean.png" alt={`Logo ${settings.name}`} fill className="contain"/></span><span><strong>{settings.name}</strong><small>{settings.motto}</small></span></a><div className="links">{siteLinks.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div><MobileNav/></div></nav></>}
