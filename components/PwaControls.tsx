'use client';
import { useEffect, useState } from 'react';
import { hasSupabase, supabase } from '@/lib/supabase-browser';

type DeferredPrompt = Event & { prompt:()=>Promise<void>; userChoice:Promise<{outcome:'accepted'|'dismissed'}> };
function urlBase64ToUint8Array(base64String:string){const padding='='.repeat((4-base64String.length%4)%4);const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');const raw=atob(base64);return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))}
export default function PwaControls(){
 const [install,setInstall]=useState<DeferredPrompt|null>(null); const [notif,setNotif]=useState<'idle'|'enabled'|'blocked'|'loading'>('idle');
 const pushAvailable=hasSupabase&&Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
 useEffect(()=>{if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});const h=(e:Event)=>{e.preventDefault();setInstall(e as DeferredPrompt)};window.addEventListener('beforeinstallprompt',h);if(typeof Notification!=='undefined')setNotif(Notification.permission==='granted'?'enabled':Notification.permission==='denied'?'blocked':'idle');return()=>window.removeEventListener('beforeinstallprompt',h)},[]);
 async function installApp(){if(!install)return;await install.prompt();await install.userChoice;setInstall(null)}
 async function enablePush(){try{setNotif('loading');if(!hasSupabase||!('serviceWorker'in navigator)||!('PushManager'in window))throw new Error();const permission=await Notification.requestPermission();if(permission!=='granted'){setNotif(permission==='denied'?'blocked':'idle');return}const reg=await navigator.serviceWorker.ready;const key=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;if(!key)throw new Error();let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(key)});const {error}=await supabase.functions.invoke('subscribe-push',{body:{subscription:sub.toJSON(),audience:'public'}});if(error)throw error;setNotif('enabled')}catch{setNotif('idle')}}
 if(!install&&!pushAvailable)return null;
 return <div className="pwaControls">{install&&<button className="pwaBtn" onClick={installApp}>Installer Riziki</button>}{pushAvailable&&<button className="pwaBtn secondary" onClick={enablePush} disabled={notif==='enabled'||notif==='blocked'||notif==='loading'}>{notif==='enabled'?'Notifications activées':notif==='blocked'?'Notifications bloquées':notif==='loading'?'Activation…':'Activer les notifications'}</button>}</div>
}
