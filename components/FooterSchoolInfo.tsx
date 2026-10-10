'use client';

import { useSiteSettings } from '@/lib/use-site-data';

export default function FooterSchoolInfo(){
  const settings=useSiteSettings();
  return <><div><strong>Adresse</strong><p>{settings.address}</p></div><div><strong>Contact officiel</strong><p><a className="footerMail" href={`mailto:${settings.email}`}>{settings.email}</a><br/><a className="footerSite" href={settings.website}>{settings.website.replace(/^https?:\/\//,'')}</a></p></div></>;
}
