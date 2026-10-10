'use client';

import { FormEvent, useEffect, useState } from 'react';
import { SERVICES } from '@/lib/config';
import { supabase } from '@/lib/supabase-browser';

type SchoolRole = 'admin_systeme'|'direction'|'gestionnaire'|'prefecture'|'directeur_etudes'|'discipline'|'secretariat'|'direction_primaire'|'communication';
type Account = { id:string; email?:string; full_name?:string|null; service?:string|null; role?:SchoolRole;active?:boolean };
const ROLES:SchoolRole[]=['admin_systeme','direction','gestionnaire','prefecture','directeur_etudes','discipline','secretariat','direction_primaire','communication'];

export default function AccountManager({ currentUserId }:{ currentUserId:string }) {
  const [accounts,setAccounts]=useState<Account[]>([]);
  const [note,setNote]=useState('');

  async function invoke(body:Record<string,unknown>){
    const {data,error}=await supabase.functions.invoke('manage-users',{body});
    if(error)throw error;
    if(data?.error)throw new Error(data.error);
    return data;
  }
  async function load(){try{const data=await invoke({action:'list'});setAccounts(data.users||[])}catch{setNote('Impossible de charger les comptes. Vérifiez le déploiement de la fonction manage-users.')}}
  useEffect(()=>{load()},[]);
  async function create(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;const fd=new FormData(form);try{await invoke({action:'create',email:fd.get('email'),password:fd.get('password'),full_name:fd.get('full_name'),service:fd.get('service'),role:fd.get('role')});form.reset();setNote('Compte créé.');await load()}catch(error){setNote(error instanceof Error?error.message:'Création impossible.')}}
  async function update(account:Account){const fullName=prompt('Nom complet',account.full_name||'');if(fullName===null)return;const service=prompt('Service',account.service||'');if(service===null)return;const role=prompt(`Rôle : ${ROLES.join(', ')}`,account.role||'secretariat') as SchoolRole|null;if(!role||!ROLES.includes(role))return;try{await invoke({action:'update',id:account.id,full_name:fullName,service,role,active:account.active!==false});setNote('Compte modifié.');await load()}catch{setNote('Modification impossible.')}}
  async function toggleActive(account:Account){try{await invoke({action:'update',id:account.id,full_name:account.full_name,service:account.service,role:account.role,active:account.active===false});setNote(account.active===false?'Compte activé.':'Compte désactivé.');await load()}catch{setNote('Modification impossible.')}}
  async function remove(account:Account){if(account.id===currentUserId||!confirm(`Supprimer le compte ${account.email||account.full_name} ?`))return;try{await invoke({action:'delete',id:account.id});setNote('Compte supprimé.');await load()}catch{setNote('Suppression impossible.')}}
  return <section className="accountManager"><h2>Gestion des comptes de l’école</h2><p>Réservé à l’administrateur système. Chaque compte reçoit uniquement les droits de son rôle et de son service.</p><form className="publisher" onSubmit={create}><label>Nom complet<input name="full_name" required/></label><label>E-mail<input name="email" type="email" required/></label><label>Mot de passe temporaire<input name="password" type="password" minLength={8} required/></label><label>Service<select name="service" defaultValue=""><option value="">Aucun / accès général</option>{SERVICES.map(service=><option key={service.id} value={service.id}>{service.label}</option>)}</select></label><label>Rôle<select name="role" defaultValue="secretariat">{ROLES.map(role=><option key={role} value={role}>{role}</option>)}</select></label><button className="btn primary">Créer le compte</button></form>{note&&<p className="formStatus" role="status">{note}</p>}<div className="contentList">{accounts.map(account=><article className="contentRow" key={account.id}><div><span className={account.active===false?'badge':'badge live'}>{account.active===false?'Inactif':'Actif'}</span><h3>{account.full_name||'Sans nom'}</h3><p>{account.email} · {account.role} · {account.service||'accès général'}</p></div><div className="rowActions"><button onClick={()=>update(account)}>Modifier</button><button onClick={()=>toggleActive(account)}>{account.active===false?'Activer':'Désactiver'}</button>{account.id!==currentUserId&&<button className="danger" onClick={()=>remove(account)}>Supprimer</button>}</div></article>)}</div></section>;
}
