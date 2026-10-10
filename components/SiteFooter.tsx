import Image from 'next/image';
import MobileContactDock from '@/components/MobileContactDock';
import SocialLinks from '@/components/SocialLinks';
import BackToTop from '@/components/BackToTop';
import FooterSchoolInfo from '@/components/FooterSchoolInfo';

export default function SiteFooter(){return <><section className="officialStrip"><div className="shell officialStripInner"><div><small>SITE OFFICIEL</small><strong>excellenciariziki.com</strong></div><p>Une seule adresse pour découvrir l’école, suivre ses actualités et contacter ses services.</p></div></section><MobileContactDock/><BackToTop/><footer className="footer"><div className="shell footerGrid"><div className="footerBrand"><Image src="/brand/logo-clean.png" alt="Logo Riziki" width={88} height={64}/><div><strong>EXCELLENCIA COLLÈGE RIZIKI</strong><p>Discipline · Travail · Excellence</p></div></div><FooterSchoolInfo/><div><strong>Réseaux officiels</strong><SocialLinks/><a className="staffAccess" href="/admin/">Espace personnel / Administration</a></div></div><div className="copyright">© 2026 EXCELLENCIA COLLÈGE RIZIKI — Tous droits réservés.</div></footer></>}
