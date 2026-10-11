import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async(req)=>{
 const expected=Deno.env.get('CRON_SECRET');
 if(!expected||req.headers.get('x-cron-secret')!==expected)return new Response('unauthorized',{status:401});
 const url=Deno.env.get('SUPABASE_URL')!;
 const service=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 const {data:jobs,error}=await service.from('notification_jobs').select('*').eq('status','scheduled').lte('scheduled_for',new Date().toISOString()).order('scheduled_for').limit(20);
 if(error)return Response.json({error:error.message},{status:500});
 webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT')!,Deno.env.get('VAPID_PUBLIC_KEY')!,Deno.env.get('VAPID_PRIVATE_KEY')!);
 let processed=0;
 for(const job of jobs||[]){
  const locked=await service.from('notification_jobs').update({status:'processing',updated_at:new Date().toISOString()}).eq('id',job.id).eq('status','scheduled').select('id').maybeSingle();
  if(!locked.data)continue;
  try{
   let query=service.from('push_subscriptions').select('id,endpoint,p256dh,auth');
   if(job.audience!=='public')query=query.in('audience',['public',job.audience]);
   const {data:subs,error:subError}=await query;if(subError)throw subError;
   let sent=0;
   for(const sub of subs||[]){try{await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth}},JSON.stringify({title:job.title,body:job.body,url:job.url,icon:'/brand/app-icon-192.png',badge:'/brand/app-icon-192.png'}));sent++}catch(e:any){if(e?.statusCode===404||e?.statusCode===410)await service.from('push_subscriptions').delete().eq('id',sub.id)}}
   await service.from('notification_jobs').update({status:'sent',sent_at:new Date().toISOString(),sent_count:sent,updated_at:new Date().toISOString()}).eq('id',job.id);processed++;
  }catch(e){await service.from('notification_jobs').update({status:'failed',error_message:e instanceof Error?e.message:'dispatch_failed',updated_at:new Date().toISOString()}).eq('id',job.id)}
 }
 return Response.json({processed});
});
