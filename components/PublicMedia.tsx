'use client';

import { useEffect, useState } from 'react';
import { hasSupabase, supabase } from '@/lib/supabase-browser';
type Media={id:string;title:string;description:string|null;media_type:'photo'|'youtube'|'tiktok'|'video_link';url:string};

export function mediaEmbedUrl(item:Pick<Media,'media_type'|'url'>){
 if(item.media_type==='youtube'){const match=item.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/);return match?`https://www.youtube-nocookie.com/embed/${match[1]}`:null}
 if(item.media_type==='tiktok'){const match=item.url.match(/\/video\/(\d+)/);return match?`https://www.tiktok.com/player/v1/${match[1]}?autoplay=0&loop=0`:null}
 return null;
}

export function MediaVisual({item,admin=false}:{item:Media;admin?:boolean}){
 const embed=mediaEmbedUrl(item);
 if(item.media_type==='photo')return <img src={item.url} alt={item.title} loading={admin?'eager':'lazy'} decoding="async"/>;
 if(embed)return <div className={`videoFrame ${item.media_type}`}><iframe src={embed} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>;
 if(item.media_type==='video_link')return <video src={item.url} controls preload="metadata" playsInline aria-label={item.title}/>;
 return <a className="mediaFallback" href={item.url} target="_blank" rel="noreferrer">Ouvrir la vidéo ↗</a>;
}

export default function PublicMedia(){
 const [items,setItems]=useState<Media[]>([]);
 useEffect(()=>{if(!hasSupabase)return;supabase.from('media_items').select('id,title,description,media_type,url').eq('published',true).order('sort_order').then(({data})=>setItems((data||[]) as Media[]))},[]);
 if(!items.length)return null;
 return <section className="dynamicMedia"><div className="sectionHead centeredHead"><div><p className="sectionKicker">MÉDIATHÈQUE OFFICIELLE</p><h2>Riziki en photos et en vidéos</h2><p>Découvrez les activités publiées par l’établissement sans quitter le site.</p></div></div><div className="mediaGrid">{items.map(item=><article className="mediaCard" key={item.id}><MediaVisual item={item}/><div><span className="mediaType">{item.media_type==='photo'?'Photo':item.media_type==='youtube'?'YouTube':item.media_type==='tiktok'?'TikTok':'Vidéo'}</span><h3>{item.title}</h3>{item.description&&<p>{item.description}</p>}</div></article>)}</div></section>
}
