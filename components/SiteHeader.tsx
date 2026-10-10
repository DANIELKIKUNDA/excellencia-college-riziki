import Image from 'next/image';
import MobileNav from '@/components/MobileNav';

export const siteLinks = [
  ['L’école','/ecole/'], ['Formations','/formations/'], ['Vie scolaire','/vie-scolaire/'],
  ['Actualités','/actualites/'], ['Communiqués','/communiques/'], ['Contact','/contact/'],
] as const;

export default function SiteHeader(){return <><header className="topbar"><div className="shell topbarInner"><span>Avenue College Masombo n°23, quartier Hewa Bora, commune Kampempa</span><span className="topPhones">Préfecture : 0977712959 · Secrétariat : 0977872797</span></div></header><nav className="nav"><div className="shell navInner"><a className="brand" href="/" aria-label="Accueil Riziki"><span className="brandLogo"><Image src="/brand/logo-clean.png" alt="Logo EXCELLENCIA COLLÈGE RIZIKI" fill className="contain"/></span><span><strong>EXCELLENCIA COLLÈGE RIZIKI</strong><small>Discipline · Travail · Excellence</small></span></a><div className="links">{siteLinks.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div><MobileNav/></div></nav></>}
