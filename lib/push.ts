import webpush from 'web-push';
import { supabaseConfig } from '@/lib/supabase-rest';

function pushConfig(){
  return {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

export async function sendPushNotification(payload:{title:string;body:string;url?:string;audience?:string}){
  const {url} = supabaseConfig();
  const {publicKey,privateKey,subject,serviceRoleKey}=pushConfig();
  if(!url || !serviceRoleKey || !publicKey || !privateKey) return {sent:0,skipped:true};
  webpush.setVapidDetails(subject,publicKey,privateKey);
  const audience = payload.audience || 'public';
  const filter = audience==='public' ? '' : `&audience=in.(public,${encodeURIComponent(audience)})`;
  const r = await fetch(`${url}/rest/v1/push_subscriptions?select=id,endpoint,p256dh,auth${filter}`,{
    headers:{apikey:serviceRoleKey,Authorization:`Bearer ${serviceRoleKey}`},cache:'no-store'
  });
  if(!r.ok) return {sent:0,error:'subscriptions'};
  const rows = await r.json();
  let sent=0;
  await Promise.all(rows.map(async (s:any)=>{
    try{
      await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},JSON.stringify({
        title:payload.title,body:payload.body,url:payload.url||'/',icon:'/brand/logo-clean.png',badge:'/brand/logo-clean.png'
      }));
      sent++;
    }catch(e:any){
      if(e?.statusCode===404 || e?.statusCode===410){
        await fetch(`${url}/rest/v1/push_subscriptions?id=eq.${encodeURIComponent(s.id)}`,{
          method:'DELETE',headers:{apikey:serviceRoleKey,Authorization:`Bearer ${serviceRoleKey}`}
        });
      }
    }
  }));
  return {sent};
}
