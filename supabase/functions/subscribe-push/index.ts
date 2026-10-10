import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
Deno.serve(async (req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 try{
  const {subscription,audience='public'}=await req.json();
  const endpoint=subscription?.endpoint, p256dh=subscription?.keys?.p256dh, auth=subscription?.keys?.auth;
  if(!endpoint||!p256dh||!auth)return new Response(JSON.stringify({error:'invalid_subscription'}),{status:400,headers:{...cors,'Content-Type':'application/json'}});
  const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const {error}=await sb.from('push_subscriptions').upsert({endpoint,p256dh,auth,audience,user_agent:req.headers.get('user-agent'),last_seen_at:new Date().toISOString()},{onConflict:'endpoint'});
  if(error)throw error;
  return new Response(JSON.stringify({ok:true}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:'subscribe_failed'}),{status:500,headers:{...cors,'Content-Type':'application/json'}})}
});
