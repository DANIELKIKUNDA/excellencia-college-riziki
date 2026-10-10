import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...cors, 'Content-Type': 'application/json' },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization') || '';
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const service = createClient(url, serviceKey);
    const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin_systeme','system_admin'].includes(profile?.role)) return json({ error: 'forbidden' }, 403);

    const payload = await req.json();
    const action = String(payload.action || 'list');

    if (action === 'list') {
      const { data: usersData, error: usersError } = await service.auth.admin.listUsers({ perPage: 1000 });
      if (usersError) throw usersError;
      const { data: profiles, error: profilesError } = await service.from('profiles').select('id,full_name,service,role,active,created_at');
      if (profilesError) throw profilesError;
      const profileMap = new Map((profiles || []).map((item) => [item.id, item]));
      return json({ users: usersData.users.map((item) => ({
        id: item.id,
        email: item.email,
        ...profileMap.get(item.id),
      })) });
    }

    if (action === 'create') {
      const roles = ['admin_systeme','direction','gestionnaire','prefecture','directeur_etudes','discipline','secretariat','direction_primaire','communication'];
      const role = roles.includes(payload.role) ? payload.role : 'secretariat';
      const { data, error } = await service.auth.admin.createUser({
        email: String(payload.email || '').trim(),
        password: String(payload.password || ''),
        email_confirm: true,
      });
      if (error || !data.user) throw error || new Error('user_creation_failed');
      const { error: profileError } = await service.from('profiles').insert({
        id: data.user.id,
        full_name: String(payload.full_name || '').trim() || null,
        service: String(payload.service || '').trim() || null,
        role,
        active: true,
      });
      if (profileError) {
        await service.auth.admin.deleteUser(data.user.id);
        throw profileError;
      }
      return json({ ok: true, id: data.user.id });
    }

    if (action === 'update') {
      const targetId = String(payload.id || '');
      const roles = ['admin_systeme','direction','gestionnaire','prefecture','directeur_etudes','discipline','secretariat','direction_primaire','communication'];
      const role = roles.includes(payload.role) ? payload.role : 'secretariat';
      if (!targetId) return json({ error: 'missing_id' }, 400);
      if (payload.email || payload.password) {
        const attributes: Record<string, string> = {};
        if (payload.email) attributes.email = String(payload.email).trim();
        if (payload.password) attributes.password = String(payload.password);
        const { error } = await service.auth.admin.updateUserById(targetId, attributes);
        if (error) throw error;
      }
      const { error } = await service.from('profiles').update({
        full_name: String(payload.full_name || '').trim() || null,
        service: String(payload.service || '').trim() || null,
        role,
        active: payload.active !== false,
      }).eq('id', targetId);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === 'delete') {
      const targetId = String(payload.id || '');
      if (!targetId || targetId === user.id) return json({ error: 'invalid_target' }, 400);
      const { error } = await service.auth.admin.deleteUser(targetId);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: 'invalid_action' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'user_management_failed' }, 500);
  }
});
