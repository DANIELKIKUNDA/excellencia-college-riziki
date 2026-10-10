import { cookies } from 'next/headers';
import { supabaseConfig } from '@/lib/supabase-rest';

type StaffProfile = { id:string; full_name:string|null; service:string|null; role:'staff'|'admin' };

export async function validateAdmin() {
  const token = (await cookies()).get('riziki_admin_token')?.value;
  const { url, anonKey } = supabaseConfig();
  if (!token || !url || !anonKey) return null;
  const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!r.ok) return null;
  const user = await r.json();
  const p = await fetch(`${url}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,full_name,service,role&limit=1`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` }, cache: 'no-store'
  });
  if (!p.ok) return null;
  const profiles = await p.json();
  const profile = profiles?.[0] as StaffProfile | undefined;
  if (!profile) return null;
  return { token, user, profile };
}
