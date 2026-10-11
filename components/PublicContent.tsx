'use client';
import { useEffect, useState } from 'react';
import { hasSupabase, supabase } from '@/lib/supabase-browser';
type Item={id:string;title:string;excerpt?:string;body?:string;published_at?:string;audience?:string};
export default function PublicContent({type}:{type:'news'|'announcements'}){
 const [items,setItems]=useState<Item[]>([]); const [loaded,setLoaded]=useState(false);
 useEffect(()=>{let alive=true;(async()=>{
   if(!hasSupabase){if(alive)setLoaded(true);return;}
   const table=type==='news'?'news':'announcements';
   const {data}=await supabase.from(table).select('id,title,excerpt,body,published_at,audience').eq('published',true).order('published_at',{ascending:false}).limit(6);
   if(alive){setItems((data||[]) as Item[]);setLoaded(true);}
 })();return()=>{alive=false}},[type]);
 if(!loaded) return <div className="emptyState">Chargement…</div>;
 if(!items.length) return <div className="emptyState">{type==='news'?'Les premières activités réelles seront publiées ici dès réception des photos et vidéos des classes et ateliers.':'Les communiqués officiels de l’école seront publiés ici et pourront déclencher des notifications sur les téléphones des parents.'}</div>;
 return <div className="publicList">{items.map(x=><article key={x.id} className="publicItem"><div className="publicMeta"><div className="publicDate">{x.published_at?new Date(x.published_at).toLocaleDateString('fr-FR'):''}</div>{type==='announcements'&&x.audience&&<span className="audiencePill">{x.audience==='public'?'Tous les parents':x.audience}</span>}</div><h3>{x.title}</h3><p>{x.excerpt||x.body}</p></article>)}</div>
}
