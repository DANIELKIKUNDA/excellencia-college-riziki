'use client';

type Item = { id:string; title:string; published:boolean; published_at?:string };
type Message = { id:string; name:string; subject:string; status:string; created_at:string };

export default function AdminOverview({messages,news,announcements,onNavigate}:{messages:Message[];news:Item[];announcements:Item[];onNavigate:(tab:'messages'|'news'|'announcements'|'accounts'|'notifications')=>void}){
 const unread=messages.filter(item=>item.status==='new').length;
 const published=news.filter(item=>item.published).length+announcements.filter(item=>item.published).length;
 const drafts=news.filter(item=>!item.published).length+announcements.filter(item=>!item.published).length;
 const recent=[...messages.map(item=>({id:item.id,title:item.subject,meta:`Message de ${item.name}`,date:item.created_at})),...news.map(item=>({id:item.id,title:item.title,meta:'Actualité',date:item.published_at||''})),...announcements.map(item=>({id:item.id,title:item.title,meta:'Communiqué',date:item.published_at||''}))].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
 return <div className="adminOverview">
  <section className="adminWelcome"><div><span className="adminEyebrow">CENTRE DE PILOTAGE</span><h2>Bonjour, votre école est sous contrôle.</h2><p>Publiez, informez les familles et gérez les accès depuis un espace unique.</p></div><button className="btn primary" onClick={()=>onNavigate('announcements')}>+ Nouveau communiqué</button></section>
  <div className="metricGrid">
   <button className="metricCard blue" onClick={()=>onNavigate('messages')}><span>Messages</span><strong>{messages.length}</strong><small>{unread} non traité{unread>1?'s':''}</small></button>
   <button className="metricCard green" onClick={()=>onNavigate('news')}><span>Actualités</span><strong>{news.length}</strong><small>{news.filter(x=>x.published).length} publiée{news.filter(x=>x.published).length>1?'s':''}</small></button>
   <button className="metricCard gold" onClick={()=>onNavigate('announcements')}><span>Communiqués</span><strong>{announcements.length}</strong><small>{announcements.filter(x=>x.published).length} publié{announcements.filter(x=>x.published).length>1?'s':''}</small></button>
   <div className="metricCard violet"><span>Contenus</span><strong>{published}</strong><small>{drafts} brouillon{drafts>1?'s':''}</small></div>
  </div>
  <div className="overviewGrid"><section className="overviewPanel"><div className="panelTitle"><div><span>ACTIVITÉ</span><h3>Derniers mouvements</h3></div></div>{recent.length?<div className="activityFeed">{recent.map(item=><div className="activityItem" key={`${item.meta}-${item.id}`}><i/><div><strong>{item.title}</strong><small>{item.meta}{item.date?` · ${new Date(item.date).toLocaleDateString('fr-FR')}`:''}</small></div></div>)}</div>:<div className="emptyState">L’activité récente apparaîtra ici.</div>}</section>
  <section className="overviewPanel"><div className="panelTitle"><div><span>RACCOURCIS</span><h3>Actions fréquentes</h3></div></div><div className="quickActions"><button onClick={()=>onNavigate('news')}>Publier une actualité <b>→</b></button><button onClick={()=>onNavigate('notifications')}>Envoyer une notification <b>→</b></button><button onClick={()=>onNavigate('accounts')}>Ajouter un responsable <b>→</b></button><button onClick={()=>onNavigate('messages')}>Traiter les messages <b>→</b></button></div></section></div>
 </div>
}
