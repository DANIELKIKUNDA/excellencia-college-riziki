import Link from 'next/link';
import AdminConsole from '@/components/AdminConsole';

export const metadata = { title: { absolute: 'Administration | EXCELLENCIA COLLÈGE RIZIKI' }, robots: { index: false, follow: false, noarchive: true } };

export default function AdminPage() {
  return <main className="adminPage"><div className="shell"><div className="adminHeader"><div><p className="sectionKicker">ESPACE PRIVÉ</p><h1>Administration Riziki</h1><p>Gestion des messages, actualités et communiqués de l’école.</p></div><Link href="/" className="btn light">Retour au site</Link></div><AdminConsole /></div></main>;
}
