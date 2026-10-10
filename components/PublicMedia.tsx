'use client';

import { useEffect, useState } from 'react';
import { hasSupabase, supabase } from '@/lib/supabase-browser';
type Media={id:string;title:string;description:string|null;media_type:string;url:string};
export default function PublicMedia(){const [items,setItems]=useState<Media[]>([]);useEffect(()=>{if(!hasSupabase)return;supabase.from('media_items').select('id,title,description,media_type,url').eq('published',true).order('sort_order').then(({data})=>setItems((data||[]) as Media[]))},[]);if(!items.length)return null;return <section className="dynamicMedia"><div className="sectionHead centeredHead"><div><p className="sectionKicker">PUBLICATIONS RÉCENTES</p><h2>Photos et vidéos de l’école</h2></div></div><div className="mediaGrid">{items.map(item=><article className="mediaCard" key={item.id}>{item.media_type==='photo'?<img src={item.url} alt={item.title}/>:<a href={item.url} target="_blank" rel="noreferrer"><span className="mediaPlay">▶</span>Voir sur {item.media_type==='youtube'?'YouTube':item.media_type==='tiktok'?'TikTok':'la plateforme vidéo'}</a>}<div><h3>{item.title}</h3>{item.description&&<p>{item.description}</p>}</div></article>)}</div></section>}
