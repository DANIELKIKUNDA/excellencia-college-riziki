'use client';

import { useEffect, useState } from 'react';
import { hasSupabase, supabase } from '@/lib/supabase-browser';

type Social = { platform:string; url:string; active:boolean };

export default function SocialLinks() {
  const [active,setActive]=useState<Social[]>([]);
  useEffect(()=>{if(!hasSupabase)return;supabase.from('social_links').select('platform,url,active').eq('active',true).then(({data})=>setActive((data||[]).filter(item=>Boolean(item.url)) as Social[]))},[]);
  if (!active.length) return <p><small>Liens officiels bientôt disponibles</small></p>;
  return (
    <div className="socialLinks" aria-label="Réseaux sociaux officiels">
      {active.map(item => <a key={item.platform} href={item.url} target="_blank" rel="noreferrer">{item.platform.charAt(0).toUpperCase()+item.platform.slice(1)}</a>)}
    </div>
  );
}
