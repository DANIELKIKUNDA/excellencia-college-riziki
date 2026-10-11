'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [nearBottom,setNearBottom]=useState(false);
  useEffect(() => {
    const update = () => setNearBottom(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-240);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const behavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto' as const:'smooth' as const;
  return <div className="pageNavigator visible" aria-label="Navigation verticale">
    <button type="button" aria-label="Monter en haut de la page" onClick={()=>window.scrollTo({top:0,behavior:behavior()})}>↑</button>
    <span aria-hidden="true"/>
    <button type="button" aria-label="Descendre en bas de la page" disabled={nearBottom} onClick={()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:behavior()})}>↓</button>
  </div>;
}
