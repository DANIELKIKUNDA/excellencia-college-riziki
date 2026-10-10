import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import webpush from 'npm:web-push@3.6.7';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 try{
  const authHeader=req.headers.get('Authorization')||'';
  const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
  const url=Deno.env.get('SUPABASE_URL')!;
  const caller=createClient(url,anon,{global:{headers:{Authorization:authHeader}}});
  const {data:{user}}=await caller.auth.getUser();
  if(!user)return new Response(JSON.stringify({error:'unauthorized'}),{status:401,headers:{...cors,'Content-Type':'application/json'}});
  const service=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const {data:profile}=await service.from('profiles').select('role').eq('id',user.id).single();
  if(!profile||!['admin_systeme','direction','gestionnaire','communication','manager','system_admin'].includes(profile.role))return new Response(JSON.stringify({error:'forbidden'}),{status:403,headers:{...cors,'Content-Type':'application/json'}});
  const payload=await req.json(); const audience=payload.audience||'public';
  let q=service.from('push_subscriptions').select('id,endpoint,p256dh,auth');
  if(audience!=='public')q=q.in('audience',['public',audience]);
  const {data:subs,error}=await q;if(error)throw error;
  webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT')||'mailto:admin@example.com',Deno.env.get('VAPID_PUBLIC_KEY')!,Deno.env.get('VAPID_PRIVATE_KEY')!);
  let sent=0;
  for(const s of subs||[]){try{await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},JSON.stringify({title:payload.title,body:payload.body,url:payload.url||'/',icon:'/brand/logo-clean.png',badge:'/brand/logo-clean.png'}));sent++}catch(e:any){if(e?.statusCode===404||e?.statusCode===410)await service.from('push_subscriptions').delete().eq('id',s.id)}}
  return new Response(JSON.stringify({sent}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:'push_failed'}),{status:500,headers:{...cors,'Content-Type':'application/json'}})}
});
